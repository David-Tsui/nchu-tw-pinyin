	/***********************************************興大台語拼音輸入法演算法*********************************************/
	/*********************************************Mainly coded by David Tsui*******************************************/
	/******************************************************************************************************************/
	var nav_arr = ["#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login"];   // navbar的元素
	var nav_color = ["#F87284","#F0A01C","#F1EE8F","#8AE194","#5B81E9"];                    // 初始navbar的顏色
	var customJqte = "";                                                                    // 記錄當前jqte的樣式
	var customJqte_flat = "";                                                               // 記錄當前jqte_flat的樣式
	var click_count = 0;

	var mode = 0;                                                       // 自選模式 0: 拼音模式; 1: 選字模式; 2: 關聯詞模式  3: 修正模式
																		// 智能模式 0: 拼音模式; 1: 空白選字的拼音模式; 2: 自動選詞模式 3: 修正模式

	var search_key = "";                                                // 查詢中文字的英文拼音Key(自選及智能皆使用)
	var search_key_loc = 0;                                             // 記錄輸入key值時的輸入位置
	var prefix_key = "";                                                // 查詢關聯詞的中文key

	var auto_search_key = "";                                           // 自動選詞的搜尋key
	var auto_len = 0;                                                   // 記錄已自動選字成功的字串長度
	var auto_start = 0;                                                 // 記錄自動選字的起始位置
	var auto_end = 0;                                                   // 記錄自動選字的終點位置
	var auto_letter = [];                                               // 陣列-記錄回傳的智慧選詞
	var pinyin_record = [];                                             // 記錄輸入框中所有字詞，以物件格式記錄
	/*  pinyin_record = [
		pinyin: "",
		word: "",
		start_loc: 0,
		end_loc: 0,
		modifiable: 0/1/2 (0:可修改，1:可在最前方修改，2:只能刪除)
	];*/
	var record_last_index = 0;
	var auto_static_word = "";                                          // 記錄因超出三詞範圍，以及經由選定而無法再自動變動的字詞

	var sel_mode = 0;                                                   // 記錄當前dropdown選單中的模式
	var select_letter = [];                                             // 陣列-記錄回傳的文字

	var number_letters = 0;                                             // 記錄該拼音回傳之結果總共有幾個字
	var keyin = 0;                                                      // 記錄按下鍵盤的Ascii code
	var input_copy = "";                                                // 記錄鍵盤輸入前的所有文字
	var input_word = "";                                                // 記錄鍵盤輸入前的中文字
	var input_len = 0;                                                  // 記錄鍵盤輸入前已選字成功的字串長度
	var input_loc = 0;                                                  // 記錄鍵盤輸入的位置

	var show_text = "";                                                 // 記錄textarea中所顯示的文字
	var show_flat_text = "";                                            // 記錄小裝置顯示時之替代textarea中所顯示的文字  
	var mousedown_loc = 0;                                              // 記錄滑鼠一點下去時的游標位置

	var totalpage = 0;                                                  // 記錄回傳文字的總頁數
	var thispage = 1;                                                   // 記錄當前的頁數

	var undo_stack = [];                                                // 模擬堆疊的陣列-記錄輸入的結果，提供給undo button使用
	var undo_index = 0;                                                 // 記錄每一次undo_record的索引值
	var first_input_flag = true;                                        // undo_stack的最底元素應是完全空白，第一次輸入時先push空白紀錄進去，故以這判斷

	var tow_check = false;                                              // 判斷滑鼠有無反白拖曳
	var forbid_mousemove = false;                                       // 用來避免偶爾keydown觸發mousemove的事件的flag     
	var input_mouseleave_flag = false;                                  // 用來修正在與下方兩邊快速移動時造成的bug
	var prompt_mouseleave_flag = false;                                 // 用來修正在與上方兩邊快速移動時造成的bug
	var associated_search_flag = false;                                 // 用來判斷是否正在關聯拼音
	var correspond_flag = false;                                        // 用來判斷音與字是否對應
	var interval = "\t\t";                                              // textarea中的小標題間距

	$(document).ready(function(){
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		set_default();                                                   // 設定一些畫面的初始狀態
		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓與輸入法相關↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

		$("#input").mousedown(function(){                           
			var textbox = $("#input");
			var DOM_textbox = document.getElementById("input");
			mousedown_loc = getCaretCharacterOffsetWithin(DOM_textbox);  // 記錄滑鼠一點下去時的游標位置
			console.log("mousedown_loc: " + mousedown_loc);
			forbid_mousemove = false;
		}).mousemove(function(){
			/*if (forbid_mousemove == false){
				var textbox = $("#input");
				mousedown_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				show_text = $("#show").html();
				if (show_text == ""){                                    // 非選字時點選textbox中的任一位置，或是拖拉反白
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
				else{                               
					if (getCaretCharacterOffsetWithin(DOM_textbox) == getCaretCharacterOffsetWithin(textbox)){ // 如果在拼音或選字時，將游標點選之後依舊在原始位置
						tow_check = false;
					}
					else                                                 // 如果在拼音或選字時反白
						tow_check = true;
				}
			}*/
		}).mouseup(function(){                                           //調整在拼音時，被反白拖曳導致游標移動到奇怪的地方
			var DOM_textbox = document.getElementById("input");
			mouseup_loc = getCaretCharacterOffsetWithin(DOM_textbox);  	// 記錄滑鼠彈起來時的游標位置
			if (sel_mode == 0 && mode == 0 && search_key == "")
				input_loc = mouseup_loc;

			show_text = $("#show").html();
			if (tow_check == true && show_text != ""){                  // 如果不能選字或是拼音還存在，則反白會失效，游標自動跑到當前的input_loc
				textbox.setCursorPosition(input_loc);           		// 一律固定到該次輸入的位置
			}
			else if (tow_check == false && mode == 2 && (getCaretCharacterOffsetWithin(DOM_textbox) != input_loc)){ // 如果在關聯詞模式，將游標點至非該次輸入的地方，則視為放棄選詞
				mode = 0;                                               // 而後視為選字成功之後續歸零
				$("#show").html("");
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
			}
			else if (tow_check == false && show_text != ""){            // 如果沒有拖拉反白，而是單純的點選
				if ((getCaretCharacterOffsetWithin(DOM_textbox) > (input_loc + search_key.length)) || (getCaretCharacterOffsetWithin(DOM_textbox) < input_loc)){ // 點選在拼音區間外
					textbox.setCursorPosition(mousedown_loc);                   
				}
				else                                                    // 點選在拼音區間裡
					textbox.setCursorPosition(getCaretCharacterOffsetWithin(DOM_textbox));	// 位置不動
			}
		});

		/********************************************↑以上為mouse事件↑*********************************************/

		$("#input").keydown(function(e){
			var textbox = $("#input");
			var DOM_textbox = document.getElementById("input");
			var prompt_txtbox = $("#prompt");
			var prompt_flat_txtbox = $("#prompt_flat");
			keyin = e.which;
			//console.log("keyin: " + keyin);
			//if (e.ctrlKey) return false;                                // 暫時先擋住ctrl
			forbid_mousemove = true;
			if (keyin == 229){                                          // 擋住中文輸入法
				var text = "請切換至英文輸入法!";
				prompt_txtbox.val(text);
				prompt_flat_txtbox.val(text);
				caption_effect();
				return false;                       
			}
			if (keyin == 45){                                           // 限制insert
				var text = "本輸入法不支援insert鍵!";
				prompt_txtbox.val(text);
				prompt_flat_txtbox.val(text);
				caption_effect();
				return false;   
			}                           

			if (first_input_flag == true){
				push_undo_record();
				first_input_flag = false;
			}   
						 
			show_text = $("#show").html();
			auto_start = get_auto_start();
			
			if (show_text == "" || show_text == "無此拼音，請按backspace或delete調整拼音"){   // 如果拼音模式下失敗，禁止+/-號
				if ((keyin == 107 || keyin == 187)) return false;               
				if ((keyin == 109 || keyin == 189)) return false;
			}       

			if (keyin == 13 && sel_mode == 1){                          // 智能模式的自動選詞時，按下enter結束自動選詞
				var text = textbox.html();
				if (mode == 2){
					for(var i = 0; i < word_record_loc.length; i++){
						if (word_record_loc[i] < 999999)
							input_loc = word_record_loc[i] + auto_letter[i].length;                         
					}                       
					auto_start = input_loc;
					auto_len = 0;
					auto_search_key = "";
					search_key = "";
					input_word = remove_tags(text);
					auto_static_word = input_word;
					input_len = input_word.length;
					textbox.html(input_word);
					mode = 0;
					textbox.focus().setCursorPosition(input_loc);
					return false;
				}
			}

			if (keyin == 32 && sel_mode == 1 && mode == 1){
				console.log("**********************");
				console.log("input_loc: " + input_loc);
				console.log("input_len: " + input_len);
				console.log("auto_start: " + auto_start);
				console.log("**********************");
				if (input_loc < input_len){                              // 不在末端打字
					if (input_loc == auto_start){
						//console.log("auto_search_key: " + auto_search_key);
						auto_search_key = search_key + " " + auto_search_key;
					}
					else{
						var j = 0;
						for(var i = 0; i < auto_search_key.length; i++){
							if (auto_search_key[i] == " ") 
								j++;
							if (j == (input_loc - auto_start)){          // 以auto_start作為新的起點
								var insert_loc = i;
								console.log("The blank locate: " + insert_loc);
								var left = auto_search_key.substring(0,insert_loc);
								var right = auto_search_key.substring(insert_loc,auto_search_key.length);
								console.log("left: " + left);
								console.log("right: " + right);
								auto_search_key = left + " " + search_key + right;  // 更新auto_search
								break;
							}
						}  
					} 
				}
				else
					auto_search_key += search_key + " ";
				console.log("auto_search_key: " + auto_search_key);
				$.ajaxSettings.async = false;
				search_auto();
				$.ajaxSettings.async = true;
			} 
			if (keyin == 32 && (search_key == "" || associated_search_flag == true)){ // 當當前沒有拼音，或是在拚音提示狀態中，禁止空白
				var text = "現在不能按空白!";
				prompt_txtbox.val(text);
				prompt_flat_txtbox.val(text);
				caption_effect();
				return false;
			}
			if (keyin == 35){                                          // 限制End鍵
				if (mode == 0){
					if (sel_mode == 0 && associated_search_flag == true){
						textbox.setCursorPosition(input_loc + search_key.length);
						return false;
					}
				}
				else if (mode == 1 || show_text == "無此拼音，請按backspace或delete調整拼音"){         // 選字模式下，若按下End鍵直接將輸入位置移動到拼音尾
					textbox.setCursorPosition(input_loc + search_key.length);
					return false;
				}
				if (mode == 2){                                        // 關聯詞模式下，若按下方向鍵視為放棄
					mode = 0;
					$("#show").html("");
					$("#show_flat").html("");
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
			}
			if (keyin == 36){                                          // 限制Home鍵
				if (mode == 0){
					if (associated_search_flag == true){
						textbox.setCursorPosition(input_loc);
						return false;
					}
				}
				else if (mode == 1 || show_text == "無此拼音，請按backspace或delete調整拼音"){         // 選字模式下，若按下Home鍵直接將輸入位置移動到拼音首
					textbox.setCursorPosition(input_loc);
					return false;
				}
				if (mode == 2){                                        // 關聯詞模式下，若按下方向鍵視為放棄
					mode = 0;
					$("#show").html("");
					$("#show_flat").html("");
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
			}                  
			if (keyin == 37 && reachLeft() == true){                   // 限制游標移動在拼音界限內
				if (sel_mode == 0 && mode == 1) return false;
				if (sel_mode == 0 && mode == 0 && search_key != "") return false;
				if (sel_mode == 1 && mode == 2) return false;
				if (sel_mode == 1 && mode == 1) return false;
			}                   
			
			if (keyin == 39 && reachRight() == true){                  // 限制游標移動在拼音界限內
				if (sel_mode == 0 && mode == 1) return false;
				if (sel_mode == 0 && mode == 0 && search_key != "") return false;     
				if (sel_mode == 1 && mode == 2) return false;
				if (sel_mode == 1 && mode == 1) return false;
			}

			if (keyin == 40 && sel_mode == 0 && search_key == ""){
				var which_word = get_Which_Word(input_loc,"head");
				switch (pinyin_record[which_word].modifiable){
					case 0: 
						var key = pinyin_record[which_word].pinyin;
						var start_loc = pinyin_record[which_word].start_loc;
						console.log("key: " + key);
						var j = 0;
						for(var i = 0; i < key.length; i++){
							if (key[i] == " ") 
								j++;
							if (j == (input_loc - start_loc)){         
								var temp_loc = i;
								search_key = key.substring(temp_loc,key.length);
								search_key = search_key.trim();
								break;
							}
						}
						console.log("search_key: " + search_key);
						mode = 3;
						search_char(0);
						return false;
						break;
					case 1:

						break;
					case 2:
						var text = "此字詞無法修改!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
						return false;
						break;
				}
				
			}

			/*if (keyin == 40 && sel_mode == 1 && mode == 2){            // 自動選詞時按方向鍵"下"來改字
				if (temp_loc >= word_record_loc[0] && temp_loc < word_record_loc[1]){
					var j = 0;
					var pinyin = pinyin_record[0];
					var split_loc = (temp_loc - auto_start);
					for(var i = 0; i < pinyin.length; i++){
						if (pinyin[i] == " ")                           //
							j++;
						if (j == split_loc){
							search_key = pinyin.substring(split_loc,pinyin.length);
							break;
						}
					}
				}
				else if (temp_loc >= word_record_loc[1] && temp_loc < word_record_loc[2]){
					var j = 0;
					var pinyin = pinyin_record[1];
					var split_loc = (temp_loc - auto_start);
					for(var i = 0; i < pinyin.length; i++){
						if (pinyin[i] == " ")                           //
							j++;
						if (j == split_loc){
							search_key = pinyin.substring(split_loc,pinyin.length);
							break;
						}
					}
				}
				else if (temp_loc >= word_record_loc[2]){
					var j = 0;
					var pinyin = pinyin_record[2];
					var split_loc = (temp_loc - auto_start);
					for(var i = 0; i < pinyin.length; i++){
						if (pinyin[i] == " ")                           //
							j++;
						if (j == split_loc){
							search_key = pinyin.substring(split_loc,pinyin.length);
							break;
						}
					}
				}
				console.log("(down)search_key: " + search_key);
				mode = 3;
				search_char(0);
				return false;
			}*/
			
			if (keyin == 8){
				if (sel_mode == 1 && mode == 2 && reachLeft() == true) 
					return false; 
				if (sel_mode == 0 && mode == 2){
					mode = 0;
					$("#show").html("");
					$("#show_flat").html("");
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
			} 

			if (keyin == 46){
				if (sel_mode == 1 && mode == 2 && reachRight() == true)
					return false; 
				if (sel_mode == 0 && mode == 2){
					mode = 0;
					$("#show").html("");
					$("#show_flat").html("");
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
			}  
							
			if (mode == 0 || associated_search_flag == true){
				if (isNumber(keyin)){                                   // 拼音模式下禁止輸入數字
					var text = "現在還不能選字!";
					prompt_txtbox.val(text);
					prompt_flat_txtbox.val(text);
					caption_effect();
					return false;
				}
			}
			
			if (sel_mode == 0 && mode == 2 && (keyin >= 37 && keyin <= 40)){                // 關聯詞模式下，若按下方向鍵視為放棄
				mode = 0;
				$("#show").html("");
				$("#show_flat").html("");
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
			}
			
			if ((mode != 0 || associated_search_flag == true) && reachTail() == true){          // 選字模式下，若翻頁已達末頁，則+號無效，若所選數字不存在文字，亦禁止該數字的鍵入
				if ((keyin == 107 || keyin == 187)){
					if (totalpage == 1){/*do nothing*/}
					else{
						var text = "已達最末頁!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
					}
					return false; 
				}
				if (isNumber(keyin) && keyin >= 96){                    // 如果按下的數字鍵並不存在對應文字
					if ((keyin - 96 + (thispage - 1) * 10) > number_letters || (keyin == 96) && ((thispage * 10) > number_letters)){
						var text = "該號碼無法選擇!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();                               
						return false;
					}
				}
				else if (isNumber(keyin) && keyin >= 48 && keyin < 96){ // 如果按下的數字鍵並不存在對應文字
					if ((keyin - 48 + (thispage - 1) * 10) > number_letters || (keyin == 48) && ((thispage * 10) > number_letters)){
						var text = "該號碼無法選擇!";
						prompt_txtbox.val(text); 
						prompt_flat_txtbox.val(text);
						caption_effect();
						return false;
					}
				}
			}
			if ((mode != 0 || associated_search_flag == true) && reachHead() == true){         // 選字模式下，若翻頁已達首頁，則-號無效
				if (keyin == 109 || keyin == 189){
					if (totalpage == 1){/*do nothing*/}
					else{
						var text = "已達首頁!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
					}
					return false;
				}
			}           

			if (keyin == 107 || keyin == 187){          // +鍵
				thispage++;                             // 刷新頁數
				var temp_text = "";
				var temp_text_flat = "";
				var i = 0 + (10 * (thispage - 1));
				var counter = 0;
				var number = 1;
				var next_flag = false;
				while (i < number_letters && counter < 10){
					if (associated_search_flag == false)
						temp_text += number + ". " + select_letter[i] + "\n";
					else
						temp_text += "● " + select_letter[i] + "\n";
					if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){        // 為了讓小螢幕裝置顯示正常，字不會出界
						if ((i % 10) == 3){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
						if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
							next_flag = true;
						}
						else if (((i % 10) == 7)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + " +:下頁\n";
							else
								temp_text_flat += "● " + select_letter[i] + " +:下頁\n"
						}
					}
					else if (((i % 10) == 3 || (i % 10) == 7) && (thispage == totalpage)){
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
						if ((i % 10) == 7){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
					}
					else{
						if (associated_search_flag == false)
							temp_text_flat += number + ". " + select_letter[i] + " ";
						else
							temp_text_flat += "● " + select_letter[i] + " ";                                                
					}
					i++;    
					counter++;
					number++;
					if (number == 10) 
						number = 0;
				}
				if (thispage < totalpage){
					temp_text += "+:下一頁 -:上一頁";
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					temp_text_flat += " -:上頁";
				}
				else{
					temp_text += "-:上一頁";
					temp_text_flat += "-:上頁";
				}

				if (sel_mode == 0){
					if (mode == 0){
						temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text; 
					}
					if (mode == 1){
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text; 
					}
				}
				if (sel_mode == 1){
					if (associated_search_flag == true)
						temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text; 
					else
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
				}
				if (mode == 2)
					temp_text = "關聯詞" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
				$("#show").html(temp_text);
				$("#show_flat").html(temp_text_flat);
				return false;
			}
			if (keyin == 109 || keyin == 189){          // -鍵
				thispage--;                             // 刷新頁數引
				var temp_text = "";
				var temp_text_flat = "";
				var i = 0 + (10 * (thispage - 1));
				var counter = 0;
				var number = 1;
				var next_flag = false;
				while (i < number_letters && counter < 10){
					if (associated_search_flag == false)
						temp_text += number + ". " + select_letter[i] + "\n";
					else
						temp_text += "● " + select_letter[i] + "\n";
					if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){        // 為了讓小螢幕裝置顯示正常，字不會出界
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
						if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
							next_flag = true;
						}
						else if (((i % 10) == 7)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + " +:下頁\n";
							else
								temp_text_flat += "● " + select_letter[i] + " +:下頁\n"
						}
					}
					else if (((i % 10) == 3 || (i % 10) == 7) && (thispage == totalpage)){
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
						if ((i % 10) == 7){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += "● " + select_letter[i] + "\n";
						}
					}
					else{
						if (associated_search_flag == false)
							temp_text_flat += number + ". " + select_letter[i] + " ";
						else
							temp_text_flat += "● " + select_letter[i] + " ";
						}
					i++;    
					counter++;
					number++;
					if (number == 10) number = 0;
				}
				if (thispage < totalpage && thispage > 1){
					temp_text += "+:下一頁 -:上一頁";
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					temp_text_flat += " -:上頁";
				}
				else{
					temp_text += "+:下一頁";
					temp_text_flat += " +:下頁";
				}

				if (sel_mode == 0){
					if (mode == 0){
						temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text; 
					}
					if (mode == 1){
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
					}
				}
				if (sel_mode == 1){
					if (associated_search_flag == true)
						temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text; 
					else
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
				}
				if (mode == 2)
					temp_text = "關聯詞" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
				$("#show").html(temp_text);
				$("#show_flat").html(temp_text_flat);
				return false;
			}                                               
		}).keyup(function(e){                                           // 接續的keyup事件，為了讓上下左右鍵有影響
			keyin = e.which;
			var prompt_txtbox = $("#prompt");
			var prompt_flat_txtbox = $("#prompt_flat");
			if (sel_mode == 0){ 
				if (keyin == 37 && mode != 1 && !(mode == 0 && search_key != "")){               // 非拼音時，左右鍵將會調整輸入位置
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
				if (keyin == 39 && mode != 1 && !(mode == 0 && search_key != "")){               // 非拼音時，左右鍵將會調整輸入位置 
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);                 
				}       
				if (mode == 0 && keyin == 35 && associated_search_flag == false){
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);  
				}
				if (mode == 0 && keyin == 36 && associated_search_flag == false){
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox); 
				}
			}
			if (sel_mode == 1){
				if (keyin == 37 && (mode == 0 || mode == 2)){       // 非拼音時，左右鍵將會調整輸入位置
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
				if (keyin == 39 && (mode == 0 || mode == 2)){       // 非拼音時，左右鍵將會調整輸入位置                     
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);                        
				}
			}
			push_undo_record();
		}).on('input',function(e){                                  // 同時發生的事件，只控制輸入進textbox的按鍵          
			var prompt_txtbox = $("#prompt");
			var prompt_flat_txtbox = $("#prompt_flat"); 
			/*************************************************自選模式***********************************************/
			if (sel_mode == 0){
				if ((keyin >= 65 && keyin <= 90) || keyin == 32 || keyin == 8 || keyin == 46 || keyin == 37 || keyin == 39){  
				// 輸入英文產生搜索資料庫的key值，並考慮刪除情形
					getKey(keyin);
					input_copy = textbox.html();
					push_undo_record();
				}
			}
			/*************************************************智能模式***********************************************/
			if (sel_mode == 1){
				if ((keyin >= 65 && keyin <= 90) || keyin == 8 || keyin == 46 || keyin == 37 || keyin == 39){  
				// 輸入英文產生搜索資料庫的key值，並考慮刪除情形
					getKey(keyin);
					//add_key_underline(search_key);
					input_copy = textbox.html();
					push_undo_record();
				}
			}
			
			if (keyin == 8 || keyin == 46 || keyin == 32 || (keyin >= 65 && keyin <= 90)){  
				// backspace鍵或是delete鍵的刪除，及反白取代字的情形
				deleteWord(keyin);
				input_copy = textbox.html();
			}
			
			if (((sel_mode == 0 && mode != 0) && totalpage == 1) || (sel_mode == 1 && mode != 0)){
				if (sel_mode == 1 && keyin == 32){                     // 如果是智能模式，數字跟空白鍵都能用來選字
					if (mode == 1 || mode == 3){
						push_before_selected(); 
						setWord();
						push_undo_record();                       
						textbox.focus().setCursorPosition(input_loc);                          
						return;
					}
				}
				if (isNumber(keyin)){
					if (mode == 1 || mode == 3) 
						push_before_selected();
					//$.ajaxSettings.async = false;
					setWord();
					//$.ajaxSettings.async = true;
					push_undo_record();
					textbox.focus().setCursorPosition(input_loc);       
					if (prefix_key != "")
						search_associated();                        
					return;
				}
			}
			else if ((mode != 0 || associated_search_flag == true) && totalpage > 1){
				show_text = $("#show").html();
				show_flat_text = $("#show_flat").html();
				if (sel_mode == 1 && (isNumber(keyin) || keyin == 32)){                // 如果是智能模式，數字跟空白鍵都能用來選字
					if (mode == 1){
						push_before_selected();                             
						setWord();
						push_undo_record();
						textbox.focus().setCursorPosition(input_loc);       
						return;
					}
				}
				if (isNumber(keyin)){
					if (mode == 1)
						push_before_selected();
					setWord();
					push_undo_record();
					textbox.focus().setCursorPosition(input_loc);       
					thispage = 1;                           // 歸零
					totalpage = 1;                          // 歸零
					if (prefix_key != "")
						search_associated();    
					return;
				}
				else if ((keyin != 107) && (keyin != 187) && (keyin != 109) && (keyin != 189)){
					thispage = 1;                           // 歸零
					totalpage = 1;                          // 歸零
				}
			}
				
			if (search_key == ""){                              // 沒有文字輸入，則textarea為空
				$("#show").html("");
				$("#show_flat").html("");
				prompt_txtbox.val("");
				prompt_flat_txtbox.val("");
				if (sel_mode == 0) mode = 0;
				return;
			}
			if (sel_mode == 0)
				search_char(0);
			else if (sel_mode == 1)
				search_char(1);
			//console.log("mode: " + mode);   
		});

		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑與輸入法相關↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
		$("#btn_previous").click(function(){                        // 在小螢幕模式時的"上一頁"按鈕
			var prompt_txtbox = $("#prompt");
			var prompt_flat_txtbox = $("#prompt_flat");
			if (mode == 0){ 
				prompt_txtbox.val("現在還不能換頁!");
				prompt_flat_txtbox.val("現在還不能換頁!");
				caption_effect();
				return;
			}
			if (totalpage > 1){
				if (mode != 0 && reachHead() == true){              // 選字模式下，若翻頁已達首頁，則-號無效
					prompt_txtbox.val("已達首頁!");
					prompt_flat_txtbox.val("已達首頁!");
					caption_effect();
					return;
				}
				else{
					thispage--;                                     // 刷新頁數
					var temp_text = "";
					var temp_text_flat = "";
					var i = 0 + (10 * (thispage - 1));
					var counter = 0;
					var next_flag = false;
					while (i < number_letters && counter < 10){
						temp_text += (i + 1) + ". " + select_letter[i] + "\n";
						if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
							if ((i % 10) == 3) 
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
							if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
								next_flag = true;
							}
							else if ((i % 10) == 7)
								temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
						}
						else
							temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
						i++;    
						counter++;
					}
					if (thispage < totalpage && thispage > 1){
						temp_text += "+:下一頁 -:上一頁";
						if (next_flag == true)
							temp_text_flat += " +:下頁";
						temp_text_flat += " -:上頁";
					}
					else{
						temp_text += "+:下一頁";
						temp_text_flat += " +:下頁";
					}

					if (mode == 1)
						temp_text = "候選字\n" + temp_text;
					if (mode == 2)
						temp_text = "關聯詞\n" + temp_text;
					$("#show").html(temp_text);
					$("#show_flat").html(temp_text_flat);
				}
			}
			else    
				return;
		});

		$("#btn_next").click(function(){                            // 在小螢幕模式時的"下一頁"按鈕
			var prompt_txtbox = $("#prompt");
			var prompt_flat_txtbox = $("#prompt_flat");
			if (mode == 0){
				prompt_txtbox.val("現在還不能換頁!");
				prompt_flat_txtbox.val("現在還不能換頁!");
				caption_effect();
				return;
			}
			if (totalpage > 1){
				if (mode != 0 && reachTail() == true){              // 選字模式下，若翻頁已達末頁，則+號無效
					prompt_txtbox.val("已達末頁!");
					prompt_flat_txtbox.val("已達末頁!");
					caption_effect();
					return;
				}
				else{
					thispage++;                                     // 刷新頁數
					var temp_text = "";
					var temp_text_flat = "";
					var i = 0 + (10 * (thispage - 1));
					var counter = 0;
					var next_flag = false;
					while (i < number_letters && counter < 10){
						temp_text += (i + 1) + ". " + select_letter[i] + "\n";
						if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
							if ((i % 10) == 3) 
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
							if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
								next_flag = true;
							}
							else if (((i % 10) == 7))
								temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
						}
						else if (((i % 10) == 3 || (i % 10) == 7) && (thispage == totalpage)){
							if ((i % 10) == 3) 
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
							if ((i % 10) == 7)
								temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
						}
						else
							temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
						i++;    
						counter++;
					}
					if (thispage < totalpage){
						temp_text += "+:下一頁 -:上一頁";
						if (next_flag == true)
							temp_text_flat += " +:下頁";
						temp_text_flat += " -:上頁";
					}
					else{
						temp_text += "-:上一頁";
						temp_text_flat += "-:上頁";
					}
					if (mode == 1)
						temp_text = "候選字\n" + temp_text; 
					if (mode == 2)
						temp_text = "關聯詞\n" + temp_text;
					$("#show").html(temp_text);
					$("#show)flat").html(temp_text_flat);
				}
			}
			else
				return;
		});

		$("#undo").click(function(){
			get_record();           
		});

		$("#undo_flat").click(function(){
			get_record();
		});

		$("#copy, #copy_flat").zclip({
			path: './js/ZeroClipboard.swf',
			copy: function(){ return remove_tags($("#input").html()); }
		}).click(function(){
			var text = $("#input").html();
			text = remove_tags(text);
			if (text != ""){
				$("#prompt").val('已複製到剪貼簿!');
				$("#prompt_flat").val('已複製到剪貼簿!');
				caption_effect();
			}
			else{
				$("#prompt").val('沒有內容可複製!');
				$("#prompt_flat").val('沒有內容可複製!');
				caption_effect();
			}
		});

		$("#cut, #cut_flat").zclip({
			path: './js/ZeroClipboard.swf',
			copy: function(){ return remove_tags($("#input").html()); }
		}).click(function(){
			var text = $("#input").html();
			text = remove_tags(text);
			if (text != ""){
				$("#input").html("");
				$("#prompt").val('已剪下到剪貼簿!');
				$("#prompt_flat").val('已剪下到剪貼簿!');
				mode = 0;
				$("#show").html("");
				$("#show_flat").html("");
				caption_effect();   
			}
			else{
				$("#prompt").val('沒有內容可剪下!');
				$("#prompt_flat").val('沒有內容可剪下!');
				caption_effect();       
			}
		});

		$("#btn_initial").click(function(){
			if (mode != 0 && reachHead() == true){                  // 選字模式下，若翻頁已達首頁，則-號無效
				prompt_txtbox.val("已達首頁!");
				prompt_flat_txtbox.val("已達首頁!");
				caption_effect();
				return;
			}
			thispage = 1;                                           // 回到首頁
			var temp_text = "";
			var temp_text_flat = "";
			var i = 0;
			var counter = 0;
			var next_flag = false;
			while  (i < number_letters && counter < 10){
				temp_text += (i + 1) + ". " + select_letter[i] + "\n";
				if (((i % 10) == 3 || (i % 10) == 7) && (thispage < totalpage)){
					if ((i % 10) == 3) 
						temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
					if (((i % 10) == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
						temp_text_flat += (i + 1) + ". " + select_letter[i] + "\n";
						next_flag = true;
					}
					else if (((i % 10) == 7))
					temp_text_flat += (i + 1) + ". " + select_letter[i] + " +:下頁\n";
				}
				else
					temp_text_flat += (i + 1) + ". " + select_letter[i] + " ";
				i++;    
				counter++;
			}
			if (totalpage > 1){
				if (thispage < totalpage && thispage > 1){
					temp_text += "+:下一頁 -:上一頁";
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					temp_text_flat += " -:上頁";
				}
				else{
					temp_text += "+:下一頁";
					temp_text_flat += " +:下頁";
				}

				if (mode == 1)
					temp_text = "候選字\n" + temp_text;
				if (mode == 2)
					temp_text = "關聯詞\n" + temp_text;
				$("#show").html(temp_text);
				$("#show_flat").html(temp_text_flat);
			}
		});

						
		$("#GO").click(function(){                                  // 教學啟用按鈕"馬上出發"的按下事件
			$("#tutor_panel").slideUp(700);
			$("#hide_push").height(50);
			$("#hide_br").html("<br><br>");                 
			if ($("#prompt_flat").is(":hidden")){
				var pause_timer = setInterval(function(){
					$('html,body').animate({scrollTop: $("#Input_place").offset().top - 75},1200);
					clearInterval(pause_timer);
				},800);
				var pause1 = setInterval(function(){
					$(".lab_qrcode").animate({
						margin: '0 0'  
					},"slow");
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'left center'
					}).popup('show');
					var textbox = $("#input");
					var prompt_txtbox = $("#prompt");
					qrcode_toleft();
					clearInterval(pause1);
					var pause2 = setInterval(function(){
						$("#input").popup('hide');
						$(".lab_qrcode").animate({
							margin: '0 28%'  
						},"slow");
						$("#select_mode").popup({
							content: '這是選擇不同輸入模式的下拉式選單',
							position: 'left center'
						}).popup('show');
						clearInterval(pause2);
						var pause3 = setInterval(function(){
							$("#select_mode").popup('hide');
							$(".lab_qrcode").animate({
								margin: '0 17%'  
							},"slow");
							$("#prompt").popup({
								content: '這是簡易提示欄，成功或失敗操作時會有提示',
								position: 'left center'
							}).popup('show');
							clearInterval(pause3);                                      
							var pause4 = setInterval(function(){
								$("#prompt").popup('hide');
								$(".lab_qrcode").animate({
									margin: '0 28%'  
								},"slow");
								$("#copy").popup({
									content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
									position: 'left center'
								}).popup('show');
								clearInterval(pause4);
								var pause5 = setInterval(function(){
									$("#copy").popup('hide');
									$("#undo").popup({
										content: '這是復原按鈕，按下後將還原至上一步',
										position: 'bottom center'
									}).popup('show');
									clearInterval(pause5);
									var pause6 = setInterval(function(){
										$("#undo").popup('hide');
										$("#cut").popup({
											content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
											position: 'right center'
										}).popup('show');
										clearInterval(pause6);
										var pause7 = setInterval(function(){
											$("#cut").popup('hide');
											$("#show").popup({
												content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
												position: 'right center'
											}).popup('show');
											clearInterval(pause7);
											var pause8 = setInterval(function(){
												$("#show").popup('hide');
												customJqte.attr('data-variation','large');
												customJqte.attr('data-offset',35);
												customJqte.popup({
													content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
													position: 'left center'
												}).popup('show');
												clearInterval(pause8);
												var pause9 = setInterval(function(){
													customJqte.popup('hide');
													generate_prompt_btn();
													$("#input").focus();
													clearInterval(pause9);
												},2500);
											},2500);
										},2500);
									},2500);
								},2500);
							},2500);
						},2500);
					},2500);
				},2000);
			}
			else{
				var pause_timer = setInterval(function(){
					$('html,body').animate({scrollTop: ($("#Input_place").offset().top - 150)},1200);
					clearInterval(pause_timer);
				},800);
				var pause1 = setInterval(function(){
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'top center'
					}).popup('show');
					clearInterval(pause1);
					var pause2 = setInterval(function(){
						$("#input").popup('hide');
						$("#select_mode_flat").popup({
							content: '這是選擇不同輸入模式的下拉式選單',
							position: 'left center'
						}).popup('show');
						clearInterval(pause2);
						var pause3 = setInterval(function(){
							$("#select_mode_flat").popup('hide');
							$("#prompt_flat").popup({
								content: '這是簡易提示欄，成功或失敗操作時會有提示',
								position: 'right center'
							}).popup('show');
							clearInterval(pause3);
							var pause4 = setInterval(function(){
								$("#prompt_flat").popup('hide');
								$("#copy_flat").popup({
									content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
									position: 'top center'
								}).popup('show');
								clearInterval(pause4);
								var pause5 = setInterval(function(){
									$("#copy_flat").popup('hide');
									$("#undo_flat").popup({
										content: '這是復原按鈕，按下後將還原至上一步',
										position: 'bottom center'
									}).popup('show');
									clearInterval(pause5);
									var pause6 = setInterval(function(){
										$("#undo_flat").popup('hide');
										$("#cut_flat").popup({
											content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
											position: 'top center'
										}).popup('show');
										clearInterval(pause6);
										var pause7 = setInterval(function(){
											$("#cut_flat").popup('hide');
											$("#show_flat").popup({
												content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
												position: 'top center'
											}).popup('show');
											clearInterval(pause7);
											var pause8 = setInterval(function(){
												$("#show_flat").popup('hide');
												$(".jqte").popup({
													content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
													position: 'top center',
												}).popup('show');                                                           
												clearInterval(pause8);
												var pause9 = setInterval(function(){
													$(".jqte").popup('hide');
													generate_prompt_btn();
													$("#input").focus();
													clearInterval(pause9);
												},2500);
											},2500);
										},2500);
									},2500);
								},2500);
							},2500);
						},2500);
					},2500);
				},1500);
			}
		});

		$("#NO").click(function(){
			$("#tutor_panel").slideUp(700);
			$("#hide_push").height(50);
			$("#hide_br").html("<br><br>");
			generate_prompt_btn();

			if ($("#prompt_flat").is(":hidden")){
				var pause_timer = setInterval(function(){
					$('html,body').animate({scrollTop: $("#Input_place").offset().top - 75},1500);
					clearInterval(pause_timer);
				},800);
				$("#input").focus();
			}
			else{
				var pause_timer = setInterval(function(){
					$('html,body').animate({scrollTop: ($("#Input_place").offset().top - 150)},1500);
					clearInterval(pause_timer);
				},800);
				$("#input").focus();
			}
		});

		var form_elements = ["#email","#uid","#password","#password_confirm","#nickname"];
		var error_arr = ["#error_email","#error_prompt1","#error_prompt2","#error_prompt3","#error_prompt4"];

		$("#close_modal").click(function(){
			var all_blank = true;
			for(var i = 0; i < form_elements.length; i++){
				if ($(form_elements[i]).val() != ""){
					all_blank = false;
					break;
				}
			}
			if (all_blank){
				$("#myModal").modal('hide');
			}
			else{
				$("#close_myModal").modal('show');
				$("#delete_modal").click(function(){
					for(var i = 0; i < form_elements.length; i++){
						$(form_elements[i]).val("");
						$(error_arr[i]).hide();
					}
					$("#close_myModal").modal('hide');
				});
				$("#cancel_modal").click(function(){
					$("#close_myModal").modal('hide');
					$("#myModal").modal('show');
				});
				$("#close_modal3").click(function(){
					$("#close_myModal").modal('hide');
					$("#myModal").modal('show');
				});
			}
		});

		$(form_elements[0]).focusin(function(){
			$(error_arr[0]).hide();
		});
		$(form_elements[1]).focusin(function(){
			$(error_arr[1]).hide();
		});
		$(form_elements[2]).focusin(function(){
			$(error_arr[2]).hide();
		});
		$(form_elements[3]).focusin(function(){
			$(error_arr[3]).hide();
		});
		$(form_elements[4]).focusin(function(){
			$(error_arr[4]).hide();
		});

		var error_login1 = $("#error_login_prompt1");
		var error_login2 = $("#error_login_prompt2");
		$("#login_uid").focusin(function(){
			error_login1.hide();
		});
		$("#login_password").focusin(function(){
			error_login2.hide();
		});
											
		for (i = 0; i < nav_arr.length; i++){
			$(nav_arr[i]).mouseenter(function(){$(this).css('color',"white");});
		}
					
		$("body").on('mouseleave',nav_arr[0],function(){
			$(nav_arr[0]).css('color',nav_color[0]);
		});
		$("body").on('mouseleave',nav_arr[1],function(){
			$(nav_arr[1]).css('color',nav_color[1]);
		});
		$("body").on('mouseleave',nav_arr[2],function(){
			$(nav_arr[2]).css('color',nav_color[2]);
		});
		$("body").on('mouseleave',nav_arr[3],function(){
			$(nav_arr[3]).css('color',nav_color[3]);
		});
		$("body").on('mouseleave',nav_arr[4],function(){
			$(nav_arr[4]).css('color',nav_color[4]);
		});

		$(function(){                                               // 調整contenteditable的placeholder的bug
			$("#input").focusout(function(){
				var element = $(this);        
				if (!element.text().replace(" ", "").length) {
					element.empty();
				}
			});
		});        
	}); 
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓與輸入法相關↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	function search_char(only_one){                                             // 運用ajax方式去mysql尋找key值所對應的字
		$.post('search_word.php',{search_KEY:search_key,MODE:only_one},function(data){   // 查詢文字及分數
			if (data == ""){
				$("#show").html("無此拼音，請按backspace或delete調整拼音");
				$("#show_flat").html("無此拼音，請按backspace或delete調整拼音");
				$('#chatAudio')[0].play();
				associated_search_flag = false;
				mode = 0;
			}
			else if (data[0] == "associated pinyin"){
				number_letters = Object.keys(data).length - 1;      // 取得總字數，第一項被當作判斷是否有接續拼音的flag，故 -1
				getPage();                                          // 取得該key值所對應文字的總頁數
				select_letter = [];
				for(var i = 0; i < number_letters; i++)             // 將回傳的json複製到陣列
					select_letter[i] = data[i + 1];
				
				if (totalpage == 1){
					var temp_text = "";
					var temp_text_flat = "";
					for(var i = 0; i < number_letters; i++){
						temp_text += "● " + select_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += "● " + select_letter[i] + "\n";
						else if (i == 7)
							temp_text_flat += "● " + select_letter[i] + "\n";
						else
							temp_text_flat += "● " + select_letter[i] + " ";
					}
					temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
					$("#show").html(temp_text);
					$("#show_flat").html(temp_text_flat);
				}
				else{
					var temp_text = "";
					var temp_text_flat = "";
					var next_flag = false;
					for(var i = 0; i < 10; i++){
						temp_text += "● " + select_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += "● " + select_letter[i] + "\n";
						else if ((i == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
							temp_text_flat += "● " + select_letter[i] + "\n";
							next_flag = true;
						}
						else if ((i == 7) && (select_letter[i + 1].length > 1))
							temp_text_flat += "● " + select_letter[i] + " +:下頁\n";
						else
							temp_text_flat += "● " + select_letter[i] + " ";
					}
					temp_text += "+:下一頁";
					temp_text = "拼音提示" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					$("#show").html(temp_text);    
					$("#show_flat").html(temp_text_flat);                           
				}       
				associated_search_flag = true; 
				mode = 0;
			}
			else{
				if (only_one == 0){
					number_letters = Object.keys(data).length;          // 取得總字數
					getPage();                                          // 取得該key值所對應文字的總頁數
					select_letter = [];
					for(var i = 0; i < number_letters; i++)             // 將回傳的json複製到陣列
						select_letter[i] = data[i];
					
					if (totalpage == 1){
						var temp_text = "";
						var temp_text_flat = "";
						var number = 1;
						for(var i = 0; i < number_letters; i++){
							temp_text += number + ". " + select_letter[i] + "\n";
							if (i == 3)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else if (i == 7)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else
								temp_text_flat += number + ". " + select_letter[i] + " ";
							number++;
							if (number == 10) 
								number = 0;
						}
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
						$("#show").html(temp_text);
						$("#show_flat").html(temp_text_flat);
					}
					else{
						var temp_text = "";
						var temp_text_flat = "";
						var next_flag = false;
						var number = 1;
						for(var i = 0; i < 10; i++){
							temp_text += number + ". " + select_letter[i] + "\n";
							if (i == 3)
								temp_text_flat += number + ". " + select_letter[i] + "\n";
							else if ((i == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
								temp_text_flat += number + ". " + select_letter[i] + "\n";
								next_flag = true;
							}
							else if ((i == 7) && (select_letter[i + 1].length > 1))
								temp_text_flat += number + ". " + select_letter[i] + " +:下頁\n";
							else
								temp_text_flat += number + ". " + select_letter[i] + " ";
							number++;
							if (number == 10) 
								number = 0;
						}
						temp_text += "+:下一頁";
						temp_text = "候選字" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
						if (next_flag == true)
							temp_text_flat += " +:下頁"; 
						$("#show").html(temp_text); 
						$("#show_flat").html(temp_text_flat);                                                                   
					}   
					if (sel_mode == 0 && mode != 3)                         // 修改模式的字插入情形不一樣，故不進mode 1
						mode = 1;                                           // 進入選字模式
				}
				else if (only_one == 1){
					$("#show").html("請按空白鍵選字");    
					$("#show_flat").html("請按空白鍵選字");                
					mode = 1;
				}
				associated_search_flag = false;
			}
		},"json");
	}

	function search_associated(){                                           // 運用ajax方式去mysql尋找key值所對應的字
		var key_len = prefix_key.length;
		$.post('search_associated.php',{prefix_KEY:prefix_key},function(data){ 
			if (data == ""){
				$("#show").html("");
				$("#show_flat").html("");
				mode = 0;
				return;
			}
			else{
				select_letter = [];
				number_letters = Object.keys(data).length;                  // 取得總字數                            
				getPage();                                                  // 取得總頁數
				for(var i = 0; i < number_letters; i++){                    // 將回傳的json複製到陣列
					var data_str = data[i];    
					var data_len = data_str.length;
					select_letter[i] = data_str.substr(key_len,data_len - key_len);
				}
				 
				if (totalpage == 1){
					var temp_text = "";
					var temp_text_flat = "";
					var number = 1;
					for(var i = 0; i < number_letters; i++){
						temp_text += number + ". " + select_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + select_letter[i] + "\n";
						else if (i == 7)
							temp_text_flat += number + ". " + select_letter[i] + "\n";
						else
							temp_text_flat += number + ". " + select_letter[i] + " ";
						number++;
						if (number == 10) number = 0;
					}
					temp_text = "關聯詞" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
					$("#show").html(temp_text); 
					$("#show_flat").html(temp_text_flat);
				}
				else{
					var temp_text = "";
					var temp_text_flat = "";
					var number = 1;
					var next_flag = false;
					for(var i = 0; i < 10; i++){
						temp_text += number + ". " + select_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + select_letter[i] + "\n";
						else if ((i == 7) && (select_letter[i + 1].length <= 4) && (select_letter[i + 2].length <= 4)){
							temp_text_flat += number + ". " + select_letter[i] + "\n";
							next_flag = true;   
						}
						else if ((i == 7) && (select_letter[i + 1].length > 1))
							temp_text_flat += number + ". " + select_letter[i] + " +:下頁\n";
						else
							temp_text_flat += number + ". " + select_letter[i] + " ";
						number++;
						if (number == 10) number = 0;
					}
					temp_text += "+:下一頁";
					temp_text = "關聯詞" + interval + "(" + thispage + "/" + totalpage + ")\n" + temp_text;
					if (next_flag == true)
						temp_text_flat += " +:下頁"; 
					$("#show").html(temp_text); 
					$("#show_flat").html(temp_text_flat);
				}
				mode = 2;                                                   // 進入關聯詞模式
			}
		},"json");
	}

	function search_auto(){                                                 // 進SQL進行搜尋並自動選字
		var textbox = $("#input");
		var textbox = document.getElementById("input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		$.post('search_word_auto.php',{auto_KEY:auto_search_key},function(data){
			if (data == ""){
				$("#show").html("");
				$("#show_flat").html("");
				mode = 0;
				return;
			}
			else{
				var check_over_three = data[0];             // 檢查是否超過3詞上限

				auto_letter = [];
				var len = Object.keys(data).length - 1; 
				var j = 0;
				for(var i = 1; i <= len; i++){
					auto_letter[i - 1] = data[i]['character'];
					pinyin_record[j++] = data[i]['pinyin'];
				}

				if (check_over_three == 1){                 // 如果是，則調整auto_search_key
					var cut_index = auto_search_key.search(pinyin_record[0]);   // 第一個要固定詞的起始位置
					var first_word_len = word_record_loc[1];
					auto_start = first_word_len;            // 調整auto_start為當前第二詞的起始位置
					var first_pinyin_len = pinyin_record[0].length;
					auto_search_key = auto_search_key.substring(cut_index + first_pinyin_len + 1,auto_search_key.length);
					//console.log("下一次的搜尋字串: " + auto_search_key);
					var left = auto_static_word.substring(0,auto_start);
					var right = auto_static_word.substring(auto_start,auto_static_word.length);
					if (right != "")
						auto_static_word = left + auto_letter[0] + right; 
					else
						auto_static_word = left + auto_letter[0];
					console.log("無法再變動的詞： " + auto_static_word);                               
					auto_letter.shift();                    // 將已固定的詞從陣列首shift出去，其他elements往前移動
				}
			}                
		},"json");
	}

	function search_correspond(key,word){
		$.post('search_correspond.php',{KEY:key,WORD:word},function(data){
			if (data == ""){
				return;
			}
			else{
				if (data[0] == 1)
					correspond_flag = true;
				else
					correspond_flag = false;
			}
		},'json');
	}

	function rearrange_objs(key,word,index,del_flag,after_flag){    // 刪字或是字區被分割時，會將該字詞區剩下的拼音重新分配
		if (key != ""){                                             // 如果刪除前該字區超過一個音節，就會需要回傳去分割
			$.post('pinyin_split.php',{THE_KEY:key},function(data){
				if (data == ""){
					return;
				}
				else{
					var key_num = Object.keys(data).length; 
					var word_num = word.length;
					var pinyin_objs = [];
					var j = 0;
					var temp_loc = 0;
					try{
						temp_loc = pinyin_record[index].start_loc;
					}
					catch(err){                                     // 如果index所指到的位置未存在obj就稍後新增，把前一個的end_loc拿來用
						temp_loc = pinyin_record[index - 1].end_loc;
					}

					var temp_index = index;
					var start_loc = 0;
					var end_loc = 0;
					for(var i = 0; i < key_num; i++){
						var pinyin_piece = data[i];                 // 被切出來的拼音
						var syllable = getSyllable(pinyin_piece);   // 計算該拼音的音節，以便將原本區域間的字分割正確
						var word_piece = word.substring(j,j + syllable);
						word_num -= word_piece.length;
						console.log("被切的字: " + word_piece);
						start_loc = j + temp_loc;
						end_loc = j + temp_loc + syllable;
						var obj = "";
						$.ajaxSettings.async = false;
						search_correspond(pinyin_piece,word_piece); // 檢查拼音是否與字依序相符
						$.ajaxSettings.async = true;
						if (correspond_flag)                            
							obj = new pinyin_obj(pinyin_piece,word_piece,start_loc,end_loc,0);
						else
							obj = new pinyin_obj(pinyin_piece,word_piece,start_loc,end_loc,2);
						j += syllable;
						pinyin_objs.push(obj);
					}      
					if (word_num > 0){                              // 如果字數超過音節數
						var word_piece = word.substring((word.length - word_num),word.length);  // 則把剩下來的字併為一詞
						start_loc = end_loc;
						end_loc = start_loc + word_num;
						obj = new pinyin_obj("",word_piece,start_loc,end_loc,2);
						pinyin_objs.push(obj);                      // 插入到物件陣列裡
					}
					for(var i = 0; i < pinyin_objs.length; i++){
						if (i == 0){
							if (del_flag){
								pinyin_record.splice(temp_index, 1, pinyin_objs[i]);                                
							}
							else{
								pinyin_record.splice(temp_index, 0, pinyin_objs[i]);
							}
						}
						else{
							pinyin_record.splice(temp_index, 0, pinyin_objs[i]);
						}
						record_last_index = temp_index;
						temp_index++;
					}        
					$.ajaxSettings.async = false;       
					modify_obj_loc(index, 0, after_flag);
					$.ajaxSettings.async = true;
				}
			},"json");
		}
		else if (key == "" && word == ""){              // 只剩一單字（先調整，後刪除）
			modify_obj_loc(index + 1, 1, 0);            // 先將會被刪除的字區後方的所有字區先調整位置
			pinyin_record.splice(index, 1);             // 再把該字詞刪除
			//record_last_index = index;
		}
		else if (key == "" && word != ""){              // 沒有拼音的詞
			try {
				if (del_flag){                          // 刪字時，直接將傳過來的字取代原本的
					pinyin_record[index].word = word;
					pinyin_record[index].end_loc = pinyin_record[index].start_loc + word.length;
				}
				else{                                   // 補字時，將該詞插入正確位置
					start_loc = pinyin_record[index - 1].end_loc;
					end_loc = start_loc + word.length;
					var obj = new pinyin_obj("", word, start_loc, end_loc, 2);
					pinyin_record.splice(index, 0, obj);
				}
			}
			catch(err){
				start_loc = pinyin_record[index - 1].end_loc;
				end_loc = start_loc + word.length;
				var obj = new pinyin_obj("", word, start_loc, end_loc, 2);
				pinyin_record.splice(index, 0, obj);
			}
			$.ajaxSettings.async = false;
			modify_obj_loc(index, 0, 0);
			$.ajaxSettings.async = true;
			record_last_index = index;
		}
		for(var i = 0; i < pinyin_record.length; i++){      
			switch (pinyin_record[i].modifiable){
				case 0:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可被修改");
					break;
				case 1:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可在最前方被修改");
					break;
				case 2:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 不可修改");
					break;
			}           
		}
	}

	function modify_obj_loc(index,all_del,after_flag){      // 刪字，補字時會修正各pinyin_obj的首尾位置
		console.log("從" + index + "開始修正");
		console.log("after_flag: " + after_flag);
		var temp_index = index;
		if (all_del == 0){                                  // 如果字區內還有字
			for(var i = 0; i < pinyin_record.length; i++){
				if (after_flag){
					if (i < index)                          
						continue;
					else{
						pinyin_record[i].start_loc = pinyin_record[temp_index - 1].end_loc;
						pinyin_record[i].end_loc = pinyin_record[i].start_loc + pinyin_record[i].word.length;
						temp_index++;
					}
				}
				else{
					if (i <= index)                         // 因為字區還有字，所以從該字區之後才進行修正
						continue;
					else{
						pinyin_record[i].start_loc = pinyin_record[temp_index].end_loc;
						pinyin_record[i].end_loc = pinyin_record[i].start_loc + pinyin_record[i].word.length;
						temp_index++;
					}
				}
			}
		}
		else if (all_del == 1){                         // 如果該字區已經消失（全部被刪除了）
			var substituted_flag = false;
			for(var i = 0; i < pinyin_record.length; i++){
				if (i < index)                          
					continue;
				else{
					if (substituted_flag == false && temp_index == index){          // 後方第一個字區往前替補  
						pinyin_record[i].start_loc = pinyin_record[temp_index - 1].start_loc;
						pinyin_record[i].end_loc = pinyin_record[i].start_loc + pinyin_record[i].word.length;
						substituted_flag = true;
						temp_index--;
					}
					else{                               // 而後修正索引讓後方字區的位置都正確
						pinyin_record[i].start_loc = pinyin_record[temp_index].end_loc;
						pinyin_record[i].end_loc = pinyin_record[i].start_loc + pinyin_record[i].word.length;
					}
					temp_index++;
				}
			}
		}
		
		for(var i = 0; i < pinyin_record.length; i++){      
			switch (pinyin_record[i].modifiable){
				case 0:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可被修改");
					break;
				case 1:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可在最前方被修改");
					break;
				case 2:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 不可修改");
					break;
			}   
		}
	}

	function get_auto_start(){                                  // 取得自動選詞的起點，每一次預設取第一個span的位置
		var textbox = $("#input");
		var html = textbox.html();
		var first_span_loc = html.search("<span");             // 尋找textbox是否有span tag
		var start = 0;
		if (first_span_loc < 0){                                // 如果在非自動選詞的狀態下
			start = input_loc;                                  // auto_start == input_loc
		}
		else{
			if (input_loc < first_span_loc){                    // 出現未被加上底線的前置拼音
				first_span_loc -= search_key.length;            // 已減去search_key的長度做為修正
			}
			start = first_span_loc;
		}               
		return start;
	}

	function setWord(){                                         // 把中文字打上去
		var textbox = $("#input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		input_word = remove_tags(input_word);                   // 取得純文字
		var left = input_word.substring(0,input_loc);
		var right = input_word.substring(input_loc,input_word.length);
		var word_length = 0;

		if (sel_mode == 0 || (sel_mode == 1 && mode == 3)){
			if (mode == 3){     // 修正模式
				var insert_word = "";
				if (keyin == 48 || keyin == 96)
					insert_word = select_letter[9 + (thispage - 1) * 10];
				else if (keyin >= 97)
					insert_word = select_letter[keyin - 97 + (thispage - 1) * 10];
				else if (keyin >= 49)
					insert_word = select_letter[keyin - 49 + (thispage - 1) * 10];
				word_length = insert_word.length;
				var replace_end = input_loc + word_length;
				right = right.substring(replace_end,input_word.length);            
				console.log("left: " + left);
				console.log("right: " + right);              
				input_word = left + insert_word + right;
				var obj = "";
				if (getSyllable(search_key) == word_length){
					$.ajaxSettings.async = false;
					search_correspond(search_key,insert_word);              // 檢查拼音是否與字依序相符
					$.ajaxSettings.async = true;
					if (correspond_flag)                                        
						obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,0);
					else
						obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,1);
					$.ajaxSettings.async = true;
				}
				else
					obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,1);
				addRecord(obj,input_loc);
				var text = "";
				for(var i = 0; i < pinyin_record.length; i++){
					text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
				}         
				textbox.html(text);
				input_len += word_length;                                   // 調整成功字數
				search_key = "";                                            // 清空buffer
				mode = 0;
				return;
			}
			if (mode == 2){     // 關聯詞模式  
				var insert_word = "";               
				if (keyin == 48 || keyin == 96)
					insert_word = select_letter[9 + (thispage - 1) * 10];
				else if (keyin >= 97)
					insert_word = select_letter[keyin - 97 + (thispage - 1) * 10];
				else if (keyin >= 49)
					insert_word = select_letter[keyin - 49 + (thispage - 1) * 10];
				input_word = left + insert_word + right;
				word_length = insert_word.length;
							
				var obj = new pinyin_obj("",insert_word,input_loc,input_loc + word_length,2);
				addRecord(obj,input_loc);   
				var text = "";
				for(var i = 0; i < pinyin_record.length; i++){
					text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
				}         
				textbox.html(text);
				input_len += word_length;                                   // 調整成功字數                                 
				prefix_key = "";                                            // 清空buffer
				mode = 0;   
			}
			if (mode == 1){     // 自選模式
				var insert_word = "";
				if (keyin == 48 || keyin == 96)
					insert_word = select_letter[9 + (thispage - 1) * 10];
				else if (keyin >= 97)
					insert_word = select_letter[keyin - 97 + (thispage - 1) * 10];
				else if (keyin >= 49)
					insert_word = select_letter[keyin - 49 + (thispage - 1) * 10];
				input_word = left + insert_word + right;
				word_length = insert_word.length;
				prefix_key = insert_word;
				
				var obj = "";
				if (getSyllable(search_key) == word_length){                // 如果音節數=字數
					$.ajaxSettings.async = false;
					search_correspond(search_key,insert_word);              // 檢查拼音是否與字依序相符
					$.ajaxSettings.async = true;
					if (correspond_flag)                                    
						obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,0);   // 是則可修改
					else
						obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,1);   // 不是則只能在前方修改
				}
				else
					obj = new pinyin_obj(search_key,insert_word,input_loc,input_loc + word_length,1);       // 音節數!=字數，只能在最前方修改
				$.ajaxSettings.async = false;
				addRecord(obj,input_loc);
				$.ajaxSettings.async = true;
				var text = "";
				console.log("幾個record: " + pinyin_record.length);
				for(var i = 0; i < pinyin_record.length; i++){
					text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
				}
				textbox.html(text);
				input_len += word_length;                                   // 調整成功字數
				search_key = "";                                            // 清空buffer
				mode = 2;
			}
			$("#show").html("");    
			$("#show_flat").html("");
			caption_effect();
			prompt_txtbox.val("選字成功!");
			prompt_flat_txtbox.val("選字成功!");
			input_loc += word_length;                                       // 調整下一次的輸入位置
			return;
		}
		else if (sel_mode == 1){                                            // 智能模式
			if (mode == 1){
				var show_letter = "";
				var characters_count = 0;
				
				for(var i = 0; i < auto_letter.length; i++){
					var index = "";
					if (i == 0){
						index = "first";
						word_record_loc[i] = auto_start;
						pinyin_record_loc[i] = auto_start;
						word_record_loc[i + 1] = 999999;
						pinyin_record_loc[i + 1] = 999999;
					}
					else if (i == 1){
						index = "second";
						word_record_loc[i] = auto_start + auto_letter[i - 1].length;
						pinyin_record_loc[i] = auto_start + auto_letter[i - 1].length;
						word_record_loc[i + 1] = 999999;
						pinyin_record_loc[i + 1] = 999999;
					}
					else if (i == 2){
						index = "third";
						word_record_loc[i] = word_record_loc[i - 1] + auto_letter[i - 1].length;
						pinyin_record_loc[i] = word_record_loc[i - 1] + auto_letter[i - 1].length;
					}
					var letter_span = '<span id="' + index + '" class="in_pinyin_window">' + auto_letter[i] + '</span>';
					show_letter += letter_span;
					characters_count += auto_letter[i].length;
				}
				input_word = show_letter;                   // 將自動選詞區段的字詞存起
				console.log("input_word: " + input_word);

				// 為了讓自動選詞區域能出現在兩個已選定字詞的中間，從auto_start分割兩半，從中插入
				// 最後出現在textbox中的文字是「已選定字詞」與「自動選詞區域字詞」的組合
				var static_left = auto_static_word.substring(0,auto_start);
				var static_right = auto_static_word.substring(auto_start,auto_static_word.length); 
				console.log("static_left: " + static_left);
				console.log("static_right: " + static_right);
				var total_string = "";
				if (static_right != ""){
					total_string = static_left + input_word + static_right;  
				}
				else    // 如果已選定字詞只出現在auto_start的左邊
					total_string = auto_static_word + input_word;             
				textbox.html(total_string);

				$("#show").html("");    
				$("#show_flat").html("");
				prompt_txtbox.val("選字成功!");
				prompt_flat_txtbox.val("選字成功!");
				caption_effect();
				input_len = auto_static_word.length + characters_count;         // 調整總成功字數
				auto_len = characters_count;                // 調整成功自動選詞的長度
				
				input_loc++;
				auto_start = get_auto_start();              // 更新自動選字區域的起始位置
				console.log("auto_start: " + auto_start);
				console.log("總字數： " + input_len);
				console.log("下一次輸入位置： " + input_loc);
				search_key = "";
				mode = 2;   
				return;
			}
		}
	}     

	function deleteWord(keyCode){                                           // 處理選字後的刪除事件，不包含search_key的增減
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input"); 
		var text = textbox.html();
		text = remove_tags(text);             

		if (keyCode == 8){                                                  // backspace鍵刪除
			if (mode == 0 && search_key == ""){                             // 單純選字成功後的階段
				if (tow_check == false){                                    // 如果是一字一字刪除
					var text = textbox.html();
					var temp_input_len = input_len;
					text = remove_tags(text);
					input_word = text;                                      // 下一次輸入框中的字將由當前textbox之值接續
					auto_static_word = input_word;
					input_len = input_word.length;                          // 調整記錄輸入成功的中文字數
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox); // 得到下一次的輸入位置   
					auto_start = get_auto_start();
					var delete_word_flag = true;

					if (temp_input_len == 0){                               // 原本就沒字
						return;
					}
					else if (input_len == temp_input_len)                   // 刪除後字數沒變動，代表只是拼音被刪除
						delete_word_flag = false;
					else if (delete_word_flag && pinyin_record.length == 1 && pinyin_record[0].word.length == 1){   // 最後一個字
						pinyin_record = [];
					}   
					else if (delete_word_flag && pinyin_record.length > 1 || pinyin_record[0].word.length > 1){     // 不是最後一個字
						var which_word = get_Which_Word(input_loc + 1,"tail");      // 先抓到是哪個字被刪
						var key = pinyin_record[which_word].pinyin;
						var word = pinyin_record[which_word].word;
						if (word.length != 1){
							var temp_loc = input_loc - pinyin_record[which_word].start_loc;
							var left = word.substring(0,temp_loc)
							var right = word.substring(temp_loc + 1,word.length);
							temp_loc = pinyin_record[which_word].start_loc;
							word = left + right;
							if (key != ""){     // 有word但沒key的情形屬於關聯詞，略過key的分割
								key = split_key(key,temp_loc,input_loc);
							}
							console.log("word: " + word);
							rearrange_objs(key,word,which_word,1,0);
						}
						else{
							rearrange_objs("","",which_word,0,0);
						}   
					}                            
				}
			} 
			/**************************************************************************************************/
			if (sel_mode == 1 && mode == 2){                                // 智能模式
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);                         
				if (auto_len == 1){
					auto_len--;
					input_len--;
					auto_search_key = "";
					search_key = "";               
					auto_start = input_loc;
					console.log("刪完字後的html: " + textbox.html());
					return;
				}
				var j = 0;
				for(var i = 0; i < auto_search_key.length; i++) {
					if (auto_search_key[i] == " ") 
						j++;
					if (j == (input_loc - auto_start)) {         
						var del_loc = i;
						console.log("The delete blank location: " + del_loc);
						if (del_loc != 0){
							var left = auto_search_key.substring(0,del_loc);
							var right = auto_search_key.substring(del_loc + 1,auto_search_key.length);
							var check_behind = right.search(" ");
							left = left.trim();
							right = right.trim();
							console.log("left: " + left);
							console.log("right: " + right);
							console.log("check_behind: " + check_behind);
							if (check_behind == -1) 
								auto_search_key = left;
							else {
								right = right.substring(check_behind + 1,right.length);
								auto_search_key = left + " " + right;  // 更新auto_search_key
							}
						}
						else {
							var check_behind = auto_search_key.search(" ");
							auto_search_key = auto_search_key.substring(check_behind + 1,auto_search_key.length);
						}
						//console.log("auto_search_key: " + auto_search_key);
						break;
					}
				}  
				console.log("auto_search_key: " + auto_search_key);
				var left = text.substring(0,input_loc);
				var right = text.substring(input_loc + search_key.length,text.length);
				input_word = left + right;                          
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數                      
				console.log("刪完字後的html: " + textbox.html());
			}          

			/*if (mode == 1 && (textbox.html().length < input_len)){   // 若在拼音模式下，以滑鼠拖曳方式將整個search_key及舊有文字刪除的階段
				input_word = textbox.html();                         // 下一次選字將由當前textbox之值接續
				search_key = "";                                    // 遇到此情形，直接將search_key刪除
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);         // 得到下一次的輸入位置
			}*/

			if (search_key != "" && (getCaretCharacterOffsetWithin(DOM_textbox) < input_loc)){ // 在拼音時，移動到左邊界並刪除中文字時的狀態
				var left = text.substring(0,getCaretCharacterOffsetWithin(DOM_textbox));
				var right = text.substring(getCaretCharacterOffsetWithin(DOM_textbox) + search_key.length,text.length);
				input_word = left + right;                          
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);     // 得到下一次的輸入位置
			}
			return;
		}
		if (keyCode == 46){                                                 // delete
			if (mode == 0 && search_key == ""){                             // 單純選字成功後的階段，直接複製記錄按下backspace後的textbox各狀態
				var text = textbox.html();
				text = remove_tags(text);
				input_word = text;   
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
			}
			if (sel_mode == 1 && mode == 2 && search_key == ""){
				var text = textbox.html();
				text = remove_tags(text);
				input_word = text;                                          // 下一次選字將由當前textbox之值接續
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);     // 得到下一次的輸入位置   
			}
			/*if (mode == 1 && (textbox.html().length < input_len)){   // 若在拼音模式下，以滑鼠拖曳方式將整個search_key及舊有文字刪除的階段
				input_word = textbox.html();                         // 下一次選字將由當前textbox之值接續
				search_key = "";                                    // 遇到此情形，直接將search_key刪除
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);         // 得到下一次的輸入位置
			}*/
			if (sel_mode == 0 && search_key != "" && (getCaretCharacterOffsetWithin(DOM_textbox) > input_loc)){ // 在拼音時，移動到右邊界並刪除中文字時的狀態
				var left = text.substring(0,input_loc);
				var right = text.substring(input_loc + search_key.length,text.length);
				input_word = left + right;                          
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
			}
			return;
		}
		if (keyCode >= 65 && keyCode <= 90){                                // 反白並且用輸入英文來取代時的情形
			var text = textbox.html();
			text = remove_tags(text);
			if (text.length <= input_len){
				var char_arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
				input_word = text;
				var del_word = char_arr[keyCode - 65];
				var del_loc = input_word.search(del_word);
				var left = input_word.substring(0,del_loc);
				var right = input_word.substring(del_loc + 1,input_word.length);
				input_word = left + right;
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
				getKey(keyCode);
			}   
			return;
		}
	}       

	function pinyin_obj(pinyin,word,start_loc,end_loc,modify_flag){
		this.pinyin = pinyin;
		this.word =  word;
		this.start_loc = start_loc;
		this.end_loc = end_loc;
		this.modifiable = modify_flag;
	}

	function addRecord(pinyin_obj,loc){                     // 將pinyin物件加到pinyin_record陣列中  
		if (pinyin_record.length > 0 && (loc == pinyin_record[pinyin_record.length - 1].end_loc)){  // 最末端打字，直接push
			pinyin_record.push(pinyin_obj);
		}
		else if (loc == 0){     // 最前端補字
			pinyin_record.unshift(pinyin_obj);
			$.ajaxSettings.async = false;
			modify_obj_loc(0, 0, 0);
			$.ajaxSettings.async = true;
		}
		else{                   // 中間情形，得細分是在各字區首尾還是會造成字區被切割
			var which_word = get_Which_Word(loc,"head");        // 先找到loc是在第幾個字區
			if (loc == pinyin_record[which_word].start_loc){    // 在某字區起始位置
				pinyin_record.splice(which_word,0,pinyin_obj);
				$.ajaxSettings.async = false;
				modify_obj_loc(which_word, 0, 0);
				$.ajaxSettings.async = true;
			}
			else if (loc == pinyin_record[which_word].end_loc){ // 在某字區尾端
				pinyin_record.splice(which_word + 1,0,pinyin_obj);
				$.ajaxSettings.async = false;
				modify_obj_loc(which_word + 1, 0, 0);
				$.ajaxSettings.async = true;
			}
			else if (loc < pinyin_record[which_word].end_loc && loc > pinyin_record[which_word].start_loc){ // 在字區中間
				var temp_loc = loc - pinyin_record[which_word].start_loc;
				var word_left = pinyin_record[which_word].word.substring(0,temp_loc);
				var word_right = pinyin_record[which_word].word.substring(temp_loc,pinyin_record[which_word].word.length);
				var pinyin_left = "";
				var pinyin_right = "";
				var key = pinyin_record[which_word].pinyin;     // 把該字區的拼音抓出來.
				var syllable = getSyllable(key);
				temp_loc = pinyin_record[which_word].start_loc;

				if (key != ""){                                 // 沒有拼音的字詞則略過拼音分割
					if (loc > syllable){                    // 字詞的位置超過拼音
						pinyin_left = key;
					}
					else{
						var j = 0;
						for(var i = 0; i < key.length; i++){
							if (key[i] == " ") 
								j++;
							if (j == (loc - temp_loc)){         
								var split_loc = i;          
								pinyin_left = key.substring(0,split_loc);
								pinyin_right = key.substring(split_loc + 1,key.length);
								pinyin_left = pinyin_left.trim();
								pinyin_right = pinyin_right.trim();
								break;
							}
						}
					}
				}

				console.log("pinyin_left: " + pinyin_left);
				console.log("pinyin_right: " + pinyin_right);
				console.log("word_left: " + word_left);
				console.log("word_right: " + word_right);

				$.ajaxSettings.async = false;
				rearrange_objs(pinyin_left, word_left, which_word, 1, 0);
				$.ajaxSettings.async = true;
				console.log("最後一個record的index: " + record_last_index);
				pinyin_record.splice(record_last_index + 1, 0, pinyin_obj);
				$.ajaxSettings.async = false;
				rearrange_objs(pinyin_right, word_right, record_last_index + 2, 0, 1);
				$.ajaxSettings.async = true;
			}   
		}
		
		for(var i = 0; i < pinyin_record.length; i++){
			switch (pinyin_record[i].modifiable){
				case 0:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可被修改");
					break;
				case 1:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 可在最前方被修改");
					break;
				case 2:
					console.log("第" + (i + 1) + "個拼音: " + pinyin_record[i].pinyin + "; 字詞: " + 
						pinyin_record[i].word + "; 位置為" + pinyin_record[i].start_loc + "~" + 
						pinyin_record[i].end_loc + "; 不可修改");
					break;
			}           
		}
	}

	function split_key(key,start_loc,split_loc){    // 將key以音節數分割
		var j = 0;
		var after_key = "";
		for(var i = 0; i < key.length; i++){
			if (key[i] == " ") 
				j++;
			if (j == (split_loc - start_loc)){         
				var del_loc = i;
				if (del_loc != 0){                  // 不是在最前端刪字
					var left = key.substring(0,del_loc);
					var right = key.substring(del_loc + 1,key.length);
					var check_behind = right.search(" ");
					left = left.trim();
					right = right.trim();
					if (check_behind == -1)         // 如果後面沒有" "
						after_key = left;           // 代表只有一音節
					else{                           // 如果還有" "，則得從" "之後去切
						right = right.substring(check_behind + 1,right.length);
						after_key = left + " " + right; // 更新key
					}
				}
				else{                               // 在最前端刪字
					var check_behind = key.search(" ");
					after_key = key.substring(check_behind + 1,key.length);
				}   
				break;
			}
		}
		return after_key;
	}

	function get_Which_Word(this_loc,head_or_tail){         // 判斷游標所在位置屬於第幾個詞(回傳陣列的index)
		if (this_loc == pinyin_record[pinyin_record.length - 1].end_loc)
			return pinyin_record.length - 1;
		for(var i = 0; i < pinyin_record.length; i++){
			if (this_loc == 0)
				return 0;			
			else{
				if (head_or_tail == "tail"){
					if (this_loc > pinyin_record[i].start_loc && this_loc <= pinyin_record[i].end_loc)
						return i;					
				}
				else if (head_or_tail == "head"){
					if (this_loc >= pinyin_record[i].start_loc && this_loc < pinyin_record[i].end_loc)
						return i;					
				}
			}
		}
	}

	function getSyllable(key){                  // 得到key的音節數
		var blanks = 0;
		var syllable = 0;
		for(var i = 0; i < key.length; i++){
			if (key[i] == " ")
				blanks++;
		}
		syllable = blanks + 1;
		return syllable;
	}

	function getKey(keyCode){                   // 產生要搜索mysql的key值，處理增修情形
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var now_loc = getCaretCharacterOffsetWithin(DOM_textbox);
		var text = textbox.html();
		text = remove_tags(text);
		console.log("text: " + text);
		var temp_key_len = text.length - input_len;
		
		if (keyCode == 8){
			if (search_key.length == 1 && (now_loc == input_loc)){          // 當拼音只有一個，且游標正好在其右方
				search_key = "";
				associated_search_flag = false;
				text = textbox.html();
				if (text.search("</span>") < 0)
					mode = 0;
				else
					mode = 2;
			}
			if ((input_loc + search_key.length) == now_loc){                // 從當前拼音結尾往前刪除
				search_key = search_key.substr(0,temp_key_len);
			}
			else if ((input_loc + search_key.length) > now_loc){            // 從當前拼音非結尾處往前刪除
				search_key = text.substr(input_loc,temp_key_len);
			}
			else if (sel_mode == 0 && (now_loc < input_loc)){               // 拼音時，移動到左邊界並刪除中文字
				deleteWord(keyCode);
			}
		}
		if (keyCode == 46){
			if (search_key.length == 1 && now_loc == input_loc){            // 當拼音只有一個，且游標正好在其左方
				search_key = "";
				associated_search_flag = false;
			}
			if (now_loc == (input_loc + search_key.length) && reachRight()){// 拼音時，移動到右邊界並刪除中文字
				deleteWord(keyCode);
			}
			else if (input_loc == now_loc){                                 // 從當前拼音首往後刪除
				search_key = search_key.substr(1,temp_key_len);
			}
			else if (now_loc > input_loc){                                  // 從當前拼音非首處往前刪除
				search_key = search_key.substr(0,temp_key_len);
			}
		}
		if (keyCode >= 65 && keyCode <= 90 || keyCode == 32){ 
			if (input_len == 0){                                            // 當是打第一個字時
				var key_part = text;                                        // textbox中值即是search_key
				var temp_loc = now_loc - 1;                                             
				search_key_loc = temp_loc;
				var left = key_part.substring(0,search_key_loc);
				var right = key_part.substring(search_key_loc,temp_key_len);
				search_key = left + right;
			}
			else{                                                           // 不是第一個字
				if (input_loc == 0){                                        // 拼音插入在最前方
					var key_part = text.substring(0,temp_key_len);
					var left = key_part.substring(0,search_key_loc);
					var right = key_part.substring(search_key_loc,temp_key_len);
					search_key = left + right;
				}
				else{                         
					var key_part = text.substring(input_loc,input_loc + temp_key_len);
					search_key_loc = now_loc - 1;
					var pre_word = text.substring(0,input_loc);
					var temp_loc = 0;
					if (search_key_loc - getCaretCharacterOffsetWithin(DOM_textbox) >= 0){
						search_key_loc = search_key_loc - input_len;
					}
					else{
						temp_loc = now_loc - 1;
						search_key_loc = temp_loc - pre_word.length;
					}
					var left = key_part.substring(0,search_key_loc);
					var right = key_part.substring(search_key_loc,temp_key_len);
					search_key = left + right;                       
				}      
			}
		}   
		while (search_key.search("&nbsp;") >= 0){
			search_key = search_key.replace("&nbsp;"," ");  
		}
		search_key = search_key.trim();
		console.log("search_key: " + search_key);    
		console.log("");          
	}

	function remove_tags(text){             // 不取html的tag，得到純文字
		var tags = [
			'<span id="first" class="in_pinyin_window">',
			'<span id="second" class="in_pinyin_window">',
			'<span id="third" class="in_pinyin_window">',
			'<span class="in_pinyin_window">',
			'</span>',
			'</u>',
			'<u>',
		];
		var after_text = text;
		if (after_text.search("<br>") == 0){
			after_text = after_text.replace("<br>","");
		}
		for(var i = 0; i < tags.length; i++){
			while (after_text.search(tags[i]) >= 0){
				after_text = after_text.replace(tags[i],"");
			}
		}
		return after_text;
	}
		
	function getPage(){                                             // 得到回傳字的總頁數
		totalpage = parseInt(number_letters / 10);
		if (number_letters % 10 != 0) 
			totalpage++;
	}

	$.fn.setCursorPosition = function(pos){                         // 控制游標顯示位置   
		var element = document.getElementById("input");
		var range = document.createRange();          
		try{
			var sel = window.getSelection();
			var which_word = get_Which_Word(pos,"tail");
			console.log("which_word: " + which_word);
			console.log("element: " + element.childNodes[0]);
			var loc = pos - pinyin_record[which_word].start_loc;
			element = element.childNodes[which_word];
			console.log("element: " + element);
			range.setStart(element.childNodes[0], loc);                          
			/*if (typeof(check_child_node) == "undefined" && sel_mode == 1 && mode == 2){ // 只要是智能模式通通進給我進catch拉!
				throw "set in span";
			}
			else{
				range.setStart(element.childNodes[0], pos);
			}*/
		}
		catch (err){                                                // 此區塊直接針對各span設定其游標位置
			console.log("err_msg: " + err);
			console.log("pos: " + pos);  
			var node;
			for(var i = 0; i < 3; i++){
				console.log("word_record_loc[" + i + "] = " + word_record_loc[i]);
			}
			if (pos >= word_record_loc[0] && pos <= word_record_loc[1]){
				 node = document.getElementById("first");
				 pos = pos - auto_start;                              // 更新設定位置為輸入位置在auto_start起點下的相對位置
				 console.log("first");
			}
			else if (pos > word_record_loc[1] && pos <= word_record_loc[2]){
				 node = document.getElementById("second");
				 pos = pos - auto_letter[0].length - auto_start;      // 更新設定位置為輸入位置在auto_start起點下的相對位置
				 console.log("second");
			}
			else if (pos > word_record_loc[2]){
				 node = document.getElementById("third");
				 pos = pos - auto_letter[0].length - auto_letter[1].length - auto_start;  // 更新設定位置為輸入位置在auto_start起點下的相對位置
				 console.log("third");
			}
			range.setStart(node.childNodes[0], pos);
			var sel = window.getSelection();
		}
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		element.focus();          
	};

	function getCaretCharacterOffsetWithin(element) {               // 得到文字游標位置（即便是html tag裡
		var caretOffset = 0;
		var doc = element.ownerDocument || element.document;
		var win = doc.defaultView || doc.parentWindow;
		var sel;
		if (typeof win.getSelection != "undefined") {
			sel = win.getSelection();
			if (sel.rangeCount > 0) {
				var range = win.getSelection().getRangeAt(0);
				var preCaretRange = range.cloneRange();
				preCaretRange.selectNodeContents(element);
				preCaretRange.setEnd(range.endContainer, range.endOffset);
				caretOffset = preCaretRange.toString().length;
			}
		} 
		else if ((sel = doc.selection) && sel.type != "Control") {
			var textRange = sel.createRange();
			var preCaretTextRange = doc.body.createTextRange();
			preCaretTextRange.moveToElementText(element);
			preCaretTextRange.setEndPoint("EndToEnd", textRange);
			caretOffset = preCaretTextRange.text.length;
		}
		return caretOffset;
	}

	function replaceSelectedText(replacementText) {
		var sel, range;
		if (window.getSelection) {
			sel = window.getSelection();
			if (sel.rangeCount) {
				range = sel.getRangeAt(0);
				var range_len = range.toString().length; 
				if (range_len > 0){
					start = end - range_len;
					range.deleteContents();
					range.insertNode(document.createTextNode(replacementText));
				}
				else
					return;
			}
		} 
		else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			range.text = replacementText;
		}
	}

	function get_sel_mode(text){                                    // 判斷dropdown中的值，並決定輸入法模式
		var textbox = $("#input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		
		if (text == "自選模式"){
			sel_mode = 0;
			prompt_txtbox.val("已切換至自選模式!");
			prompt_flat_txtbox.val("已切換至自選模式!");
		}
		if (text == "智能模式"){
			sel_mode = 1;
			prompt_txtbox.val("已切換至智能模式!");
			prompt_flat_txtbox.val("已切換至智能模式!");
		}
		textbox.focus();
		caption_effect();   
	}

	/*function enter_sel_mode(e,text){
		alert("Here!");
		if (e.keyCode == 13){
			get_sel_mode(text);
		}
	}*/

	function reachHead(){                                           // 已達首頁
		if (thispage == 1) return true;
	}

	function reachTail(){                                           // 已達末頁
		if (thispage == totalpage) return true;
	}

	function reachLeft(){                                           // 已達拼音左邊界
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var check = getCaretCharacterOffsetWithin(DOM_textbox);
		if (sel_mode == 0){
			if (input_loc == check) return true;
		}
		else if (sel_mode == 1){
			if (mode == 1){                                         // 智能模式中的拼音左邊界
				if (input_loc == check) return true;
			}
			if (mode == 2){                                         // 智能模式中的自動選詞左邊界
				if ((auto_start == check) && (input_len != 0)) return true;             
			}
		}               
	}

	function reachRight(){                                          // 已達拼音右邊界
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var check = getCaretCharacterOffsetWithin(DOM_textbox);
		if (sel_mode == 0){
			if ((input_loc + search_key.length) == check) return true;
		}
		if (sel_mode == 1){
			if (mode == 1){                                         // 智能模式中的拼音左邊界
				console.log("here");
				if ((input_loc + search_key.length) == check) return true;
			}
			if (mode == 2){                                         // 智能模式中的自動選詞右邊界
				if ((auto_start + auto_len) == check) return true;                    
			}
		}
	}

	function isNumber(keyCode){                                     // 判斷鍵入的鍵盤值是否為數字
		if (keyCode >= 48 && keyCode <= 57) return true;
		if (keyCode >= 96 && keyCode <= 105) return true;
		return false;
	}
				 
	function make_undo_record(index,mode,len,duplicate_val,word,loc,key,a_key,a_start,a_end,a_len){       // undo_record 物件的建構子
		this.index = index;
		this.mode = mode;
		this.len = len;
		this.duplicate_val = duplicate_val;
		this.word = word;
		this.loc = loc;
		this.key = key;
		this.a_key = a_key;
		this.a_start = a_start;
		this.a_end = a_end;
		this.a_len = a_len;
	}

	function push_undo_record(){                                    // 新增undo_record，並push到堆疊中
		var copy = $("#input").html();
		copy = remove_tags(copy);
		var undo_record = new make_undo_record(undo_index,mode,input_len,copy,input_word,input_loc,search_key);
		undo_stack.push(undo_record);
		undo_index++;
	}

	function push_before_selected(){                                // 新增undo_record，並push到堆疊中
		var copy = input_copy;
		var undo_record = new make_undo_record(undo_index,mode,input_len,copy,input_word,input_loc,search_key);
		undo_stack.push(undo_record);
		undo_index++;
	}

	function pop_undo_record(){                                     // 將堆疊頂端的undo_record，pop出來
		if (undo_stack[0] != null)
			undo_stack.pop();
	}

	function get_record(){                                          // 得到undo_record
		var undo_record = undo_stack[undo_stack.length - 2];
		var textbox = $("#input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		if (undo_record != null){
			mode = undo_record.mode;
			input_len = undo_record.len;
			input_word = undo_record.word;
			input_loc = undo_record.loc;
			search_key = undo_record.key;
			textbox.html(undo_record.duplicate_val);
			textbox.setCursorPosition(input_loc);
			if (search_key != ""){                                  // 如果紀錄中有可搜尋的拼音，那就去找字，關聯詞暫時無視
				search_char(0);
			}
			else{                                                   // 沒有就清空選字區
				$("#show").html("");    
				$("#show_flat").html("");
			}
			pop_undo_record();                                      // pop出一個舊紀錄
		}
		else{                                                       // 當stack中已無元素，則無法再復原了
			prompt_txtbox.val("已達復原步驟上限!");
			prompt_flat_txtbox.val("已達復原步驟上限!");
			caption_effect();
		}
	}
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑與輸入法相關↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

	function nav_to_white(){                                        // 讓上方的navbar的元素有白色跑馬燈特效
		function auto_count(){                                      // 用來控制變色的index的anonymous function，本身記錄index
			var count = 0;
			return function(){
				if (count >= 5)
					count = 0;
				return count++;
			};
		}
		var set_count = auto_count();                               // 為anonymous function取名
		var p = setInterval(function(){
			var temp = nav_assign_white(set_count());               // 記錄這次變色元素的index
			var pause_timer = setInterval(function(){
				nav_restore_color(temp);                            // 還原該元素的色彩
				clearInterval(pause_timer);                         
			},1500);
		},1500);
	}

	function nav_assign_white(element){                             // 把元素顏色變白色
		$(nav_arr[element]).css('color',"white");
		return element;
	}

	function nav_restore_color(element){                            // 讓上方的已變色的navigator元素變回原色的函式
		$(nav_arr[element]).css('color',nav_color[element]);
	}

	function caption_effect(){                                      // 字幕效果，讓提示欄的文字在1.5秒後消失
		var pause_timer = setInterval(function(){ 
			$("#prompt").val("");
			$("#prompt_flat").val("");
			clearInterval(pause_timer); 
		},1500);
	}

	function change_theme(theme){
		var css_num = 0;
		if (theme == "origin"){
			nav_assign_color("origin");
			css_num = 1;
			customJqte.remove();
			customJqte_flat.remove();
			$("#jqte_place").append('<textarea id="jqte" readonly></textarea>');
			$("#jqte").jqte({css:"jqte_origin"});
			customJqte = $(".jqte_origin");
			$("#jqte_flat").jqte({css:"jqte_origin_flat"});
			$("#jqte_place_flat").append('<textarea id="jqte_flat" readonly></textarea>');
			customJqte_flat = $(".jqte_origin_flat");                  
		}
		else if (theme == "pink"){
			nav_assign_color("pink");
			css_num = 2;
			customJqte.remove();
			customJqte_flat.remove();
			$("#jqte_place").append('<textarea id="jqte" readonly></textarea>');
			$("#jqte").jqte({css:"jqte_pink"});
			customJqte = $(".jqte_pink");
			$("#jqte_flat").jqte({css:"jqte_pink_flat"});
			$("#jqte_place_flat").append('<textarea id="jqte_flat" readonly></textarea>');
			customJqte_flat = $(".jqte_pink_flat");
		}
		else if (theme == "blue"){
			nav_assign_color("blue");
			css_num = 3;
			customJqte.remove();
			customJqte_flat.remove();
			$("#jqte_place").append('<textarea id="jqte" readonly></textarea>');
			$("#jqte").jqte({css:"jqte_blue"});
			customJqte = $(".jqte_blue");
			$("#jqte_flat").jqte({css:"jqte_blue_flat"});
			$("#jqte_place_flat").append('<textarea id="jqte_flat" readonly></textarea>');
			customJqte_flat = $(".jqte_blue_flat");
		}
		else if (theme == "xmas"){
			nav_assign_color("xmas");
			css_num = 4;
			customJqte.remove();
			customJqte_flat.remove();
			$("#jqte_place").append('<textarea id="jqte" readonly></textarea>');
			$("#jqte").jqte({css:"jqte_xmas"});
			customJqte = $(".jqte_xmas");
			$("#jqte_flat").jqte({css:"jqte_xmas_flat"});
			$("#jqte_place_flat").append('<textarea id="jqte_flat" readonly></textarea>');
			customJqte_flat = $(".jqte_xmas_flat");
		}
		if (typeof(Storage) != "undefined") {                   
			localStorage.setItem("theme", theme); 
		} 
		for(var i = 1; i <= 4; i++){
			if (i == css_num)
				document.getElementById("CSS" + i).disabled = false;
			else
				document.getElementById("CSS" + i).disabled = true;
		}
	}

	function nav_assign_color(theme){
		if (theme == "origin"){
			nav_color = ["#F87284","#F0A01C","#F1EE8F","#8AE194","#5B81E9"];
			for(var i = 0; i < nav_arr.length; i++){
				$(nav_arr[i]).css('color',nav_color[i]);
			}
			nav_to_white();
			for(var i = 0; i < nav_arr.length; i++){
				$(nav_arr[i]).mouseenter(function(){$(this).css('color',"white");});
			}
						
			$("body").on('mouseleave',nav_arr[0],function(){
				$(nav_arr[0]).css('color',nav_color[0]);
			});
			$("body").on('mouseleave',nav_arr[1],function(){
				$(nav_arr[1]).css('color',nav_color[1]);
			});
			$("body").on('mouseleave',nav_arr[2],function(){
				$(nav_arr[2]).css('color',nav_color[2]);
			});
			$("body").on('mouseleave',nav_arr[3],function(){
				$(nav_arr[3]).css('color',nav_color[3]);
			});
			$("body").on('mouseleave',nav_arr[4],function(){
				$(nav_arr[4]).css('color',nav_color[4]);
			}); 
		}
		else if (theme == "pink"){
			nav_color = "#FFF";
			for(var i = 0; i < nav_arr.length; i++){
				$(nav_arr[i]).css('color',nav_color);
			}
		}
		else if (theme == "blue"){
			nav_color = "#FFF";
			for(var i = 0; i < nav_arr.length; i++){
				$(nav_arr[i]).css('color',nav_color);
			}
		}
		else if (theme == "xmas"){
			nav_color = "#FFF";
			for(var i = 0; i < nav_arr.length; i++){
				$(nav_arr[i]).css('color',nav_color);
			}
		} 
	}

	/***********************************************************************提示按鈕相關***********************************************************************/
	function generate_prompt_btn(){                                 // 產生開啟提示、關閉提示按鈕
		$("#hide_btn").fadeIn();
		generate_open();
		generate_close();
	}

	function generate_open(){                                       // 讓"開啟提示"的button有其功能
		$("#open_prompt").click(function(){
			if ($("#prompt_flat").is(":hidden")){
				var textbox = $("#input");
				var prompt_txtbox = $("#prompt");
				qrcode_toleft();
				if (ispopup_visible()){
					//已經彈出popup時，則不需要再開啟
				}
				else{
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'left center'
					}).popup('hide');
									
					$("#select_mode").popup({
						content: '這是選擇不同輸入模式的下拉式選單',
						position: 'left center'
					}).popup('hide');
					
					$("#prompt").popup({
						content: '這是簡易提示欄，成功或失敗操作時會有提示',
						position: 'left center'
					}).popup('hide');
										
					$("#copy").popup({
						content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
						position: 'left center'
					}).popup('hide');
											
					$("#undo").popup({
						content: '這是復原按鈕，按下後將還原至上一步',
						position: 'bottom center'
					}).popup('hide');
												
					$("#cut").popup({
						content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
						position: 'right center'
					}).popup('hide');
													
					$("#show").popup({
						content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
						position: 'right center'
					}).popup('hide');
					
					customJqte.popup({
						content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
						position: 'left center'
					}).popup('hide');
				}
			}
			else{
				$("#input").popup({
					content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
					position: 'top center'
				}).popup('hide');
				
				$("#select_mode_flat").popup({
					content: '這是選擇不同輸入模式的下拉式選單',
					position: 'left center'
				}).popup('hide');
								
				$("#prompt_flat").popup({
					content: '這是簡易提示欄，成功或失敗操作時會有提示',
					position: 'right center'
				}).popup('hide');
									
				$("#copy_flat").popup({
					content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
					position: 'top center'
				}).popup('hide');
										
				$("#undo_flat").popup({
					content: '這是復原按鈕，按下後將還原至上一步',
					position: 'bottom center'
				}).popup('hide');
											
				$("#cut_flat").popup({
					content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
					position: 'top center'
				}).popup('hide');
												
				$("#show_flat").popup({
					content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
					position: 'top center'
				}).popup('hide');
				
				$(".jqte").popup({
					content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
					position: 'top center'
				}).popup('hide');
			}
			$("#prompt").val("提示功能已開啟!");
			$("#prompt_flat").val("提示功能已開啟!");
			caption_effect();
		});
	}

	function generate_close(){                                          // 讓"關閉提示"的button有其功能
		$("#close_prompt").click(function(){
			if ($("#prompt_flat").is(":hidden")){
				$("#input").popup('hide');
				$("#select_mode").popup('hide');
				$("#prompt").popup('hide');
				$("#copy").popup('hide');
				$("#undo").popup('hide');
				$("#cut").popup('hide');
				$("#show").popup('hide');
				customJqte.popup('hide');
				$(".lab_qrcode").animate({margin: '0 28%'});
				var pause_timer = setInterval(function(){
					$("body").off("mouseenter","#input");
					$("body").off("mouseleave","#input");
					$("body").off("mouseenter","#prompt");
					$("body").off("mouseleave","#prompt");
					$("#input").popup('destroy');
					$("#select_mode").popup('destroy');
					$("#prompt").popup('destroy');
					$("#copy").popup('destroy');
					$("#undo").popup('destroy');
					$("#cut").popup('destroy');
					$("#show").popup('destroy');
					customJqte.popup('destroy');
					$("#prompt").val("提示功能已關閉!");
					caption_effect();
					clearInterval(pause_timer);
				},200);
			}
			else{
				$("#input").popup('hide');
				$("#select_mode_flat").popup('hide');
				$("#prompt_flat").popup('hide');
				$("#copy_flat").popup('hide');
				$("#undo_flat").popup('hide');
				$("#cut_flat").popup('hide');
				$("#show_flat").popup('hide');
				$(".jqte").popup('hide');
				var pause_timer = setInterval(function(){
					$("#input").popup('destroy');
					$("#select_mode_flat").popup('destroy');
					$("#prompt_flat").popup('destroy');
					$("#copy_flat").popup('destroy');
					$("#undo_flat").popup('destroy');
					$("#cut_flat").popup('destroy');
					$("#show_flat").popup('destroy');
					$(".jqte").popup('destroy');
					$("#prompt_flat").val("提示功能已關閉!");
					caption_effect();
					clearInterval(pause_timer);
				},200);
			}
		});
	}

	function ispopup_visible(){                                         // 判斷畫面上是否還有存在的popup
		if ($("#input").popup('is visible') || $("#select_mode").popup('is visible') || $("#prompt").popup('is visible') || $("#copy").popup('is visible') ||
			$("#undo").popup('is visible') || $("#cut").popup('is visible') || $("#show").popup('is visible') || customJqte.popup('is visible')){
			return true;
		}
		else
			return false;
	}

	function ispopup_flat_visible(){                                    // 判斷手機畫面上是否還有存在的popup
		if ($("#input").popup('is visible') || $("#select_mode_flat").popup('is visible') || $("#prompt_flat").popup('is visible') || $("#copy_flat").popup('is visible') ||
			$("#undo_flat").popup('is visible') || $("#cut_flat").popup('is visible') || $("#show_flat").popup('is visible') || $(".jqte").popup('is visible')){
			return true;
		}
		else
			return false;
	}
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓會員資料驗證↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/        


	function qrcode_toleft(){                                   // 調整上方兩個popup彈出時QRcode的位置
		$("body").on('mouseenter',"#input",function(){
			if ($("#input").popup('is hidden')){
				if (prompt_mouseleave_flag){
					$(".lab_qrcode").animate({margin: '0 0'},"fast");  
				}
				else{
					$(".lab_qrcode").animate({margin: '0 0'},"fast");                  
				}
			}
			else if ($("#input").popup('is hidden') && $("#prompt").popup('is hidden')){
				$(".lab_qrcode").animate({margin: '0 0'},"fast");
			}
		});
		$("body").on('mouseleave',"#input",function(){
			if ($("#input").popup('is hidden')){
					$(".lab_qrcode").animate({margin: '0 28%'},"fast");
				}
			if ($("#input").popup('is visible')){
				if (prompt_mouseleave_flag){
					$(".lab_qrcode").animate({margin: '0 28%'},"fast");
					prompt_mouseleave_flag = false;
				}
				else{
					$(".lab_qrcode").animate({margin: '0 17%'},"fast");
				}
			}
			if ($("#input").popup('is visible') && $("#prompt").popup('is hidden')){
				$(".lab_qrcode").animate({margin: '0 28%'},"fast");
			}
			input_mouseleave_flag = true;
		});
		
		$("body").on('mouseenter',"#prompt",function(){
			if ($("#prompt").popup('is hidden')){
				$(".lab_qrcode").animate({margin: '0 17%'},"fast");
			}
			else if ($("#prompt").popup('is hidden') && $("#input").popup('is visible')){
				if (input_mouseleave_flag){
					$(".lab_qrcode").animate({margin: '0 17%'},"fast");
				}
				else{
					$(".lab_qrcode").animate({margin: '0 0'},"fast");
				}
			}
			else if ($("#prompt").popup('is visible')){   
				$(".lab_qrcode").animate({margin: '0 17%'},"fast");
			}
		});
		$("body").on('mouseleave',"#prompt",function(){
			if ($("#prompt").popup('is visible')){
				if (input_mouseleave_flag){
					$(".lab_qrcode").animate({margin: '0 28%'},"fast");
					input_mouseleave_flag = false;
				}
				else{
					$(".lab_qrcode").animate({margin: '0 28%'},"fast");
				}
			}
			else if ($("#prompt").popup('is visible') && $("#input").popup('is hidden')){
				$(".lab_qrcode").animate({margin: '0 28%'},"fast");
			}
			else if ($("#prompt").popup('is hidden')){
				$(".lab_qrcode").animate({margin: '0 28%'},"fast");
			}
			prompt_mouseleave_flag = true;
		});
	}

	function change_pic(){
		click_count++;
		if (click_count == 5){
			var timer = setInterval(function(){
				$("#change_qr").html('<img src="./images/pokerface.png" width="120px" height="120px" style="margin-left: 18px; margin-top: 5px; margin-bottom: 2px"/><br><br>');
				clearInterval(timer);
				var timer2 = setInterval(function(){
					$("#change_qr").html('<img src="./images/pinyinQR.png" id="my_qrcode" onclick="change_pic()" width="160px" height="160px" style="margin-top: -13px"/>');
					$("#my_qrcode").click(function(){
						$(this).transition('tada');
					});
					clearInterval(timer2);
				},800);
			},350); 
			click_count = 0;
		}
	}

	function set_default(){
		//$(document).jSnow();
		$("#input").focus();
		$("#hide_btn").hide();
		$('<audio id="chatAudio"><source src="error.mp3" type="audio/mpeg"></audio>').appendTo('body');  
		$(window).on('load', function(e){                               // 讓從FB導回來的頁面沒有'#_=_' 
			if (window.location.hash == '#_=_') { 
				window.location.hash = '';                              // for older browsers, leaves a # behind 
				history.pushState('', document.title, window.location.pathname); // nice and clean 
				e.preventDefault(); // no page reload 
			}  
		});

		$("#nav_contact").click(function(){
			$("#message_board").modal('show');
		});
		$("#my_qrcode").click(function(){
			$(this).transition('tada');
		});
		$('.ui.dropdown').dropdown();                                   // 啟用dropdown元素   
		$("#search_pinyin").autocomplete({                              // 運用jquery UI的autocomplete來做到以中文反查拼音
			source: 'search_pinyin.php'
		});                         

		/*********************************設定主題背景相關********************************/
		var theme = "origin";
		var valid_css_num = 0;
		var style = ["origin","pink","blue","xmas"];

		if (typeof(Storage) != "undefined") {                           // 先從localStorage取theme資料
			var data = localStorage.getItem("theme");
			if (data != null){                                          // 如果storage中有資料
				theme = data;                                           // 則更改主題，若無則為預設的origin
				for(var i = 0; i < style.length; i++){
					if (theme == style[i]){
						valid_css_num = i;
						break;
					}
				}
			}
		}
		var initial_style = "jqte_" + theme;
		var flat_initial_style = initial_style + "_flat";
		$("#jqte").jqte({css: initial_style});
		$("#jqte_flat").jqte({css: flat_initial_style});

		customJqte = $("." + initial_style);
		customJqte_flat = $("." + flat_initial_style);   
		change_theme(theme);
		/*********************************設定主題背景相關********************************/     
	}