<?php

return [

	/*
	|--------------------------------------------------------------------------
	| Third Party Services
	|--------------------------------------------------------------------------
	|
	| This file is for storing the credentials for third party services such
	| as Stripe, Mailgun, Mandrill, and others. This file provides a sane
	| default location for this type of information, allowing packages
	| to have a conventional place to find your various credentials.
	|
	*/

	'mailgun' => [
		'domain' => 'mg.nchutwpinyin.com',
		'secret' => 'key-23324c859da909b06ecc3ec381d1746f',
	],

	'mandrill' => [
		'secret' => '',
	],

	'ses' => [
		'key' => '',
		'secret' => '',
		'region' => 'us-east-1',
	],

	'stripe' => [
		'model'  => 'User',
		'secret' => '',
	],

	'facebook' => [
	    'client_id' => '811007622269243',
	    'client_secret' => '6adb494b91d709723f222e9d9fb07787',
	    'redirect' => 'http://speechlab.cs.nchu.edu.tw/l5_pinyin/public/auth/facebook/callback',
	],

];
