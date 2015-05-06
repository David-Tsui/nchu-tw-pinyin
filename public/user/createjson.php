<?php
	function createjson()
	{	
		$name =  Auth::user()->name; 
		$dbexp = "select `id` from `users` where `name` = '" . $name . "'";
		$result = DB::select($dbexp);
		$id = $result[0]->id;
		$filename = $id . ".json";
		if (!file_exists($filename))
		{
			$myFile = "./user/dict/" . $filename;
			$stringData = "[]";
			$fh = fopen($myFile, 'w') or die("can't open file");
			fwrite($fh, $stringData);
			fclose($fh);
		}
	}
?>