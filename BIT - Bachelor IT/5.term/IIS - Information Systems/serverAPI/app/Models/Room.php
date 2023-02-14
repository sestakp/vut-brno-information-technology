<?php

/**
* Author: Lukáš Plevač
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Presentation;
use App\Models\Conference;

class Room extends Model
{
    use HasFactory;

        /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'conference_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [

    ];


    public function Conference(){
        return $this->belongsTo(Conference::class);
    }

    public function Presentations(){
        return $this->hasMany(Presentation::class);
    }

    // this is a recommended way to declare event handlers
    public static function boot() {
        parent::boot();

        static::deleting(function($room) { // before delete() method call this
                $room->Presentations()->delete();
                // do the rest of the cleanup...
        });
    }
}
