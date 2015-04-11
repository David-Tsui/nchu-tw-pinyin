<?php
	//header("Content-Type:text/html; charset=utf-8");
	if (isset($_POST['KEY']) && isset($_POST['WORD'])){
		include("mysql_connect.inc.php");

		$key = trim($_POST['KEY']);
		$word = $_POST['WORD'];
		//$key = "hong tai";
		//$word = "颱風";

		$token = strtok($key," ");		// 把拼音用空白切開
		$keys = array();					// 宣告存各音節的陣列
		$words = array();

		$keys[0] = $token;
		$counter = 0;
		while ($token != false){
			$token = strtok(" ");
			if ($token == false){
				break;
			}
			else{
				$counter++;
			}
			$keys[$counter] = $token;
		}
		$word_len = strlen($word) / 3;

		$i = 0;
		while ($i < $word_len){
			$words[$i] = mb_substr($word,$i,1,"utf-8");
			$i++;
		}

		$syllable = count($keys);
		$word_index = count($words);
		$arr = array();
		for($i = 0; $i < $word_index; $i++){
			for($j = 0; $j < $syllable; $j++){
				$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
					WHERE `sound` = :key"; 
				$stmt = $db->prepare($sql);
				$stmt->bindParam(':key',$keys[$j]);
				$stmt->execute();
				$stmt->setFetchMode(PDO::FETCH_NUM);

				$row = $stmt->fetch();
				do{
					if ($row != ""){         
						if (strcmp($words[$i],$row[0]) == 0){
							$arr[0] = 1;
							if ($i < ($word_index - 1))
								continue;
							else
								break;
						}
						else{
							$arr[0] = 0;
						}
					}  
					else
						break;
				
				}while ($row = $stmt->fetch());
			}
		}	

		echo json_encode($arr);
		$db = null;
	}
	else{
		echo "Haven't got a post value!!";
	}
?>