<!DOCTYPE html>
<html lang="en">
	<head>
		<title>興大無聲調台語拼音輸入法</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="./jquery-ui-1.11.2/jquery-ui.css" rel="stylesheet">
		<link href="./bootstrap/css/bootstrap.css" rel="stylesheet">
		<link href="./css/bootstrap-modal-bs3patch.css" rel="stylesheet">
		<link href="./css/bootstrap-modal.css" rel="stylesheet">
		<link href="./semantic/css/semantic.css" rel="stylesheet">
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
		<link href="./ico/briefcase.ico" rel="shortcut icon">
		<style>
			.jqte_origin_editor, .jqte_blue_editor, .jqte_pink_editor, .jqte_xmas_editor, .jqte_source{
				min-height: 375px;
				max-height: 375px;
			}

			.jqte_origin_flat_editor, .jqte_blue_flat_editor, .jqte_pink_flat_editor, .jqte_xmas_flat_editor, .jqte_source{
				min-height: 180px;
				max-height: 180px;
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
					<a class="navbar-brand" id="prefix_title" href="#">興大台語輸入法</a>
				</div>
				<div id="navbarCollapse" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a href="{{ url('') }}" id="nav_home"><span class="glyphicon glyphicon-home"></span> 首頁</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="{{ url('/#about') }}" id="nav_about"><span class="glyphicon glyphicon-info-sign"></span> 關於輸入法</a></li>
						<li><a href="{{ url('/#tutorial') }}" id="nav_tutorial"><span class="glyphicon glyphicon-star"></span> 拼音教學</a></li>
						<li><a href="{{ url('/#contact') }}" id="nav_contact" date-toggle="modal"><span class="glyphicon glyphicon-envelope"></span> 聯絡我們</a></li>
						@if (Auth::user())
							<li><a href="{{ url('/auth/logout') }}" id="nav_login"><span class="glyphicon glyphicon-user"></span>會員登出</a></li>
						@else
							<li><a href="{{ url('/auth/login') }}" id="nav_login"><span class="glyphicon glyphicon-user"></span>會員登入/註冊</a></li>                 
						@endif
					</ul>
				</div>
			</div>
		</nav>
		<div id="push"></div>
		<div id="hide_push"></div>
		<div id="hide_br"></div>
		<br>
			
		<!-- 上方的4*4*4 -->
		<div class="container">
			<div class="row" style="text-align: center">
				<div class="col-xs-12 col-sm-4 col-md-4" id="up_left"></div>
				<div class="col-xs-12 col-sm-4 col-md-4">                       
					<div class="panel panel-default" id="tutor_panel" style="border-radius: 5px">
						<div class="panel-heading" style="background-color: #FAEFC4; font-size: 16px">初來乍到?</div>
						<div class="panel-body" style="background-color: #FFF; font-size: 12px">如果第一次使用，建議您點選按鈕進入簡易說明及教學</div>
						<div class="panel-footer clearfix" style="background-color: #FAEFC4">
							<div class="pull-right">
								<div class="btn btn-primary" id="GO" style="font-size: 10px">馬上出發!</div>
								<div class="btn btn-default" id="NO" style="font-size: 10px">下次再說!</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-4 col-md-4" id="up_right">
				</div>
			</div>
			<!-- 中間的4*4*4 -->
			<div class="row">
				<div class="col-xs-12 col-sm-4 col-md-4" id="left" style="text-align: center">
					<div class="hidden-xs lab_qrcode" id="change_qr" style="text-align: left; margin-left: 28%">
						<img src="./images/pinyinQR.png" id="my_qrcode" onclick="change_pic()" width="160px" height="160px" style="margin-top: -13px"/>
					</div>
					<div class="login_span">
						<p id="login_status">
							您當前的身分是:
							<?php
								$url = "./auth/login";
								$exp = "訪客";
								if (Auth::user()){
									$url = "./auth/logout";
									$exp = Auth::user()->name; 
								}
								$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $exp . '</a>';
								echo $string;
							?>   
						</p>
					</div>
					<div class="ui icon input" style="margin-top: -0px">
						<input class="prompt" type="text" id="search_pinyin" placeholder="請輸入欲查詢拼音的中文" style="border-radius: 3px;">
						<i class="search icon"></i>
					</div>
					<br><br>                                                                                                                                                             
					<div class="jumbotron" id="public_note">
						<div style="margin-top: -15px">
							<h3>系統公告</h3>
							<p style="text-align: right; font-size: 9px">4/15.2015</p>
							<div style="text-align: left">
								<p style="font-size: 14px">● 智能模式維修中!</p>
								<p style="font-size: 14px">● 手機介面請使用自選模式</p>
								<p style="font-size: 14px">● 會員系統、聯絡系統已上線!</p>
							</div>
							<div id="hide_btn" style="text-align: center; margin-bottom: -20px">
								<div class="ui huge buttons" style="font-size: 14px">
									<div class="ui button" id="open_prompt" style="color: #FFF; background-color: #FFBABA">開啟提示</div>
									<div class="or"></div>
									<div class="ui button" id="close_prompt" style="color: #FFF; background-color: #AAD4FF">關閉提示</div>
								</div>
							</div>
						</div>
					</div>
					<br>
				</div>  
								
				<div class="col-xs-12 col-sm-4 col-md-4" id="Input_place">
					<div id="input" placeholder="請輸入英文拼音..." contenteditable="true" data-variation="large" onpaste="return false" ondragenter="return false" oncontextmenu="return false;" style="margin-top: 15px"></div>
					<div class="ui input">
						<div class="hidden-xs">
							<div class="ui left pointing dropdown icon button" tabindex="0" id="select_mode" data-variation="large">
								<div class="text" style="margin-left: 7px">自選模式</div>
								<i class="down icon"></i>                                   
								<div class="menu">
									<div class="item active" style="font-size: 10px" onclick="get_sel_mode('自選模式')" onkeydown="enter_sel_mode(event,'自選模式')"><i class="edit icon"></i>自選模式</div>
									<div class="item" style="font-size: 10px" onclick="get_sel_mode('智能模式')" onkeydown="enter_sel_mode(event,'智能模式')"><i class="edit sign icon"></i>智能模式</div>
								</div>
							</div>
							<br>
							<input type="text" id="prompt" data-variation="large" readonly>
						</div>
					</div>
					<div class="ui input">
						<div class="visible-xs">
							<div class="ui left pointing dropdown icon button" id="select_mode_flat" data-offset="-8" style="margin-top: 10px; background-color: #FF9494; color: #FFF; font-weight: bold; font-family: '微軟正黑體'; font-size: 9px">
								<div class="text" style="margin-left: 5px">自選模式</div>
								<i class="down icon"></i>
								<div class="menu">
									<div class="item active" style="font-size: 10px" onclick="get_sel_mode('自選模式')"><i class="edit icon"></i>自選模式</div>
									<div class="item" style="font-size: 10px" onclick="get_sel_mode('智能模式')"><i class="edit sign icon"></i>智能模式</div>			
								</div>
							</div>
							<input type="text" id="prompt_flat" data-offset="-45" readonly>
						</div>  
					</div>
					<div class="buttons hidden-xs" id="middle_btn" style="margin-top: 5px;">
						<div class="circular ui icon button" id="copy" data-variation="large" style="width: 65px; height: 35px; background-color: #7DFD8C"><i class="big copy icon" style="color: #000; margin-top: -2px"></i></div>
						<div class="circular ui icon button" id="undo" data-variation="large" style="width: 65px; height: 35px; background-color: #97F0FF"><i class="big undo icon" style="color: #000; margin-top: -2px"></i></div>
						<div class="circular ui icon button" id="cut" data-variation="large" style="width: 65px; height: 35px; background-color: #FCF783"><i class="big cut icon" style="color: #000; margin-top: -3px"></i></div>
					</div>
					<div class="buttons visible-xs" id="middle_btn_flat" style="margin-left: 8px; margin-top: 0px; margin-bottom: 5px">
						<div class="circular ui button" id="copy_flat" style="background-color: #7DFD8C"><i class="copy icon" style="padding-left: 4px; color: #000"></i></div>&nbsp;&nbsp;&nbsp;
						<div class="circular ui button" id="undo_flat" style="background-color: #97F0FF"><i class="undo icon" style="padding-left: 4px; color: #000"></i></div>&nbsp;&nbsp;&nbsp;
						<div class="circular ui button" id="cut_flat" style="background-color: #FCF783"><i class="cut icon" style="padding-left: 4px; color: #000"></i></div>
						<br>
					</div>
					<div class="field hidden-xs">
						<textarea id="show" data-variation="large" onclick="false" readonly></textarea>  
					</div>
					<div class="fluid visible-xs">
						<textarea id="show_flat" data-variation="small" readonly></textarea>
						<br>
						<div style="margin-left: 4px">
							<div class="ui left attached button" id="btn_previous" style="font-size: 10px; margin-bottom: 10px; padding-right: 15px; border-radius: 5px;">
								<i class="small arrow sign left icon"></i>上一頁
							</div>
							<div class="ui button" id="btn_initial" style="font-size: 10px; margin-bottom: 10px; border-radius: 5px;">首頁</div>
							<div class="right attached ui button" id="btn_next" style="font-size: 10px; margin-bottom: 10px; padding-left: 15px; border-radius: 5px;">
								下一頁<i class="small arrow sign right icon"></i>
							</div>
						</div>
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
			
			<div class="row" id="about">
				<br>
				<div id="push">主題背景一覽</div>
				<div class="col-xs-12 col-sm-4 col-md-3">
					<div class="thumbnail">
						<img src="./images/theme/origin.jpg" style="width: 90%" alt="img not found!">
						<div class="caption">
							<h3>簡約黑白</h3>
							<p><a href="#" class="btn btn-primary" role="button" onclick="change_theme('origin')">套用</a></p>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-4 col-md-3">
					<div class="thumbnail">
						<img src="./images/theme/pink.jpg" style="width: 90%" alt="img not found!">
						<div class="caption">
							<h3>甜蜜粉紅</h3>
							<p><a href="#" class="btn btn-primary" role="button" onclick="change_theme('pink')">套用</a></p>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-4 col-md-3">
					<div class="thumbnail">
						<img src="./images/theme/blue.jpg" style="width: 90%" alt="...">
						<div class="caption">
							<h3>飄逸水藍</h3>
							<p><a href="#" class="btn btn-primary" role="button" onclick="change_theme('blue')">套用</a></p>
						</div>
					</div>
				</div>
				<div class="col-xs-12 col-sm-4 col-md-3">
					<div class="thumbnail">
						<img src="./images/theme/xmas.jpg" style="width: 90%" alt="...">
						<div class="caption">
							<h3>耶誕佳節</h3>
							<p><a href="#" class="btn btn-primary" role="button" onclick="change_theme('xmas')">套用</a></p>
						</div>
					</div>
				</div>
			</div>
			<div class="row" id="tutorial">
				<p>拼音教學</p>
			</div>
		</div>
	 
        <!-- message_board  -->
        <div id="message_board" class="modal fade" tabindex="-1" data-width="400" style="display: none;">
            <div class = "modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 style="margin-left: 18px"><i class="glyphicon glyphicon-edit"></i>聯絡我們</h4>
            </div>
            <form method="post">
                <div class="modal-body">
                    <div class="form-group" id="info_form_msg">
                        <div class="ui fluid input" class="form-control" style="font-size: 14px; font-weight: bold">
                            <div>
                                <p><i class="smile icon"></i>姓名</p>
                                <input type="text" class="form-control" name="mes_name" id="mes_name" onchange="CheckName()"
                                 placeholder="請輸入您的暱稱，方便我們回信，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->name; ?>">
                                <span id="name_check_mes"></span>
                            </div>
                            <div style="margin-top: 8px">
                                <p><i class="mail icon"></i>電子郵件</p>
                                <input type="text" class="form-control" name="mes_email" id="mes_email" onchange="CheckEmail()"
                                placeholder="請輸入您的常用信箱，回信將會寄往該信箱，謝謝。" value="<?php if (Auth::user()) echo Auth::user()->email; ?>">
                                <span id="email_check_mes"></span>
                            </div>
                            <div style="margin-top: 8px">
                                <p><i class="glyphicon glyphicon-leaf"></i>主旨</p>
                                <input type="text" class="form-control" name="mes_title" id="mes_title" onchange="CheckTitle()">
                                <span id="title_check_mes"></span>
                            </div>
                            <div style="margin-top: 8px">
                                <p><i class="glyphicon glyphicon-comment"></i>內容</p>
                                <textarea id="mes_comment" name="mes_comment" aria-required="true" style="height: 100px; width: 100%" onchange="CheckComment()"></textarea>
                                <span id="comment_check_mes"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                    <button type="button" data-dismiss="modal" class="btn">放棄</button>
                    <button type="submit" class="btn btn-primary" onclick="return CheckBeforeSubmit();">發送</button>
                </div>
            </form>
        </div>

		<!-- 註腳 -->
		<div id="footer" class="navbar-static-bottom">
			<div align="center" class="panel-body">
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

		<script src="./js/jquery-1.11.1.js"></script>
		<script src="./js/pinyin_algorithm.js"></script>
		<script src="./jquery-ui-1.11.2/jquery-ui.js"></script>
		<script src="./bootstrap/js/bootstrap.js"></script>
		<script src="./semantic/js/semantic.js"></script>
		<script src="./js/bootstrap-modal.js"></script>
		<script src="./js/bootstrap-modalmanager.js"></script>
		<script src="./jQuery-TE_v.1.4.0/jquery-te-1.4.0.js"></script>
		<script src="./js/jquery.zclip.js"></script>
		<script src="./js/buttons.js"></script>
		<script src="./js/jsnow.js"></script>
        <script src="./js/checkmessage.js"></script>
		<!--<script src="./js/jquery-migrate-1.2.1.js"></script>-->
		<script>
			var switchTo5x=true;
			stLight.options({publisher: "a95bbd74-613c-4b46-a5b3-b1afcdde1318", doNotHash: false, doNotCopy: false, hashAddressBar: false});
		</script>
	</body>
</html>