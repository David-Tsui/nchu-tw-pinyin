<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>興大無聲調台語拼音輸入法</title>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link href="./bootstrap/css/bootstrap.css" rel="stylesheet">
		<link href="./semantic/css/semantic.css" rel="stylesheet">
		<link href="./css/modify.css" rel="stylesheet">

		<style>
			body {
				/*origin*/
				background: url(images/origin_back.jpg) no-repeat center center fixed;
				/*common*/
				-webkit-background-size: cover;
			  	-moz-background-size: cover;
			  	-o-background-size: cover;
			 	background-size: cover;
				font-family: Arial, "文泉驛正黑", "WenQuanYi Zen Hei", "微軟正黑體", "Microsoft JhengHei", "標楷體", sans-serif;
			}

			#push { height: 50px; }

			.navbar { min-height: 50px; }

			.navbar-nav > li > a {
				font-size: 14px;
				font-weight: bold;
			}

			.navbar-inverse {
				/*origin*/
				background: rgba(34, 34, 34, 0.9);
				border-color: #101010;
				box-shadow: inset 0px 8px 25px 8px rgba(37, 37, 37, 1); 
				-webkit-box-shadow: inset 0px 8px 25px 8px rgba(37, 37, 37, 1); 
				-moz-box-shadow: inset 0px 8px 25px 8px rgba(37, 37, 37, 1);
				/*common*/
			}

			.navbar-inverse .navbar-brand {
				font-size: 24px;
				font-weight: bold;
				color: #F6D5D5;
			}

			.nav > li > a {
				padding-left: 18px;
				color: #E92428;
			}

			.navbar-collapse .navbar-nav > li > a { color: #FFFFFF; }

			.navbar-toggle { background-color: rgba(253, 253, 253, 0.25); }

			.navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus { background-color: rgba(255, 253, 253, 0.8); }

			#footer {
				/*origin*/
				background-color: rgba(34, 34, 34, 0.9);
				box-shadow: inset 0px -8px 25px 8px rgba(37, 37, 37, 1); 
				-webkit-box-shadow: inset 0px -8px 25px 8px rgba(37, 37, 37, 1); 
				-moz-box-shadow: inset 0px -8px 25px 8px rgba(37, 37, 37, 1);
				/*common*/
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
						<li><a href="#" id="nav_home"><span class="glyphicon glyphicon-home"></span> 首頁</a></li>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li><a href="#" id="nav_about"><span class="glyphicon glyphicon-info-sign"></span> 關於輸入法</a></li>
						<li><a href="#" id="nav_tutorial"><span class="glyphicon glyphicon-star"></span> 拼音教學</a></li>
						<li><a href="#" id="nav_contact" date-toggle="modal"><span class="glyphicon glyphicon-envelope"></span> 聯絡我們</a></li>
						<li><a href="#" id="nav_login"><span class="glyphicon glyphicon-user"></span>會員登入/註冊</a></li>               
					</ul>
				</div>
			</div>
		</nav>
		<div id="push"></div>
		<div id="push"></div>
		<br>

		<div class="container">
			<div class="row" style="text-align: center">
				<div class="col-xs-12 col-sm-4 col-md-4"></div>
				<div class="col-xs-12 col-sm-4 col-md-4">                       	
					<div class="ui card">
					  	<div class="image">
					    	<img src="images/maintaining.jpg" style="width: 90%">
					  	</div>
					  	<div class="content">
					  		<div class="header" style="font-size: 24px">網站維護中!! 請稍待QAQ</div>
					      	<div class="meta"></div>
					      	<div class="description"></div>
					  	</div>
					  </div>
				</div>
				<div class="col-xs-12 col-sm-4 col-md-4"></div>
			</div>
		</div>		
		<div id="push"></div>

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
		<script src="./bootstrap/js/bootstrap.js"></script>
		<script src="./semantic/js/semantic.js"></script>
		<script src="./js/buttons.js"></script>
	</body>
</html>