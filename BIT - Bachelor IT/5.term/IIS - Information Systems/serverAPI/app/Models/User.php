<?php

/**
* Author: Pavel Šesták
*/

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Conference;
use App\Models\Presentation;
use App\Models\Ticket;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email_verified_at',
        'name',
        'email',
        'password',
        'provider_id',
        'role',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function Presentations(){
        return $this->hasMany(Presentation::class);
    }

    public function Conferences(){
        return $this->hasMany(Conference::class);
    }

    public function Tickets(){
        return $this->hasMany(Ticket::class);
    }

    // this is a recommended way to declare event handlers
    public static function boot() {
    parent::boot();

    static::deleting(function($user) { // before delete() method call this
            $user->Tickets()->delete();
            // do the rest of the cleanup...
        });
    }
}
