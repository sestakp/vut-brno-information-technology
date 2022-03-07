<?php

/**
* Author: Vojtěch Kulíšek
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Conference;
use Illuminate\Support\Facades\Validator;

class Ticket extends Model
{
    use HasFactory;

        /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'conference_id',
        'status',
        'quantity'
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

    public function User(){
        return $this->belongsTo(User::class);
    }

    public function Conference(){
        return $this->belongsTo(Conference::class);
    }

    private $errors;

    private $rules = array(
        'user_id' => ['required', 'exists:users,id'],
        'conference_id' => ['required', 'exists:conferences,id'],
        'status' => ['required', 'in:reserved,paid,picked up'],
        'quantity' => 'required|numeric|min:1|max:8',
    );

    public function validate($data)
    {
        // make a new validator object
        $v = Validator::make($data->toArray(), $this->rules);

        // check for failure
        if ($v->fails())
        {
            // set errors and return false
            $this->errors = $v->errors()->ToArray();
            return false;
        }

        // validation pass
        return true;
    }

    public function errors()
    {
        return $this->errors;
    }
}
