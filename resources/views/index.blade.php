<!DOCTYPE html>
<html lang="en">
	<head>
		<title>興大無聲調台語拼音輸入法</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="./jquery-ui-1.11.2/jquery-ui.css" rel="stylesheet">
		<link href="./bootstrap/css/bootstrap.css" rel="stylesheet">
		<!--<link href="./css/bootstrap-modal-bs3patch.css" rel="stylesheet">
		<link href="./css/bootstrap-modal.css" rel="stylesheet">-->
		<link href="./semantic/semantic.css" rel="stylesheet">
		<link href="./fullPage.js/jquery.fullPage.css" rel="stylesheet">
		<link href="./css/modify.css" rel="stylesheet">
		<link href="./css/theme-origin.css" rel="stylesheet" id="CSS1" disabled="disabled">
		<link href="./css/theme-pink.css" rel="stylesheet" id="CSS2" disabled="disabled">
		<link href="./css/theme-blue.css" rel="stylesheet" id="CSS3" disabled="disabled">
		<link href="./css/theme-xmas.css" rel="stylesheet" id="CSS4" disabled="disabled">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-origin.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-blue.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-pink.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-xmas.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-origin-flat.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-blue-flat.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-pink-flat.1.4.0.css" rel="stylesheet">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-xmas-flat.1.4.0.css" rel="stylesheet">
		<link href="./underlineJS/css/underline.css" rel="stylesheet">
		<link href="./ico/briefcase.ico" rel="shortcut icon">
		<script src="https://code.createjs.com/soundjs-0.6.0.min.js"></script>

		<style>
			.jqte_origin_editor, .jqte_blue_editor, .jqte_pink_editor, .jqte_xmas_editor, .jqte_source{
				min-height: 380px;
				max-height: 380px;
			}

			.jqte_origin_flat_editor, .jqte_blue_flat_editor, .jqte_pink_flat_editor, .jqte_xmas_flat_editor, .jqte_source{
				min-height: 180px;
				max-height: 180px;
			}

			.thumbnail_img { width: 60%; }

			#google_btn {
				width: 72px;
				height: 26px;
				margin-top: 12px;
				margin-left: -28px;
			}

			#google_btn_flat {
				width: 68px;
				height: 24px;
				margin: auto;
				margin-top: 7px;
			}

			.navbar-inverse .navbar-brand {
				font-size: 18px;
				font-weight: bold;
				color: #F6D5D5;
			}

			#input {
				border: ridge rgba(157, 157, 157, 0.5); 
				border-width: 1px;
				/*common*/
				background-color: #FFF;
				width: 100%;
				min-height: 32px;
				text-align: left;
				font-size: 18px; 
				padding-left: 5px;
				padding-top: 4px;
				-webkit-ime-mode: disabled;
				font-family: Arial, "文泉驛正黑", "WenQuanYi Zen Hei", "微軟正黑體", "Microsoft JhengHei", "標楷體", sans-serif;
			}

			#input[placeholder]:empty:focus:before {
				content: "";
			}

			#input[placeholder]:empty:before {
				content: attr(placeholder);
				color: #555; 
			}

			.in_pinyin_window {
				margin-left: 1.1px; 
				margin-right: 1.1px; 
				text-decoration: underline;
			}

			.cannotMod {
				margin-left: 0px; 
				margin-right: 0px; 
				text-decoration: none;
			}

			#message_board {
				background-color: rgba(255, 255, 255, 0.5);
				border-radius: 15px;
				padding: 10px;
				width: 100%;
			}

			#mes_comment {
				min-height: 100px; 
				min-width: 100%; 
				max-height: 100px;
				max-width: 100%;
				border-radius: 5px;
			}

			.myForm_body {
				margin-left: 8%;
				margin-right: 8%;	
			}
		</style>
	</head>

	<body>
		<div class="audio">
		    <audio id="audio00" src="./underlineJS/audio/cello_00.mp3" preload="auto"></audio>
		    <audio id="audio01" src="./underlineJS/audio/cello_01.mp3" preload="auto"></audio>
		    <audio id="audio02" src="./underlineJS/audio/cello_02.mp3" preload="auto"></audio>
		    <audio id="audio03" src="./underlineJS/audio/cello_03.mp3" preload="auto"></audio>
		    <audio id="audio04" src="./underlineJS/audio/cello_04.mp3" preload="auto"></audio>
		    <audio id="audio05" src="./underlineJS/audio/cello_05.mp3" preload="auto"></audio>
		    <audio id="audio06" src="./underlineJS/audio/cello_06.mp3" preload="auto"></audio>
		    <audio id="audio07" src="./underlineJS/audio/cello_07.mp3" preload="auto"></audio>
		    <audio id="audio08" src="./underlineJS/audio/cello_08.mp3" preload="auto"></audio>
		    <audio id="audio09" src="./underlineJS/audio/cello_09.mp3" preload="auto"></audio>
		    <audio id="audio10" src="./underlineJS/audio/cello_10.mp3" preload="auto"></audio>
		    <audio id="audio11" src="./underlineJS/audio/cello_11.mp3" preload="auto"></audio>
		    <audio id="audio12" src="./underlineJS/audio/cello_12.mp3" preload="auto"></audio>
		    <audio id="audio13" src="./underlineJS/audio/cello_13.mp3" preload="auto"></audio>
		    <audio id="audio14" src="./underlineJS/audio/cello_14.mp3" preload="auto"></audio>
		    <audio id="audio15" src="./underlineJS/audio/cello_15.mp3" preload="auto"></audio>
		    <audio id="audio16" src="./underlineJS/audio/cello_16.mp3" preload="auto"></audio>
		    <audio id="audio17" src="./underlineJS/audio/cello_17.mp3" preload="auto"></audio>
		    <audio id="audio18" src="./underlineJS/audio/cello_18.mp3" preload="auto"></audio>
		    <audio id="audio19" src="./underlineJS/audio/cello_19.mp3" preload="auto"></audio>
		</div>
		<nav role="navigation" class="navbar navbar-inverse navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
					<button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
						<span class="sr-only"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand visible-xs" id="prefix_title" href="#">興大無聲調台語輸入法</a>
				</div>
				<div id="navbarCollapse" class="collapse navbar-collapse">
					<ul class="nav navbar-nav" id="menu">
                        <li data-menuanchor="home"><a href="#home" id="nav_home"><span class="glyphicon glyphicon-home"></span> HOME</a></li>
                        @if (Auth::user())
                            <li><a href="{{ url('/auth/logout') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登出</a></li>
                        @else
                            <li><a href="{{ url('/auth/login') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登入/註冊</a></li>                 
                        @endif
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li>
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li>
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li>        
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li> 
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li>   
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li>   
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li> 
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li> 
                        <li class="hidden-xs">&emsp;&emsp;&emsp;</li> 
                        <li class="hidden-xs">&emsp;</li>                   
						<li data-menuanchor="pinyin_IME"><a href="#pinyin_IME" id="nav_input"><span class="glyphicon glyphicon-pencil"></span> 輸入頁面</a></li>
						<li data-menuanchor="about"><a href="#about" id="nav_about"><span class="glyphicon glyphicon-info-sign"></span> 關於輸入法</a></li>
						<li data-menuanchor="tutorial"><a href="#tutorial" id="nav_tutorial"><span class="glyphicon glyphicon-star"></span> 拼音教學</a></li>
						<li data-menuanchor="contact"><a href="#contact" id="nav_contact"><span class="glyphicon glyphicon-envelope"></span> 聯絡我們</a></li>
                    </ul>
				</div>
			</div>
		</nav>
		<br><br>

		<div id="fullpage">
			<div class="section active" id="section0">
				<div class="container">
					<div class="row">
						<div class="col-xs-12 col-sm-3 col-md-3">
							<div class="hidden-xs lab_qrcode" id="change_qr" style="text-align: left; margin-left: 28%">
								<img src="./images/pinyinQR.png" id="my_qrcode" onclick="change_pic()" width="160px" height="160px" style="margin-top: -13px"/>
							</div>
						</div>
						<div class="col-xs-12 col-sm-6 col-md-6" id="left" style="text-align: center">
							<p class="visible-xs"><br><br></p>
							<p class="text">
						    	<span class="hidden-xs underline" style="font-size: 80px">興大</span>
						    	<span class="hidden-xs underline" style="font-size: 80px">無聲調</span>						    	
							    <span class="visible-xs underline" style="font-size: 68px; margin-left: 69px; padding-right: 85px;">興大</span>
							    <span class="visible-xs underline" style="font-size: 68px; margin-left: 34px; padding-right: 52px;">無聲調</span>
							    <br>
							    <div class="hidden-xs" style="font-size: 38px">
							    	<span class="underline">台語</span>
									<span class="underline">拼音</span>
									<span class="underline">輸入法</span>
							    </div>
								<div class="visible-xs" style="font-size: 30px; margin-top: -12px">
							    	<span class="underline">台語</span>
									<span class="underline">拼音</span>
									<span class="underline">輸入法</span>
							    </div>
							</p>
							<div id="push" class="hidden-xs"></div>
							<div id="push" class="hidden-xs"></div>
							<div class="trigger"></div>
						</div>
						<div class="col-xs-12 col-sm-3 col-md-3">
							<!--<div class="jumbotron" id="public_message">
								<h3>系統公告</h3>
								<p style="text-align: right; font-size: 12px">4/15.2015</p>
								<div style="text-align: left">
									<div style="font-size: 14px">
										<p>● 智能模式開發中!</p>
										<p>● 手機介面請使用自選模式</p>
										<p>● 會員、聯絡系統已上線!</p>
									</div>
								</div>										
							</div>-->
						</div>
					</div>
				</div>
			</div>
			
			<div class="section" id="section1">
				<div class="container">
					<div class="row">
						<div class="col-xs-12 col-sm-4 col-md-4" id="left" style="text-align: center">
							<div class="hidden-xs" id="hide_panel"></div>    
							<div id="hide_btn" style="text-align: center">
								<div class="ui buttons" style="font-size: 14px">
									<div class="ui button" id="open_prompt" style="color: #FFF; background-color: #FFBABA">開啟提示</div>
									<div class="or"></div>
									<div class="ui button" id="close_prompt" style="color: #FFF; background-color: #AAD4FF">關閉提示</div>
								</div>
							</div>
							<br>
							<div class="panel panel-default" id="tutorial_panel" style="border-radius: 5px">
								<div class="panel-heading" style="background-color: #FAEFC4; font-size: 16px">初來乍到?</div>
								<div class="panel-body" style="background-color: #FFF; font-size: 12px">如果第一次使用，建議您點選按鈕進入簡易說明及教學</div>
								<div class="panel-footer clearfix" style="background-color: #FAEFC4">
									<div class="pull-right">
										<div class="btn btn-primary" id="GO" style="font-size: 10px">馬上出發!</div>
										<div class="btn btn-default" id="NO" style="font-size: 10px">下次再說!</div>
									</div>
								</div>
							</div>
							<div class="login_span">
								<br>
								<p id="login_status">
									您當前的身分是:
									<?php
										$url = "./auth/login";
										$name = "訪客";
										if (Auth::user()){
											$url = "./auth/logout";
											$name = Auth::user()->name; 
											$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $name . '</a>';
											echo $string;
											$control_btn = '<div class="ui buttons" style="font-size: 14px">';
											$control_btn .= '<div class="ui black basic button">更新資料</div>';
											$control_btn .=	'<a href="./user/' . $name . '" class="ui black basic button">管理辭庫</a>';
											$control_btn .= '</div>';
											echo $control_btn;
										}
										else{
											$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $name . '</a>';
											echo $string;
										}
									?>   
								</p>
								
								<br><br>
							</div>
							<div class="ui icon input">
								<input class="prompt" type="text" id="search_pinyin" placeholder="請輸入欲查詢拼音的中文" style="border-radius: 3px;" data-variation="large">
								<i class="search icon"></i>
							</div>					
							<br><br>								                                                                                                                                            
						</div>  
										
						<div class="col-xs-12 col-sm-4 col-md-4" id="Input_place">
							<div id="input" placeholder="請輸入英文拼音..." contenteditable="true" data-variation="large" onpaste="return false" ondragenter="return false" oncontextmenu="return false;" style="margin-top: 15px"></div>							
							<div class="col-xs-12 col-sm-2 col-md-2"></div>
							<div class="col-xs-12 col-sm-8 col-md-8">
								<div class="ui input hidden-xs">
									<div style="margin-top: 5px">
										<span style="font-size: 14px; color: #000">自選模式&nbsp;&nbsp;</span>
										<div class="ui slider checkbox" tabindex="0" id="select_mode" data-variation="large" style="margin-top: 13px">
										    <input type="checkbox">
										    <label></label>
										</div>
										<span style="font-size: 14px; color: #000">智能模式</span>
									</div>												
								</div>
								<!--<span id="google_btn_flat" class="ui blue button visible-xs" onclick="google();">google&nbsp;<i class="small search icon"></i></span>-->
								<a href="javascript: google();"><img src="./images/google_logo.png" class="visible-xs" id="google_btn_flat"></a>
							</div>		
							<div class="col-xs-12 col-sm-2 col-md-2">		
								<!--<span id="google_btn" class="ui icon blue button hidden-xs" onclick="google();">google<i class="small search icon"></i></span>-->
								<a href="javascript: google();"><img src="./images/google_logo.png" class="hidden-xs" id="google_btn"></a>
							</div>
							<br>
							<div class="ui input">
								<input type="text" class="hidden-xs" id="prompt" data-variation="large" style="margin-top: 3px; margin-left: -2px" readonly>
								<input type="text" class="visible-xs" id="prompt_flat" data-offset="-45" style="margin-top: 3px" readonly>
							</div>
							<div class="buttons hidden-xs" id="middle_btn" style="margin-top: 5px;">
								<div class="circular ui icon button" id="copy" data-variation="large" style="width: 65px; height: 35px; background-color: #7DFD8C">
									<i class="large copy icon" style="color: #000; margin-top: -2px"></i>
								</div>							
								<div class="circular ui icon button" id="undo" data-variation="large" style="width: 65px; height: 35px; background-color: #97F0FF">
									<i class="large undo icon" style="color: #000; margin-top: -2px"></i>
								</div>
								<div class="circular ui icon button" id="cut" data-variation="large" style="width: 65px; height: 35px; background-color: #FCF783">
									<i class="large cut icon" style="color: #000; margin-top: -3px"></i>
								</div>
							</div>
							<div class="buttons visible-xs" id="middle_btn_flat" style="margin-left: 8px; margin-top: 0px; margin-bottom: 5px">
								<div class="circular ui button" id="copy_flat" style="background-color: #7DFD8C">
									<i class="copy icon" style="padding-left: 4px; color: #000"></i>
								</div>
								&nbsp;&nbsp;&nbsp;
								<div class="circular ui button" id="undo_flat" style="background-color: #97F0FF">
									<i class="undo icon" style="padding-left: 4px; color: #000"></i>
								</div>
								&nbsp;&nbsp;&nbsp;
								<div class="circular ui button" id="cut_flat" style="background-color: #FCF783">
									<i class="cut icon" style="padding-left: 4px; color: #000"></i>
								</div>
								<br>
							</div>
							<div class="field hidden-xs">
								<textarea id="show" data-variation="large" onclick="false" readonly></textarea>  
							</div>
							<div class="fluid visible-xs">
								<textarea id="show_flat" data-variation="small" readonly></textarea>
								<br>
								<!--<div style="margin-left: 4px">
									<div class="ui left attached button" id="btn_previous" style="font-size: 10px; margin-bottom: 10px; padding-right: 15px; border-radius: 5px;">
										<i class="small arrow sign left icon"></i>上一頁
									</div>
									<div class="ui button" id="btn_initial" style="font-size: 10px; margin-bottom: 10px; border-radius: 5px;">首頁</div>
									<div class="right attached ui button" id="btn_next" style="font-size: 10px; margin-bottom: 10px; padding-left: 15px; border-radius: 5px;">
										下一頁<i class="small arrow sign right icon"></i>
									</div>
								</div>-->
							</div>
							<br>
						</div>
						<div class="col-xs-12 col-sm-4 col-md-4" id="right"> 
							<div class="fluid hidden-xs hidden-sm" id="jqte_place">
								<textarea id="jqte"></textarea>
							</div>
							<div class="fluid visible-xs visible-sm" id="jqte_place_flat">
								<textarea id="jqte_flat"></textarea>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="section" id="section2">
				<div class="slide" data-anchor="slide1">
					<div class="container">
						<div class="row">
							<div id="push"></div>
							<div class="col-sm-3 col-md-3 col-lg-3">															
							</div>
							<div class="col-sm-6 col-md-6 col-lg-6">
								<div class="jumbotron" id="public_intro">
									<div style="font-size: 16px">
										<p style="line-height: 1.8;">
											&emsp;&emsp;&nbsp;此網頁版輸入法是無需考慮聲調的多功能台語拼音輸入法。
											主體為台語拼音，兼容縮寫、音首以及英文輸入，是個比想像中還要__的輸入法。
										</p>
										<p style="line-height: 1.8;">
											本輸入法分為兩種模式 ── 「自選模式」及「智能模式」
											。前者類似常見的「ㄅ半輸入法」，後者則類似「新注音輸入法」，兩種模式皆支援改字。
										</p>
										<p style="line-height: 1.8;">
											頁面主題有多種配色主題可更換，讓您可以在賞心悅目的色彩中進行打字，點擊兩側箭頭即可瀏覽主題。
										</p>							
									</div>						
								</div>				
							</div>
							<div class="col-sm-3 col-md-3 col-lg-3"></div>
							<div id="push"></div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="slide2">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(1/4)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/origin.jpg" alt="img not found!">
								<div class="caption">
									<h3>簡約黑白</h3>
									<p><button class="btn btn-primary" class="change_theme_btn" role="button" onclick="change_theme('origin')">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="slide3">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(2/4)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/pink.jpg" alt="img not found!">
								<div class="caption">
									<h3>甜蜜粉紅</h3>
									<p><button class="btn btn-primary" class="change_theme_btn" role="button" onclick="change_theme('pink')">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="slide4">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(3/4)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/blue.jpg" alt="img not found!">
								<div class="caption">
									<h3>飄逸水藍</h3>
									<p><button class="btn btn-primary" class="change_theme_btn" role="button" onclick="change_theme('blue')">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="slide5">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(4/4)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/xmas.jpg" alt="img not found!">
								<div class="caption">
									<h3>耶誕佳節</h3>
									<p><button class="btn btn-primary" class="change_theme_btn" role="button" onclick="change_theme('xmas')">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="section" id="section3">
				<div class="container">
					<div class="row">
						<p>拼音教學</p>
					</div>
				</div>
			</div>

			<div class="section" id="section4">
				<div class="container">
					<div class="row" style="margin-bottom: -12px">
						<div class="col-xs-12 col-sm-3 col-md-3"></div>
						<div class="col-xs-12 col-sm-6 col-md-6">
							<div id="message_board">
								<br>
								<form method="post">
									<div class="ui form myForm_body">
										<div class="form-group" id="info_form_msg">
											<div class="field">
												<label><i class="smile icon"></i>姓名</label>
												<input type="text" class="form-control" name="mes_name" id="mes_name" onchange="CheckName()"
												placeholder="請輸入您的暱稱，方便我們回信，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->name; ?>">
												<span id="name_check_mes"></span>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="mail icon"></i>電子郵件</label>
													<input type="text" class="form-control" name="mes_email" id="mes_email" onchange="CheckEmail()"
													placeholder="請輸入您的常用信箱，回信將會寄往該信箱，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->email; ?>">
													<span id="email_check_mes"></span>
												</div>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="glyphicon glyphicon-leaf"></i> 主旨</label>
													<input type="text" class="form-control" name="mes_title" id="mes_title" onchange="CheckTitle()">
													<span id="title_check_mes"></span>
												</div>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="glyphicon glyphicon-comment"></i> 內容</label>
													<textarea id="mes_comment" name="mes_comment" aria-required="true" onchange="CheckComment()"></textarea>
													<span id="comment_check_mes"></span>
												</div>
											</div>
										</div>
									</div>
									<div class="myForm_footer" style="text-align: center">
										<input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
										<button type="submit" class="btn btn-primary" onclick="return CheckBeforeSubmit();">發送</button>
										<button class="btn btn-default" onclick="return truncateMessage();">重置</button>
									</div>
								</form>
							</div>
						</div>
						<div class="col-xs-12 col-sm-3 col-md-3"></div>
					</div>
					<div class="row">
						<div id="push"></div>
						<div id="push"></div>
					</div>
				</div>	
				
				<div id="footer" style="text-align: center">
					<p>
						<span class='st_facebook_hcount' displayText='Facebook'></span>
						<span class='st_twitter_hcount' displayText='Tweet'></span>
						<span class='st_googleplus_hcount' displayText='Google +'></span>
					</p>
					<p class="credit" style="color: #FFF; font-size: 14px; font-weight: bold; margin-bottom: -10px">
						中興大學資訊工程學系©2014
					</p>
				</div>	
			</div>
		</div>

		<script src="./js/jquery-1.11.1.js"></script>
		<script src="./js/pinyin_algorithm.js"></script>
		<script src="./jquery-ui-1.11.2/jquery-ui.js"></script>
		<script src="./bootstrap/js/bootstrap.js"></script>
		<script src="./semantic/semantic.js"></script>
		<script src="./fullPage.js/vendors/jquery.slimscroll.min.js"></script>
		<script src="./fullPage.js/jquery.fullPage.js"></script>
		<script src="./js/bootstrap-modal.js"></script>
		<script src="./js/bootstrap-modalmanager.js"></script>
		<script src="./jQuery-TE_v.1.4.0/jquery-te-1.4.0.js"></script>
		<script src="./js/jquery.zclip.js"></script>
		<script src="./js/buttons.js"></script>
		<!--<script src="./js/jsnow.js"></script>-->
		<script src="./js/checkmessage.js"></script>
		<script src="./underlineJS/js/classie.js"></script>
		<script src="./underlineJS/js/baseline-ratio.js"></script>
		<script src="./underlineJS/js/underline.js"></script>
		<script src="./underlineJS/js/guitar-string.js"></script>
		<script src="./underlineJS/js/single-underline.js"></script>
		<script src="./underlineJS/js/multiple-underline.js"></script>
		<!--<script src="./js/jquery-migrate-1.2.1.js"></script>-->
		<script>
			var switchTo5x=true;
			stLight.options({publisher: "a95bbd74-613c-4b46-a5b3-b1afcdde1318", doNotHash: false, doNotCopy: false, hashAddressBar: false});
		</script>
	</body>
</html>