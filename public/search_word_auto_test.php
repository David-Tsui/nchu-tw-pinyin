<!DOCTYPE html>
<html>
	<body>
	123
	</body>
</html>

<?php
	echo 'test string: <br><br>
		string = gi ui gi iu diong hing dai hak <br>
		string = gi ui gi iu a bing gor ap den hong xin <br>
		string = ba le dai bak bbun hua diong hing <br>
		string = ap den hong xin <br>
		string = jiam tau mia an xim diong hing dai hak xin <br>
		string = an xim diong hing dai hak <br> 
		string = gi ui gi iu a bing gor ap den hong xin <br> <br>
		PS.分數(score)已經取過log了，所以比分數時要改成 + <br> <br>
		<form action = "" method="post">
			String: <input type="text" name="str" id="name" >
			<input type="submit" name="submit" value="Submit"> 
			<br/>
		</form>';

	if (!empty($_POST)) {
		$str = $_POST["str"];
		
		echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
		echo "<style>
			table, th, td {
				border: 1px solid black;
				border-collapse: collapse;
			}
			th,td {
				padding: 15px;
			}
		  </style>";
			  
		include("mysql_connect.inc.php");
		
		class Word 
		{
			public $start;
			public $end;
			public $character;
			public $pinyin;
			public $score;
			
			public function __construct($start,$end,$character,$pinyin,$score){
				$this->start = $start;
				$this->end = $end;
				$this->character = $character;
				$this->pinyin = $pinyin;
				$this->score = $score;
			}
			
			public function show_details(){
				return "start: " . $this->start . "<br>end: " . $this->end . "<br>character: " . $this->character . "<br>pinyin: " . $this->pinyin . "<br>score: " . $this->score . "<br>"; 
				//return "character: <strong>" . $this->character . "</strong><br>pinyin: " . $this->pinyin . "<br>score: " . $this->score . "<br>";
			}
		}
		$key = array();
		$string = $str;
		$token = strtok($string, " ");
		$key[0] = $token;
		$counter = 0;
		while ($token != false){
			$token = strtok(" ");
			if ($token == false){
				break;
			}
			else{
				$counter++;
			}
			$key[$counter] = $token;
		}
		$arr = array();

		$syllable = count($key);
		for ($i = 0; $i < $syllable + 1; $i++){
			for ($j = 0; $j < $syllable + 1; $j++){
				$arr[$i][$j] = 0;
			}
		}
		
		for ($i = 1; $i < $syllable + 1; $i++){
			for ($j = $i; $j < $syllable + 1; $j++){
				$search_key = getkey($key, $i, $j);
				$sql = "SELECT `characters`,`score` FROM `pinyin_formal` 
						WHERE `sound` = :search_key 
						ORDER BY CHAR_LENGTH(`characters`) ASC, `score` DESC";
				$stmt = $db->prepare($sql);
				$stmt->bindParam('search_key',$search_key);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);
				$row = $stmt->fetch();
				if ($row[0] != ""){
					$arr[$i][$j] = new Word($i, $j, $row[0], $search_key, log($row[1]));
				}
			}
		}
		
		echo "<strong><p style=\"text-align: center; font-size: 24px\">長詞搜尋</p></strong>";
		echo "<p style=\"text-align: center\">搜尋拼音: ";
		for ($i = 0 ; $i < $syllable; $i++){
			echo $key[$i] . " ";
		}
		echo "</p>";
		
		echo "<table style=\"width:100%\">";
		for ($i = 0; $i < $syllable + 1; $i++){
			echo "<tr>";
			for ($j = 0; $j < $syllable + 1; $j++){
				$temp = $arr[$i][$j];
				if ($temp == ""){
					echo "<td>" . $temp . "</td>";
				}
				else
					echo "<td>" . $arr[$i][$j]->show_details() . "</td>";
			}
			echo "</tr>";
		}
		echo "</table>";
		
		$count = 1;
		$queue = new SplQueue();
		$shortestWords = array_fill(0,$syllable + 1,2147483647);	// 0|W W W W W ...  存當前總最短詞數
		$greatestScore = array_fill(0,$syllable + 1,0.0);			// 
		$parentV = array_fill(0,$syllable + 1,1);					// 從哪裡來
		$ans_arr = array();
		
		$shortestWords[0] = 0;
		$greatestScore[0] = 0.0;
		$parentV[0] = 0;
		$queue->push(0);
		
		while (!$queue->isEmpty()) {
			$currentV = $queue->pop();
			for ($nextV = $currentV + 1; $nextV <= $syllable; $nextV++) {
				if ($arr[$currentV + 1][$nextV] != NULL) {
					if (($shortestWords[$currentV] + 1 < $shortestWords[$nextV]) ||
						($shortestWords[$currentV] + 1 == $shortestWords[$nextV] && 
						 $greatestScore[$currentV] + $arr[$currentV + 1][$nextV]->score > $greatestScore[$nextV])) {
							$shortestWords[$nextV] = $shortestWords[$currentV] + 1;
							$greatestScore[$nextV] = $greatestScore[$currentV] + $arr[$currentV + 1][$nextV]->score;
							$parentV[$nextV] = $currentV;
							$queue->push($nextV);
					}
				}
			}
		}
		
		/*echo "<br>";
		echo "syllable: ", $syllable, "<br>";
		for ($i=0; $i<=$syllable; $i++)
			echo $parentV[$i], " ";
		*/
		echo "<br>";

		$tail = $syllable;
		while ($tail >= 1) {
			$parentTail = $parentV[$tail];
			$ans_arr[$count]['character'] = $arr[$parentTail + 1][$tail]->character;
			$ans_arr[$count]['pinyin'] = $arr[$parentTail + 1][$tail]->pinyin;
			$tail = $parentTail;
			$count++;
		}

		for ($i = $count - 1; $i > 0; $i--) {
			echo $ans_arr[$i]['character'], " ";
		}
		echo "<br>";
		
		$j = 1;
		$over_three = 0;
		$ans = array($over_three);		// 以0表示還在三詞內
		for ($i = $count - 1; $i > 0; $i--) {
			if ($j > 3) {
				$over_three = 1;
				$ans[0] = $over_three;	// 若超過三詞，則回傳1
			}
			$ans[$j++] = $ans_arr[$i];
		}
		print_r($ans);
	}

		//echo json_encode($arr);
	
	/*}
	else{
		echo "Haven't got a post value!!";
	}*/

	function getkey($key,$start,$end){
		if ($start == $end)
			return $key[$start - 1];
		else{
			$temp = "";
			for ($i = $start; $i <= $end; $i++){
				$temp .= $key[$i - 1] . " ";
			}
			$temp = trim($temp);
			return $temp;
		}
	
	}
?>
