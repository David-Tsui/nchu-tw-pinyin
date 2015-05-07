function MakeTable (member)
{
	var file = "./dict/" + member + ".json";
	$.getJSON(file ,function(result) {
		var length = Object.keys(result).length;
		var exp = "";
		for(var i = length - 1; i >= 0; i--)
		{
			exp += "<tr id=" + "'" + (i) + "'>";
			exp += "<td><div class='checkbox'><label><input type='checkbox'></label></div></td>";
			exp += "<td>" + result[i].sound + "</td>";
			exp += "<td>" + result[i].characters + "</td>";
			exp += "</tr>";
		}
		$('#json_table').html(exp);
	});
}

function AddWord (member)
{
	var sd = document.getElementById("sound").value;
	var ch = document.getElementById("characters").value;

	sd = CheckAndReplaceSound(sd);
	ch = CheckChars(ch);

	/*console.log ("type=" + typeof sd + " sd='" + sd + "'");
	console.log ("type=" + typeof ch + " ch='" + ch + "'");*/

	if (sd == false || ch == false)
	{
		alert ("您輸入的格式有誤，請照提示輸入");
	}

	else
	{
		var file = "./dict/" + member + ".json";

		$.getJSON(file ,function(result){
			{
				var newWord = {sound:sd, characters:ch};
				var check = FindWordIndex(newWord, result);
				if (check[0] != -1)	//-1為沒找到
				{
					alert ("您不可以加重複的詞。")
				}
				else
				{
					var length = Object.keys(result).length;
					var exp = "<tr id=" + "'" + (length) + "'>";
					exp += "<td><div class='checkbox'><label><input type='checkbox'></label></div></td>";
					exp += "<td>" + sd + "</td>";
					exp += "<td>" + ch + "</td>";
					exp += "</tr>";

					var newhtml = $('#json_table').html();
					newhtml = exp + newhtml;
					$('#json_table').html(newhtml);

					result.push({sound: sd, characters: ch});
					UpdateJson(file, result);

					document.getElementById("sound").value = "";
					document.getElementById("characters").value = "";
				}
			}
		});
	}
}

function FindWord (member)
{
	var file = "./dict/" + member + ".json";

	var key = document.getElementById("keyword").value;
	$.getJSON(file ,function(result){
		{
			var result = FindWordIndex (key, result);
			console.log(result);

			


			
		}
	});

}

function FindWordIndex (input, result)
{
	var ret = [-1];	//沒找到初始化為-1
	console.log(JSON.stringify(input));
	if (typeof input == "object")
	{
		for (var i=0; i<result.length; i++)
		{
			if (JSON.stringify(input) === JSON.stringify(result[i]) )
			{
				ret[0] = i;
				break;
			}
		}
	}
	else
	{
		ret.pop();
		for (var i=0; i<result.length; i++)
		{
			if (result[i].sound == input || result[i].characters == input)
			{
				ret.push(i);
			}
		}
	}
	
	console.log("ret=" + ret);
	return ret;
}

function DeleteAllWord (member)
{
	var file = "./dict/" + member + ".json";

	$('#json_table').html(exp);

	$.getJSON(file ,function(result){
		result = [];
		UpdateJson (file, result);
	});
	var exp = "";
	$('#json_table').html(exp);
}

function DeleteChosenWord (member)
{
	var file = "./dict/" + member + ".json";
	var index = 0;
	$(document).ready(function () {
		var collection = $('input:checkbox:checked').parents("tr");
		$.getJSON(file ,function(result){
			for(var i = collection.length-1 ; i >= 0; i--)
			{
				index = collection[i]["id"];
				result.splice(index, 1);
			}
			$('input:checkbox:checked').parents("tr").remove();
			UpdateJson (file, result);
		});
    });
}

function UpdateJson (filename, result)
{
	$(document).ready(function() {
	    $.ajax({ 
	    	url: "./updatejson.php",
	    	method: "POST",
	    	data: { 
	    		file: filename,
	    		data: JSON.stringify(result, null, "\t")
	    	}
		});
	});
}

function CheckAndReplaceSound (oldsound)
{
	var regexp = /^.[A-Za-z \t]{1,}$/;
	if (!regexp.test(oldsound))	//判斷是否為 英文"Aa" 或 空格" " 或 縮排"\t"
	{
		//console.log ("false\n");
		return false;
	}
	else 
	{
		var temp = (oldsound.toLowerCase()).trim();
		var templen = temp.length;
		var isspace = false;
		var ret = "";
		//console.log("'" + temp + "'");
		for (var i=0; i<templen; i++)
		{
			if ((temp[i] == ' ' || temp[i] == '\t') && !isspace)
			{
				isspace = true;
				ret += ' ';
			}
			else if (isspace && temp[i] != ' ' && temp[i] != '\t')
			{
				isspace = false;
				ret += temp[i];
			}
			else if (isspace && (temp[i] == ' ' || temp[i] == '\t'))
				continue;
			else
				ret += temp[i];
		}
		/*console.log("Before: '" + oldsound + "'");
		console.log("After: '" + ret + "'");
		console.log("\n");*/
		return ret;
	}
}

function CheckEng (ch)
{
	return (('a' <= ch  && ch <= 'z') ? true : false);
}

function CheckChars (chars)
{
	//console.log ("Ch:" + chars);
	//只含中文
	var regexp = /^[\u4e00-\u9fa5]{1,}$/;
	if (!regexp.test(chars))
	{
		//console.log ("false\n\n");
		return false;
	}
	else
	{
		//console.log("true\n\n");
		return chars;
	}
}