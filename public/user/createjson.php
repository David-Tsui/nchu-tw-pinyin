<?php
	function createjson()
	{	
		$name =  Auth::user()->name; 
		$dbexp = "select `id` from `users` where `name` = '" . $name . "'";
		$result = DB::select($dbexp);
		$id = $result[0]->id;
		$myFile = "./user/dict/" . $id . ".json";
		if (!is_file($myFile))
		{
			//WriteToConsole("No such file.");
			$stringData = "[]";
			$fh = fopen($myFile, 'w') or die("can't open file");
			fwrite($fh, $stringData);
			fclose($fh);
		}
	}
	function WriteToConsole ($str)
	{
		echo "\n<script>";
		echo "console.log ('" . $str . "');";
		echo "</script>\n\n";
	}
?>