<?php
	include("mysql_connect.inc.php");
	$key = trim($_GET['term']);
	$arr = array();
	
	$sql = "SELECT DISTINCT `sound` FROM `pinyin_formal` 
			WHERE `characters` = :key 
			ORDER BY CHAR_LENGTH(`sound`) ASC, `score` DESC";
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
	echo json_encode($arr);
	$db = null;
?>