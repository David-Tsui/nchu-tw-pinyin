<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
//use Illuminate\Http\Request;
use App\Http\Requests;
use Mail;
use Auth;
use Request;
//use Illuminate\Support\Facades\Input;

class MailController extends Controller {
	public function SendMail ()
	{
		$sender = array('name'  => Request::input('mes_name'), 
					    'email' => Request::input('mes_email'),
					    'title' => Request::input('mes_title')
					    );

		$data = array('contents' => Request::input('mes_comment'));
			
		Mail::send('emails.contact', $data, function($message) use ($sender)
		{
			$message->from($sender['email'], $sender['name']);
			$message->To('st880221@gmail.com', 'TW-Pinyin Developers')
			->cc('dick50414@gmail.com') 	//副本收件者
			->subject($sender['title']);
		});
		echo '<script language="javascript">';
		echo 'alert("訊息已送出。")';
		echo '</script>';
		header( "refresh:0;url=./" );
	}

}