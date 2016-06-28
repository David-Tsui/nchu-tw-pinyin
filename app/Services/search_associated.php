<?php
	if (isset($_POST['prefix_KEY']))
	{
		include("mysql_connect.inc.php");
		
		$asso = $_POST['prefix_KEY'];
		$word_len = strlen($asso) / 3;
		$asso .= "%";
		$arr = array();

		$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
				WHERE `characters` LIKE :asso AND CHAR_LENGTH(`characters`) > $word_len 
				ORDER BY CHAR_LENGTH(`characters`) ASC, `score` DESC";
		$stmt = $db->prepare($sql);
		$stmt->bindParam(':asso',$asso);
		$stmt->execute();
		$stmt->setFetchMode(PDO::FETCH_NUM);
		$row = $stmt->fetch();

		$i = 0;
		do{	
			if ($row[0] != "")
				$arr[$i] = $row[0];	
			else
				break;
			$i++;
		}while ($row = $stmt->fetch());

		if (count($arr) == 0){
			$empty = array();
			echo json_encode($empty);   
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