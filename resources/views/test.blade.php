<!DOCTYPE html>
<html lang="en">
  <head>
    <title>興大台語輸入法</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{ asset('/ico/briefcase.ico') }}" rel="shortcut icon">
    <link href="{{ asset('/jquery-ui-1.11.2/jquery-ui.css') }}" rel="stylesheet">
    <link href="{{ asset('/bootstrap/css/bootstrap.css') }}" rel="stylesheet">
    <link href="{{ asset('/semantic/semantic.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/modify.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/theme_black.css') }}" rel="stylesheet" id="CSS1" disabled="disabled">
    <link href="{{ asset('/css/theme_pink.css') }}" rel="stylesheet" id="CSS2" disabled="disabled">
    <link href="{{ asset('/css/theme_blue.css') }}" rel="stylesheet" id="CSS3" disabled="disabled">
    <link href="{{ asset('/css/theme_xmas.css') }}" rel="stylesheet" id="CSS4" disabled="disabled">
    <link href="{{ asset('/css/theme_green.css') }}" rel="stylesheet" id="CSS5" disabled="disabled">
    <script src="{{ asset('/js/jquery-1.11.1.js') }}"></script>
    <script>
    	var style = ["black","pink","blue","xmas","green"];
    	var nav_arr = ["#nav_home","#nav_log","#nav_input","#nav_about","#nav_tutorial","#nav_contact"];    // navbar的元素
    	$(document).ready(function(){
				var theme = get_theme();
				change_theme(theme);
				nav_assign_color(theme);
        $("#search_pinyin").autocomplete({                              // 運用jquery UI的autocomplete來做到以中文反查拼音
          source: '{{ asset("search_pinyin.php") }}'
        }); 
    	});      
      
      function get_theme(){
        var theme = "black";
	      if (typeof(Storage) != "undefined") {           				// 先從localStorage取theme資料
					var data = localStorage.getItem("theme");
					if (data != null)											// 如果storage中有資料
						theme = data;											  // 則更改主題，若無則為預設的black
				}
        return theme;
      }

    	function change_theme(theme){
    		for(var i = 0; i < style.length; i++){
          if (theme == style[i])
            document.getElementById("CSS" + (i + 1)).disabled = false;
          else
            document.getElementById("CSS" + (i + 1)).disabled = true;
        }
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
          //static_color = "rgb(71, 125, 210)";
          static_color = "#fff";
          for(var i = 0; i < nav_arr_len; i++){
            $(nav_arr[i]).css('color',static_color);
            (function(i){
              $(nav_arr[i]).mouseenter(function(){$(this).css('color',nav_color[i]);});    
            })(i);
            $(nav_arr[i]).mouseleave(function(){$(this).css('color',static_color);});
          }
        }
      }
    </script>
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
          <a class="navbar-brand visible-xs" id="prefix_title" href="#">興大無聲調台語輸入法</a>
        </div>
        <div id="navbarCollapse" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            @if (Auth::user())
              <li><a href="{{ url('/auth/logout') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登出</a></li>
            @else
              <li><a href="{{ url('/auth/login') }}" id="nav_log"><span class="glyphicon glyphicon-user"></span> 會員登入/註冊</a></li>                 
            @endif
          </ul>
          <ul class="nav navbar-nav navbar-right" id="menu">  
            <li data-menuanchor="home"><a href="{{ url('/#home') }}" id="nav_home"><span class="glyphicon glyphicon-home"></span> HOME</a></li>
            <li data-menuanchor="pinyin_IME"><a href="{{ url('/#pinyin_IME') }}" id="nav_input"><span class="glyphicon glyphicon-pencil"></span> 輸入頁面</a></li>
            <li data-menuanchor="about"><a href="{{ url('/#about') }}" id="nav_about"><span class="glyphicon glyphicon-info-sign"></span> 關於輸入法</a></li>
            <li data-menuanchor="tutorial"><a href="{{ url('/#tutorial') }}" id="nav_tutorial"><span class="glyphicon glyphicon-star"></span> 拼音教學</a></li>
            <li data-menuanchor="contact"><a href="{{ url('/#contact') }}" id="nav_contact"><span class="glyphicon glyphicon-envelope"></span> 聯絡我們</a></li>
          </ul>
        </div>
      </div>
    </nav>
		<div class="push"></div>
		<div class="push"></div>
    <div class="push"></div>
    <br>
		
		@yield('content')

		<!-- Scripts -->
		<script src="{{ asset('/jquery-ui-1.11.2/jquery-ui.js') }}"></script>
    <script src="{{ asset('/bootstrap/js/bootstrap.js') }}"></script>
    <script src="{{ asset('/semantic/semantic.js') }}"></script>
	</body>
</html>