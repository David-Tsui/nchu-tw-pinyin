<?php
	function CreateDBTable()
	{
		include("mysql_memdict_connect.inc.php");
		$name =  Auth::user()->name; 
		$dbexp = "select `id` from `users` where `name` = '" . $name . "'";
		$result = DB::select($dbexp);
		$id = $result[0]->id;
		$sql = "CREATE TABLE IF NOT EXISTS `";
		$sql .= $id;
		$sql .= "` (
				`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
				`sound` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
				`characters` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
				PRIMARY KEY (`id`)
				) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;";
		$stmt = $memdb->prepare($sql);
		$stmt->execute();
	}

	function CreateJson()
	{
		$name =  Auth::user()->name; 
		$dbexp = "select `id` from `users` where `name` = '" . $name . "'";
		$result = DB::select($dbexp);
		$id = $result[0]->id;
		$myFile = "./user/dict/" . $id . ".json";

		if (!is_file($myFile))
		{
			WriteToConsole("No such file.");
			$stringData = "[]";
			$fh = fopen($myFile, 'w') or die("can't open file");
			fwrite($fh, $stringData);
			fclose($fh);
		}
	}

	function WriteToConsole ($str)
	{
		if ( is_array( $str ) )
        	$output = "<script>console.log( '" . implode( ',', $str) . "' );</script>";
    	else
        	$output = "<script>console.log( '" . $str . "' );</script>";
   		echo $output;
	}
?>