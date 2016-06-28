<?php
	include("mysql_connect.inc.php");
	/*$consonant = array(
		"b",
		"bb",
		"c",
		"d",
		"g",
		"gg",
		"h",
		"j",
		"k",
		"l",
		"m",
		"n",
		"ng",
		"p",
		"q",
		"r",
		"s",
		"t",
		"x",
		"z",
	);
	$vowel = array();
	$sql = "SELECT `sound` FROM `pinyin_formal` 
		    WHERE `sound` LIKE :key AND `sound` NOT LIKE :key2";*/

    
    $arr = array(
    	"bang","binn","borh","buann","bbak","bbauh","bbih","bbong","cai","cop","cuang","cua","dah","diam","diap","duh",
		"ga","giann","giuh","guai","ggan","gget","ggit","gguan","hainn","huat","huih","hut","jia","jiou","jiouh",
		"kennh","konn","kueh","kue","lam","lap","liau","lim","mi","moh","mui","naih","nng","niu","ngau","ngeh","ngiauh","ngo",
		"piah","pok","puah","qionn","qiunn","qiok","rin","riong","rip","run","sen","suinn","suainn","te","tor","tann","ting",
		"xiak","xiang","xiannh","xik","zat","zenn","zom","zu"
	);


  	for($i = 0; $i < count($arr); $i++){
	  	$sql = "SELECT DISTINCT `characters` FROM `pinyin_formal` 
		    	WHERE `sound` = :key AND char_length(`characters`) = 1
		    	LIMIT 0,4";
		$stmt = $db->prepare($sql);
		$key = $arr[$i];
		$stmt->bindParam(':key',$key);
		$stmt->execute();
		$stmt->setFetchMode(PDO::FETCH_NUM);
		$row = $stmt->fetch();

		echo "key =  $key<br>";
		do{
	    	if ($row != "")						
				echo "$row[0], ";
			else{
				break;
			}
	  	}while ($row = $stmt->fetch());
	  	echo "<br><br>";
	}

	/*$i = 0;
	$flag = 0;
	$temp_vowel = "";
	do{
    	if ($row != ""){		
    		if (getSyllable($row[0]) == 1){				
				echo "$row[0]<br>";
				$temp_key = $row[0];
				if ($flag != 0 && strcmp($temp_key, $temp_vowel) == 0){
					$vowel[$i]["count"]++;
				}
				else if ($flag != 0 && strcmp($temp_key, $temp_vowel) != 0){
					$i++;
					$temp_vowel = $temp_key;
					$vowel[$i]["sound"] = substr($temp_key, strlen($key)); 
					$vowel[$i]["count"] = 1;
				}
				else{
					$temp_vowel = $temp_key;
					$vowel[$i]["sound"] = substr($temp_key, strlen($key));
					$vowel[$i]["count"] = 1;
					$flag = 1;
				}
			}
		}
		else
			break;
		//$i++;
  	}while ($row = $stmt->fetch());

  	for($j = 0; $j <= $i; $j++){
  		echo "vowel[$j][sound] = " . $vowel[$j]["sound"] . ", ";
  		echo "vowel[$j][count] = " . $vowel[$j]["count"] . "<br>";
  	}*/

  	function getSyllable($key){                  // 得到key的音節數
		$blanks = 0;
		$syllable = 0;
		for($i = 0; $i < strlen($key); $i++){
			if (strcmp($key[$i]," ") == 0) 
				$blanks++;
		}
		$syllable = $blanks + 1;
		return $syllable;
	}
?>