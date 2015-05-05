function CreateJson (member)
{
    $.ajax({ 
    	url: "./createjson.php",
    	method: "POST",
    	data: {name: member}
	});
}

function MakeTable (member)
{
	var file = "./dict/" + member + ".json";
	$.getJSON(file ,function(result) {
		console.log("result: " + result);
	}).fail(function(){
		//alert("NO such file!");
		CreateJson(member);
	}).success(function(){
		$.getJSON(file ,function(result) {
			var length = Object.keys(result).length;
			var exp = "";
			for(var i = length - 1; i >= 0; i--)
			{
				exp += "<tr id=" + "'" + (i) + "'>";
				exp += "<td><div class='checkbox'><label><input type='checkbox' name='selected[]'></label></div></td>";
				exp += "<td>" + result[i].sound + "</td>";
				exp += "<td>" + result[i].characters + "</td>";
				exp += "</tr>";
			}
			$('#json_table').html(exp);
		});
	});

	/*$.ajax({
		url: file,
		type:'HEAD',
		error: function()
		{
			CreateJson (member);
    	},
	    success: function()
	    {
	        
	    }
	});*/
}

function AddWord (member)
{
	var sd = document.getElementById("sound").value;
	var ch = document.getElementById("characters").value;
	
	if (sd != "" && ch != "")
	{
		var file = "./dict/" + member + ".json";

		$.getJSON(file ,function(result){
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
			}
		});
		document.getElementById("sound").value = "";
		document.getElementById("characters").value = "";
	}
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
