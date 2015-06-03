	/***********************************************興大台語拼音輸入法演算法**********************************************/
	/*********************************************Mainly coded by David Tsui********************************************/
	/*******************************************************************************************************************/
	var nav_arr = ["#nav_home","#nav_log","#nav_input","#nav_about","#nav_tutorial","#nav_contact"];  // navbar的元素
  var now_theme = "black";
	var customJqte = "";                                                // 記錄當前jqte的樣式
	var customJqte_flat = "";                                           // 記錄當前jqte_flat的樣式
	
	var sel_mode = 1;                                                   // 記錄當前的選字模式
	var mode = 0;   // 自選模式 0: 拼音模式; 1: 選字模式; 2: 關聯詞模式  3: 修正模式
									// 智能模式 0: 拼音模式; 1: 空白選字的拼音模式; 2: 自動選詞模式 3: 修正模式
	var search_key = "";                                                // 查詢中文字的英文拼音Key(自選及智能皆使用此)
	var search_key_loc = 0;                                             // 記錄輸入key值時的輸入位置
	var prefix_key = "";                                                // 查詢關聯詞的中文key

	var auto_search_key = "";                                           // 自動選詞的搜尋key
	var auto_start = -1;                                                // 記錄自動選字的起始位置
	var auto_letter = [];                                               // 陣列-記錄回傳的自動選詞之字詞
	var auto_pinyin = [];																								// 陣列-記錄回傳的自動選詞之拼音
	var auto_pointer = [];																							// 記錄目前自動選詞的數量
	var pinyin_record = [];                                             // 記錄輸入框中所有字詞，以物件陣列記錄
	var record_last_index = -1;																					// 記錄最後一個插入pinyin_record陣列的位置
	/*  
	pinyin_record = [
		{
			pinyin: "",
			word: "",
			start_loc: 0,
			end_loc: 0,
			modifiable: 0/1/2 (0:可修改，1:可在最前方修改，2:無法修改)
		},
		{
			pinyin: "",
			word: "",
			start_loc: 0,
			end_loc: 0,
			modifiable: 0/1/2 (0:可修改，1:可在最前方修改，2:無法修改)
		},
		{
			pinyin: "",
			word: "",
			start_loc: 0,
			end_loc: 0,
			modifiable: 0/1/2 (0:可修改，1:可在最前方修改，2:無法修改)
		}
	];
	*/
	var candidate_letter = [];                                          // 陣列-記錄回傳的文字
	var mod_pinyin_record = [];																					// 陣列-修正模式下，記錄詞對應拼音
	var number_letters = 0;                                             // 記錄該拼音回傳之結果總共有幾個字
	var keyin = 0;                                                      // 記錄按下鍵盤的keycode
	var input_word = "";                                                // 記錄輸入框中出現的中文字
	var input_len = 0;                                                  // 記錄輸入框中出現的中文字長度
	var input_loc = 0;                                                  // 記錄鍵盤輸入的位置

	var show_text = "";                                                 // 記錄textarea中所顯示的文字
	var show_flat_text = "";                                            // 記錄小裝置顯示時之替代textarea中所顯示的文字  
	var mousedown_loc = 0;                                              // 記錄滑鼠一點下去時的游標位置

	var totalPage = 0;                                                  // 記錄回傳文字的總頁數
	var currentPage = 1;                                                // 記錄當前的頁數

	var correspond_flag = false;                                        // 用來判斷音與字是否對應
	var tow_check = false;                                              // 判斷滑鼠有無反白拖曳   
	var associated_search_flag = false;                                 // 用來判斷是否正在關聯拼音
	var punctuation_search_flag = false;																// 用來判斷是否正要輸入標點符號
	var interval = "\t\t";                                              // textarea中的小標題間距
	var click_count = 0;

	$(document).ready(function(){
		Pace.on("done", function(){
			$('#index_title').transition('flash');
		});
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		set_default();                                                  // 設定初始狀態

		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
		/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓與輸入法相關↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/

		$("#input").mousedown(function(){                           
			mousedown_loc = getCaretCharacterOffsetWithin(DOM_textbox);  // 記錄滑鼠一點下去時的游標位置
		}).mousemove(function(){
			/*var textbox = $("#input");
			var DOM_textbox = document.getElementById("input");
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
			}*/
		}).mouseup(function(){                                           //調整在拼音時，被反白拖曳導致游標移動到奇怪的地方
			var DOM_textbox = document.getElementById("input");
			mouseup_loc = getCaretCharacterOffsetWithin(DOM_textbox);  	// 記錄滑鼠彈起來時的游標位置
			if (sel_mode == 0 && mode == 0 && search_key == "")
				input_loc = mouseup_loc;

			show_text = $("#show").html();
			if (tow_check == true && show_text != ""){                  // 如果不能選字或是拼音還存在，則反白會失效，游標自動跑到當前的input_loc
				textbox.setCursorPosition(input_loc);           				// 一律固定到該次輸入的位置
			}
			else if (tow_check == false && (mode == 2 || mode == 3) && (getCaretCharacterOffsetWithin(DOM_textbox) != input_loc)){ // 如果在關聯詞模式，將游標點至非該次輸入的地方，則視為放棄選詞
				mode = 0;                                               // 而後視為選字成功之後續歸零
				$("#show, #show_flat").html("");
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
			keyin = e.keyCode;

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
						 
			show_text = $("#show").html();
			auto_start = get_auto_start();

			if (keyin == 220){
				if (mode == 0 && show_text == "" || mode == 2 || mode == 3){
					$.getJSON('./dict_punctuation.json',function(data){
						var punctuations = data.punctuation;
						number_letters = punctuations.length;      					// 取得總字數，第一項被當作判斷是否有接續拼音的flag，故 -1
						currentPage = 1;
						getPage();                                          // 取得該key值所對應文字的總頁數
						candidate_letter = [];
						for(var i = 0; i < number_letters; i++)             // 將回傳的json複製到陣列
							candidate_letter[i] = punctuations[i];
						var temp_text = "";
						var temp_text_flat = "";
						var next_flag = false;
						var number = 1;
						for(var i = 0; i < 10; i++){
							temp_text += number + ". " + candidate_letter[i] + "\n";
							if (i == 3)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else if ((i == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
								next_flag = true;
							}
							else if ((i == 7) && (candidate_letter[i + 1].length > 1))
								temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
							else
								temp_text_flat += number + ". " + candidate_letter[i] + " ";
							number++;
							if (number == 10) 
								number = 0;
						}
						temp_text += "+:下一頁";
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
						if (next_flag == true)
							temp_text_flat += " +:下頁"; 
						$("#show, #show_flat").html(temp_text); 
						mode = 1;
						punctuation_search_flag = true;                                                                         					    				
					});
				}
				return false;
			}

			if (keyin == 186 || keyin == 188 || keyin == 190 || keyin == 191 || keyin == 192 || keyin == 219 || keyin == 221 || keyin == 222){
				if (mode == 0 && show_text == "" || mode == 2 || mode == 3){
					var punc = "";
					if (keyin == 186) punc = "；"; 
					else if (keyin == 188) punc = "，"; 
					else if (keyin == 190) punc = "。"; 
					else if (keyin == 191) punc = "？"; 
					else if (keyin == 192) punc = "~"; 
					else if (keyin == 219) punc = "「";
					else if (keyin == 221) punc = "」";
					else if (keyin == 222) punc = "、";
					obj = new pinyin_obj("", punc, input_loc, input_loc + 1, 2); 

					mode = 0;
					$.ajaxSettings.async = false;
					addRecord(obj,input_loc);
					$.ajaxSettings.async = true;
					var text = "";
					for(var i = 0; i < pinyin_record.length; i++){
						if (pinyin_record[i].modifiable == 2)
							text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
						else
							text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
					}         
					textbox.html(text);
					input_word = remove_tags(textbox.html());
					input_len = input_word.length;                              // 調整成功字數 
					input_loc++;
					textbox.setCursorPosition(input_loc);
					search_key = "";
					prefix_key = "";
					$("#show, #show_flat").html("");
					return false;
				}
				else
					return false;
			}
			
			if (show_text == "" || show_text == "無此拼音，請按backspace或delete調整拼音"){   // 如果拼音模式下失敗，禁止+/-號
				if ((keyin == 107 || keyin == 187)) return false;               
				if ((keyin == 109 || keyin == 189)) return false;
			}     

			if (keyin == 8){
				if (sel_mode == 0){
					if (((mode == 0 && search_key != "") || mode == 1) && reachLeft() == true){
						var text = "目前無法刪字!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
						return false; 
					}
					else if (mode == 2 || mode == 3){
						mode = 0;
						$("#show, #show_flat").html("");
						prefix_key = "";
						search_key = "";
						input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
					}
				}
				if (sel_mode == 1 && mode == 2 && reachLeft() == true) 
					return false; 
			}   

			if (keyin == 13){
				if ((mode == 0 && associated_search_flag == false) || mode == 2){
					var textbox = $("#input");
					var html = textbox.html();
					var check = html.search('<span class="in_pinyin_window">');
					if (check >= 0){
						var text = remove_tags(html);
						input_word = text;
						var word_length = input_word.length;
						pinyin_record = [];
						var obj = new pinyin_obj("",input_word,0,word_length,2);
						$.ajaxSettings.async = false;
						addRecord(obj,0);
						$.ajaxSettings.async = true;
						input_loc = word_length;
						input_len = input_word.length;
						textbox.html(input_word);
						textbox.setCursorPosition(input_loc);
						mode = 0;
						search_key = "";
						auto_start = -1;
						$("#show, #show_flat").html("");
					}
					else{
						var text = "此區無法換行!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
					}
				}
				else{
					var text = "現在不能按Enter!";
					prompt_txtbox.val(text);
					prompt_flat_txtbox.val(text);
					caption_effect();
				}
				return false;
			}

			if (keyin == 32){ 										// 當前在拚音提示狀態中禁止空白
				if (sel_mode == 0){
					if ((mode == 0 && search_key == "") || mode == 2 || mode == 3){
						obj = new pinyin_obj(""," ",input_loc,input_loc + 1,2); 
						$.ajaxSettings.async = false;
						addRecord(obj,input_loc);
						$.ajaxSettings.async = true;
						var text = "";
						for(var i = 0; i < pinyin_record.length; i++){
							if (pinyin_record[i].modifiable == 2)
								text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
							else
								text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
						}         
						textbox.html(text);
						input_word = remove_tags(textbox.html());
						input_len = input_word.length;                              // 調整成功字數 
						input_loc++;
						textbox.setCursorPosition(input_loc);
						if (mode == 2 || mode == 3){
							search_key = "";
							prefix_key = "";
							mode = 0;
							$("#show, #show_flat").html("");
						}
						return false;
					}
				}
				else if (sel_mode == 1 && mode == 1){
					console.log("**********************");
					console.log("input_loc: " + input_loc);
					console.log("input_len: " + input_len);
					console.log("auto_start: " + auto_start);
					console.log("**********************");
					if (input_loc < input_len){                              // 不在末端打字
						if (input_loc == auto_start){
							console.log("auto_search_key: " + auto_search_key);
							auto_search_key = search_key + " " + auto_search_key;
						}
						else{
							var j = 0;
							for(var i = 0; i < auto_search_key.length; i++){
								if (auto_search_key[i] == " ") 
									j++;
								if (j == (input_loc - auto_start)){          // 以auto_start作為新的起點
									var insert_loc = i;
									//console.log("The blank locate: " + insert_loc);
									var left = auto_search_key.substring(0,insert_loc);
									var right = auto_search_key.substring(insert_loc,auto_search_key.length);
									//console.log("left: " + left);
									//console.log("right: " + right);
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
					mode = 2;
				}
				if (associated_search_flag == true){
					var text = "拼音提示下不能按空白!";
					prompt_txtbox.val(text);
					prompt_flat_txtbox.val(text);
					caption_effect();
					return false;
				}
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
				if (mode == 2 || mode == 3){                           // 關聯詞、修正模式下，若按下方向鍵視為放棄
					mode = 0;
					prefix_key = "";
					search_key = "";
					$("#show, #show_flat").html("");
					candidate_letter = [];
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
				if (mode == 2 || mode == 3){                           // 關聯詞模式下，若按下方向鍵視為放棄
					mode = 0;
					prefix_key = "";
					search_key = "";
					$("#show, #show_flat").html("");
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
				}
			}       

			if (keyin == 37 && reachLeft() == true){                 // 限制游標移動在拼音界限內
				if (mode == 0 && search_key != "") return false;
				if (mode == 1) return false;
			}                   
			
			if (keyin == 39 && reachRight() == true){                  // 限制游標移動在拼音界限內
				if (mode == 0 && search_key != "") return false;
				if (mode == 1) return false;
			}

			if (keyin == 40 && sel_mode == 0 && search_key == ""){
				var which_word = get_Which_Word(input_loc,"head");
				switch (pinyin_record[which_word].modifiable){
					case 0: 
						var key = pinyin_record[which_word].pinyin;
						var start_loc = pinyin_record[which_word].start_loc;
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
						$.ajaxSettings.async = false;
						search_char(2);
						$.ajaxSettings.async = true;
						return false;
						break;
					case 1:
						var key = pinyin_record[which_word].pinyin;
						var start_loc = pinyin_record[which_word].start_loc;
						var end_loc = pinyin_record[which_word].end_loc;
						if (input_loc == start_loc){
							search_key = key;	
							mode = 3;
							$.ajaxSettings.async = false;
							search_char(0);				
							$.ajaxSettings.async = true;
						}
						else{
							var text = "此處無法修改，請移至最前端!";
							prompt_txtbox.val(text);
							prompt_flat_txtbox.val(text);
							caption_effect();
						}
						return false;
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

			if (keyin == 46){
				if (sel_mode == 0){
					if (((mode == 0 && search_key != "") || mode == 1) && reachRight() == true){
						var text = "目前無法刪字!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
						return false; 
					}
					else if (mode == 2 || mode == 3){
						mode = 0;
						$("#show, #show_flat").html("");
						prefix_key = "";
						search_key = "";
						input_loc = getCaretCharacterOffsetWithin(DOM_textbox);
					}
				}
				else if (sel_mode == 1 && mode == 2 && reachLeft() == true) 
					return false; 
			}  

			/*if (keyin == 40 && sel_mode == 1 && mode == 2){            // 自動選詞時按方向鍵"下"來改字
				if (temp_loc >= auto_pointer[0] && temp_loc < auto_pointer[1]){
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
				else if (temp_loc >= auto_pointer[1] && temp_loc < auto_pointer[2]){
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
				else if (temp_loc >= auto_pointer[2]){
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
							
			if (mode == 0 || associated_search_flag == true){
				if (isNumber(keyin)){                                   // 拼音模式下禁止輸入數字
					var text = "現在還不能選字!";
					prompt_txtbox.val(text);
					prompt_flat_txtbox.val(text);
					caption_effect();
					return false;
				}
			}
			
			if (sel_mode == 0 && (mode == 2 || mode == 3) && (keyin >= 37 && keyin <= 40)){     // 關聯詞模式下，若按下方向鍵視為放棄
				mode = 0;
				$("#show, #show_flat").html("");
				search_key = "";
				prefix_key = "";
			}
			
			if ((mode != 0 || associated_search_flag == true) && reachTail() == true){          // 選字模式下，若翻頁已達末頁，則+號無效，若所選數字不存在文字，亦禁止該數字的鍵入
				if ((keyin == 107 || keyin == 187)){
					if (totalPage == 1){/*do nothing*/}
					else{
						var text = "已達最末頁!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
					}
					return false; 
				}
				if (isNumber(keyin) && keyin >= 96){                    // 如果按下的數字鍵並不存在對應文字
					if ((keyin - 96 + (currentPage - 1) * 10) > number_letters || (keyin == 96) && ((currentPage * 10) > number_letters)){
						var text = "該號碼無法選擇!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();                               
						return false;
					}
				}
				else if (isNumber(keyin) && keyin >= 48 && keyin < 96){ // 如果按下的數字鍵並不存在對應文字
					if ((keyin - 48 + (currentPage - 1) * 10) > number_letters || (keyin == 48) && ((currentPage * 10) > number_letters)){
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
					if (totalPage == 1){/*do nothing*/}
					else{
						var text = "已達首頁!";
						prompt_txtbox.val(text);
						prompt_flat_txtbox.val(text);
						caption_effect();
					}
					return false;
				}
			}           

			if (keyin == 107 || keyin == 187){        // +鍵
				currentPage++;                             // 刷新頁數
				var temp_text = "";
				var temp_text_flat = "";
				var i = 0 + (10 * (currentPage - 1));
				var counter = 0;
				var number = 1;
				var next_flag = false;
				while (i < number_letters && counter < 10){
					if (associated_search_flag == false)
						temp_text += number + ". " + candidate_letter[i] + "\n";
					else
						temp_text += "● " + candidate_letter[i] + "\n";
					if (((i % 10) == 3 || (i % 10) == 7) && (currentPage < totalPage)){        // 為了讓小螢幕裝置顯示正常，字不會出界
						if ((i % 10) == 3){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
						if (((i % 10) == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
							next_flag = true;
						}
						else if (((i % 10) == 7)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + " +:下頁\n"
						}
					}
					else if (((i % 10) == 3 || (i % 10) == 7) && (currentPage == totalPage)){
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
						if ((i % 10) == 7){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
					}
					else{
						if (associated_search_flag == false)
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						else
							temp_text_flat += "● " + candidate_letter[i] + " ";                                                
					}
					i++;    
					counter++;
					number++;
					if (number == 10) 
						number = 0;
				}
				if (currentPage < totalPage){
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
						temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text; 
					}
					if (mode == 1 || mode == 3){
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text; 
					}
				}
				if (sel_mode == 1){
					if (associated_search_flag == true)
						temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text; 
					else
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
				}
				if (mode == 2)
					temp_text = "關聯詞" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
				$("#show").html(temp_text);
				$("#show_flat").html(temp_text_flat);
				return false;
			}
			if (keyin == 109 || keyin == 189){        // -鍵
				currentPage--;                             // 刷新頁數引
				var temp_text = "";
				var temp_text_flat = "";
				var i = 0 + (10 * (currentPage - 1));
				var counter = 0;
				var number = 1;
				var next_flag = false;
				while (i < number_letters && counter < 10){
					if (associated_search_flag == false)
						temp_text += number + ". " + candidate_letter[i] + "\n";
					else
						temp_text += "● " + candidate_letter[i] + "\n";
					if (((i % 10) == 3 || (i % 10) == 7) && (currentPage < totalPage)){        // 為了讓小螢幕裝置顯示正常，字不會出界
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
						if (((i % 10) == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
							next_flag = true;
						}
						else if (((i % 10) == 7)){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + " +:下頁\n"
						}
					}
					else if (((i % 10) == 3 || (i % 10) == 7) && (currentPage == totalPage)){
						if ((i % 10) == 3){ 
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
						if ((i % 10) == 7){
							if (associated_search_flag == false)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += "● " + candidate_letter[i] + "\n";
						}
					}
					else{
						if (associated_search_flag == false)
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						else
							temp_text_flat += "● " + candidate_letter[i] + " ";
						}
					i++;    
					counter++;
					number++;
					if (number == 10) number = 0;
				}
				if (currentPage < totalPage && currentPage > 1){
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
						temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text; 
					}
					if (mode == 1 || mode == 3){
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					}
				}
				if (sel_mode == 1){
					if (associated_search_flag == true)
						temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text; 
					else
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
				}
				if (mode == 2)
					temp_text = "關聯詞" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
				$("#show").html(temp_text);
				$("#show_flat").html(temp_text_flat);
				return false;
			}                                               
		}).keyup(function(e){                                           // 接續的keyup事件，為了讓上下左右鍵有影響
			keyin = e.keyCode;
			if ((keyin == 37 || keyin == 39) && mode != 1 && !(mode == 0 && search_key != ""))               // 非拼音時，左右鍵將會調整輸入位置
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);      
			if ((keyin == 35 || keyin == 36) && mode == 0 && associated_search_flag == false)
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox);  
		}).on('input',function(e){                                  // 同時發生的事件，只控制輸入進textbox的按鍵          
			/*************************************************自選模式***********************************************/
			if (sel_mode == 0){
				if ((keyin >= 65 && keyin <= 90) || keyin == 32 || keyin == 8 || keyin == 46 || keyin == 37 || keyin == 39){  
				// 輸入英文產生搜索資料庫的key值，並考慮刪除情形
					getKey(keyin);
					var text = textbox.html();
				}
			}
			/*************************************************智能模式***********************************************/
			if (sel_mode == 1){
				if ((keyin >= 65 && keyin <= 90) || keyin == 8 || keyin == 46){  
				// 輸入英文產生搜索資料庫的key值，並考慮刪除情形
					getKey(keyin);
				}
			}
			if (keyin == 8 || keyin == 46 || keyin == 32 || (keyin >= 65 && keyin <= 90)){  
				// backspace鍵或是delete鍵的刪除，及反白取代字的情形
				deleteWord(keyin);
			}
			
			if ((sel_mode == 0 && mode != 0) || (sel_mode == 1 && mode != 0)){
				if (sel_mode == 1 && keyin == 32){                     // 如果是智能模式，數字跟空白鍵都能用來選字
					if (mode == 2){
						setWord();                    
						textbox.setCursorPosition(input_loc);                          
						return;
					}
				}
				if (isNumber(keyin)){
					setWord();
					textbox.setCursorPosition(input_loc);       
					currentPage = 1;                           // 歸零
					totalPage = 1;                          // 歸零
					if (prefix_key != "")
						search_associated();                        
					return;
				}
				else if (totalPage > 1 && (keyin != 107) && (keyin != 187) && (keyin != 109) && (keyin != 189)){
					currentPage = 1;                           // 歸零
					totalPage = 1;                          // 歸零
				}
			}
						
			if (search_key == ""){                            
				$("#show, #show_flat").html("");
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
		$("#clear").click(function(){
			$("#input").html("");
			$("#show, #show_flat").html("");
			$("#input").focus();
			pinyin_record = [];
			mode = 0;
			input_word = "";
			input_loc = 0;   
			associated_search_flag = false;
			$("#prompt").val('輸入框已清空!');
			$("#prompt_flat").val('輸入框已清空!');
			caption_effect();
		});

		$("#copy").zclip({
			path: './js/ZeroClipboard.swf',
			copy: function(){
				var text = remove_tags($("#input").html()); 
				if (text != ""){
					$("#prompt").val('已複製到剪貼簿!');
					$("#prompt_flat").val('已複製到剪貼簿!');
					var jqte_text = $(".jqte_" + now_theme + "_editor").html();
					$(".jqte_" + now_theme + "_editor").html(jqte_text + text);
					caption_effect();
					$("#input").setCursorPosition(input_loc);
					return text;
				}
				else{
					$("#prompt").val('沒有內容可複製!');
					$("#prompt_flat").val('沒有內容可複製!');
					caption_effect();
					$("#input").focus();
					return;
				}
			}
		});

		$("#cut").zclip({
			path: './js/ZeroClipboard.swf',
			copy: function(){
				var text = remove_tags($("#input").html()); 
				if (text != ""){
					$("#prompt").val('已剪下到剪貼簿!');
					$("#prompt_flat").val('已剪下到剪貼簿!');
					input_word = "";
					pinyin_record = [];
					mode = 0;
					input_loc = 0;
					search_key = "";
					$("#input").html("");
					$("#show").html("");
					$("#show_flat").html("");
					associated_search_flag = false;
					var jqte_text = $(".jqte_" + now_theme + "_editor").html();
					$(".jqte_" + now_theme + "_editor").html(jqte_text + text);
					caption_effect();
					$("#input").focus();
					return text;
				}
				else{
					$("#prompt").val('沒有內容可剪下!');
					$("#prompt_flat").val('沒有內容可剪下!');
					caption_effect();
					$("#input").focus();
					return;
				}
			}
		});
						
		$("#GO").click(function(){                                  // 教學啟用按鈕"馬上出發"的按下事件  
			var height = $("#tutorial_panel").height();
			$("#hide_panel").height(height + 22);
			$("#tutorial_panel").fadeOut('2000',function(){
				$("#hide_panel").show();
			});        

			if ($("#prompt_flat").is(":hidden")){
				var pause1 = setInterval(function(){
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'left center'
					}).popup('show');
					clearInterval(pause1);
					var pause2 = setInterval(function(){
						$("#input").popup('hide');
						$("#google_btn").popup({
							content: '這是用來將所打字詞進行Google搜尋的按鈕',
							position: 'left center'
						}).popup('show');
						clearInterval(pause2);
						var pause3 = setInterval(function(){
							$("#google_btn").popup('hide');
							$("#prompt").popup({
								content: '這是簡易提示欄，成功或失敗操作時會有提示',
								position: 'left center'
							}).popup('show');
							clearInterval(pause3);                                      
							var pause4 = setInterval(function(){
								$("#prompt").popup('hide');
								$("#copy").popup({
									content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
									position: 'left center'
								}).popup('show');
								clearInterval(pause4);
								var pause5 = setInterval(function(){
									$("#copy").popup('hide');
									$("#clear").popup({
										content: '這是清除按鈕，按下後將把輸入框清空',
										position: 'bottom center'
									}).popup('show');
									clearInterval(pause5);
									var pause6 = setInterval(function(){
										$("#clear").popup('hide');
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
													$("#search_pinyin").popup({
														content: '這是反向查詢區，不會拼音的中文字可在這查拼音',
														position: 'bottom center'
													}).popup('show');											
													clearInterval(pause9);
													var pause10 = setInterval(function(){
														$("#search_pinyin").popup('hide');
														generate_prompt_btn();
														$("#input").focus();
														clearInterval(pause10);
													},3000);
												},3000);
											},3000);
										},3000);
									},3000);
								},3000);
							},3000);
						},3000);
					},3000);
				},1000);
			}
			else{
				var pause1 = setInterval(function(){
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'top center'
					}).popup('show');
					clearInterval(pause1);
					var pause2 = setInterval(function(){
						$("#input").popup('hide');
						$("#google_btn").popup({
							content: '這是用來將所打字詞進行Google搜尋的按鈕',
							position: 'left center'
						}).popup('show');
						clearInterval(pause2);
						var pause3 = setInterval(function(){
							$("#prompt_flat").popup({
								content: '這是簡易提示欄，成功或失敗操作時會有提示',
								position: 'right center'
							}).popup('show');
							clearInterval(pause3);
							var pause4 = setInterval(function(){
								$("#prompt_flat").popup('hide');
								$("#show_flat").popup({
									content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
									position: 'top center'
								}).popup('show');
								clearInterval(pause4);
								var pause5 = setInterval(function(){
									$("#show_flat").popup('hide');
									customJqte_flat.popup({
										content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
										position: 'top center',
									}).popup('show');  
									clearInterval(pause5);
									var pause6 = setInterval(function(){
										customJqte_flat.popup('hide');
										$("#search_pinyin").popup({
											content: '這是反向查詢區，不會拼音的中文字可在這查拼音',
											position: 'bottom center'
										}).popup('show');          	                                               
										clearInterval(pause6);
										var pause7 = setInterval(function(){
											$("#search_pinyin").popup('hide');
											generate_prompt_btn();
											$("#input").focus();											
											clearInterval(pause7);
										},3000);
									},3000);
								},3000);
							},3000);
						},3000);
					},3000);
				},1000);
			}
		});

		$("#NO").click(function(){
			var height = $("#tutorial_panel").height();
			generate_prompt_btn();
			$("#hide_panel").height(height + 22);
			$("#tutorial_panel").fadeOut('2000',function(){
				$("#hide_panel").show();
			});
			$("#input").focus();
		});

		$(function(){                                               // 調整contenteditable div的placeholder的bug
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
	function search_char(search_mode){                              // 以英文拼音當key，找尋key對應的字
		$.post('search_word.php',{search_KEY:search_key,MODE:search_mode},function(data){   // 查詢文字及分數
			if (data == ""){
				$("#show, #show_flat").html("無此拼音，請按backspace或delete調整拼音");
				$('#chatAudio')[0].play();
				associated_search_flag = false;
				mode = 0;
			}
			else if (data[0] == "associated pinyin"){
				number_letters = Object.keys(data).length - 1;      // 取得總字數，第一項被當作判斷是否有接續拼音的flag，故 -1
				currentPage = 1;
				getPage();                                          // 取得該key值所對應文字的總頁數
				candidate_letter = [];
				for(var i = 0; i < number_letters; i++)             // 將回傳的json複製到陣列
					candidate_letter[i] = data[i + 1];
				
				if (totalPage == 1){
					var temp_text = "";
					var temp_text_flat = "";
					for(var i = 0; i < number_letters; i++){
						temp_text += "● " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += "● " + candidate_letter[i] + "\n";
						else if (i == 7)
							temp_text_flat += "● " + candidate_letter[i] + "\n";
						else
							temp_text_flat += "● " + candidate_letter[i] + " ";
					}
					temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					$("#show").html(temp_text);
					$("#show_flat").html(temp_text_flat);
				}
				else{
					var temp_text = "";
					var temp_text_flat = "";
					var next_flag = false;
					for(var i = 0; i < 10; i++){
						temp_text += "● " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += "● " + candidate_letter[i] + "\n";
						else if ((i == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
							temp_text_flat += "● " + candidate_letter[i] + "\n";
							next_flag = true;
						}
						else if ((i == 7) && (candidate_letter[i + 1].length > 1))
							temp_text_flat += "● " + candidate_letter[i] + " +:下頁\n";
						else
							temp_text_flat += "● " + candidate_letter[i] + " ";
					}
					temp_text += "+:下一頁";
					temp_text = "拼音提示" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					$("#show").html(temp_text);    
					$("#show_flat").html(temp_text_flat);                           
				}       
				associated_search_flag = true; 
				mode = 0;
			}
			else if (data[0] == "modify letter"){
				number_letters = Object.keys(data[1]).length;      		// 取得字詞數
				var number_pinyins = Object.keys(data[2]).length;		// 取得拼音數
				currentPage = 1;
				getPage();                                          	// 取得該key值所對應文字的總頁數
				candidate_letter = [];
				mod_pinyin_record = [];
				for(var i = 0; i < number_letters; i++)
					candidate_letter[i] = data[1][i];
				for(var i = 0; i < number_pinyins; i++){
					if (i == 0)
						var obj = new modify_record_obj(data[2][i],0,data[3][i]);										
					else
						var obj = new modify_record_obj(data[2][i],data[3][i - 1],data[3][i]);
					mod_pinyin_record[i] = obj;
				}

				if (totalPage == 1){
					var temp_text = "";
					var temp_text_flat = "";
					var number = 1;
					for(var i = 0; i < number_letters; i++){
						temp_text += number + ". " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else if (i == 7)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						number++;
						if (number == 10) 
							number = 0;
					}
					temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					$("#show").html(temp_text);
					$("#show_flat").html(temp_text_flat);
				}
				else{
					var temp_text = "";
					var temp_text_flat = "";
					var next_flag = false;
					var number = 1;
					for(var i = 0; i < 10; i++){
						temp_text += number + ". " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else if ((i == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							next_flag = true;
						}
						else if ((i == 7) && (candidate_letter[i + 1].length > 1))
							temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
						else
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						number++;
						if (number == 10) 
							number = 0;
					}
					temp_text += "+:下一頁";
					temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					if (next_flag == true)
						temp_text_flat += " +:下頁"; 
					$("#show").html(temp_text); 
					$("#show_flat").html(temp_text_flat);                                                                   
				}        					    				
			}
			else{
				if (search_mode == 0 || search_mode == 2){
					number_letters = Object.keys(data).length;          // 取得總字數
					currentPage = 1;
					getPage();                                          // 取得該key值所對應文字的總頁數
					candidate_letter = [];
					mod_pinyin_record = [];
					for(var i = 0; i < number_letters; i++)             // 將回傳的json複製到陣列
						candidate_letter[i] = data[i];
					
					if (totalPage == 1){
						var temp_text = "";
						var temp_text_flat = "";
						var number = 1;
						for(var i = 0; i < number_letters; i++){
							temp_text += number + ". " + candidate_letter[i] + "\n";
							if (i == 3)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else if (i == 7)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else
								temp_text_flat += number + ". " + candidate_letter[i] + " ";
							number++;
							if (number == 10) 
								number = 0;
						}
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
						$("#show").html(temp_text);
						$("#show_flat").html(temp_text_flat);
					}
					else{
						var temp_text = "";
						var temp_text_flat = "";
						var next_flag = false;
						var number = 1;
						for(var i = 0; i < 10; i++){
							temp_text += number + ". " + candidate_letter[i] + "\n";
							if (i == 3)
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							else if ((i == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
								temp_text_flat += number + ". " + candidate_letter[i] + "\n";
								next_flag = true;
							}
							else if ((i == 7) && (candidate_letter[i + 1].length > 1))
								temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
							else
								temp_text_flat += number + ". " + candidate_letter[i] + " ";
							number++;
							if (number == 10) 
								number = 0;
						}
						temp_text += "+:下一頁";
						temp_text = "候選字" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
						if (next_flag == true)
							temp_text_flat += " +:下頁"; 
						$("#show").html(temp_text); 
						$("#show_flat").html(temp_text_flat);                                                                   
					}   
					if (sel_mode == 0 && mode != 3)                         // 修改模式的字插入情形不一樣，故不進mode 1
						mode = 1;                                           // 進入選字模式
				}
				else if (search_mode == 1){
					candidate_letter = [];
					candidate_letter[0] = data[0];
					$("#show, #show_flat").html("請按空白鍵選字");                
					mode = 1;
				}
				associated_search_flag = false;
			}
		},"json");
	}

	function search_associated(){                                           // 以中文當key，找尋關聯詞
		var key_len = prefix_key.length;
		if (key_len == 0) return;
		$.post('search_associated.php',{prefix_KEY:prefix_key},function(data){ 
			if (data == ""){
				$("#show, #show_flat").html("");
				mode = 0;
				return;
			}
			else{
				candidate_letter = [];
				number_letters = Object.keys(data).length;                  // 取得總字數                            
				getPage();                                                  // 取得總頁數
				for(var i = 0; i < number_letters; i++){                    // 將回傳的json複製到陣列
					var data_str = data[i];    
					var data_len = data_str.length;
					candidate_letter[i] = data_str.substr(key_len,data_len - key_len);
				}
				 
				if (totalPage == 1){
					var temp_text = "";
					var temp_text_flat = "";
					var number = 1;
					for(var i = 0; i < number_letters; i++){
						temp_text += number + ". " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else if (i == 7)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						number++;
						if (number == 10) number = 0;
					}
					temp_text = "關聯詞" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
					$("#show").html(temp_text); 
					$("#show_flat").html(temp_text_flat);
				}
				else{
					var temp_text = "";
					var temp_text_flat = "";
					var number = 1;
					var next_flag = false;
					for(var i = 0; i < 10; i++){
						temp_text += number + ". " + candidate_letter[i] + "\n";
						if (i == 3)
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
						else if ((i == 7) && (candidate_letter[i + 1].length <= 4) && (candidate_letter[i + 2].length <= 4)){
							temp_text_flat += number + ". " + candidate_letter[i] + "\n";
							next_flag = true;   
						}
						else if ((i == 7) && (candidate_letter[i + 1].length > 1))
							temp_text_flat += number + ". " + candidate_letter[i] + " +:下頁\n";
						else
							temp_text_flat += number + ". " + candidate_letter[i] + " ";
						number++;
						if (number == 10) number = 0;
					}
					temp_text += "+:下一頁";
					temp_text = "關聯詞" + interval + "(" + currentPage + "/" + totalPage + ")\n" + temp_text;
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
		var DOM_textbox = document.getElementById("input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		$.post('search_word_auto.php',{auto_KEY:auto_search_key},function(data){
			if (data == ""){
				$("#show, #show_flat").html("");
				mode = 0;
				return;
			}
			else{
				auto_letter = [];
				auto_pinyin = [];
				var len = Object.keys(data).length - 1; 
				var check_over_three = data[0];             // 檢查是否超過3詞上限
				for(var i = 1; i <= len; i++){
					auto_letter[i - 1] = data[i]['character'];
					auto_pinyin[i - 1] = data[i]['pinyin'];
				}
				var del_tail_flag = false;
				if (input_loc == auto_start) 
					del_tail_flag = true;
				if (check_over_three){											// 如果是，則調整auto_search_key
					if (del_tail_flag){							// 如果輸入位置為第一詞的正前方
						var cut_index = auto_search_key.search(auto_pinyin[3]);
						auto_search_key = auto_search_key.substring(0,cut_index);
						auto_start = pinyin_record[auto_pointer[0]].start_loc;    // 調整auto_start為當前第一詞的起始位置
					}
					else{
						var cut_index = auto_search_key.search(auto_pinyin[0]); // 第一個要固定詞的起始位置
						var first_pinyin_len = auto_pinyin[0].length;
						auto_search_key = auto_search_key.substring(cut_index + first_pinyin_len + 1,auto_search_key.length);
						auto_start = pinyin_record[auto_pointer[1]].start_loc;    // 調整auto_start為當前第二詞的起始位置
						auto_letter.shift();
						auto_pinyin.shift();
					}
					console.log("next_auto_search_key: " + auto_search_key);   
					console.log("auto_start: " + auto_start);
				}

				var len = auto_letter.length;												// 依序將自動選詞的結果產生物件
				var pinyin_objs = [];
				var word_length = 0;
				var start = auto_start;
				for(var i = 0; i < len; i++){
					console.log("auto_letter[" + i + "] = " + auto_letter[i]);
					word_length = auto_letter[i].length;
					var start_loc = start;
					var end_loc = start + word_length;
					$.ajaxSettings.async = false;
					search_correspond(auto_pinyin[i],auto_letter[i]); // 檢查拼音是否與字依序相符
					$.ajaxSettings.async = true;
					if (correspond_flag)       
						obj = new pinyin_obj(auto_pinyin[i], auto_letter[i], start_loc, end_loc, 0);
					else
						obj = new pinyin_obj(auto_pinyin[i], auto_letter[i], start_loc, end_loc, 1);
					pinyin_objs.push(obj);
					start += word_length;
				}
        
				if (auto_pointer.length == 0){															// 如果還沒有任何自動選字區塊（完全沒有，或是按enter取消後）
					for(var i = 0; i < pinyin_objs.length; i++){
						pinyin_record.splice(record_last_index + 1, 0, pinyin_objs[i]);
						auto_pointer[i] = record_last_index + 1;
						record_last_index++;
					}
				}
				else{
					var auto_words_num = auto_pointer.length;									// 先得到舊的組字區物件個數
					var which_word = get_Which_Word(auto_start,"head");
					if (check_over_three){
						if (del_tail_flag){																			// 如果在第一詞正前方出現第四詞
							pinyin_record.splice(auto_pointer[0], auto_words_num);// 把舊的全部移除
							auto_letter.pop();
							auto_pinyin.pop();
						}
						else
							pinyin_record.splice(auto_pointer[1], auto_words_num);// 若超過三詞，則從第二字詞開始刪
					}
					else
						pinyin_record.splice(auto_pointer[0], auto_words_num);	// 把舊的全部移除
					auto_pointer = [];
					for(var i = 0; i < pinyin_objs.length; i++){							// 更新組字區
						pinyin_record.splice(which_word, 0, pinyin_objs[i]);		// 把新的塞進去
						auto_pointer[i] = which_word;
						which_word++;
					}   
					if (check_over_three && del_tail_flag) 
						auto_pointer.pop();
					for(var i = 0; i < auto_pointer.length; i++){
						console.log("auto_pointer[" + i + "] = " + auto_pointer[i]);
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
		},"json");
	}

	function search_correspond(key,word){
		$.post('search_correspond.php',{KEY:key,WORD:word},function(data){
			if (data == ""){
				correspond_flag = false;
			}
			else{
				if (data[0] == 1)
					correspond_flag = true;
				else
					correspond_flag = false;
			}
		},'json');
	}

	function setWord(){                                     // 把中文字打上去
		var textbox = $("#input");
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		input_word = remove_tags(input_word);                 // 取得純文字
		var left = input_word.substring(0,input_loc);
		var right = input_word.substring(input_loc,input_word.length);
		var word_length = 0;
		var which_word = get_Which_Word(input_loc,"head");

		if (sel_mode == 0){
			if (mode == 3){     // 修正模式
				var former_word = pinyin_record[which_word].word;		// 先抓到此區中的字詞
				var start_loc = input_loc - pinyin_record[which_word].start_loc;	// 從游標位置分割出後端的字詞
				former_word = former_word.substring(start_loc,former_word.length);
				var insert_word = "";
				var select_index = 0;	// 用來抓取正確的search_key
				if (keyin == 48 || keyin == 96){
					insert_word = candidate_letter[9 + (currentPage - 1) * 10];
					select_index = 9 + (currentPage - 1) * 10;
				}
				else if (keyin >= 97){
					insert_word = candidate_letter[keyin - 97 + (currentPage - 1) * 10];
					select_index = keyin - 97 + (currentPage - 1) * 10;
				}
				else if (keyin >= 49){
					insert_word = candidate_letter[keyin - 49 + (currentPage - 1) * 10];
					select_index = keyin - 49 + (currentPage - 1) * 10;
				}
				word_length = insert_word.length;

				if (mod_pinyin_record.length != 0){				// 如果是可分割的拼音，不可分的則略過
					var which_pinyin = "";
					for(var i = 0; i < mod_pinyin_record.length; i++){
						if (select_index >= mod_pinyin_record[i].start_index && select_index < mod_pinyin_record[i].end_index)
							which_pinyin = mod_pinyin_record[i].pinyin;
					}
					search_key = which_pinyin;
				}

				if (former_word == insert_word){								// 如果更改之後的字跟原本一樣，則跳過
					var text = "";
					for(var i = 0; i < pinyin_record.length; i++){
						if (pinyin_record[i].modifiable == 2)
							text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
						else
							text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
					}          
					textbox.html(text);
					search_key = "";                                            // 清空buffer
					mode = 0;
					$("#show, #show_flat").html("");
					caption_effect();
					prompt_txtbox.val("選字成功!");
					prompt_flat_txtbox.val("選字成功!");
					input_loc += word_length;                                   // 調整下一次的輸入位置
					return;
				}
				else{
					var replace_end = input_loc + word_length;
					if (pinyin_record[which_word].modifiable == 1)
						replace_end = input_loc + pinyin_record[which_word].word.length;
					var split_loc = replace_end;
					var syllables = getSyllable(search_key);
					if (word_length > syllables)
						split_loc = input_loc + syllables;
					
					right = input_word.substring(split_loc,input_word.length);            
					input_word = left + insert_word + right;
					var obj = "";
					if (getSyllable(search_key) == word_length){                // 如果音節數=字數
						$.ajaxSettings.async = false;
						search_correspond(search_key,insert_word);              	// 檢查拼音是否與字依序相符
						$.ajaxSettings.async = true;
						if (correspond_flag)                                    
							obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 0);   // 是則可修改
						else
							obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 1);   // 不是則只能在前方修改
					}
					else
						obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 1);     // 音節數!=字數，只能在最前方修改
					$.ajaxSettings.async = false;
					addRecord(obj,input_loc);
					$.ajaxSettings.async = true;
					var text = "";
					for(var i = 0; i < pinyin_record.length; i++){
						if (pinyin_record[i].modifiable == 2)
							text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
						else
							text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
					}         
					textbox.html(text);
					input_len = input_word.length;                              // 調整成功字數
					search_key = "";                                            // 清空buffer
					mode = 0;
				}
			}
			else if (mode == 2){     // 關聯詞模式  
				var insert_word = "";               
				if (keyin == 48 || keyin == 96)
					insert_word = candidate_letter[9 + (currentPage - 1) * 10];
				else if (keyin >= 97)
					insert_word = candidate_letter[keyin - 97 + (currentPage - 1) * 10];
				else if (keyin >= 49)
					insert_word = candidate_letter[keyin - 49 + (currentPage - 1) * 10];
				input_word = left + insert_word + right;
				word_length = insert_word.length;
							
				var obj = new pinyin_obj("", insert_word, input_loc, input_loc + word_length, 2);
				addRecord(obj,input_loc);   
				var text = "";
				for(var i = 0; i < pinyin_record.length; i++){
					if (pinyin_record[i].modifiable == 2)
						text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
					else
						text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
				}         
				textbox.html(text);
				input_len = input_word.length                               	// 調整成功字數                                 
				prefix_key = "";                                            	// 清空buffer
				mode = 0;   
			}
			else if (mode == 1){     // 自選模式
				var insert_word = "";
				if (keyin == 48 || keyin == 96)
					insert_word = candidate_letter[9 + (currentPage - 1) * 10];
				else if (keyin >= 97)
					insert_word = candidate_letter[keyin - 97 + (currentPage - 1) * 10];
				else if (keyin >= 49)
					insert_word = candidate_letter[keyin - 49 + (currentPage - 1) * 10];
				input_word = left + insert_word + right;
				word_length = insert_word.length;
				prefix_key = insert_word;
				
				var obj = "";
				if (punctuation_search_flag){
					obj = new pinyin_obj("", insert_word, input_loc, input_loc + word_length, 2);   // 是則可修改
					prefix_key = "";
				}
				else{
					if (getSyllable(search_key) == word_length){              	// 如果音節數=字數
						$.ajaxSettings.async = false;
						search_correspond(search_key,insert_word);              	// 檢查拼音是否與字依序相符
						$.ajaxSettings.async = true;
						if (correspond_flag)                                    
							obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 0);   // 是則可修改
						else
							obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 1);   // 不是則只能在前方修改
					}
					else
						obj = new pinyin_obj(search_key, insert_word, input_loc, input_loc + word_length, 1);     // 音節數!=字數，只能在最前方修改
				}
				$.ajaxSettings.async = false;
				addRecord(obj,input_loc);
				$.ajaxSettings.async = true;
				var text = "";
				for(var i = 0; i < pinyin_record.length; i++){
					if (pinyin_record[i].modifiable == 2)
						text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
					else
						text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
				}
				textbox.html(text);
				input_len = input_word.length;                              // 調整成功字數
				search_key = "";                                            // 清空buffer
				if (!punctuation_search_flag)																// 檢查是否為標點符號輸入
					mode = 2;
				else{
					mode = 0;
					if (insert_word.length > 1) input_loc--;									// 如果是成對標點符號，將輸入位置調整到中間
				}
				punctuation_search_flag = false;
			}
			input_loc += word_length;                                     // 調整下一次的輸入位置
		}
		else if (sel_mode == 1){
			if (mode == 2){
				var text = "";
				input_word = "";
				for(var i = 0; i < pinyin_record.length; i++){
					if (pinyin_record[i].modifiable == 2)
						text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
					else
						text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
					input_word += pinyin_record[i].word;
				}
				textbox.html(text);
			}
			input_loc += candidate_letter[0].length;
		}
		$("#show, #show_flat").html("");
		caption_effect();
		prompt_txtbox.val("選字成功!");
		prompt_flat_txtbox.val("選字成功!");
		
	}     

	function deleteWord(keyCode){                                   // 處理選字後的刪除事件，不包含search_key的增減
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input"); 
		var text = textbox.html();
		text = remove_tags(text);             

		if (keyCode == 8){                                            // backspace鍵刪除
			if (mode == 0 && search_key == ""){                         // 單純選字成功後的階段
				if (tow_check == false){                                  // 如果是一字一字刪除
					var text = textbox.html();
					var temp_input_len = input_len;
					text = remove_tags(text);
					input_word = text;                                      // 下一次輸入框中的字將由當前textbox之值接續
					console.log("input_word: " + input_word);
					//auto_static_word = input_word;
					input_len = input_word.length;                          // 調整記錄輸入成功的中文字數
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox); // 得到下一次的輸入位置   
					//auto_start = get_auto_start();
					var delete_word_flag = true;

					if (temp_input_len == 0){                               // 原本就沒字
						return;
					}
					else if (input_len == temp_input_len)                   // 刪除後字數沒變動，代表只是拼音被刪除
						delete_word_flag = false;
					else if (delete_word_flag && pinyin_record.length == 1 && pinyin_record[0].word.length == 1){   // 最後一個字
						//console.log("all clean");
						pinyin_record = [];
					}   
					else if (delete_word_flag && pinyin_record.length > 1 || pinyin_record[0].word.length > 1){     // 不是最後一個字
						console.log("input_loc: " + input_loc);
						var which_word = get_Which_Word(input_loc + 1,"tail");      // 先抓到是哪個字被刪
						console.log("which_word: " + which_word);
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
							$.ajaxSettings.async = false;
							rearrange_objs(key,word,which_word,1,0);
							$.ajaxSettings.async = true;
						}
						else{
							$.ajaxSettings.async = false;
							rearrange_objs("","",which_word,0,0);
							$.ajaxSettings.async = true;
						}   
						var text = "";
						for(var i = 0; i < pinyin_record.length; i++){
							if (pinyin_record[i].modifiable == 2)
								text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
							else
								text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
						}
						textbox.html(text);
						textbox.setCursorPosition(input_loc);
						modify_obj_loc(which_word,0,0);
					}      				                  
				}
			} 
			/**************************************************************************************************/
			/*if (sel_mode == 1 && mode == 2){                                // 智能模式
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
			}
			if (search_key != "" && (getCaretCharacterOffsetWithin(DOM_textbox) < input_loc)){ // 在拼音時，移動到左邊界並刪除中文字時的狀態
				var left = text.substring(0,getCaretCharacterOffsetWithin(DOM_textbox));
				var right = text.substring(getCaretCharacterOffsetWithin(DOM_textbox) + search_key.length,text.length);
				input_word = left + right;                          
				input_len = input_word.length;                              // 調整記錄輸入成功的中文字數
				input_loc = getCaretCharacterOffsetWithin(DOM_textbox);     // 得到下一次的輸入位置
			}*/
			return;
		}
		if (keyCode == 46){                                                 // delete
			if (mode == 0 && search_key == ""){                             // 單純選字成功後的階段
				if (tow_check == false){                                    // 如果是一字一字刪除
					var text = textbox.html();
					var temp_input_len = input_len;
					text = remove_tags(text);
					input_word = text;                                      // 下一次輸入框中的字將由當前textbox之值接續
					//auto_static_word = input_word;
					input_len = input_word.length;                          // 調整記錄輸入成功的中文字數
					input_loc = getCaretCharacterOffsetWithin(DOM_textbox); // 得到下一次的輸入位置   
					// auto_start = get_auto_start();
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
						var which_word = get_Which_Word(input_loc,"head");      // 先抓到是哪個字被刪
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
							$.ajaxSettings.async = false;
							rearrange_objs(key,word,which_word,1,0);
							$.ajaxSettings.async = true;
						}
						else{
							$.ajaxSettings.async = false;
							rearrange_objs("","",which_word,0,0);
							$.ajaxSettings.async = true;
						}   
						var text = "";
						for(var i = 0; i < pinyin_record.length; i++){
							if (pinyin_record[i].modifiable == 2)
								text += '<span class="in_pinyin_window cannotMod">' + pinyin_record[i].word + '</span>';
							else
								text += '<span class="in_pinyin_window">' + pinyin_record[i].word + '</span>';
						}
						textbox.html(text);
						textbox.setCursorPosition(input_loc);
					}      				                  
				}
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

	function get_auto_start(){
		if (auto_pointer.length > 0)
			return pinyin_record[auto_pointer[0]].start_loc;
		else
			return input_loc;
	}

	function rearrange_objs(key,word,index,del_flag,after_flag){    // 刪字或是字區被分割時，會將該字詞區剩下的拼音重新分配
		if (key != ""){                                             // 如果刪除前該字區超過一個音節，就會需要回傳去分割
			var key_arr = key.split("");
			if (key_arr[0] == key_arr[0].toUpperCase()){			// 如果是音首、英文、縮寫模式
				var pinyin_objs = [];
				var word_arr = word.split("");
				var temp_index = index;
				var temp_loc = 0;
				try{
					temp_loc = pinyin_record[index].start_loc;
				}
				catch(err){                                     // 如果index所指到的位置未存在obj就稍後新增，把前一個的end_loc拿來用
					temp_loc = pinyin_record[index - 1].end_loc;
				}
				var start_loc = temp_loc;
				var end_loc = temp_loc + 1;
				obj = new pinyin_obj(key, word_arr[0], start_loc, end_loc, 2);
				pinyin_objs.push(obj);                      		// 插入到物件陣列裡

				for(var i = 1; i < word_arr.length; i++){
					start_loc = end_loc;
					end_loc = start_loc + 1;
					obj = new pinyin_obj("", word_arr[i], start_loc, end_loc, 2);
					pinyin_objs.push(obj);                      	// 插入到物件陣列裡
				}
				for(var i = 0; i < pinyin_objs.length; i++){
					if (i == 0)
						pinyin_record.splice(temp_index, 1, pinyin_objs[i]);
					else
						pinyin_record.splice(temp_index, 0, pinyin_objs[i]);
					record_last_index = temp_index;
					temp_index++;
				}
			}
			else{
				$.post('pinyin_split.php',{THE_KEY:key},function(data){
					if (data == ""){
					}
					else{
						var key_num = Object.keys(data).length; 
						var key_len = getSyllable(key);
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
						if (key_len > word_num){
							var word_piece = word;
							if (index > 0)
								start_loc = pinyin_record[index - 1].end_loc;
							end_loc = start_loc + word_num;
							obj = new pinyin_obj("", word_piece, start_loc, end_loc, 2);
							pinyin_objs.push(obj);                      	// 插入到物件陣列裡
						}
						else{
							for(var i = 0; i < key_num; i++){
								var pinyin_piece = data[i];                 // 被切出來的拼音
								var syllable = getSyllable(pinyin_piece);   // 計算該拼音的音節，以便將原本區域間的字分割正確
								var word_piece = word.substring(j,j + syllable);
								word_num -= word_piece.length;
								start_loc = j + temp_loc;
								end_loc = j + temp_loc + syllable;
								var obj = "";
								$.ajaxSettings.async = false;
								search_correspond(pinyin_piece,word_piece); // 檢查拼音是否與字依序相符
								$.ajaxSettings.async = true;
								if (correspond_flag)                            
									obj = new pinyin_obj(pinyin_piece, word_piece, start_loc, end_loc, 0);
								else
									obj = new pinyin_obj(pinyin_piece, word_piece, start_loc, end_loc, 2);
								j += syllable;
								pinyin_objs.push(obj);
							}
							if (word_num > 0){                              // 如果字數超過音節數
								var word_piece = word.substring((word.length - word_num),word.length);  // 則把剩下來的字併為一詞
								start_loc = end_loc;
								end_loc = start_loc + word_num;
								obj = new pinyin_obj("", word_piece, start_loc, end_loc, 2);
								pinyin_objs.push(obj);                      	// 插入到物件陣列裡
							}
						}      
						for(var i = 0; i < pinyin_objs.length; i++){
							if (i == 0){
								if (del_flag)
									pinyin_record.splice(temp_index, 1, pinyin_objs[i]);                                
								else
									pinyin_record.splice(temp_index, 0, pinyin_objs[i]);
							}
							else
								pinyin_record.splice(temp_index, 0, pinyin_objs[i]);
							record_last_index = temp_index;						
							temp_index++;
						}        
						$.ajaxSettings.async = false;       
						modify_obj_loc(index, 0, after_flag);
						$.ajaxSettings.async = true;
					}
				},"json");
			}
		}
		else if (key == "" && word == ""){              // 只剩一單字（先調整，後刪除）
			modify_obj_loc(index + 1, 1, 0);            // 先將會被刪除的字區後方的所有字區先調整位置
			pinyin_record.splice(index, 1);             // 再把該字詞刪除
		}
		else if (key == "" && word != ""){              // 沒有拼音的詞
			try{
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
			modify_obj_loc(index, 0, 0);
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
		var temp_index = index;
		if (all_del == 0){                                  	// 如果字區內還有字
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
					if (i <= index)                         				// 因為字區還有字，所以從該字區之後才進行修正
						continue;
					else{
						pinyin_record[i].start_loc = pinyin_record[temp_index].end_loc;
						pinyin_record[i].end_loc = pinyin_record[i].start_loc + pinyin_record[i].word.length;
						temp_index++;
					}
				}
			}
		}
		else if (all_del == 1){                        			 	// 如果該字區已經消失（全部被刪除了）
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
					else{                               						// 而後修正索引讓後方字區的位置都正確
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

	function pinyin_obj(pinyin,word,start_loc,end_loc,modify_flag){
		this.pinyin = pinyin;
		this.word =  word;
		this.start_loc = start_loc;
		this.end_loc = end_loc;
		this.modifiable = modify_flag;
	}

	function modify_record_obj(pinyin,start_index,end_index){
		this.pinyin = pinyin;
		this.start_index = start_index;
		this.end_index = end_index;
	}

	function addRecord(pinyin_obj,loc){                     	// 將pinyin物件加到pinyin_record陣列中  
		if (pinyin_record.length > 0 && (loc == pinyin_record[pinyin_record.length - 1].end_loc)){  // 最末端打字，直接push
			pinyin_record.push(pinyin_obj);
		}
		else if (loc == 0){     // 最前端操作
			if (mode == 3){
				var which_word = get_Which_Word(loc,"head");        // 先找到loc是在第幾個字區
				var former_word = pinyin_record[which_word].word;
				var former_pinyin = pinyin_record[which_word].pinyin;
				var new_word = pinyin_obj.word;
				var new_pinyin = pinyin_obj.pinyin;
				if (new_word.length == former_word.length && getSyllable(new_pinyin) == getSyllable(former_pinyin))
					pinyin_record.splice(0,1,pinyin_obj);
				else{
					var key_syllable = getSyllable(new_pinyin);
					var split_loc = 0;
					if (pinyin_record[which_word].modifiable == 1)
						split_loc = former_word.length;
					else
						split_loc = key_syllable;

					var pinyin_left = "";
					var pinyin_right = "";
					var word_left = former_word.substring(0,split_loc);
					var word_right = former_word.substring(split_loc,former_word.length);

					var j = 0;
					if (pinyin_record[which_word].modifiable == 1 || (pinyin_record[which_word].modifiable == 0 && getSyllable(former_pinyin) == 1)){
						pinyin_left = new_pinyin;
						pinyin_obj.pinyin = pinyin_left;
						pinyin_record.splice(which_word,1,pinyin_obj);
					}
					else{
						for(var i = 0; i < former_pinyin.length; i++){
							if (former_pinyin[i] == " ") 
								j++;
							if (j == key_syllable){         
								var temp_loc = i;        
								pinyin_left = former_pinyin.substring(0,temp_loc);
								pinyin_right = former_pinyin.substring(temp_loc + 1,former_pinyin.length);
								pinyin_left = pinyin_left.trim();
								pinyin_right = pinyin_right.trim();
								break;
							}
						}
						pinyin_obj.pinyin = pinyin_left;
						pinyin_record.splice(which_word,1,pinyin_obj);
						$.ajaxSettings.async = false;
						rearrange_objs(pinyin_right, word_right, which_word + 1, 0, 0);
						$.ajaxSettings.async = true;
					}		
				}
			}
			else
				pinyin_record.unshift(pinyin_obj);
			$.ajaxSettings.async = false;
			modify_obj_loc(0, 0, 0);
			$.ajaxSettings.async = true;
		}
		else{                   // 中間情形，得細分是在各字區首尾還是會造成字區被切割
			var which_word = get_Which_Word(loc,"head");        // 先找到loc是在第幾個字區
			var former_word = pinyin_record[which_word].word;
			var former_pinyin = pinyin_record[which_word].pinyin;
			var new_word = pinyin_obj.word;
			var new_pinyin = pinyin_obj.pinyin;
			if (loc == pinyin_record[which_word].start_loc){    // 在某字區起始位置
				if (mode == 3){
					if (new_word.length == former_word.length && getSyllable(new_pinyin) == getSyllable(former_pinyin))
						pinyin_record.splice(which_word,1,pinyin_obj);
					else{
						var key_syllable = getSyllable(new_pinyin);
						
						var split_loc = 0;
						if (pinyin_record[which_word].modifiable == 1)
							split_loc = former_word.length;
						else
							split_loc = key_syllable;

						var pinyin_left = "";
						var pinyin_right = "";
						var word_left = former_word.substring(0,split_loc);
						var word_right = former_word.substring(split_loc,former_word.length);

						var j = 0;
						if (pinyin_record[which_word].modifiable == 1 || (pinyin_record[which_word].modifiable == 0 && getSyllable(former_pinyin) == 1))
							pinyin_record.splice(which_word,1,pinyin_obj);
						else{
							for(var i = 0; i < former_pinyin.length; i++){
								if (former_pinyin[i] == " ") 
									j++;
								if (j == key_syllable){         
									var temp_loc = i;        
									pinyin_left = former_pinyin.substring(0,temp_loc);
									pinyin_right = former_pinyin.substring(temp_loc + 1,former_pinyin.length);
									pinyin_left = pinyin_left.trim();
									pinyin_right = pinyin_right.trim();
									break;
								}
							}
							pinyin_obj.pinyin = pinyin_left;
							pinyin_record.splice(which_word,1,pinyin_obj);
							$.ajaxSettings.async = false;
							rearrange_objs(pinyin_right, word_right, which_word + 1, 0, 0);
							$.ajaxSettings.async = true;
						}		
					}
				}
				else
					pinyin_record.splice(which_word,0,pinyin_obj);

				$.ajaxSettings.async = false;
				modify_obj_loc(which_word, 0, 0);
				$.ajaxSettings.async = true;
			}
			else if (loc < pinyin_record[which_word].end_loc && loc > pinyin_record[which_word].start_loc){ // 在字區中間			
				var start_loc = loc - pinyin_record[which_word].start_loc;
				var end_loc = pinyin_record[which_word].end_loc - pinyin_record[which_word].start_loc;
				var key_syllable = getSyllable(new_pinyin);
				var word_left = former_word.substring(0,start_loc);
				var word_right = former_word.substring(start_loc,end_loc);
				var pinyin_left = "";
				var pinyin_right = "";

				if (mode == 3){
					var pre_pinyin = "";
					var pre_word = former_word.substring(0,start_loc);
					console.log("pre_word: " + pre_word);
					word_left = former_word.substring(start_loc,start_loc + key_syllable);
					word_right = former_word.substring(start_loc + key_syllable,end_loc);
					former_word = word_left + word_right;

					console.log("start_loc: " + start_loc);
					var j = 0;
					for(var i = 0; i < former_pinyin.length; i++){
						if (former_pinyin[i] == " ") 
							j++;
						if (j == start_loc){   
							var temp_loc = i;      
							pre_pinyin = former_pinyin.substring(0,temp_loc);
							former_pinyin = former_pinyin.substring(temp_loc + 1,former_pinyin.length);
							pre_pinyin = pre_pinyin.trim();
							former_pinyin = former_pinyin.trim();
							console.log("former_pinyin: " + former_pinyin);
							if (getSyllable(former_pinyin) == 1){
								pinyin_left = former_pinyin;
								pinyin_right = "";
								break;
							}
							else{
								j = 0;
								for(var k = 0; k < former_pinyin.length; k++){
									if (former_pinyin[k] == " ") 
										j++;
									if (j == key_syllable){   
										var temp_loc = k;      
										pinyin_left = former_pinyin.substring(0,temp_loc);
										pinyin_right = former_pinyin.substring(temp_loc + 1,former_pinyin.length);
										pinyin_left = pinyin_left.trim();
										pinyin_right = pinyin_right.trim();
										break;
									}       							
								}
								break;
							}
						}       							
					}				
					
					pinyin_obj.pinyin = pinyin_left;
					$.ajaxSettings.async = false;
					rearrange_objs(pre_pinyin, pre_word, which_word, 1, 0);
					$.ajaxSettings.async = true;
					pinyin_record.splice(record_last_index + 1, 0, pinyin_obj);
					if (word_right != ""){
						$.ajaxSettings.async = false;
						rearrange_objs(pinyin_right, word_right, record_last_index + 2, 0, 1);
						$.ajaxSettings.async = true;
					}
					modify_obj_loc(which_word, 0, 0);
				}
				else{
					var syllable = getSyllable(former_pinyin);
					start_loc = pinyin_record[which_word].start_loc;
					var temp_loc = loc - start_loc;

					if (former_pinyin != ""){                       // 沒有拼音的字詞則略過拼音分割
						if (temp_loc > syllable){                  // 字詞的位置超過拼音
							pinyin_left = former_pinyin;
						}
						else{
							var j = 0;
							for(var i = 0; i < former_pinyin.length; i++){
								if (former_pinyin[i] == " ") 
									j++;
								if (j == temp_loc){         
									var split_loc = i;          
									pinyin_left = former_pinyin.substring(0,split_loc);
									pinyin_right = former_pinyin.substring(split_loc + 1,former_pinyin.length);
									pinyin_left = pinyin_left.trim();
									pinyin_right = pinyin_right.trim();
									break;
								}
							}
						}
					}

					$.ajaxSettings.async = false;
					rearrange_objs(pinyin_left, word_left, which_word, 1, 0);
					$.ajaxSettings.async = true;
					pinyin_record.splice(record_last_index + 1, 0, pinyin_obj);
					$.ajaxSettings.async = false;
					rearrange_objs(pinyin_right, word_right, record_last_index + 2, 0, 1);
					$.ajaxSettings.async = true;
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
		if (pinyin_record.length > 0 && (this_loc == pinyin_record[pinyin_record.length - 1].end_loc))
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
		input_len = input_word.length;
		var temp_key_len = text.length - input_len;
		
		if (keyCode == 8){
			if (search_key.length == 1 && (now_loc == input_loc)){          // 當拼音只有一個，且游標正好在其右方
				search_key = "";
				associated_search_flag = false;
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
				var key_part = text;                                        	// textbox中值即是search_key
				var temp_loc = now_loc - 1;                                             
				search_key_loc = temp_loc;
				var left = key_part.substring(0,search_key_loc);
				var right = key_part.substring(search_key_loc,temp_key_len);
				search_key = left + right;
			}
			else{                                                           // 不是第一個字
				if (input_loc == 0){                                        	// 拼音插入在最前方
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
		var blanks = [' &nbsp; ',' &nbsp;','&nbsp;'];
		var blanks_num = blanks.length;
		for(var i = 0; i < blanks_num; i++){
			var the_blank = blanks[i];
			while (search_key.search(the_blank) >= 0){
				search_key = search_key.replace(the_blank," ");
			}
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
			'<span class="in_pinyin_window cannotMod">',
			'</span>',
			'</u>',
			'<u>',
			'<br>'
		];
		var after_text = text;
		if (after_text.search("<br>") == 0){
			after_text = after_text.replace("<br>","");
		}
		var tags_num = tags.length;
		for(var i = 0; i < tags_num; i++){
			var the_tag = tags[i];
			while (after_text.search(the_tag) >= 0){
				after_text = after_text.replace(the_tag,"");
			}
		}
		return after_text;
	}
		
	function getPage(){                                             // 得到回傳字的總頁數
		totalPage = parseInt(number_letters / 10);
		if (number_letters % 10 != 0) totalPage++;
	}

	/*function select_word(loc,start,end){
		var mainDiv = document.getElementById("input");
		var element = mainDiv.childNodes[0];
		var which_word = get_Which_Word(loc,"head");
		element = element.childNodes[which_word];
		var range = document.createRange();
		range.setStart(element, start); 
		range.setEnd(element, end); 
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}*/

	$.fn.setCursorPosition = function(pos){                         // 控制游標顯示位置   
		var DOM_textbox = document.getElementById("input");
		var range = document.createRange();          
		var sel = window.getSelection();
		var which_word = get_Which_Word(pos,"tail");
		var loc = pos - pinyin_record[which_word].start_loc;
		try{
			DOM_textbox = DOM_textbox.childNodes[which_word];
			DOM_textbox = DOM_textbox.childNodes[0];
			range.setStart(DOM_textbox, loc);                          
		}
		catch (err){                                                  // 自選模式，去除底線後的設定游標位置，此區塊直接針對各span設定其游標位置
			console.log("err_msg: " + err);
			if (sel_mode == 0){
				DOM_textbox = document.getElementById("input");
				DOM_textbox = DOM_textbox.childNodes[0];
				range.setStart(DOM_textbox, loc); 
			}  
		}
		range.collapse(true);
		sel.removeAllRanges();
		sel.addRange(range);
		$("#input").focus();          
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

	/*function replaceSelectedText(replacementText) {
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
	}*/

	function reachHead(){                                           // 已達首頁
		if (currentPage == 1) return true;
	}

	function reachTail(){                                           // 已達末頁
		if (currentPage == totalPage) return true;
	}

	function reachLeft(){                                           // 已達拼音左邊界
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var check = getCaretCharacterOffsetWithin(DOM_textbox);
		if (sel_mode == 0){
			if (input_loc == check) 
				return true;
		}
		else if (sel_mode == 1){             
			if (input_loc == check) 
				return true;
		}               
	}

	function reachRight(){                                          // 已達拼音右邊界
		var textbox = $("#input");
		var DOM_textbox = document.getElementById("input");
		var check = getCaretCharacterOffsetWithin(DOM_textbox);
		if (sel_mode == 0){
			if ((input_loc + search_key.length) == check) 
				return true;
		}
		if (sel_mode == 1){                                    
			if ((input_loc + search_key.length) == check) 
				return true;
		}
	}

	function isNumber(keyCode){                                     // 判斷鍵入的鍵盤值是否為數字
		if (keyCode >= 48 && keyCode <= 57) return true;
		if (keyCode >= 96 && keyCode <= 105) return true;
		return false;
	}


	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑與輸入法相關↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
	/*↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/

	/*function nav_to_white(){                                        // 讓上方的navbar的元素有白色跑馬燈特效
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
	}*/

	function nav_assign_white(element){                             // 把元素顏色變白色
		$(nav_arr[element]).css('color',"white");
		return element;
	}

	function nav_restore_color(element){                            // 讓上方的已變色的navigator元素變回原色的函式
		$(nav_arr[element]).css('color',nav_color[element]);
	}

	function caption_effect(){                                      // 字幕效果，讓提示欄的文字在1.5秒後消失
		var pause_timer = setInterval(function(){ 
			$("#prompt, #prompt_flat").val("");
			clearInterval(pause_timer); 
		},1500);
	}

	function change_theme(theme,initial_flag){
		var all_theme = ["black","pink","blue","xmas","green"];
		nav_assign_color(theme);
		customJqte.remove();
		customJqte_flat.remove();
		$("#jqte_place").append('<textarea id="jqte" readonly></textarea>');
		$("#jqte_place_flat").append('<textarea id="jqte_flat" readonly></textarea>');
		var jqte_theme = "jqte_" + theme;
		var jqte_flat_theme = "jqte_" + theme + "_flat";
		$("#jqte").jqte({css:jqte_theme});
		customJqte = $("." + jqte_theme);
		$("#jqte_flat").jqte({css:jqte_flat_theme});
		customJqte_flat = $("." + jqte_flat_theme);                  

		if (typeof(Storage) != "undefined"){                   
			localStorage.setItem("theme", theme); 
			var text = localStorage.getItem("text", text);						// 先把在localStorage中的text抓出來
			$(".jqte_" + theme + "_editor").html(text);
			$(".jqte_" + theme + "_flat_editor").html(text);
		}

		$(".jqte_" + theme + "_editor").change(function(){
			var jqte_text = $(this).html();
			localStorage.setItem("text", jqte_text); 
		});
		$(".jqte_" + theme + "_flat_editor").change(function(){
			var jqte_text = $(this).html();
			localStorage.setItem("text", jqte_text); 
		});

		for(var i = 0; i < all_theme.length; i++){
			document.getElementById("theme_" + all_theme[i]).disabled = true;
			if (theme == all_theme[i])
				document.getElementById("theme_" + theme).disabled = false;
		}	
		now_theme = theme;
		if (!initial_flag)
			$.fn.fullpage.moveTo(2, 1);
	}

	function nav_assign_color(theme){
		var nav_color = ["rgb(240, 160, 28)","#F87284","#F1EE8F","#8AE194","#5B81E9","rgb(171, 145, 249)"];
		var nav_arr_len = nav_arr.length;
		if (theme == "black"){
			static_color = "#fff";
			for(var i = 0; i < nav_arr_len; i++){
				$(nav_arr[i]).css('color',nav_color[i]);
				$(nav_arr[i]).on('mouseenter',function(){$(this).css('color',static_color);});
				(function(i){
			    $(nav_arr[i]).mouseleave(function(){$(this).css('color',nav_color[i]);});    
			  })(i);
			}
		}
		else if (theme == "pink"){
			static_color = "#fff";
			for(var i = 0; i < nav_arr_len; i++){
				$(nav_arr[i]).css('color',static_color);
				(function(i){
			    $(nav_arr[i]).mouseenter(function(){$(this).css('color',nav_color[i]);});    
			  })(i);
			  $(nav_arr[i]).mouseleave(function(){$(this).css('color',static_color);});  
			}
		}
		else if (theme == "blue"){
			static_color = "#fff";
			for(var i = 0; i < nav_arr_len; i++){
				$(nav_arr[i]).css('color',static_color);
				(function(i){
			    $(nav_arr[i]).mouseenter(function(){$(this).css('color',nav_color[i]);});    
			  })(i);
			  $(nav_arr[i]).mouseleave(function(){$(this).css('color',static_color);});
			}
		}
		else if (theme == "xmas"){
			static_color = "#fff";
			for(var i = 0; i < nav_arr_len; i++){
				$(nav_arr[i]).css('color',static_color);
				(function(i){
			    $(nav_arr[i]).mouseenter(function(){$(this).css('color',nav_color[i]);});    
			  })(i);
			  $(nav_arr[i]).mouseleave(function(){$(this).css('color',static_color);});
			}
		} 
		else if (theme == "green"){
			static_color = "rgb(71, 125, 210)";
			for(var i = 0; i < nav_arr_len; i++){
				$(nav_arr[i]).css('color',static_color);
				(function(i){
			    $(nav_arr[i]).mouseenter(function(){$(this).css('color',nav_color[i]);});    
			  })(i);
			  $(nav_arr[i]).mouseleave(function(){$(this).css('color',static_color);});
			}
		}
	}

	/***********************************************************************提示按鈕相關***********************************************************************/
	function generate_prompt_btn(height){                           // 產生開啟提示、關閉提示按鈕
		$("#hide_btn").delay('500').fadeIn();
		generate_open();
		generate_close();
	}

	function generate_open(){                                       // 讓"開啟提示"的button有其功能
		$("#open_prompt").click(function(){
			if ($("#prompt_flat").is(":hidden")){
				var textbox = $("#input");
				var prompt_txtbox = $("#prompt");
				//qrcode_toleft();
				var check_popup_hide = ispopup_hidden();
				if (!check_popup_hide){																	  // 已經彈出popup時，則不需要再開啟
				}
				else{
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'left center'
					}).popup('hide');
									
					$("#select_mode").popup({
						content: '這是選擇不同輸入模式的滑動選單',
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
											
					$("#clear").popup({
						content: '這是清除按鈕，按下後將把輸入框清空',
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
					
					customJqte.attr('data-variation','large');
					customJqte.attr('data-offset',35);
					customJqte.popup({
						content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
						position: 'left center'
					}).popup('hide');

					$("#search_pinyin").popup({
						content: '這是反向查詢區，不會拼音的中文字可在這查拼音',
						position: 'bottom center'
					}).popup('hide');	
				}
			}
			else{
				$("#input").popup({
					content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
					position: 'top center'
				}).popup('hide');
								
				$("#prompt_flat").popup({
					content: '這是簡易提示欄，成功或失敗操作時會有提示',
					position: 'right center'
				}).popup('hide');
																					
				$("#show_flat").popup({
					content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
					position: 'top center'
				}).popup('hide');
				
				customJqte_flat.popup({
					content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
					position: 'left center'
				}).popup('hide');

				$("#search_pinyin").popup({
					content: '這是反向查詢區，不會拼音的中文字可在這查拼音',
					position: 'bottom center'
				}).popup('show');
			}
			$("#prompt, #prompt_flat").val("提示功能已開啟!");
			caption_effect();
		});
	}

	function generate_close(){                                          // 讓"關閉提示"的button有其功能
		$("#close_prompt").click(function(){
			$("#input").popup('hide');
			$("#select_mode").popup('hide');
			$("#prompt, #prompt_flat").popup('hide');
			$("#copy").popup('hide');
			$("#clear").popup('hide');
			$("#cut").popup('hide');
			$("#show, #show_flat").popup('hide');
			customJqte.popup('hide');
			customJqte_flat.popup('hide');
			$("#search_pinyin").popup('hide');
			var pause_timer = setInterval(function(){

				$("#input").popup('destroy');
				$("#select_mode").popup('destroy');
				$("#prompt, #prompt_flat").popup('destroy');
				$("#copy").popup('destroy');
				$("#clear").popup('destroy');
				$("#cut").popup('destroy');
				$("#show, #show_flat").popup('destroy');
				customJqte.popup('destroy');
				customJqte_flat.popup('destroy');
				$("#search_pinyin").popup('destroy');
				$("#prompt, #prompt_flat").val("提示功能已關閉!");
				caption_effect();
				clearInterval(pause_timer);
			},100);
		});
	}

	function ispopup_hidden(){                                         // 判斷畫面上是否還有存在的popup
		var pop_arr = ["#input","#select_mode","#prompt","#copy","#clear","#cut","#show","#search_pinyin"];
		var check = false;
		var temp = $("#input").popup('is hidden');
		for(var i = 0; i < pop_arr.length; i++){
			if ($(pop_arr[i]).popup('is hidden')){
				check = true;
			}
			else{
				check = false;
				break;
			}
		}
		if (!check)
			return check;
		else if (check && customJqte.popup('is hidden'))
			check = true;
		else
			check = false;
		return check;
	}

	function ispopup_flat_hidden(){                                    // 判斷手機畫面上是否還有存在的popup
		var pop_arr = ["#input","#prompt_flat","#show_flat","#search_pinyin"];
		var check = false;
		for(var i = 0; i < pop_arr.length; i++){
			if ($(pop_arr[i]).popup('is hidden'))
				check = true;
			else{
				check = false;
				break;
			}
		}
		if (!check)
			return check;
		else if (check && customJqte_flat.popup('is hidden'))
			check = true;
		else
			check = false;
		return check;
	}
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓會員資料驗證↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
	/*↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/        

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

	function getTutorial(){
		$.getJSON('tutorial.json',function(data){
			var json_len = data.length;
			var content = "";
			for(var i = 0; i < json_len; i++){
				var consonant = data[i].consonant;
				var vowel_arr = data[i].vowel;
				var vowel_arr_len = vowel_arr.length;
				var exp = "<tr>";
				exp += '<td style="color: #FD529A; font-weight: bold">' + consonant + '<i class="arrow right icon hidden-xs" style="float: right; margin-top: 2px"></i><i class="arrow down icon visible-xs" style="float: right"></i></td>';
				for(var j = 0; j < vowel_arr_len; j++){
					var the_vowel = vowel_arr[j].sound;
					var word_arr = vowel_arr[j].word;
					var word_arr_len = word_arr.length;
					var the_sound = consonant.toUpperCase() + the_vowel.toUpperCase();
					if (the_vowel == "－")
						the_sound = consonant.toUpperCase();
					$('<audio id="sound_' + the_sound + '"><source src="./tutorial_sound/' + the_sound + '-MingShingYu-20060622.wav" type="audio/wav"></audio>').appendTo('body');
					exp += '<td><span style="color: #E78AD0">' + consonant + "</span>" + the_vowel + '<a href="javascript: play_sound(\'' + the_sound + '\');"><i class="large volume down icon" style="float: right"></i></a></td>';
					exp += "<td>";
					for(var k = 0; k < word_arr_len; k++){
						if (k == (word_arr_len - 1))
							exp += word_arr[k];
						else
							exp += word_arr[k] + ", ";
					}
					exp += "</td>";

				}
				exp += "</tr>";
				content += exp;
			}
			$("#json_table, #json_table_flat").html(content);
		});
	}

	function play_sound(sound){
		$("#sound_" + sound)[0].play();
	}

	function google(){
		var str = remove_tags($('#input').html());
		if (str == ""){
			$("#prompt, #prompt_flat").val("搜尋字串不能為空白!");
			caption_effect();
		}
		else{
			var false_punctutations = ["℃", "℉", "㎏", "㎎", "㎜", "㎝", "㎡", "㏄", "㏎"];
			var true_punctutaions = ["°C","°F","kg","mg","mm","cm","m^2","cc","km"];
			var arr_len = false_punctutations.length;
			for(var i = 0; i < arr_len; i++){
				var false_punc = false_punctutations[i];
				var true_punc = true_punctutaions[i];
				while (str.search(false_punc) >= 0){
					str = str.replace(false_punc,true_punc);
				}
			}
			str = "https://www.google.com.tw/webhp?sourceid=chrome-instant&ion=1&espv=2&es_th=1&ie=UTF-8#q=" + str;
			var replaced_url = str.replace(" ","+");
			window.open(replaced_url);
		}
	}

	function set_default(){
		//$(document).jSnow();
		$(window).on('load', function(e){                               // 讓從FB導回來的頁面沒有'#_=_' 
			if (window.location.hash == '#_=_') { 
				window.location.hash = '';                              // for older browsers, leaves a # behind 
				history.pushState('', document.title, window.location.pathname); // nice and clean 
				e.preventDefault(); // no page reload 
			}  
		});

		$("#hide_btn").hide();
		$("#hide_panel").hide();
		$('<audio id="chatAudio"><source src="error.mp3" type="audio/mpeg"></audio>').appendTo('body');  

		$('#fullpage').fullpage({
			anchors:['home', 'pinyin_IME', 'about', 'tutorial', 'contact'],
			menu: '#menu',
			keyboardScrolling: false,
			//navigation: true,
			//navigationPosition: 'right',
			//navigationTooltips: ['HOME','輸入頁面','關於輸入法','拼音教學','聯絡我們'],
			slidesNavigation: true,
			scrollOverflow: true,
			css3: true
			//continuousVertical: true
		});

		$("#my_qrcode").click(function(){
			$(this).transition('tada');
		});
		$('.ui.dropdown').dropdown();                                   // 啟用dropdown元素   
		$('.ui.checkbox').checkbox();
		$("#search_pinyin").autocomplete({                              // 運用jquery UI的autocomplete來做到以中文反查拼音
			source: 'search_pinyin.php'
		});        
		$('.menu .item').tab();                 

		/*********************************設定主題背景相關********************************/
		var style = ["black","pink","blue","xmas","green"];
		var text = "";
		if (typeof(Storage) != "undefined") {                           // 先從localStorage取theme資料
			var data = localStorage.getItem("theme");
			text = localStorage.getItem("text");
			if (data != null){                                            // 如果storage中有資料
				now_theme = data;                                           // 則更改主題，若無則為預設的black
				for(var i = 0; i < style.length; i++){
					if (now_theme == style[i]) break;
				}
			}
		}
		var initial_style = "jqte_" + now_theme;
		var flat_initial_style = initial_style + "_flat";
		$("#jqte").jqte({css: initial_style});
		$("#jqte_flat").jqte({css: flat_initial_style});
		$(".jqte_" + now_theme + "_editor").html(text);
		$(".jqte_" + now_theme + "_flat_editor").html(text);

		customJqte = $("." + initial_style);
		customJqte_flat = $("." + flat_initial_style);   
		change_theme(now_theme,true);
		/*********************************設定主題背景相關********************************/  
		getTutorial();		// 產生教學頁面

		$('.trigger').click(function(e){
			e.preventDefault();
			$.fn.fullpage.moveSectionDown();
		});

		$('#index_title').click(function(){
			$('#index_title').transition('flash');
		});

		var DOM_textbox = document.getElementById("input");
		var input_page = document.getElementById("input_page");
		var DOM_back_search = document.getElementById("search_pinyin");

		var my_defaults = {
		  is_unordered    : true,
		  prevent_repeat  : true  
		};
		var listener = new window.keypress.Listener(DOM_textbox,my_defaults);
		var listener2 = new window.keypress.Listener(input_page,my_defaults);
		var listener3 = new window.keypress.Listener(DOM_back_search,my_defaults);
		listener.simple_combo("ctrl c", function(){
		  var text = remove_tags($("#input").html()); 
			if (text != ""){
				$("#prompt, #prompt_flat").val('已複製到右方編輯器!');
				var jqte_text = $(".jqte_" + now_theme + "_editor").html();
				$(".jqte_" + now_theme + "_editor").html(jqte_text + text);
				caption_effect();
				$("#input").setCursorPosition(input_loc);
			}
			else{
				$("#prompt, #prompt_flat").val('沒有內容可複製!');
				caption_effect();
				$("#input").focus();
			}				
		});
		listener.simple_combo("ctrl x",function(){
			var text = remove_tags($("#input").html()); 
			if (text != ""){
				$("#prompt, #prompt_flat").val('已剪下到右方編輯器!');
				input_word = "";
				pinyin_record = [];
				mode = 0;
				input_loc = 0;
				search_key = "";
				$("#input").html("");
				$("#show, #show_flat").html("");
				var jqte_text = $(".jqte_" + now_theme + "_editor").html();
				$(".jqte_" + now_theme + "_editor").html(jqte_text + text);
				caption_effect();
				$("#input").focus();
			}
			else{
				$("#prompt, #prompt_flat").val('沒有內容可剪下!');
				caption_effect();
				$("#input").focus();
			}
		});

		listener2.simple_combo("alt b",function(){
			$("#prompt").val('焦點移至反查拼音區');
			caption_effect();
			$("#search_pinyin").focus();
		});
		listener2.simple_combo("alt n",function(){
			$("#prompt").val('焦點移至中央拼音區');
			caption_effect();
			if ($("#input").html() != "")
				$("#input").focus().setCursorPosition(input_loc);
			else
				$("#input").focus();
		});
		listener2.simple_combo("alt m",function(){
			$("#prompt").val('焦點移至文字編輯區');
			caption_effect();
			$(".jqte_" + now_theme + "_editor").focus();
		});

		listener3.simple_combo("tab",function(){
			if ($("#input").html() != "")
				$("#input").focus().setCursorPosition(input_loc);
			else
				$("#input").focus();
		});
	}
