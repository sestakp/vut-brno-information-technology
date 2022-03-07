<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array  $input
     * @return \App\Models\User
     */
    public function create(array $input)
    {
            $user = User::where('email', '=', $input['email'])->firstOrNew();
            
            if($user->id != null){
                Validator::make($input, [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => [
                        'required',
                        'string',
                        'email',
                        'max:255',
                    ],
                    'password' => $this->passwordRules()
                ])->validate();
                $input['role'] = "user";
                $input['password'] = Hash::make($input['password']);
                $user->fill($input)->save();
                return $user;
            }
            else{
                Validator::make($input, [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => [
                        'required',
                        'string',
                        'email',
                        'max:255',
                        Rule::unique(User::class),
                    ],
                    'password' => $this->passwordRules()
                ])->validate();

                return User::create([
                    'name' => $input['name'],
                    'email' => $input['email'],
                    'password' => Hash::make($input['password']),
                    'role' => 'user'
                ]);
            }

           
    
    }
}
