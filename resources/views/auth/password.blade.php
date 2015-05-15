@extends('test')

@section('content')
<div class="container-fluid">
	<div class="row">
		<div class="col-md-3"></div>
		<div class="col-md-6">
			<div class="push"></div>
			<br>
			<br>
			<div class="panel panel-default">
				<div class="panel-heading" style="font-size: 18px">重新設定您的密碼</div>
				<div class="panel-body">
					@if (session('status'))
						<div class="alert alert-success">
							{{ session('status') }}
						</div>
					@endif

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
					<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/email') }}">
						<input type="hidden" name="_token" value="{{ csrf_token() }}">
						<div style="text-align: center">
							<p style="margin: auto; font-size: 16px">請填入申請帳號時用的E-mail，新密碼將會送到您的信箱</p>
							<br>
						</div>
						<div class="form-group">
							<div class="col-md-3"></div>
							<div class="col-md-6" style="text-align: center">
								<label class="control-label" style="float: left;">E-Mail 地址</label>
								<input type="email" class="form-control" name="email" value="{{ old('email') }}">
								<br>
								<button type="submit" class="btn btn-primary" style="margin: auto">發送</button>
							</div>
							<div class="col-md-3"></div>
						</div>
					</form>
				</div>
			</div>
		</div>
		<div class="col-md-3"></div>
	</div>
</div>
@endsection
