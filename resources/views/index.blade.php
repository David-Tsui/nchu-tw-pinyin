<?php
	session_start();
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>興大台語輸入法</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="./pace/pace.js"></script>
		<link href="./pace/themes/black/pace-theme-center-circle.css" rel="stylesheet" />
		<link href="./jquery-ui-1.11.2/jquery-ui.min.css" rel="stylesheet">
		<link href="./bootstrap/css/bootstrap.min.css" rel="stylesheet">
		<link href="./semantic/semantic.css" rel="stylesheet">
		<link href="./fullPage.js/jquery.fullPage.css" rel="stylesheet">
		<link href="./css/modify.css" rel="stylesheet">
		<link href="./css/theme_black.css" rel="stylesheet" id="theme_black">
		<link href="./css/theme_pink.css" rel="stylesheet" id="theme_pink">
		<link href="./css/theme_blue.css" rel="stylesheet" id="theme_blue">
		<link href="./css/theme_xmas.css" rel="stylesheet" id="theme_xmas">
		<link href="./css/theme_green.css" rel="stylesheet" id="theme_green">
		<link href="./jQuery-TE_v.1.4.0/jquery-te-custom.1.4.0.min.css" rel="stylesheet">
		<link href="./ico/briefcase.ico" rel="shortcut icon">
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
			<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
    <style>
			.jqte_black_editor, .jqte_blue_editor, .jqte_pink_editor, .jqte_xmas_editor, .jqte_green_editor, .jqte_source{
				min-height: 365px;
				max-height: 365px;
			}

			.jqte_black_flat_editor, .jqte_blue_flat_editor, .jqte_pink_flat_editor, .jqte_xmas_flat_editor, .jqte_green_flat_editor, .jqte_source{
				min-height: 180px;
				max-height: 180px;
			}
    </style>
	</head>

	<body>
		<nav role="navigation" class="navbar navbar-inverse navbar-fixed-top">
			<div class="container">
				<div class="navbar-header">
					<button type="button" data-target="#navbarCollapse" data-toggle="collapse" class="navbar-toggle">
						<span class="sr-only"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand visible-xs" id="prefix_title" href="#">興大台語輸入法</a>
				</div>
				<div id="navbarCollapse" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
            @if (Auth::user())
              <?php 
          			$myname =  Auth::user()->name; 
								$dbexp = "select `id` from `users` where `name` = '" . $myname . "'";
								$result = DB::select($dbexp);
								$myid = $result[0]->id;
          			$_SESSION['myid'] = $myid;
              ?>
            <li><a href="{{ url('/auth/logout') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登出</a></li>
            @else
            <?php
            	session_unset();
            	session_destroy();
            ?>
            <li><a href="{{ url('/auth/login') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登入/註冊</a></li>                 
            @endif
          </ul>
          <ul class="nav navbar-nav navbar-right" id="menu">        	      
            <li data-menuanchor="home"><a href="#home" id="nav_home"><span class="glyphicon glyphicon-home"></span> HOME</a></li>
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
								<img src="./images/pinyinQR.png" alt="img not found!" id="my_qrcode" onclick="change_pic()" style="margin-top: -13px; width: 160px; height: 160px"/>
							</div>
						</div>
						<div class="col-xs-12 col-sm-6 col-md-6" style="text-align: center">
							<div class="push"></div>
							<div id="index_title" class="hidden-xs">
								<br>
					    	<span style="font-size: 80px; font-weight: bold">興大台語</span>
					    	<br>			    	
						    <span style="font-size: 60px; font-weight: bold">輸入法</span>
						    <div class="push"></div>
								<div class="push"></div>
						  </div>
							<div id="index_title_flat" class="visible-xs">
						    <span style="font-size: 68px; font-weight: bold">興大</span>
						    <span style="font-size: 68px; font-weight: bold">台語</span>
						    <br>
								<span style="font-size: 30px; font-weight: bold">輸入法</span>
								<div class="push"></div>
							</div>
							<div class="trigger"></div>
						</div>
						<div class="col-xs-12 col-sm-3 col-md-3"></div>
					</div>
				</div>
			</div>
			
			<div class="section" id="section1">
				<div class="container" id="input_page">
					<div class="row">
						<div class="col-xs-12 col-sm-4 col-md-4" id="left" style="text-align: center">
							<div class="visible-xs">
								<div class="push"></div>
							</div>
							<div class="login_span">
								<p id="login_status">
									您當前的身分是:
									<?php
										$url = "./auth/login";
										$name = "訪客";
										if (Auth::user()){
											include('./user/CreateTable.php');
											//CreateJson();
											CreateDBTable();
											$url = "./auth/logout";
											$name = Auth::user()->name; 
											$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $name . '</a>';
											echo $string;
											$name = preg_replace('/\s+/', '_', $name);
											$control_btn = '<div class="ui buttons" style="font-size: 14px">';
											$control_btn .=	'<a href="./user/' . $name . '" class="ui black basic button" style="font-size: 16px">管理辭庫</a>';
											$control_btn .= '</div>';
											echo $control_btn;
										}
										else{
											$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $name . '</a>';
											echo $string;
										}
									?>   
								</p>
							</div>
							<div id="hide_btn" style="text-align: center; margin-top: 12px">
								<div class="ui large buttons">
									<div class="ui black basic button" id="open_prompt">開啟提示</div>
									<div class="or"></div>
									<div class="ui black basic button" id="close_prompt">關閉提示</div>
								</div>
							</div>
							<div class="ui fluid icon input" style="margin-top: 10px; border-radius: 5px; font-size: 16px">
								<input type="text" id="search_pinyin" data-variation="large" placeholder="請在此輸入欲查詢拼音的中文">
								<i class="search icon"></i>
							</div>		
							<br>
							<div class="panel panel-default" id="tutorial_panel" style="border-radius: 5px">
								<div class="panel-heading" style="background-color: #FAEFC4; font-size: 16px">初來乍到?</div>
								<div class="panel-body" style="background-color: #fff; font-size: 12px">如果第一次使用，建議您點選按鈕進入簡易說明及教學</div>
								<div class="panel-footer clearfix" style="background-color: #FAEFC4">
									<div class="pull-right">
										<div class="btn btn-primary" id="GO" style="font-size: 10px">馬上出發!</div>
										<div class="btn btn-default" id="NO" style="font-size: 10px">下次再說!</div>
									</div>
								</div>
							</div>
							<div class="hidden-xs" id="hide_panel"></div>    
							<br><br>								                                                                                                                                            
						</div>  
										
						<div class="col-xs-12 col-sm-4 col-md-4" id="Input_place">
							<div id="input" placeholder="請在此輸入英文拼音..." contenteditable="true" data-variation="large" onpaste="return false" ondragenter="return false" oncontextmenu="return false;" style="margin-top: 15px"></div>							
							<div class="col-xs-12 col-sm-2 col-md-2 hidden-xs">
								<div class="circular ui icon basic button" id="control_play" onclick="controlPlay()" style="margin-top: 4px">
									<i class="large unmute icon"></i>
								</div>
							</div>
							<div class="col-xs-12 col-sm-8 col-md-8 hidden-xs">
								<div class="ui input">
									<div style="margin-top: 5px">
										<span style="font-size: 14px; color: #000">自選&nbsp;&nbsp;</span>
										<div class="ui slider checkbox" tabindex="0" id="select_mode" data-variation="large" style="margin-top: 13px">
										    <input type="checkbox" id="box_mode">
										    <label></label>
										</div>
										<span style="font-size: 14px; color: #000">智能</span>
									</div>												
								</div>
							</div>		
							<div class="col-xs-12 col-sm-2 col-md-2 hidden-xs">		
								<a href="javascript: google();"><img src="./images/google_logo.png" alt="" id="google_btn" data-variation="large"></a>
							</div>
							<div class="col-xs-12 visible-xs">
								<div class="col-xs-2">
									<div class="circular ui icon basic button" id="control_play_flat" onclick="controlPlay()" style="margin-top: 4px">
										<i class="large unmute icon"></i>
									</div>
								</div>
								<div class="col-xs-8">
									<div class="ui input">
										<div style="margin-top: 5px">
											<span style="font-size: 14px; color: #000">自選&nbsp;&nbsp;</span>
											<div class="ui slider checkbox" tabindex="0" id="select_mode_flat" data-variation="small" style="margin-top: 13px">
											    <input type="checkbox">
											    <label></label>
											</div>
											<span style="font-size: 14px; color: #000">智能</span>
										</div>												
									</div>
								</div>
								<div class="col-xs-2">
									<a href="javascript: google();"><img src="./images/google_logo.png" alt="" id="google_btn_flat" data-variation="small"></a>
								</div>
							</div>
							<br>
							<div class="ui input">
								<input type="text" class="hidden-xs" id="prompt" data-variation="large" style="margin-top: 3px; margin-left: -2px" readonly>
								<input type="text" class="visible-xs" id="prompt_flat" data-offset="-45" style="margin-top: 3px" readonly>
							</div>
							<div class="buttons hidden-xs" id="middle_btn" style="margin-top: 5px;">
								<div class="circular ui icon button" id="copy" data-variation="large" style="width: 65px; height: 35px; background-color: #7DFD8C">
									<i class="large copy icon" style="color: #000; margin-top: -3px"></i>
								</div>							
								<div class="circular ui icon button" id="clear" data-variation="large" style="width: 65px; height: 35px; background-color: #97F0FF">
									<i class="large remove icon" style="color: #000; margin-top: -4px"></i>
								</div>
								<div class="circular ui icon button" id="cut" data-variation="large" style="width: 65px; height: 35px; background-color: #FCF783">
									<i class="large cut icon" style="color: #000; margin-top: -4px"></i>
								</div>
							</div>
							<div class="field hidden-xs">
								<textarea id="show" data-variation="large" onclick="false" readonly></textarea>  
							</div>
							<div class="fluid visible-xs">
								<textarea id="show_flat" data-variation="small" readonly></textarea>
							</div>
							<br>
						</div>
						<div class="col-xs-12 col-sm-4 col-md-4" id="right"> 
							<div class="fluid hidden-xs" id="jqte_place">
								<textarea id="jqte"></textarea>
							</div>
							<div class="fluid visible-xs" id="jqte_place_flat">
								<textarea id="jqte_flat"></textarea>
							</div>
							<div class="visible-xs">
								<div class="push"></div>
								<div class="push"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="section" id="section2">
				<div class="slide" data-anchor="slide1">
					<div class="container">
						<div class="row">
							<div class="push"></div>
							<br>
							<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
								<div class="jumbotron" id="public_intro">
									<p style="text-align: center; font-size: 26px; font-weight: bold">輸入法特色</p>
									<div style="font-size: 20px; margin-left: 10%">
										<p><i class="green check circle icon"></i>無需考慮聲調</p>
										<p><i class="green check circle icon"></i>具有縮寫、音首以及英文輸入</p>
										<p><i class="green check circle icon"></i>支援改字</p>
										<p><i class="green check circle icon"></i>支援標點符號輸入</p>
										<p><i class="green check circle icon"></i>可創造屬於自己的專用詞彙</p>
										<p><i class="green check circle icon"></i>多種配色主題</p>
									</div>						
								</div>				
							</div>
							<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
								<div class="jumbotron" id="manual" style="padding-left: 45px; padding-right: 45px">
									<p style="text-align: center; font-size: 26px; font-weight: bold">輸入法操作手冊</p>
									<div class="ui top attached labeled icon tabular menu" style="background-color: rgba(255, 255, 255, 0);">
										<a class="active item" data-tab="first"><i class="font icon"></i>輸入方法</a>
										<a class="item" data-tab="second"><i class="keyboard icon"></i>快捷鍵</a>
									</div>
									<div class="ui bottom attached active tab segment" data-tab="first">
										<div>
											<p style="font-weight: bold"><i class="blue wizard icon"></i>拼音以英文小寫開頭：</p>
											<p style="margin-left: -2px;">&emsp;&nbsp;&nbsp;拼音輸入&emsp;<i class="idea icon"></i>範例： diong hing dai hak => 中興大學</p>
											<p style="font-weight: bold"><i class="blue wizard icon"></i>拼音以英文大寫開頭：</p>
											<p style="margin-left: -2px">&emsp;&nbsp;&nbsp;音首輸入&emsp;<i class="idea icon"></i>範例： Dhdh => 中興大學</p>
											<p style="margin-left: -2px">&emsp;&nbsp;&nbsp;英文輸入&emsp;<i class="idea icon"></i>範例： Umbrella => 雨傘</p>
											<p style="margin-left: -2px">&emsp;&nbsp;&nbsp;會員輸入&emsp;<i class="idea icon"></i>範例： Li hou => 你好</p>
											<p style="font-weight: bold"><i class="blue wizard icon"></i>拼音全為英文大寫：</p>
											<p style="margin-left: -2px">&emsp;&nbsp;&nbsp;縮寫輸入&emsp;<i class="idea icon"></i>範例： NCHU => 中興大學</p>
										</div>
									</div>
									<div class="ui bottom attached tab segment" data-tab="second" id="shortcut" style="width: 100%; height: 280px; overflow: auto">
										<div>
											<p><i class="blue wizard icon"></i>在輸入框中內按下</p>
											<table class="ui celled table" style="width: 88%; margin: auto">
											  <thead>
											  </thead>
											  <tbody>
											    <tr>
											      <td>ctrl + c</td>
											      <td>直接複製到右方編輯區</td>
											    </tr>
											    <tr>
											      <td>ctrl + x</td>
											      <td>直接剪下到右方編輯區</td>
											    </tr>
											    <tr>
											      <td>ctrl + delete</td>
											      <td>初始化輸入框</td>
											    </tr>
											    <tr>
											      <td>ctrl + alt</td>
											      <td>切換輸入模式</td>
											    </tr>
											    <tr>
														<td>alt + v</td>
														<td>開啟 / 關閉發音功能</td>
											    </tr>
											  </tbody>
											</table>
											<br>
											<p><i class="blue wizard icon"></i>輸入頁面中，當已點選任何輸入框時，</p>
											<table class="ui celled table" style="width: 88%; margin: auto">
											  <thead>
											  </thead>
											  <tbody>
											    <tr>
											      <td>alt + b</td>
											      <td>輸入游標移至反查拼音欄</td>
											    </tr>
											    <tr>
											      <td>alt + n</td>
											      <td>輸入游標移至中央拼音欄</td>
											    </tr>
											    <tr>
											      <td>alt + m</td>
											      <td>輸入游標移至文字編輯器</td>
											    </tr>
											  </tbody>
											</table>
											<br>
											<p style="margin-top: 10px"><i class="blue wizard icon"></i><span class="keyboard keyboard-3"></span> 鍵啟用標點符號表</p>
											<div>
												<i class="blue wizard icon"></i>
												<span class="keyboard keyboard-4" style="margin-left: -2px"></span>
												<span class="keyboard keyboard-5"></span>
												<span class="keyboard keyboard-8"></span>
												<span class="keyboard keyboard-7"></span>
												<span class="keyboard keyboard-6"></span>
												<span class="keyboard keyboard-1"></span>
												<span class="keyboard keyboard-2"></span>
												<div style="text-align: center">
													<span>對應</span>
												</div>
											</div>
											<div style="margin-top: -10px">					
												<span class="punctuation" style="margin-left: 28px">，</span>
												<span class="punctuation">。</span>
												<span class="punctuation">、</span>
												<span class="punctuation">；</span>
												<span class="punctuation">？</span>
												<span class="punctuation">「</span>
												<span class="punctuation">」</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="visible-xs">
							<div class="push"></div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="black-theme">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(1/5)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/black.jpg" alt="img not found!">
								<div class="caption">
									<h3 style="font-family: '微軟正黑體'">簡約黑白</h3>
									<p><button class="btn btn-primary" role="button" onclick="change_theme('black',false)">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="pink-theme">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(2/5)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/pink.jpg" alt="img not found!">
								<div class="caption">
									<h3 style="font-family: '微軟正黑體'">甜蜜粉紅</h3>
									<p><button class="btn btn-primary" role="button" onclick="change_theme('pink',false)">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="blue-theme">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(3/5)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/blue.jpg" alt="img not found!">
								<div class="caption">
									<h3 style="font-family: '微軟正黑體'">飄逸水藍</h3>
									<p><button class="btn btn-primary" role="button" onclick="change_theme('blue',false)">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="xmas-theme">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(4/5)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/xmas.jpg" alt="img not found!">
								<div class="caption">
									<h3 style="font-family: '微軟正黑體'">耶誕佳節</h3>
									<p><button class="btn btn-primary" role="button" onclick="change_theme('xmas',false)">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="slide" data-anchor="green-theme">
					<div class="container">
						<div class="row">
							<p style="font-size: 20px; font-weight: bold; text-align: center">主題背景一覽(5/5)</p>
							<div class="thumbnail">
								<img class="thumbnail_img" src="./images/theme/green.jpg" alt="img not found!">
								<div class="caption">
									<h3 style="font-family: '微軟正黑體'">萊姆青綠</h3>
									<p><button class="btn btn-primary" role="button" onclick="change_theme('green',false)">套用</button></p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="section" id="section3">
				<div class="container">
					<div class="push hidden-xs"></div>
					<div class="visible-xs"><br></div>
					<div class="row">
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<p class="tutorial_prompt">本輸入法所使用的台語子音共有20個，母音則有73 + 2個(m, ng同為子母)</p>
							<p class="tutorial_prompt">下方表格列舉子音跟母音的部分搭配：</p>
						</div>
					</div>
					<div class="row">
						<br>
						<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
							<div class="panel panel-default hidden-xs" style="margin: auto">
								<table class="table table-bordered" id="tutor_table" data-toggle="table" data-show-columns="true" data-height="680">
									<thead>
										<tr>
											<th>子音</th>
											<th>母音</th>
											<th>範例字詞</th>
											<th>母音</th>
											<th>範例字詞</th>
											<th>母音</th>
											<th>範例字詞</th>
											<th>母音</th>
											<th>範例字詞</th>
										</tr>						
									</thead>
									<tbody id="json_table">
									</tbody>
								</table>
							</div>
							<div class="panel panel-default visible-xs" style="width: 100%; height: 380px; overflow: scroll">
								<table class="ui celled striped table" id="tutor_table_flat">
									<thead>
										<tr>
											<th>子音　　　　母音　　　　範例字詞</th>
										</tr>						
									</thead>
									<tbody id="json_table_flat">
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div class="push"></div>
					<div class="push hidden-xs"></div>
					<div class="visible-xs"><br></div>
				</div>
			</div>
			<div class="section" id="section4">
				<div class="container">
					<div class="row" style="margin-bottom: -12px">
						<div class="push hidden-xs"></div>
						<div class="visible-xs"><br></div>
						<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"><br></div>
						<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
							<div id="message_board">
								<br>
								<form method="post">
									<div class="ui form myForm_body">
										<div class="form-group" id="info_form_msg">
											<div class="field">
												<label><i class="smile icon"></i>姓名</label>
												<input type="text" class="form-control" name="mes_name" id="mes_name" onchange="CheckName()"
												placeholder="請輸入您的暱稱，方便我們回信，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->name; ?>" 
												style="font-family: '微軟正黑體'">
												<span id="name_check_mes"></span>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="mail icon"></i>電子郵件</label>
													<input type="text" class="form-control" name="mes_email" id="mes_email" onchange="CheckEmail()"
													placeholder="請輸入您的常用信箱，回信將會寄往該信箱，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->email; ?>"
													style="font-family: '微軟正黑體'">
													<span id="email_check_mes"></span>
												</div>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="glyphicon glyphicon-leaf"></i> 主旨</label>
													<input type="text" class="form-control" name="mes_title" id="mes_title" onchange="CheckTitle()" style="font-family: '微軟正黑體'">
													<span id="title_check_mes"></span>
												</div>
											</div>
											<div style="margin-top: 8px">
												<div class="field">
													<label><i class="glyphicon glyphicon-comment"></i> 內容</label>
													<textarea id="mes_comment" name="mes_comment" aria-required="true" onchange="CheckComment()" style="font-family: '微軟正黑體'"></textarea>
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
						<div class="col-xs-12 col-sm-3 col-md-3 col-lg-3"></div>
					</div>
					<div class="row">
						<div class="push"></div>
						<div class="push"></div>
						<br>
					</div>
				</div>	
				<div id="footer" style="text-align: center">
					<p>
						<span class='st_facebook_hcount'></span>
						<span class='st_twitter_hcount'></span>
						<span class='st_googleplus_hcount'></span>
					</p>
					<p class="credit" style="color: #fff; font-size: 14px; font-weight: bold; margin-bottom: -10px">
						中興大學資訊工程學系<i class="copyright icon"></i>2014
					</p>
				</div>	
			</div>
		</div>

		<script src="./js/jquery-1.11.1.min.js"></script>
		<script src="./js/pinyin_algorithm.js"></script>
		<script src="./jquery-ui-1.11.2/jquery-ui.min.js"></script>
		<script src="./bootstrap/js/bootstrap.min.js"></script>
		<script src="./semantic/semantic.min.js"></script>
		<script src="./fullPage.js/vendors/jquery.slimscroll.min.js"></script>
		<script src="./fullPage.js/jquery.fullPage.js"></script>
		<script src="./jQuery-TE_v.1.4.0/jquery-te-1.4.0.min.js"></script>
		<script src="./js/jquery.zclip.js"></script>
		<script src="./js/buttons.min.js"></script>
		<script src="./js/checkmessage.js"></script>
		<script src="./js/keypress.js"></script>
		<script>
			var switchTo5x=true;
			stLight.options({publisher: "a95bbd74-613c-4b46-a5b3-b1afcdde1318", doNotHash: false, doNotCopy: false, hashAddressBar: false});
		</script>
	</body>
</html>