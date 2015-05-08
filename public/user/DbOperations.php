<?php
	include("mysql_memdict_connect.inc.php");
	
	$func = $_POST['func'];
	$name = $_POST['name'];
	//$func = "DeleteChosenWord";
	//$name = '9';

	switch ($func) {
		case 'GetArray':
			GetArray ($name);
			break;

		case 'SearchWordExist':
			$tar = (object) array('sound' => $_POST['sd'], 'characters' => $_POST['ch']);
			//$tar = (object) array('sound' => 'a', 'characters' => '二');
			SearchWordExist ($name, $tar);
			break;

		case 'AddWord':
			$tar = (object) array('sound' => $_POST['sd'], 'characters' => $_POST['ch']);
			//$tar = (object) array('sound' => 'f', 'characters' => '六');
			AddWord ($name, $tar);
			break;

		case 'DeleteAllWord':
			DeleteAllWord($name);
			break;

		case 'DeleteChosenWord':
			$rettar = json_decode($_POST["tar"]);
			/*$retarr = array();
			$tar = (object) array('sound' => 'a', 'characters' => '一');
			array_push($retarr, $tar);
			$tar = (object) array('sound' => 'b', 'characters' => '二');
			array_push($retarr, $tar);
			$tar = (object) array('sound' => 'c', 'characters' => '三');
			array_push($retarr, $tar);*/
			DeleteChosenWord($name, $rettar);
			break;

		default:
			break;
	}

	function GetArray ($name)
	{
		global $db;
		$retarr = array();
		$i = 0;
		$sql = "SELECT * FROM `" . $name . "`";
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$stmt->setFetchMode(PDO::FETCH_NUM);
		$row = $stmt->fetch();
		do{
	    	if ($row != ""){
	    		$obj = (object) array('sound' => $row[0], 'characters' => $row[1]);
				array_push($retarr, $obj);
	    	}
			else
				break;
			$i++;
	  	}while ($row = $stmt->fetch());

	  	echo json_encode($retarr);
	}

	function SearchWordExist ($name, $tar)
	{
		global $db;
		$retarr = array();
		$i = 0;
		$sql = "SELECT * FROM `" . $name . "`" . "WHERE `sound` = '". $tar->sound . 
			   "' AND `characters` = '" . $tar->characters . "'";
		$stmt = $db->prepare($sql);
		$stmt->execute();
		$stmt->setFetchMode(PDO::FETCH_NUM);
		$row = $stmt->fetch();
		do{
	    	if ($row != ""){
	    		$obj = (object) array('sound' => $row[0], 'characters' => $row[1]);
				array_push($retarr, $obj);
	    	}
			else
				break;
			$i++;
	  	}while ($row = $stmt->fetch());

	  	echo json_encode($retarr);
	}

	function AddWord ($name, $tar)
	{
		global $db;
		$retarr = array();
		$i = 0;
		$sql = "INSERT INTO `" . $name . "`" . "(sound, characters)
				VALUES ('" . $tar->sound . "'" . ",'" . $tar->characters . "')";
		$stmt = $db->prepare($sql);
		$stmt->execute();
	}

	function DeleteAllWord ($name)
	{
		global $db;
		$retarr = array();
		$i = 0;
		$sql = "TRUNCATE TABLE `" . $name . "`";
		$stmt = $db->prepare($sql);
		$stmt->execute();
	}

	function DeleteChosenWord ($name, $tararr)
	{
		global $db;
		for ($i=0; $i<count($tararr); $i++)
		{
			$sql = "DELETE FROM `" . $name . "`" . "WHERE `sound` = '". $tararr[$i]->sound . 
			       "' AND `characters` = '" . $tararr[$i]->characters . "'";
			//print_r($sql);
			$stmt = $db->prepare($sql);
			$stmt->execute();
		}
	}

?>