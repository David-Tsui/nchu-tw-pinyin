@extends('test')

@section('content')
<div class="container-fluid">
	<div class="row">
		<div class="col-md-8 col-md-offset-2">
			<div class="panel panel-default" style="background-color: rgba(255, 255, 255, 0.76)">
				<div class="panel-heading" style="background-color: rgba(231, 231, 231, 0.5)">登入</div>
				<div class="panel-body">
					@if (count($errors) > 0)
						<div class="alert alert-danger">
							<strong>Whoops!</strong> There were some problems with your input.<br><br>
							<ul>
								@foreach ($errors->all() as $error)
									<li>{{ $error }}</li>
								@endforeach
							</ul>
						</div>
					@endif

					<form class="form-horizontal" role="form" method="POST" action="{{ url('/auth/login') }}">
						<input type="hidden" name="_token" value="{{ csrf_token() }}">

						<div class="form-group">
							<label class="col-md-4 control-label">電子郵件</label>
							<div class="col-md-6">
								<input type="email" class="form-control" name="email" value="{{ old('email') }}">
							</div>
						</div>

						<div class="form-group">
							<label class="col-md-4 control-label">密碼</label>
							<div class="col-md-6">
								<input type="password" class="form-control" name="password">
							</div>
						</div>

						<div class="form-group">
							<div class="col-md-6 col-md-offset-4">
								<button type="submit" class="btn btn-primary">登入</button>
								<a class="btn btn-link" href="{{ url('/password/email') }}">忘記密碼</a>
							</div>
						</div>

						<div class="form-group">
							<label class="col-md-4 control-label">尚未擁有帳號嗎？</label>
							<div class="col-md-6">
								<a class="btn btn-primary" href="{{ url('/auth/register') }}">立即註冊</a>
							</div>
						</div>

						<div class="form-group">
							<label class="col-md-4 control-label">您也可以</label>
							<div class="col-md-6">
								<a class="btn btn-primary" href="{{ url('/auth/facebook') }}">透過Facebook登入</a>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
