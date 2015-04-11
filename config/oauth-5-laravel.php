<?php

return [

	/*
	|--------------------------------------------------------------------------
	| oAuth Config
	|--------------------------------------------------------------------------
	*/

	/**
	 * Storage
	 */
	'storage' => 'Session',

	/**
	 * Consumers
	 */
	'consumers' => [

		'Facebook' => [
			'client_id'     => '811007622269243',
			'client_secret' => '6adb494b91d709723f222e9d9fb07787',
			'scope'         => ['email'],
			//'scope'         => ['email','read_friendlists','user_online_presence'],
		],

	]

];