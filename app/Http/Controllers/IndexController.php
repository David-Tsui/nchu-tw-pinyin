<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\User;
use Session;
use Auth;
use Socialize;

class IndexController extends Controller
{

	public function Index ()
	{
		return view('index');
	}

}