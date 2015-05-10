<?php
	if (isset($_POST['search_KEY']) && isset($_POST['MODE'])){
		include("mysql_connect.inc.php");

		$key = trim($_POST['search_KEY']);
		//$key = "gun bba";
		$mode = $_POST['MODE'];
		//$mode = 0;
		$key_super = $key . " %";

		$string = $key;

		$token = strtok($string," ");		// 把拼音用空白切開
		$split_key = array();				// 宣告存各音節的陣列

		$split_key[0] = $token;
		$counter = 0;
		while ($token != false){
			$token = strtok(" ");
			if ($token == false){
				break;
			}
			else{
				$counter++;
			}
			$split_key[$counter] = $token;
		}

		
		$Hplace = array();
		$counter = 0;
		for($i = 0; $i < count($split_key); $i++){
			$the_key = $split_key[$i];
			if ($the_key[strlen($the_key) - 1] == "a"){
				$Hplace[$counter] = $i;
				$counter++;
			}
		}
		$counter = 0;
		
		$ans_key = array();
		$solution = array_fill(0,count($Hplace),0);
		$used = array_fill(0,count($Hplace),false);

		function backtrack($tuple){
			global $split_key, $Hplace, $ans_key;
			global $solution;

			$temp_key = $split_key;
			$copy = "";
			for($i = 0; $i < count($Hplace); $i++){
				if ($solution[$i]){
					$temp_key[$Hplace[$i]] .= "h";
				}
			}
			for($i = 0; $i < count($temp_key); $i++){
				$copy .= $temp_key[$i] . " ";
			}
			array_push($ans_key,$copy);

			while ($tuple < count($Hplace)){
				$solution[$tuple] = 1;				
				backtrack($tuple + 1);
				$solution[$tuple] = 0;	
				$tuple++;
			}
		}
		backtrack(0);

		$arr = array();

		if (strtoupper($key[0]) == ($key[0])){
			if (strtoupper($key) == ($key)){		// 全大寫->英文縮寫MODE=4
				$key_super = $key . "%";
				$mode = 4;
				$sql = "SELECT DISTINCT `cht` FROM `eng_abbr` 
					      WHERE `abbr` = :key OR `abbr` LIKE :key_super
					      ORDER BY char_length(`cht`) ASC, `score` DESC";
				$stmt = $db->prepare($sql);
				$stmt->bindParam(':key',$key);
				$stmt->bindParam(':key_super', $key_super);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);
				$i = 0;
				$row = $stmt->fetch();
			  	do{
			    	if ($row != "")						
						$arr[$i] = $row[0];
					else
						break;
					$i++;
			  	}while ($row = $stmt->fetch());

			  	if (strlen($key) == 1){
			  		$mode = 3;
					$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
						      WHERE `abbr` = :key
						      ORDER BY char_length(`characters`) ASC, `score` DESC";
					$stmt = $db->prepare($sql);
					$stmt->bindParam(':key',$key);
					$stmt->execute();
					$stmt->setFetchMode(PDO::FETCH_NUM);

					$row = $stmt->fetch();
				  	do{
				    	if ($row != "")						
							$arr[$i] = $row[0];
						else
							break;
						$i++;
				  	}while ($row = $stmt->fetch());

				  	$key = strtolower($key);
					$mode = 5;
					$sql = "SELECT DISTINCT `cht` FROM `eng_formal` 
						      WHERE `eng` = :key
						      ORDER BY char_length(`cht`) ASC, `score` DESC";
					$stmt = $db->prepare($sql);
					$stmt->bindParam(':key',$key);
					$stmt->execute();
					$stmt->setFetchMode(PDO::FETCH_NUM);			
					$row = $stmt->fetch();
				  	do{
				    	if ($row != "")						
							$arr[$i] = $row[0];
						else
							break;
						$i++;
				  	}while ($row = $stmt->fetch());
			  	}
			}
			else{									// 第一個字大寫->台語縮寫MODE=3
				$mode = 3;
				$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
					      WHERE `abbr` = :key
					      ORDER BY char_length(`characters`) ASC, `score` DESC";
				$stmt = $db->prepare($sql);
				$stmt->bindParam(':key',$key);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);

				$i = 0;
				$row = $stmt->fetch();
			  	do{
			    	if ($row != "")						
						$arr[$i] = $row[0];
					else
						break;
					$i++;
			  	}while ($row = $stmt->fetch());

			  	if (count($arr) == 0){				// 都沒有，查英文字典 mode=5
					$key = strtolower($key);
					$mode = 5;
					$sql = "SELECT DISTINCT `cht` FROM `eng_formal` 
						      WHERE `eng` = :key
						      ORDER BY char_length(`cht`) ASC, `score` DESC";
					$stmt = $db->prepare($sql);
					$stmt->bindParam(':key',$key);
					$stmt->execute();
					$stmt->setFetchMode(PDO::FETCH_NUM);
					$i = 0;
					$row = $stmt->fetch();
				  	do{
				    	if ($row != "")						
							$arr[$i] = $row[0];
						else
							break;
						$i++;
				  	}while ($row = $stmt->fetch());

				  	if (count($arr) == 0){
				  		$key_super = $key . "%";
						$sql = "SELECT DISTINCT `eng` FROM `eng_formal` 
						    	  WHERE `eng` LIKE :key_super
						        ORDER BY char_length(`eng`) ASC, `score` DESC";
						$stmt = $db->prepare($sql);
						$stmt->bindParam(':key_super',$key_super);
						$stmt->execute();
						$stmt->setFetchMode(PDO::FETCH_NUM);
						$row = $stmt->fetch();

						$i = 1;
						if ($row[0] == ""){
						}
						else{			
							$arr[0] = "associated pinyin";
							do{	
								if ($row[0] != "")
									$arr[$i] = $row[0];	
								else
									break;
								$i++;
							}while ($row = $stmt->fetch());
						}
				  	}
				}
			}
		}

		if ($mode == 0){		// 如果是自選模式，全抓
			$j = 0;
			for($i = 0; $i < count($ans_key); $i++){
				$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
						    WHERE `sound` = :key OR `sound` LIKE :key_super 
				    	  ORDER BY char_length(`characters`) ASC, `score` DESC";
				$temp_key = trim($ans_key[$i]);
				$temp_key_super = $temp_key . " %";
				$stmt = $db->prepare($sql);
				$stmt->bindParam(':key',$temp_key);
				$stmt->bindParam(':key_super',$temp_key_super);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);
				$row = $stmt->fetch();
			  	do{
			    	if ($row != "")						
						$arr[$j] = $row[0];
					else
						break;
					$j++;
			  	}while ($row = $stmt->fetch());
			}
		}
		else if ($mode == 1){	// 如果是智能模式，抓第一個字
		    $sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
		    		    WHERE `sound` = :key 
		    		    ORDER BY char_length(`characters`) ASC, `score` DESC 
		    		    LIMIT 0,1";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key',$key);
			$stmt->execute();
			$stmt->setFetchMode(PDO::FETCH_NUM);
			$row = $stmt->fetch();
			if ($row[0] != "")	
				$arr[0] = $row[0];
		}
		else if ($mode == 2){	// 如果是修改模式，先找整個拼音，再找其他音節
			$arr[0] = "modify letter";
		    $sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
				        WHERE `sound` = :key OR `sound`
				        ORDER BY char_length(`characters`) ASC, `score` DESC";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key',$key);
			$stmt->execute();
			$stmt->setFetchMode(PDO::FETCH_NUM);
			$row = $stmt->fetch();

			$i = 0;
			$j = 0;
			$count = 0;
			$has_word = false;
		  	do{
		    	if ($row != ""){						
					$arr[1][$i] = $row[0];
					$count++;
					$has_word = true;
				}
				else
					break;
				$i++;
		  	}while ($row = $stmt->fetch());
		  	if ($has_word){
		  		$arr[2][$j] = $key;
		  		$arr[3][$j] = $count;
		  		$j++;
		  	}

		  	$syllables = getSyllable($key);
		  	if ($syllables > 1){
		  		$flag = 1;
				while ($flag){
					$pos = strrpos($key," ");
					if ($pos != false){
						$key = substr($key,0,$pos);
						$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
							      WHERE `sound` = :key 
							      ORDER BY char_length(`characters`) DESC, `score` DESC";
						$stmt = $db->prepare($sql);
						$stmt->bindParam(':key',$key);
						$stmt->execute();
						$stmt->setFetchMode(PDO::FETCH_NUM);
						$row = $stmt->fetch();

						$count = 0;
						$has_word = false;
					  	do{
					    	if ($row != ""){						
								$arr[1][$i] = $row[0];
								$count++;
								$has_word = true;
							}
							else
								break;
							$i++;
					  	}while ($row = $stmt->fetch());
					  	if ($has_word){
					  		$arr[2][$j] = $key;
		  					if ($j != 0)
		  						$arr[3][$j] = $count + $arr[3][$j - 1];
		  					else
		  						$arr[3][$j] = $count;
					  		$j++;
					  	}
					}
					else
						$flag = 0;	
				}
			}
		}
		
		if (!($mode == 3 || $mode == 4 || $mode == 5) && count($arr) == 0){	// 如果沒有該拼音對應的字，找尋其相近(關聯)的拼音
			$blanks = 0;
			for($i = 0 ; $i < strlen($key) ; $i++){
				if ($key[$i] == " ")
					$blanks++;
			}
			$temp = $blanks + 1;
			$key = strtolower($key);
			$key_super = $key . "%";
			$sql = "SELECT SUBSTRING_INDEX(`sound`,' ',$temp) FROM `pinyin_formal` 
						  WHERE `sound` LIKE :key_super 
					  	GROUP BY SUBSTRING_INDEX(`sound`,' ',$temp)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key_super',$key_super);
			$stmt->execute();
			$stmt->setFetchMode(PDO::FETCH_NUM);
			$row = $stmt->fetch();

			$i = 1;
			if ($row[0] == ""){
			}
			else{			
				$arr[0] = "associated pinyin";
				do{	
					if ($row[0] != "")
						$arr[$i] = $row[0];	
					else
						break;
					$i++;
				}while ($row = $stmt->fetch());
			}

			echo json_encode($arr);
		}
		else{
			echo json_encode($arr);
		}
		$db = null;
	}
	else{
		echo "Haven't got a post value!!";
	}

	function getSyllable($key){                  // 得到key的音節數
		$blanks = 0;
		$syllable = 0;
		for($i = 0; $i < strlen($key); $i++){
			if (strcmp($key[$i]," ") == 0) 
				$blanks++;
		}
		$syllable = $blanks + 1;
		return $syllable;
	}
?>
