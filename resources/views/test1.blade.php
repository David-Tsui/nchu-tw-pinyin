<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Document</title>
		<script src="/nchu-tw-pinyin/public/js/jquery-1.11.1.js"></script>

		<script type="text/javascript">
			$(document).ready(function(){
				var a = '<span class="in_pinyin_window">株株</span>';
				var b = '<span class="in_pinyin_window">辦辦</span>';
				var c = '<span class="in_pinyin_window">聽聽</span>';
				$("#input").html(a + b + c);
				$("#input").setCursorPosition(2);
			})


			$.fn.setCursorPosition = function(pos){                         // 控制游標顯示位置   
			var element = document.getElementById("input");
			var range = document.createRange();          
			try{
				var sel = window.getSelection();
				var check_child_node = element.childNodes[0];  
				console.log("child_node[0]: " + check_child_node);  
				check_child_node = element.childNodes[1];
				console.log("child_node[1]: " + check_child_node);                         
				if (typeof(check_child_node) == "undefined" && sel_mode == 1 && mode == 2){ // 只要是智能模式通通進給我進catch拉!
					throw "set in span";
				}
				else{
					range.setStart(element.childNodes[0], pos);
				}
			}
			catch (err){                                                // 此區塊直接針對各span設定其游標位置
				console.log("err_msg: " + err);
				console.log("pos: " + pos);  
				var node;
				range.setStart(node.childNodes[0], pos);
				var sel = window.getSelection();
			}
			range.collapse(true);
			sel.removeAllRanges();
			sel.addRange(range);
			element.focus();          
		};

		</script>
		<style>
			#input[placeholder]:empty:focus:before {
				content: "";
			}

			#input[placeholder]:empty:before {
				content: attr(placeholder);
				color: #555; 
			}

			.in_pinyin_window {
				margin-right: 1.2px; 
				text-decoration: underline;
			}
		</style>
	</head>
	<body>
		<div id="input" placeholder="請輸入英文拼音..." contenteditable="true" style="margin-top: 15px; width: 200px; border: ridge 3px"></div>
		
	</body>
</html>