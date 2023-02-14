<?php

/**
* Author: Lukáš Plevač
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Room;
use App\Models\Presentation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class Conference extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'genre',
        'location',
        'start',
        'finish',
        'price',
        'capacity',
        'user_id'
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
        'start' => 'datetime',
        'finish' => 'datetime',
    ];

    public $allRelations = array('name');

    public function User(){
        return $this->belongsTo(User::class);
    }

    public function Tickets(){
        return $this->hasMany(Ticket::class);
    }

    public function Rooms(){
        return $this->hasMany(Room::class);
    }
    public function Presentations(){
        return $this->hasMany(Presentation::class);
    }

    private $errors;

    private $rules = array(
        'name' => 'required',
        'start' => 'required|date|before_or_equal:finish',
        'finish' => 'required|date|after_or_equal:start',
        'capacity' => 'required|numeric|min:0',
        'price' => 'nullable|numeric|min:0'
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

    public function loadMedia(Request $request){
        if($request->hasFile('image')){
            $path = $request->file("image")->storePublicly("public/images");
            $this->image = Storage::url($path);
        }
        else{
            if($this->image != null){
                File::delete($this->image);
                $this->image = null;
            }
        }
    }

    // this is a recommended way to declare event handlers
    public static function boot() {
        parent::boot();

        static::deleting(function($conference) { // before delete() method call this
                $conference->Presentations()->delete();
                $conference->Rooms()->delete();
                $conference->Tickets()->delete();
                // do the rest of the cleanup...
        });
    }

}
