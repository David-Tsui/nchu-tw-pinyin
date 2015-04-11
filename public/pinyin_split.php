<?php
	if (isset($_POST['THE_KEY']))
	{
		include("mysql_connect.inc.php");
		
		class Word 
		{
			public $start;
			public $end;
			public $pinyin;
			public $score;
			
			public function __construct($start,$end,$pinyin,$score){
				$this->start = $start;
				$this->end = $end;
				$this->pinyin = $pinyin;
				$this->score = $score;
			}
		}

		$string = $_POST['THE_KEY'];		// 傳回的拼音	
		//$string = "diong hing hak";
		$token = strtok($string," ");		// 把拼音用空白切開
		$key = array();						// 宣告存各音節的陣列

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
				$search_key = getkey($key,$i,$j);
				$sql = "SELECT `score` FROM `pinyin_formal` 
						WHERE `sound` = :search_key 
						ORDER BY CHAR_LENGTH(`characters`) ASC, `score` DESC";
				$stmt = $db->prepare($sql);
				$stmt->bindParam('search_key',$search_key);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);
				$row = $stmt->fetch();
				if ($row[0] != "") {
					$arr[$i][$j] = new Word($i, $j, $search_key, log($row[0]));
				}
			}
		}
		
		$ans = "";
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
		
		while (!($queue->isEmpty())){
			$currentV = $queue->pop();
			for ($nextV = $currentV + 1; $nextV <= $syllable; $nextV++){
				if ($arr[$currentV + 1][$nextV] != NULL) {
					if (($shortestWords[$currentV] + 1 < $shortestWords[$nextV]) ||
						($shortestWords[$currentV] + 1 == $shortestWords[$nextV] && 
						 $greatestScore[$currentV] + $arr[$currentV + 1][$nextV]->score > $greatestScore[$nextV])){
						$shortestWords[$nextV] = $shortestWords[$currentV] + 1;
						$greatestScore[$nextV] = $greatestScore[$currentV] + $arr[$currentV + 1][$nextV]->score;
						$parentV[$nextV] = $currentV;
						$queue->push($nextV);
					}
				}
			}
		}
		
		$tail = $syllable;
		while ($tail >= 1){
			$parentTail = $parentV[$tail];
			$ans_arr[$count] = $arr[$parentTail + 1][$tail]->pinyin;
			$tail = $parentTail;
			$count++;
		}
		
		$j = 0;
		for ($i = $count - 1; $i > 0; $i--){
			$back[$j] = $ans_arr[$i];
			$j++;
		}
		echo json_encode($back);
	}
	else{
		echo "Haven't got a post value!!";
	}

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
