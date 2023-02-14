<?php

/**
* Author: Vojtěch Kulíšek
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    use HasFactory;

    protected $fillable = [
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

    public $allRelations = array();

    public static function with($relations){
        $instance = new static;
        if($relations == '*'){
            $relations = $instance->allRelations;
        }
        else if(is_string($relations)){
            $relations = func_get_args();
        }
        return $instance->newQuery()->with($relations);
    }
}
