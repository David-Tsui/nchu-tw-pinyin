<!DOCTYPE html>
<html lang="en">
    <head>
        <title>興大無聲調台語拼音輸入法</title>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="{{ asset('/bootstrap/css/bootstrap.css') }}" rel="stylesheet">
        <link href="{{ asset('/semantic/css/semantic.css') }}" rel="stylesheet">
        <link href="{{ asset('/css/modify.css') }}" rel="stylesheet">
        <link href="{{ asset('/css/theme-origin.css') }}" rel="stylesheet" id="CSS1" disabled="disabled">
        <link href="{{ asset('/css/theme-pink.css') }}" rel="stylesheet" id="CSS2" disabled="disabled">
        <link href="{{ asset('/css/theme-blue.css') }}" rel="stylesheet" id="CSS3" disabled="disabled">
        <link href="{{ asset('/css/theme-xmas.css') }}" rel="stylesheet" id="CSS4" disabled="disabled">
        <script src="{{ asset('/js/jquery-1.11.1.js') }}"></script>
        <script>
        	var style = ["origin","pink","blue","xmas"];
        	var nav_arr = ["#nav_home","#nav_about","#nav_tutorial","#nav_contact","#nav_login"];   // navbar的元素
            var nav_color = ["#F87284","#F0A01C","#F1EE8F","#8AE194","#5B81E9"];                    // 初始navbar的顏色
        	$(document).ready(function(){
				var theme = get_theme();
				change_theme(theme);
				nav_assign_color(theme);
        	});      
        	function get_theme(){
        		var theme = "origin";
                var valid_css_num = 0;

	            if (typeof(Storage) != "undefined") {           				// 先從localStorage取theme資料
					var data = localStorage.getItem("theme");
					if (data != null){											// 如果storage中有資料
						theme = data;											// 則更改主題，若無則為預設的origin
						for(var i = 0; i < style.length; i++){
							if (theme == style[i]){
								valid_css_num = i;
								return valid_css_num;
							}
						}
					}
				}
        	}

        	function change_theme(css_num){
        		for(var i = 1; i <= style.length; i++){
                    if (i == (css_num + 1))
                        document.getElementById("CSS" + i).disabled = false;
                    else
                        document.getElementById("CSS" + i).disabled = true;
                }
        	}

        	function nav_assign_color(theme){
                if (theme == 0){
                    nav_color = ["#F87284","#F0A01C","#F1EE8F","#8AE194","#5B81E9"];
                    for(var i = 0; i < nav_arr.length; i++){
                        $(nav_arr[i]).css('color',nav_color[i]);
                    }

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
                else if (theme == 1){
                    nav_color = "#FFF";
                    for(var i = 0; i < nav_arr.length; i++){
                        $(nav_arr[i]).css('color',nav_color);
                    }
                }
                else if (theme == 2){
                    nav_color = "#FFF";
                    for(var i = 0; i < nav_arr.length; i++){
                        $(nav_arr[i]).css('color',nav_color);
                    }
                }
                else if (theme == 3){
                    nav_color = "#FFF";
                    for(var i = 0; i < nav_arr.length; i++){
                        $(nav_arr[i]).css('color',nav_color);
                    }
                } 
            }
        </script>

        <style>
			/*#push {
				height: 40px;
			}
			
			body {
				background: url("{{ url('/css/origin_back.jpg')}} ") no-repeat center center fixed;
				-webkit-background-size: cover;
			  	-moz-background-size: cover;
			  	-o-background-size: cover;
			 	background-size: cover;
				font-family: Arial, "文泉驛正黑", "WenQuanYi Zen Hei", "微軟正黑體", "Microsoft JhengHei", "標楷體", sans-serif;
			}*/
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
                            <li><a href="{{ url('/auth/login') }}" id="nav_login"><span class="glyphicon glyphicon-user"></span>會員登出</a></li>
                        @else
                            <li><a href="{{ url('/auth/login') }}" id="nav_login"><span class="glyphicon glyphicon-user"></span>會員登入/註冊</a></li>                 
                    	@endif
                    </ul>
                </div>
            </div>
        </nav>
        <div id="push"></div>
		<div id="push"></div>
		<div id="push"></div>
		
		@yield('content')

		<!-- Scripts -->
		<script src="{{ asset('/jquery-ui-1.11.2/jquery-ui.js') }}"></script>
        <script src="{{ asset('/bootstrap/js/bootstrap.js') }}"></script>
        <script src="{{ asset('/semantic/js/semantic.js') }}"></script>
	</body>
</html>