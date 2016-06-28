<?php
	$sound = trim($_GET['SOUND']);
	$arr = array();
	$path = "";
	if ($sound[strlen($sound) - 1] == "p" || $sound[strlen($sound) - 1] == "t" || $sound[strlen($sound) - 1] == "k" || $sound[strlen($sound) - 1] == "h")
		$path = "../../public/pronunce/" . strtoupper($sound) . "5.wav";
	else
		$path = "../../public/pronunce/" . strtoupper($sound) . "1.wav";
	$check = file_exists($path);
	$arr[0] = $check;
	echo json_encode($arr);
?>