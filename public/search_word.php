<?php
	if (isset($_POST['search_KEY']) && isset($_POST['MODE'])){
		include("mysql_connect.inc.php");

		$key = trim($_POST['search_KEY']);
		//$key = 'a';
		$mode = $_POST['MODE'];
		//$mode = 0;
		$key_super = $key . " %";
		$arr = array();

		if (strtoupper($key[0]) == ($key[0])){
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
				{						
					$arr[$i] = $row[0];
				}
				else
					break;
				$i++;
		  	}while ($row = $stmt->fetch());
		}

		else if ($mode == 0){		// 如果是自選模式，全抓
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
				{						
					$arr[$i] = $row[0];
				}
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
?>
