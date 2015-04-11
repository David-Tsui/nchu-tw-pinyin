<?php
	if (isset($_POST['auto_KEY']) && isset($_POST['LOC']))
	{
		include("mysql_connect.inc.php");
		$key = $_POST['auto_KEY'];
		$loc = $_POST['LOC'];
		//$key = "iu iu a";
		//$loc = 1;	
		$blank_loc = array(-1);
		$left_index = 0;
		$right_index = 0;
		$counter = 1;
		$arr = array();
		if ($loc == 0){
			for($i = 0 ; $i < strlen($key) ; $i++){
				if ($key[$i] == " "){
					$blank_loc[$counter] = $i;
					$counter++;
				}
			}
			/*for ($i = 0 ; $i < count($blank_loc) ; $i++)
				echo "$blank_loc[$i]<br>";*/
			
			$counter--;			
			$sql = "SELECT `character_tw` FROM `pinyin_formal` WHERE `sound` = ? ORDER BY CHAR_LENGTH(`character_tw`) ASC, `score` DESC LIMIT 0,1";
			if ($stmt = mysqli_prepare($link,$sql)){
				do{
					mysqli_stmt_bind_param($stmt,"s",$key);
					mysqli_stmt_execute($stmt);
					mysqli_stmt_bind_result($stmt,$row);
					mysqli_stmt_fetch($stmt);
					if ($row != "") 
						break;
					else
						$key = substr($key,0,$blank_loc[$counter--]);
					
				}while (!mysqli_stmt_fetch($stmt));
				mysqli_stmt_close($stmt);
				$arr[0] = $row;
			}
		}
		else{
			for($i = 0 ; $i < strlen($key) ; $i++){
				if ($key[$i] == " "){
					$blank_loc[$counter] = $i;
					if ($counter == $loc){
						$left_index = $i;
					}
					if ($counter == ($loc + 1)){
						$right_index = $i;
					}
					$counter++;
				}
			}
			//echo "left_index: $left_index<br>right_index: $right_index<br>";
			$left_part = substr($key,0,$right_index);
			$right_part = substr($key,$left_index + 1,strlen($key));
			//echo "left_part: $left_part<br>right_part: $right_part<br><br>";
			
			$sql_left = "SELECT `character_tw`,`score` FROM `pinyin_formal` WHERE `sound` = ? ORDER BY char_length(`character_tw`) ASC,`score` DESC LIMIT 0,1";
			$sql_right = "SELECT `character_tw`,`score` FROM `pinyin_formal` WHERE `sound` = ? ORDER BY char_length(`character_tw`) ASC,`score` DESC LIMIT 0,1";
			if ($stmt = mysqli_prepare($link,$sql_left)){
				mysqli_stmt_bind_param($stmt,"s",$left_part);
				mysqli_stmt_execute($stmt);
				mysqli_stmt_bind_result($stmt,$row0_left,$row1_left);
				mysqli_stmt_fetch($stmt);
				mysqli_stmt_close($stmt);
				
				if ($stmt = mysqli_prepare($link,$sql_right)){
					mysqli_stmt_bind_param($stmt,"s",$right_part);
					mysqli_stmt_execute($stmt);
					mysqli_stmt_bind_result($stmt,$row0_right,$row1_right);
					mysqli_stmt_fetch($stmt);
					mysqli_stmt_close($stmt);
				}
				
				//echo "row_left = $row0_left<br>score[1] = $row1_left<br>row_right = $row0_right<br>score = $row1_right<br>";
				
				if ($row0_right != "" && $row0_left == ""){
					$arr[0] = "RIGHT";
					$arr[1] = $row0_right;
				}
				else if ($row0_left != "" && $row0_right == ""){
					$arr[0] = "LEFT";
					$arr[1] = $row0_left;
				}
				else{
					if ($row1_left > $row1_right){
						$arr[0] = "LEFT";
						$arr[1] = $row0_left;
					}
					else if ($row1_right > $row1_left){
						$arr[0] = "RIGHT";
						$arr[1] = $row0_right;
					}
					else{
						if (strlen($row0_left) > strlen($row0_right)){
							$arr[0] = "LEFT";
							$arr[1] = $row0_left;
						}
						else if (strlen($row0_right) > strlen($row0_left)){
							$arr[0] = "RIGHT";
							$arr[1] = $row0_right;
						}
						else{
							
						}
					}
				}
			}		
			echo json_encode($arr);	
		}
	}
	else{
		echo "Haven't got a post value!!";
	}
?>