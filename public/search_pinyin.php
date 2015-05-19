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

  	if (count($arr) == 0)
  	{
  		$res = "";
  		for ($i=0; $i<mb_strlen($key); $i++)
		{
			$cut = mb_substr($key, $i, 1, "utf-8");
			$test = false;
			$sql = "SELECT DISTINCT `sound` FROM `pinyin_formal` WHERE `characters` = '" .  $cut . "' " .
				   "ORDER BY `score` DESC LIMIT 0,1";
			$stmt = $db->prepare($sql);
			$stmt->execute();
			$stmt->setFetchMode(PDO::FETCH_NUM);
			$result = $stmt->fetch();
			if ($result[0] == "")
				$res .= $cut;
			else if ($i == mb_strlen($key)-1)
				$res .= $result[0];
			else
				$res .= $result[0] . " ";
		}
		array_push($arr, $res);
  	}
	echo json_encode($arr);
	$db = null;
?>