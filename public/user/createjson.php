<?php
	$myFile = "./dict/" . ($_POST['name']) . ".json";
	$stringData = "[]";
	$fh = fopen($myFile, 'w') or die("can't open file");
	fwrite($fh, $stringData);
	fclose($fh);
?>