<?php
	if (isset($_POST['search_KEY']) && isset($_POST['MODE'])){
		include("mysql_connect.inc.php");

		$key = trim($_POST['search_KEY']);
		//$key = "hing dai hak";
		$mode = $_POST['MODE'];
		//$mode = 2;
		$key_super = $key . " %";
		$arr = array();

		if (strtoupper($key[0]) == ($key[0])){
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
		  	if (count($arr) == 0)
		  		$mode = 0;
		}
		if ($mode == 0){		// 如果是自選模式，全抓
			$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
				    WHERE `sound` = :key OR `sound` LIKE :key_super 
				    ORDER BY char_length(`characters`) ASC, `score` DESC";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key',$key);
			$stmt->bindParam(':key_super',$key_super);
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
		}
		else if ($mode == 1){	// 如果是智能模式，抓第一個字
		    $sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
		    		WHERE `sound` = :key 
		    		ORDER BY CHAR_LENGTH(`characters`) ASC, `score` DESC 
		    		LIMIT 0,1";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key',$key);
			$stmt->execute();
			$stmt->setFetchMode(PDO::FETCH_NUM);
			$row = $stmt->fetch();
			if ($row[0] != "")
			{	
				$arr[0] = $row[0];
			}
		}
		else if ($mode == 2){	// 如果是修改模式，先找整個拼音，再找其他音節
		    $sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
				    WHERE `sound` = :key OR `sound`
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

		  	$syllables = getSyllable($key);
		  	if ($syllables > 1){
		  		$flag = 1;
				while ($flag){
					$pos = strrpos($key," ");
					if ($pos != false){
						$key = substr($key,0,$pos);
						//echo "key = $key<br>";
						$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
							    WHERE `sound` = :key 
							    ORDER BY char_length(`characters`) DESC, `score` DESC";
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
					else
						$flag = 0;	
				}
			}
		}
		
		if (count($arr) == 0){	// 如果沒有該拼音對應的字，找尋其相近(關聯)的拼音
			$arr = array();
			$blanks = 0;
			for($i = 0 ; $i < strlen($key) ; $i++){
				if ($key[$i] == " ")
					$blanks++;
			}
			$temp = $blanks + 1;
			$key = $key . "%";
			$sql = "SELECT SUBSTRING_INDEX(`sound`,' ',$temp) FROM `pinyin_formal` 
					WHERE `sound` LIKE :key 
					GROUP BY SUBSTRING_INDEX(`sound`,' ',$temp)";
			$stmt = $db->prepare($sql);
			$stmt->bindParam(':key',$key);
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
					{
						$arr[$i] = $row[0];	
					}
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
