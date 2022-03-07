<?php

/**
* Author: Pavel Šesták
*/

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function getAllUsers(){
        return User::select('name', 'email', 'role', 'id')->get();
    }

    public function updateUser(){

        $request = Request();

        $user = User::where('email', '=', $request->old_email)->firstOrNew();

        $currentUser = User::findOrFail(auth()->user()->id);
        if($user->id !== $currentUser->id && $currentUser->role !== "admin"){
            return;
        }

        if($currentUser->role != "admin" && $user->role != $request->role){
            return;
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [ 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', 'regex:/(^(user)|(admin)$)/u' ]
          ]);

        $data = $request->all();

        //TODO...validate
        Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        /*
        if($data->email !== $user->email){
            $data->email_verified_at = null;
            $user->sendEmailVerificationNotification();
        }*/

        $user->fill($data)->save();
    }

    public function deleteUser(Request $request)
    {
        $id = $request->id;
        $model = User::findOrFail($id);
        $model->Presentations()->delete();
        $model->Conferences()->delete();
        $model->Tickets()->delete();

        return $model->delete();
    }

    public function registerGuestAccount(){
        $request = Request();

        $user = User::where('email', '=', $request->email)->firstOrNew();

        if($user->id != null && $user->role != "guest"){
            return null;
        }

        if($user->email != null){
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [ 'required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
                'role' => ['required', 'string', 'regex:/(^(guest)$)/u' ]
              ]);
        }
        else{
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [ 'required', 'string', 'email', 'max:255', Rule::unique('users')],
                'role' => ['required', 'string', 'regex:/(^(guest)$)/u' ]
              ]);
        }

        $data = $request->all();

        //TODO...validate
        Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        $user->fill($data)->save();

        return $user;
    }
}
