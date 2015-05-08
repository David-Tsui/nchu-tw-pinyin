function MakeTable (member)
{
	$(document).ready(function() {
	    $.ajax({ 
	    	url: "./DbOperations.php",
	    	method: "POST",
	    	data: {
	    		func: "GetArray",
	    		name: member
	    	},
	    	success: function(res) {
        		var result = JSON.parse(res);
        		var length = Object.keys(result).length;
				var exp = "";
        		//console.log(result);
				for(var i = length - 1; i >= 0; i--)
				{

					exp += "<tr id=" + "'" + (i) + "'>";
					exp += "<td><div class='checkbox'><label><input type='checkbox'></label></div></td>";
					exp += "<td>" + result[i].sound + "</td>";
					exp += "<td>" + result[i].characters + "</td>";
					exp += "</tr>";
				}
				$('#json_table').html(exp);
        	}
		});
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
		var newWord = {sound:sd, characters:ch};
		$.ajax({ 
	    	url: "./DbOperations.php",
	    	method: "POST",
	    	data: {
	    		func: "SearchWordExist",
	    		name: member,
	    		sd: sd,
	    		ch: ch
	    	},
	    	success: function(res) {
        		var result = JSON.parse(res);
        		//console.log(result);
				if (result.length != 0)			//有找到
				{
					alert ("您不可以新增重複的詞。");
				}
				else
				{
					$.ajax({ 
				    	url: "./DbOperations.php",
				    	method: "POST",
				    	data: {
				    		func: "AddWord",
				    		name: member,
				    		sd: sd,
				    		ch: ch
				    	},
				    	success: function(res) {
			        		MakeTable (member);
							document.getElementById("sound").value = "";
							document.getElementById("characters").value = "";
			        	}
				    });
				}
			}
		});
		
	}
}

function DeleteAllWord (member)
{
	$(document).ready(function() {
	    $.ajax({ 
	    	url: "./DbOperations.php",
	    	method: "POST",
	    	data: {
	    		func: "DeleteAllWord",
	    		name: member
	    	},
	    	success: function(res) {
				var exp = "";
				$('#json_table').html(exp);
        	}
		});
	});
}

//先刪兩側再刪中間有BUG
//ex. {1, 2, 3, 4, 5}
//delete 2 , 4
//delete 3
//    {1,    3}
function DeleteChosenWord (member)
{
	var index = 0;
	var tararray = [];
	var temp = "";
	var collection = $('input:checkbox:checked').parents("tr");
	for(var i = collection.length-1 ; i >= 0; i--)
	{
		temp = collection[i]["innerText"];
		temp = (temp.trim()).split("\t");
		var obj = {sound:temp[0], characters:temp[1]};
		tararray.push(obj);
	}
	for (var ele in tararray)
		console.log(tararray[ele]);

	var tar = JSON.stringify(tararray);

	$.ajax({ 
	    	url: "./DbOperations.php",
	    	method: "POST",
	    	data: {
	    		func: "DeleteChosenWord",
	    		name: member,
	    		tar: tar
	    	},
	    	success: function(res) {
	    		MakeTable(member);
	    	}
	});
}

function CheckAndReplaceSound (oldsound)
{
	var temp = (oldsound.toLowerCase()).trim();
	var regexp = /[A-Za-z \t]+/;
	//console.log("temp: '" + temp + "'");
	if (!regexp.test(temp))	//判斷是否為 英文"Aa" 或 空格" " 或 縮排"\t"
	{
		//console.log ("false\n");
		return false;
	}
	else 
	{
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
		//console.log("Before: '" + oldsound + "'");
		//console.log("After: '" + ret + "'");
		//console.log("\n");
		return ret;
	}
}

function CheckEng (ch)
{
	return (('a' <= ch  && ch <= 'z') ? true : false);
}

function CheckChars (chars)
{
	chars = chars.trim();
	//console.log ("Ch:'" + chars + "'");
	//只含中文
	var regexp = /^[\u4e00-\u9fa5]{1,}$/;
	if (!regexp.test(chars))
	{
		//console.log ("false");
		return false;
	}
	else
	{
		//console.log("true\n\n");
		return chars;
	}
}

function EditValue ()
{
	console.log("hello world");
}