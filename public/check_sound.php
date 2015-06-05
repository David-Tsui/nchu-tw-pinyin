<?php
	$sound = trim($_GET['SOUND']);
	//$sound = "ainn";
	$arr = array();
	$path = "";
	if ($sound[strlen($sound) - 1] == "p" || $sound[strlen($sound) - 1] == "t" || $sound[strlen($sound) - 1] == "k" || $sound[strlen($sound) - 1] == "h")
		$path = "./pronunce/" . strtoupper($sound) . "5.wav";
	else
		$path = "./pronunce/" . strtoupper($sound) . "1.wav";
	$check = file_exists($path);
	$arr[0] = $check;
	echo json_encode($arr);
?>