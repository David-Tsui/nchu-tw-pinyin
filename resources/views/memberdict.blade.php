@extends('test')

@section('content')

<?php 
	$name =  Auth::user()->name; 
	$dbexp = "select `id` from `users` where `name` = '" . $name . "'";
	$result = DB::select($dbexp);
	$id = $result[0]->id;
?>

<!-- soruce required -->
<!--<script src="{{ asset('/user/JsonFunction.js') }}"></script>-->
<script src="{{ asset('/user/DbFunction.js') }}"></script>
<link href="./checkbox_modify.css" rel="stylesheet">

<body onload="MakeTable('<?php echo $id;?>')"></body>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-4 col-md-4" style="text-align: center">
				<div class="login_span">
					<p id="login_status">
						您當前的身分是:
						<?php
							$url = "./auth/login";
							$exp = "訪客";
							if (Auth::user()){
								$repname = preg_replace('/\s+/', '_', $name); //把' '取代成 '_'
								$url = "./" . $repname;
								$exp = $name; 
							}
							$string = '<a class="login_right_span ui red horizontal label" style="margin-top: -3px" href=' . $url . ' id="login_person">' . $exp . '</a>';
							echo $string;
						?>   
					</p>
				</div>
				<br>
				<div class="ui fluid icon input" style="margin-top: 10px; border-radius: 5px; font-size: 16px">
					<input type="text" id="search_pinyin" placeholder="請在此輸入欲查詢拼音的中文">
					<i class="search icon"></i>
				</div>
				<br><br>
			</div>

			<div class="col-xs-12 col-sm-6 col-md-6">
				<div>
					<br>
					<input type="text" class="form-control" placeholder="請輸入台語拼音" id="sound" style="font-size: 20px">
					<input type="text" class="form-control" placeholder="請輸入中文字詞，勿含空格及標點符號" id="characters" style="margin-top: 5px; font-size: 20px">
					<div style="text-align: center">
						<button type="button" class="btn btn-default" onclick="AddWord('<?php echo $id;?>')" style="margin-top: 10px; font-size: 16px">增加新詞彙</button>	
					</div>
					<br>

					<div class="btn-group btn-group-justified" role="group" aria-label="...">
						<div class="btn-group" role="group">
							<button type="button" class="btn btn-default"
							 onclick="DeleteChosenWord('<?php echo $id;?>')">刪除所選</button>
						</div>
						<div class="btn-group" role="group">
							<button type="button" class="btn btn-default"
							 onclick="DeleteAllWord('<?php echo $id;?>')">全部刪除</button>
						</div>
					</div>
					<br>
					<div class="panel panel-default">
						<div class="table-responsive" style="width: 95%">
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
			<div class="col-xs-12 col-sm-2 col-md-2"></div>
		</div>
	</div>
@endsection