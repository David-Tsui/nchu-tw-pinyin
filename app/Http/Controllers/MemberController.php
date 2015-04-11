<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
//use Illuminate\Http\Request;
//use App\Http\Requests;
use Auth;
use App\User;	//FB
use Socialize;	//FB

use View;
use Validator;
//use Redirect;

class MemberController extends Controller {

	public function RedirectToProviderFB()
	{
	    return Socialize::with('facebook')->redirect();
	}

	public function HandleProviderFBCallback()
	{
	    $fbuser = Socialize::with('facebook')->user();
	    $user = $fbuser->user;
	    $query = 'name'. ' = \''. $user['name']. '\' and email = \''. $user['email']. '\'';

	    $password = $user['first_name']. $user['id']. $user['last_name'];

		//find if not exist
		if (User::whereRaw($query)->get() == '[]')
		{
			$newuser = new User;
			$newuser->email = $user['email'];
			$newuser->name = $user['name'];
			$newuser->password = bcrypt($password); //bcrypt($password)
			$newuser->save();
		}

		if (Auth::attempt(['email' => $user['email'], 'name' => $user['name'], 'password' => $password]))
		{
			//dd('in');
			return redirect()->intended('./');
		}
		else
		{
			//dd($user); //for debugging
			return view('errors/503');
		}

	}
}