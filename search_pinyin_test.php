<?php
	include ("class_word.php");
	include("mysql_connect.inc.php");
	$key = "中興大學才不在台中呢";
	$arr = array();


	$sql = "SELECT DISTINCT `sound` FROM `pinyin_formal` 
			WHERE `characters` = :key 
			ORDER BY `score` DESC, CHAR_LENGTH(`sound`) ASC";
	$stmt = $db->prepare($sql);
	$stmt->bindParam(':key',$key);
	$stmt->execute();
	$stmt->setFetchMode(PDO::FETCH_NUM);

	$i = 0;
	$row = $stmt->fetch();
  	do{
    	if ($row[0] != "")
		{						
			$arr[$i] = $row[0];
		}
		else
			break;
		$i++;
  	}while ($row = $stmt->fetch());

  	if (count($arr) == 0)
  	{
  		$time_start = microtime(true);

		$length = mb_strlen($key);
		$cut_key = array_fill(1, $length, "-1");

		for ($i=0; $i<$length+1; $i++)
			$cut_key[$i+1] = mb_substr($key, $i, 1, "utf-8");

		$ans = "";

		/*echo "cut_key:<br>";
		var_dump($cut_key);
		echo "<br><br>";*/

		$edit_start = 1;
		$edit_end = 0;

		for ($s=0; ; $s++)
		{
			if ($edit_start > $length)
				break;
			else if (CheckCht($cut_key[$edit_start]) == false)
			{
				$ans .= $cut_key[$edit_start];
				$edit_start++;
				continue;
			}
			else
			{
				for ($t=$edit_start+1; $t<=$length; $t++)
				{
					if (CheckCht($cut_key[$t]) == false)
					{
						$edit_end = $t - 1;
						break;
					}
					else if ($t == $length)
					{
						$edit_end = $t;
						break;
					}
				}

				$ans_tp = Find_Greatest_Word($edit_start, $edit_end, $cut_key, $db);
				$ans .= $ans_tp;

				/*echo "ans_tp=" . $ans_tp . "<br>";
				echo "ans_now=" . $ans . "<br>";*/

				$edit_start = $edit_end + 1;

				//echo "next_start=" . $edit_start . "<br>";
			}
			//echo "-----------------------------<br><br>";
		}

		echo 'key = "' . $key . '"<br>';
		echo '<br>fianl ans= "' . $ans . '"<br>';
		array_push($arr, $ans);
	}

	$time_end = microtime(true);
	$time = $time_end - $time_start;
	echo "<br><br>總執行時間: " . $time . " sec.<br><br>";

	//echo json_encode($arr);
	$db = null;

	function Find_Greatest_Word ($edit_start, $edit_end, $cut_key, $db)
	{
		$edit_length = $edit_end - $edit_start + 1;
		//echo "edit_start=" . $edit_start . " , edit_end=" . $edit_end . " , edit_length=" . $edit_length . "<br></br>";
		//edit_start=新字頭, edit_end=新字尾, edit_len=end-start+1;
		
		$map_arr = array_fill(0, $edit_length+1, array_fill(0, $edit_length+1, null));

		for ($i=1; $i<$edit_length+1; $i++)
		{
			$term = $cut_key[$i+$edit_start-1];
			//echo "term = " . $term . "<br>";
			for ($j=$i; $j<=$edit_length+1; $j++)
			{
				if ($j != $i)
					$term .= $cut_key[$j+$edit_start-1];
				$sql = "SELECT DISTINCT `sound`, `score` FROM `pinyin_formal` 
						WHERE `characters` = :key 
						ORDER BY `score` DESC, CHAR_LENGTH(`sound`) ASC";
				$stmt = $db->prepare($sql);
				$stmt->bindParam(':key',$term);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);
				$row = $stmt->fetch();
				if ($row[0] != "")
					$map_arr[$i][$j] = new Word($i, $j, $term, $row[0], log($row[1]));
			}
		}

		/*echo "<br>map_arr:</br>";
		//map_arr start at 1 to length
		for ($i=0; $i<$edit_length; $i++)
		{
			for ($j=0; $j<$edit_length; $j++){
				if (is_null($map_arr[$i][$j]))
					echo "X&nbsp;&nbsp;&nbsp;&nbsp;,";
				else
					echo $map_arr[$i][$j]->pinyin . "&nbsp;&nbsp;&nbsp;&nbsp;,";
			}
			echo "<br>";
		}*/

		//table start
		/*echo '<br><table border="1" style="width:100%">';
		echo "<tr>";
		for ($i=0; $i<$edit_length+1; $i++)
			if ($i == 0)
				echo "<td></td>";
			else
				echo "<td>" . $cut_key[$i+$edit_start-1] . "</td>";
		echo "</tr>";
		for ($i=0; $i<$edit_length; $i++)
		{
			echo "<tr>";
			for ($j=0; $j<$edit_length; $j++)
			{
				if($j == 0)
					echo "<td>" . $cut_key[$i+$edit_start] . "</td>";
				if (isset($map_arr[$i+1][$j+1]))
					echo "<td>" . $map_arr[$i+1][$j+1]->pinyin . "</td>";
				else
					echo "<td> </td>";
			}
			echo "</tr>";
		}
		echo "</table>";
		//table end*/

		$count = 1;
		$queue = new SplQueue();
		$shortestWords = array_fill(0, $edit_length + 1, 2147483647);	// 0|W W W W W ...  存當前總最短詞數
		$greatestScore = array_fill(0, $edit_length + 1, 0.0);			// 
		$parentV = array_fill(0, $edit_length + 1, 1);					// 從哪裡來
		$ans_arr = array();
		
		$shortestWords[0] = 0;
		$greatestScore[0] = 0.0;
		$parentV[0] = 0;
		$queue->push(0);
		
		while (!$queue->isEmpty()) {
			$currentV = $queue->pop();
			for ($nextV = $currentV + 1; $nextV <= $edit_length; $nextV++) {
				if ($map_arr[$currentV + 1][$nextV] != NULL) {
					if (($shortestWords[$currentV] + 1 < $shortestWords[$nextV]) ||
						($shortestWords[$currentV] + 1 == $shortestWords[$nextV] && 
						 $greatestScore[$currentV] + $map_arr[$currentV + 1][$nextV]->score > $greatestScore[$nextV])) {
							$shortestWords[$nextV] = $shortestWords[$currentV] + 1;
							$greatestScore[$nextV] = $greatestScore[$currentV] + $map_arr[$currentV + 1][$nextV]->score;
							$parentV[$nextV] = $currentV;
							$queue->push($nextV);
					}
				}
			}
		}

		$tail = $edit_length;
		while ($tail >= 1) {
			$parentTail = $parentV[$tail];
			$ans_arr[$count]['character'] = $map_arr[$parentTail + 1][$tail]->character;
			$ans_arr[$count]['pinyin'] = $map_arr[$parentTail + 1][$tail]->pinyin;
			$tail = $parentTail;
			$count++;
		}

		/*echo "<br><br>";
		var_dump($ans_arr);
		echo "<br><br>";*/

		$ans_tp = "";
		for ($i = $count - 1; $i > 0; $i--)
			$ans_tp .= $ans_arr[$i]['pinyin'] . " ";

		$ans_tp = trim($ans_tp);

		return $ans_tp;
	}

	function CheckCht($str)
	{
		$reg = "/^([\x7f-\xff]+)$/"; 
		if (preg_match($reg, $str, $result))
			return true;
		else
			return false;
	}
?>