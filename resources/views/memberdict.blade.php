@extends('test')

@section('content')

<!-- soruce required -->
<script src="{{ asset('/user/function.js') }}"></script>
<link href="./checkbox_modify.css" rel="stylesheet">

<body onload="MakeTable('<?php echo (preg_replace('/\s+/', '_', Auth::user()->name));?>')"></body>

<div class="row">
	<div class="col-xs-12 col-sm-4 col-md-4" id="left" style="text-align: center">
		<div class="login_span">
			<p id="login_status">
				您當前的身分是:
				<?php
					$url = "./auth/login";
					$exp = "訪客";
					if (Auth::user()){
						$name = preg_replace('/\s+/', '_', Auth::user()->name); //把' '取代成 '_'
						$url = "./" . $name;
						$exp = Auth::user()->name; 
					}
					$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $exp . '</a>';
					echo $string;
				?>   
			</p>
		</div>
	</div>
	<div class="col-lg-6">
		<div class="input-group">
			<input type="text" class="form-control search" placeholder="尋找已有詞彙">
			<span class="input-group-btn">
				<button class="btn btn-default" type="button">開始尋找!</button>
			</span>
		</div>

		<br>

		<div class="input-group">
			<input type="text" class="form-control" placeholder="請輸入台語拼音" id="sound">
			<input type="text" class="form-control" placeholder="請輸入中文辭義" id="characters">
			<span class="input-group-btn">
				<button type="button" class="btn btn-default" 
				 onclick="AddWord('<?php echo (preg_replace('/\s+/', '_', Auth::user()->name));?>')">增加新詞彙</button>
			</span>
		</div>

		<br>

		<div class="btn-group btn-group-justified" role="group" aria-label="...">
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default"
				 onclick="DeleteChosenWord('<?php echo (preg_replace('/\s+/', '_', Auth::user()->name));?>')">刪除所選</button>
			</div>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default"
				 onclick="DeleteAllWord('<?php echo (preg_replace('/\s+/', '_', Auth::user()->name));?>')">全部刪除</button>
			</div>
			<div class="btn-group" role="group">
				<button type="button" class="btn btn-default" onclick="test()">TEST~</button>
			</div>
		</div>
	</div>
</div>

<div class="row">
	<div class="col-lg-4">
		<br>
	</div>
	<div class="col-lg-6">
		<br>
		<div class="panel panel-default">
			<div class="table-responsive">
				<table class="table table-bordered" id="custom_dict_table">
					<thead>
						<tr>
							<th>&nbsp;</th>
							<th>拼音</th>
							<th>中文</th>
						</tr>
					</thead>
					<tbody id="json_table">
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>

@endsection
