<?php
	$arr = array(
		"modify_pinyin",
		array("diong hing dai hak,1", "diong hing,4", "diong,22"),
		array("中興大學","中興","中型","重型","中","重","張","長","漲","忠")
	);
	echo "arr_len = " . count($arr) . "<br>";
	echo "arr[0]_len = " . count($arr[0]) . "<br>";
	echo "arr[1]_len = " . count($arr[1]) . "<br>";
	echo "arr[2]_len = " . count($arr[2]) . "<br>";
	/*for($j = 0; $j < count($arr[1]); $j++)
		echo $arr[1][$j] ."<br>";*/
	echo json_encode($arr);
?>