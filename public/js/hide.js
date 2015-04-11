$(document).ready(function(){
	$("#hide_btn").hide();
	$("#hide_title_login").hide();
	$("#hide_login_form").hide();
	$("#hide_login_btn").hide();
	$("#hide_title_login_success").hide();
	$("#hide_title_login_fail").hide();
	$("#logout_btn").hide();
	
	$("#nav_login").click(function(){
		$("#myModal").modal('show');
		if ($("#prompt_flat").is(":hidden")){
			$("#myModal_content").css('margin-left','14%');
		}
		else{
			$("#myModal_content").css('margin-left','3%');
		}
	});
	
	$('.ui.dropdown').dropdown();								// 啟用dropdown元素
	nav_to_white();												// 讓畫面上方的nav元素開始隨機變白

	$("#btn_previous").click(function(){						// 在小螢幕模式時的"上一頁"按鈕
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		if (mode == 0){ 
			prompt_txtbox.val("現在還不能換頁!");
			prompt_flat_txtbox.val("現在還不能換頁!");
			caption_effect();
			return;
		}
		if (totalpage > 1){
			if (mode != 0 && reachHead() == true){				// 選字模式下，若翻頁已達首頁，則-號無效
				prompt_txtbox.val("已達首頁!");
				prompt_flat_txtbox.val("已達首頁!");
				caption_effect();
				return;
			}
			else{
				thispage--;										// 刷新頁數
				var temp_text_flat = "";
				var i = 0 + (10 * (thispage - 1));
				var counter = 0;
				var next_flag = false;
				while (i < number_letters && counter < 10){
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
					if (next_flag == true)
						temp_text_flat += " +:下頁";
					temp_text_flat += " -:上頁";
				}
				else
					temp_text_flat += " +:下頁";
				document.getElementById("show_flat").innerHTML = temp_text_flat;
			}
		}
		else	
			return;
	});
	
	$("#btn_next").click(function(){							// 在小螢幕模式時的"下一頁"按鈕
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		if (mode == 0){
			prompt_txtbox.val("現在還不能換頁!");
			prompt_flat_txtbox.val("現在還不能換頁!");
			caption_effect();
			return;
		}
		if (totalpage > 1){
			if (mode != 0 && reachTail() == true){       		// 選字模式下，若翻頁已達末頁，則+號無效
				prompt_txtbox.val("已達末頁!");
				prompt_flat_txtbox.val("已達末頁!");
				caption_effect();
				return;
			}
			else{
				thispage++;                            			// 刷新頁數
				var temp_text_flat = "";
				var i = 0 + (10 * (thispage - 1));
				var counter = 0;
				var next_flag = false;
				while (i < number_letters && counter < 10){
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
						if (next_flag == true)
							temp_text_flat += " +:下頁";
						temp_text_flat += " -:上頁";
					}
					else
						temp_text_flat += "-:上頁";
				document.getElementById("show_flat").innerHTML = temp_text_flat;
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
	
	$("#copy").zclip({
		path: './js/ZeroClipboard.swf',
		copy: function(){
				return $("#input").val();
		}
	}).click(function(){
		if ($("#input").val() != ""){
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
	
	$("#copy_flat").zclip({
		path: './js/ZeroClipboard.swf',
		copy: function(){return $("#input").val();}
	}).click(function(){
		if ($("#input").val() != ""){
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
	
	$("#cut").zclip({
		path: './js/ZeroClipboard.swf',
		copy: function(){return $("#input").val();}
	}).click(function(){
		if ($("#input").val() != ""){
			$("#input").val("");
			$("#prompt").val('已剪下到剪貼簿!');
			$("#prompt_flat").val('已剪下到剪貼簿!');
			mode = 0;
			document.getElementById("show").innerHTML = "";
			caption_effect();	
		}
		else{
			$("#prompt").val('沒有內容可剪下!');
			$("#prompt_flat").val('沒有內容可剪下!');
			caption_effect();		
		}
	});
	
	$("#cut_flat").zclip({
		path: './js/ZeroClipboard.swf',
		copy: function(){
				return $("#input").val();
		}
	}).click(function(){
		if ($("#input").val() != ""){
			$("#input").val("");
			$("#prompt").val('已剪下到剪貼簿!');
			$("#prompt_flat").val('已剪下到剪貼簿!');
			mode = 0;
			document.getElementById("show").innerHTML = "";
			caption_effect();	
		}
		else{
			$("#prompt").val('沒有內容可剪下!');
			$("#prompt_flat").val('沒有內容可剪下!');
			caption_effect();		
		}
	});
	
	$("#btn_initial").click(function(){
		if (mode != 0 && reachHead() == true){					// 選字模式下，若翻頁已達首頁，則-號無效
			prompt_txtbox.val("已達首頁!");
			prompt_flat_txtbox.val("已達首頁!");
			caption_effect();
			return;
		}
		thispage = 1;							// 刷新頁數引
		var temp_text = "";
		var temp_text_flat = "";
		var i = 0;
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
			document.getElementById("show").innerHTML = temp_text;
			document.getElementById("show_flat").innerHTML = temp_text_flat;
		}
	});
						
	$("#GO").click(function(){									// 教學啟用按鈕"馬上出發"的按下事件
		$("#tutor_panel").slideUp(700);
		$("#hide_push").height(50);
		document.getElementById("hide_br").innerHTML = "<br><br>";					

		if ($("#prompt_flat").is(":hidden")){
			var pause_timer = setInterval(function(){
				$('html,body').animate({scrollTop: $("#footer").offset().top},1500);
				clearInterval(pause_timer);
			},800);
			var pause0 = setInterval(function(){
				var pause1 = setInterval(function(){
					$(".qrcode_generate").animate({
						margin: '0 0'  
					},"fast");
					$("#input").popup({
						content: '這是輸入欄，請在此輸入台語的羅馬拼音並選字，例如:a, bbe, diong, ggu, uan...等等',
						position: 'left center'
					}).popup('show');
					var textbox = $("#input");
					var prompt_txtbox = $("#prompt");
					qrcode_toleft();
					clearInterval(pause1);
					var pause2 = setInterval(function(){
						if ($("#input").popup('is hidden')){
							$(".qrcode_generate").animate({
								margin: '0 25%'  
							},"fast");
						}
						$("#select_mode").popup({
							content: '這是選擇不同輸入模式的下拉式選單',
							position: 'left center'
						}).popup('show');
						clearInterval(pause2);
						var pause3 = setInterval(function(){
							$("#prompt").popup({
								content: '這是簡易提示欄，成功或失敗操作時會有提示',
								position: 'left center'
							}).popup('show');
							clearInterval(pause3);										
							var pause4 = setInterval(function(){
								$("#copy").popup({
									content: '這是複製按鈕，將輸入的文字複製到剪貼簿',
									position: 'left center'
								}).popup('show');
								clearInterval(pause4);
								var pause5 = setInterval(function(){
									$("#undo").popup({
										content: '這是復原按鈕，按下後將還原至上一步',
										position: 'bottom center'
									}).popup('show');
									clearInterval(pause5);
									var pause6 = setInterval(function(){
										$("#cut").popup({
											content: '這是剪下按鈕，將輸入的文字剪下到剪貼簿',
											position: 'right center'
										}).popup('show');
										clearInterval(pause6);
										var pause7 = setInterval(function(){
											$("#show").popup({
												content: '這是文字顯示區，符合拼音的字詞將顯示在裡面',
												position: 'right center'
											}).popup('show');
											clearInterval(pause7);
											var pause8 = setInterval(function(){
												$(".jqte_green").attr('data-variation','large');
												$(".jqte_green").attr('data-offset',35);
												$(".jqte_green").popup({
													content: '這是文字編輯器，可以將輸入完的字詞在此進行編輯',
													position: 'left center'
												}).popup('show');
												clearInterval(pause8);
												var pause9 = setInterval(function(){
													generate_prompt_btn();
													clearInterval(pause9);
												},1200);
											},1200);
										},1200);
									},1200);
								},1200);
							},1200);
						},1200);
					},1200);
				},1200);
				clearInterval(pause0);
			},300);
		}
		else{
			var pause_timer = setInterval(function(){
				$('html,body').animate({scrollTop: ($("#Input").offset().top - 150)},1500);
				clearInterval(pause_timer);
			},800);
			var pause0 = setInterval(function(){
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
													$("#reveal_prompt_btn").hide();
													generate_prompt_btn();
													clearInterval(pause9);
												},2000);
											},2000);
										},2000);
									},2000);
								},2000);
							},2000);
						},2000);
					},2000);
				},1000);
				clearInterval(pause0);
			},1000);
		}
	});
	
	$("#NO").click(function(){
		$("#tutor_panel").slideUp(700);
		$("#hide_push").height(50);
		document.getElementById("hide_br").innerHTML = "<br><br>";
		generate_prompt_btn();
		if ($("#prompt_flat").is(":hidden")){
			var pause_timer = setInterval(function(){
				$('html,body').animate({scrollTop: $("#Input").offset().top},1500);
				$("#reveal_prompt_btn").hide();
				clearInterval(pause_timer);
			},800);
		}
		else{
			var pause_timer = setInterval(function(){
				$('html,body').animate({scrollTop: ($("#Input").offset().top - 170)},1500);
				$("#reveal_prompt_btn").hide();
				clearInterval(pause_timer);
			},800);
		}
	});
	
	var form_elements = ["#email","#uid","#password","#password_confirm","#nickname"];
	var error_arr = ["#error_email","#error_prompt1","#error_prompt2","#error_prompt3","#error_prompt4"];
	
	$("#close_modal").click(function(){
		var all_blank = true;
		for (i = 0; i < form_elements.length ; i++){
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
				for (i = 0; i < form_elements.length ; i++){
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
				
	var head_arr = new Array("#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login");
	var head_color = new Array("#F87274","#F0A01C","#F1EE8F","#8AE194","#5B81E9");
	for (i = 0; i < head_arr.length; i++){
		 $(head_arr[i]).mouseenter(function(){$(this).css('color',"white");});
	}
	$(head_arr[0]).mouseleave(function(){
		$(this).css('color',head_color[0]);
	});
	$(head_arr[1]).mouseleave(function(){
		$(this).css('color',head_color[1]);
	});
	$(head_arr[2]).mouseleave(function(){
		$(this).css('color',head_color[2]);
	});
	$(head_arr[3]).mouseleave(function(){
		$(this).css('color',head_color[3]);
	});
	$(head_arr[4]).mouseleave(function(){
		$(this).css('color',head_color[4]);
	});
	
	$("#register").click(function(){
		var email = $("#email").val();
		var id = $("#uid").val();
		var pw = $("#password").val();
		var pw_confirm = $("#password_confirm").val();
		var name = $("#nickname").val();

		var check0 = false;
		var check1 = false;
		var check2 = false;
		var check3 = false;
		check_email();
		check0 = email_flag;		
		check1 = (check_id()) ? true : false;
		check2 = (check_pw()) ? true : false;
		check3 = (check_nickname()) ? true : false;
		check = (check0 && check1 && check2 && check3) ? true : false;
		
		if (check){
			$.post('./Member_Log/register.php',{id:id, pw:pw, pw2:pw_confirm, email:email, nickname:name},function(data){
				var check = data[0];
				if (check == "success"){
					$("#info_form").slideUp(600);
					$("#register_close_btn").fadeOut("slow");
					var form_elements = ["#email","#uid","#password","#password_confirm","#nickname"];
					var error_arr = ["#error_email","#error_prompt1","#error_prompt2","#error_prompt3","#error_prompt4"];
					document.getElementById("hide_welcome").innerHTML = "註冊成功!\n您現在可以馬上登入!";
					for (i = 0; i < form_elements.length ; i++){
						 $(form_elements[i]).val("");
						 $(error_arr[i]).hide();
					}
				}
			},"json");
		}
		else	
			return;
	});
	
	$("#show_login_form").click(function(){
		clear_modal(2);
		$("#hide_welcome").hide();
		$("#close_modal2").click(function(){
			$("#myModal").modal('hide');
			clear_modal(1);				
		});
		
		$("#login_btn").click(function(){
			var login_id = $("#login_uid").val();
			var login_pw = $("#login_password").val();
			var error_login1 = $("#error_login_prompt1");
			var error_login2 = $("#error_login_prompt2");
			
			if (login_id == "" || login_pw == ""){
				if (login_id == ""){
					document.getElementById("error_login_prompt1").innerHTML = "<i class='remove sign icon'></i>" + "請輸入帳號!";
					error_login1.show();
					error_login1.css("color","red");
				}
				if (login_pw == ""){
					document.getElementById("error_login_prompt2").innerHTML = "<i class='remove sign icon'></i>" + "請輸入密碼!";
					error_login2.show();
					error_login2.css("color","red");						
				}
			}
			else{						
				$.post('./Member_Log/login.php',{id:login_id, pw:login_pw},function(data){
					var check = data[0];
					var nickname = data[1];
					if (check == "success"){
						$("#hide_title_login").hide();
						$("#hide_title_login_success").show();
						$("#hide_login_btn").hide();
						$("#hide_login_form").hide();
						document.getElementById("hide_login_welcome").innerHTML = "此視窗將在3秒後自動關閉";
						$("#hide_login_welcome").show();
						var pause_timer = setInterval(function(){
							document.getElementById("hide_login_welcome").innerHTML = "";
							$("#hide_login_welcome").hide();
							$("#hide_title_login_success").hide();
							clear_modal(1);
							$("#before_login").hide();
							$("#logout_btn").show();
							$("#myModal").modal('hide');
							clearInterval(pause_timer);
						},3000);
						document.getElementById("login_status").innerHTML = "歡迎您回來";
						document.getElementById("login_person").innerHTML = nickname;
						$("#logout_btn").click(function(){
							$.post("Member_Log/logout.php",function(data){
								alert("成功登出!");
								$("#before_login").show();
								$("#logout_btn").hide();
								document.getElementById("login_status").innerHTML = "您當前的身分是: ";
								document.getElementById("login_person").innerHTML = "訪客";
							});											
						});
					}
					else{
						$("#hide_title_login").hide();
						$("#hide_title_login_fail").show();
						$("#hide_login_btn").hide();
						$("#hide_login_form").hide();
						document.getElementById("hide_login_welcome").innerHTML = "此視窗將在3秒後返回登入畫面";
						$("#hide_login_welcome").show();
						var pause_timer = setInterval(function(){
							$("#hide_title_login_fail").hide();
							$("#hide_login_form").show();
							$("#hide_title_login").show();
							$("#hide_login_btn").show();
							document.getElementById("hide_login_welcome").innerHTML = "";
							$("#hide_login_welcome").hide();
							clearInterval(pause_timer);
						},3000);
					}
				},"json");
			}
		});
		$("#login_cancel_btn").click(function(){
			clear_modal(1);					
		});
	});
});

function prompt_mode(){
	if (sel_mode_flag == true){
		var drop_text = $("#select_mode").dropdown('get text');
		var prompt_txtbox = $("#prompt");
		var prompt_flat_txtbox = $("#prompt_flat");
		sel_mode = get_sel_mode(drop_text);
		if (sel_mode == 0){
			prompt_txtbox.val("已切換至自選模式!");
			prompt_flat_txtbox.val("已切換至自選模式!");
		}
		if (sel_mode == 1){
			prompt_txtbox.val("已切換至智能模式!");
			prompt_flat_txtbox.val("已切換至自選模式!");
		}
		if (sel_mode == 2){
			prompt_txtbox.val("已切換至英數模式!");
			prompt_flat_txtbox.val("已切換至自選模式!");
		}
		caption_effect();
		console.log(sel_mode);
		sel_mode_flag = false;
	}
	else
		sel_mode_flag = true;
}

function nav_to_white(){										// 讓上方的navigator的隨機元素變換成其對應固定色彩的函式
	var head_arr = new Array("#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login");
	var head_color = new Array("#F87274","#F0A01C","#F1EE8F","#8AE194","#5B81E9");
	for (i = 0 ; i < head_arr.length; i++){
		$(head_arr[i]).css('color',head_color[i]);
	}
	setInterval(function(){
		if (light_index >= 5) light_index = 0;					
		nav_assign_white(light_index);		
		var pause_timer = setInterval(function(){
			back_color(light_index);
			light_index++;
			clearInterval(pause_timer);							
		},1180);
	},1200);
}

function nav_assign_white(element){								// 該元素顏色是固定的
	var head_arr = new Array("#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login");
	$(head_arr[element]).css('color',"white");
}

function back_color(element){									// 讓上方的已變色的navigator元素變回原色的函式
	var head_arr = new Array("#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login");
	var head_color = new Array("#F87274","#F0A01C","#F1EE8F","#8AE194","#5B81E9");
	$(head_arr[element]).css('color',head_color[element]);
}

function caption_effect(){										// 字幕效果，讓提示欄的文字在1.5秒後消失
	var pause_timer = setInterval(function(){ 
		$("#prompt").val("");
		$("#prompt_flat").val("");
		clearInterval(pause_timer);	
	},1500);
}

function contructer_undo_record(index,mode,len,duplicate_val,word,loc,key){		// undo_record 物件的建構子
	this.index = index;
	this.mode = mode;
	this.len = len;
	this.duplicate_val = duplicate_val;
	this.word = word;
	this.loc = loc;
	this.key = key;
}

function push_undo_record(){									// 新增undo_record，並push到堆疊中
	var copy = $("#input").val();
	var undo_record = new contructer_undo_record(undo_index,mode,input_len,copy,input_word,input_loc,search_key);
	undo_stack.push(undo_record);
	undo_index++;
}

function push_before_selected(){								// 新增undo_record，並push到堆疊中
	var copy = input_copy;
	var undo_record = new contructer_undo_record(undo_index,mode,input_len,copy,input_word,input_loc,search_key);
	undo_stack.push(undo_record);
	undo_index++;
}

function pop_undo_record(){										// 將堆疊頂端的undo_record，pop出來
	if (undo_stack[0] != null)
		undo_stack.pop();
}

function get_record(){											// 得到undo_record
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
		textbox.val(undo_record.duplicate_val);
		textbox.setCursorPosition(input_loc);
		if (search_key != ""){									// 如果紀錄中有可搜尋的拼音，那就去找字，關聯詞暫時無視
			search_char_mysql(search_key);
		}
		else{													// 沒有就清空選字區
			document.getElementById("show").innerHTML = "";
			document.getElementById("show_flat").innerHTML = "";
		}
		pop_undo_record();										// pop出一個舊紀錄
	}
	else{														// 當stack中已無元素，則無法再復原了
		prompt_txtbox.val("已達復原步驟上限!");
		prompt_flat_txtbox.val("已達復原步驟上限!");
		caption_effect();
	}
}

function generate_prompt_btn(){
	$("#hide_btn").fadeIn();
	generate_open();
	generate_close();
}

function generate_open(){
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
				
				$(".jqte_green").popup({
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

function generate_close(){
	$("#close_prompt").click(function(){
		if ($("#prompt_flat").is(":hidden")){
			$("#input").popup('hide');
			$("#select_mode").popup('hide');
			$("#prompt").popup('hide');
			$("#copy").popup('hide');
			$("#undo").popup('hide');
			$("#cut").popup('hide');
			$("#show").popup('hide');
			$(".jqte_green").popup('hide');
			$(".qrcode_generate").animate({
				margin: '0 35%',
			});
			var pause_timer = setInterval(function(){
				$("body").undelegate("#input","mouseenter");
				$("body").undelegate("#input","mouseleave");
				$("body").undelegate("#prompt","mouseenter");
				$("body").undelegate("#prompt","mouseleave");
				$("#input").popup('destroy');
				$("#select_mode").popup('destroy');
				$("#prompt").popup('destroy');
				$("#copy").popup('destroy');
				$("#undo").popup('destroy');
				$("#cut").popup('destroy');
				$("#show").popup('destroy');
				$(".jqte_green").popup('destroy');
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

function ispopup_visible(){	
	if ($("#input").popup('is visible') || $("#select_mode").popup('is visible') || $("#prompt").popup('is visible') || $("#copy").popup('is visible') ||
		$("#undo").popup('is visible') || $("#cut").popup('is visible') || $("#show").popup('is visible') || $(".jqte_green").popup('is visible')){
		return true;
	}
	else
		return false;
}

function ispopup_flat_visible(){	
	if ($("#input").popup('is visible') || $("#select_mode_flat").popup('is visible') || $("#prompt_flat").popup('is visible') || $("#copy_flat").popup('is visible') ||
		$("#undo_flat").popup('is visible') || $("#cut_flat").popup('is visible') || $("#show_flat").popup('is visible') || $(".jqte_green").popup('is visible')){
		return true;
	}
	else
		return false;
}

function check_email(callback){										// 檢查使用者輸入的email是否能用
	var email = $("#email").val();
	var error0 = $("#error_email");
	if (email == ""){
		document.getElementById("error_email").innerHTML = "<i class='remove circle icon'></i>" + "請輸入email!";
		error0.show();
		error0.css("color","red");
		console.log("here");
		return false;
	}
	else{				
		$.post('check_email.php',{Email:email},function(data){
			var test = data[0];
			if (test == "true"){
				document.getElementById("error_email").innerHTML = "<i class='ok circle icon'></i>" + "此email可以使用!";
				error0.show();
				error0.css("color","#000");
				email_flag = true;
			}
			else{
				document.getElementById("error_email").innerHTML = "<i class='remove sign icon'></i>" + "請確認您的email!";
				error0.show();
				error0.css("color","red");
			}	
		},"json");				
	}
}

function check_id(){											// 檢查使用者輸入的id是否能用
	var id = $("#uid").val();
	var error1 = $("#error_prompt1");
	var error2 = $("#error_prompt2");
	var error3 = $("#error_prompt3");
	if (id == ""){
		document.getElementById("error_prompt1").innerHTML = "<i class='remove sign icon'></i>" + "請輸入帳號!";
		error1.show();
		error1.css("color","red");
		return false;
	}
	else{
		var invalid_symbol = [" ", "~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "+", "[", "]", "{", "}", "\\", "|", ";", ":", "'", "<", ">", ",", ".", "/", "?"];
		var which_symbol = "";
		for (i = 0; i < invalid_symbol.length ; i++){
			if (id.indexOf(invalid_symbol[i]) != -1){
				document.getElementById("error_prompt1").innerHTML = "<i class='remove sign icon'></i>" + "帳號名稱不能含有 \"" + invalid_symbol[i] + "\" 字元!";
				error1.show();
				error1.css("color","red");
				return false;
			}
		}
		if (id.length < 6){
			document.getElementById("error_prompt1").innerHTML = "<i class='remove sign icon'></i>" + "帳號長度不可少於6個字元!";
			error1.show();
			error1.css("color","red");
			return false;
		}
		if (id.slice(0,1) == "_"){
			document.getElementById("error_prompt1").innerHTML = "<i class='remove sign icon'></i>" + "帳號名稱開頭必須是英文!";
			error1.show();
			error1.css("color","red");
			return false;
		}	
		document.getElementById("error_prompt1").innerHTML = "<i class='ok circle icon'></i>" + "此帳號可以使用!";
		error1.show();
		error1.css("color","#000");		
		return true;
	}
}

function check_pw(){											// 檢查使用者輸入的password是否正確
	var pw = $("#password").val();
	var pw_confirm = $("#password_confirm").val();
	var error1 = $("#error_prompt1");
	var error2 = $("#error_prompt2");
	var error3 = $("#error_prompt3");
	
	if (pw == ""){
		document.getElementById("error_prompt2").innerHTML = "<i class='remove sign icon'></i>" + "請輸入密碼!";
		error2.show();
		error2.css("color","red");
		return false;
	}
	else if (pw_confirm != "" && pw != pw_confirm){
			 document.getElementById("error_prompt3").innerHTML = "<i class='remove sign icon'></i>" + "密碼不一致!";
			 error3.show();
			 error3.css("color","red");
			 return false;
		 }		
	
	if (pw == pw_confirm){
		document.getElementById("error_prompt3").innerHTML = "<i class='ok circle icon'></i>" + "確認密碼正確!";
		error3.show();
		error3.css("color","#000");
		return true;
	}
}

function check_nickname(){
	var name = $("#nickname").val();
	var error4 = $("#error_prompt4");
	if (name == ""){
		document.getElementById("error_prompt4").innerHTML = "<i class='remove sign icon'></i>" + "請輸入暱稱!";
		error4.show();
		error4.css("color","red");
		return false;
	}
	else if (name == "訪客"){
			 document.getElementById("error_prompt4").innerHTML = "<i class='remove sign icon'></i>" + "暱稱不能為訪客!";
			 error4.show();
			 error4.css("color","red");
			 return false;
		 }
		 else{
			 var invalid_symbol = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "+", "[", "]", "{", "}", "\\", "|", ";", ":", "'", "<", ">", ",", ".", "/", "?"];
			 var which_symbol = "";
			 for (i = 0; i < invalid_symbol.length; i++){
				 if (name.indexOf(invalid_symbol[i]) != -1){
					 document.getElementById("error_prompt4").innerHTML = "<i class='remove sign icon'></i>" + "暱稱不能含有 \"" + invalid_symbol[i] + "\" 字元!";
					 error4.show();
					 error4.css("color","red");
					 return false;
				 }
			 }
			 document.getElementById("error_prompt4").innerHTML = "<i class='ok sign icon'></i>" + "此暱稱可以使用!";
			 error4.show();
			 error4.css("color","#000");
			 return true;
		 }
}

function clear_modal(select_modal){
	if (select_modal == 1){
		$("#origin_title").show();
		$("#hide_title_login").hide();
		$("#hide_login_form").hide();
		$("#info_form").show();
		$("#register_close_btn").show();
		$("#before_login").show();
		$("#hide_login_btn").hide();
		
	}		
	if (select_modal == 2){
		$("#origin_title").hide();
		$("#hide_title_login").show();
		$("#hide_login_form").show();
		$("#info_form").hide();
		$("#register_close_btn").hide();
		$("#before_login").hide();
		$("#hide_login_btn").show();
	}
	if (select_modal == 3){
	
	
	}
}

function qrcode_toleft(){
	$("body").delegate("#input",'mouseenter',function(){
		if ($("#input").popup('is hidden') && $("#prompt").popup('is visible')){
			if (prompt_mouseleave_flag){
				$(".qrcode_generate").animate({
					margin: '0 0'  
				},"fast");	
			}
			else{
				$(".qrcode_generate").animate({
					margin: '0 0'  
				},"fast");					
			}
		}
		else if ($("#input").popup('is hidden') && $("#prompt").popup('is hidden')){
				 $(".qrcode_generate").animate({
					 margin: '0 0'  
				 },"fast");
			 }
	});
	$("body").delegate("#input",'mouseleave',function(){
		if ($("#input").popup('is hidden')){
			$(".qrcode_generate").animate({
				margin: '0 35%'  
			},"fast");
		}
		if ($("#input").popup('is visible') && $("#prompt").popup('is visible')){
			if (prompt_mouseleave_flag){
				$(".qrcode_generate").animate({
					margin: '0 35%'  
				},"fast");
				prompt_mouseleave_flag = false;
			}
			else{
				$(".qrcode_generate").animate({
					margin: '0 25%'  
				},"fast");
			}
		}
		if ($("#input").popup('is visible') && $("#prompt").popup('is hidden')){
			$(".qrcode_generate").animate({
				margin: '0 35%'  
			},"fast");
		}
		input_mouseleave_flag = true;
	});
	
	$("body").delegate("#prompt",'mouseenter',function(){
		if ($("#prompt").popup('is hidden') && $("#input").popup('is hidden')){
			$(".qrcode_generate").animate({
				margin: '0 25%'  
			},"fast");
		}
		else if ($("#prompt").popup('is hidden') && $("#input").popup('is visible')){
				 if (input_mouseleave_flag){
					 $(".qrcode_generate").animate({
						 margin: '0 25%'  
					 },"fast");
				 }
				 else{
					 $(".qrcode_generate").animate({
						 margin: '0 0'  
					 },"fast");
				 }
			 }
			 else if ($("#prompt").popup('is visible') && $("#input").popup('is visible')){	  
					  $(".qrcode_generate").animate({
						  margin: '0 0'  
					  },"fast");
				  }
	});
	$("body").delegate("#prompt",'mouseleave',function(){
		if ($("#prompt").popup('is visible') && $("#input").popup('is visible')){
			if (input_mouseleave_flag){
				$(".qrcode_generate").animate({
					margin: '0 35%'  
				},"fast");
				input_mouseleave_flag = false;
			}
			else{
				$(".qrcode_generate").animate({
					margin: '0 0'  
				},"fast");
			}
		}
		else if ($("#prompt").popup('is visible') && $("#input").popup('is hidden')){
				 $(".qrcode_generate").animate({
					 margin: '0 35%'  
				 },"fast");
			 }
			 else if ($("#prompt").popup('is hidden')){
					  $(".qrcode_generate").animate({
						  margin: '0 35%'  
					  },"fast");
				  }
		prompt_mouseleave_flag = true;
	});
}