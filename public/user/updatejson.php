<?php
	$myFile = $_POST['file'];
	$stringData = $_POST['data'];
	$fh = fopen($myFile, 'w') or die("can't open file");
	fwrite($fh, $stringData);
	fclose($fh);
?>