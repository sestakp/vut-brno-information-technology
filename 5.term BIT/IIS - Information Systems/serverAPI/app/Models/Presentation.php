<?php

/**
* Author: Pavel Šesták
*/

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Room;
use App\Models\Conference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class Presentation extends Model
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
        'tags',
        'location',
        'start',
        'finish',
        'state',
        'conferences',
        'rooms',
        'user_id',
        'room_id',
        'conference_id',
        'stream_link'
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

    public function Room(){
        return $this->belongsTo(Room::class);
    }

    public function User(){
        return $this->belongsTo(User::class);
    }

    public function Conference(){
        return $this->belongsTo(Conference::class);
    }


    private $errors;

    private $rules = array(
        'conference_id' => ['required', 'exists:conferences,id'],
        'name' => 'required',
        'state' => ['required', 'string', 'regex:/(^(pending)|(approved)|(declined)$)/u' ],
        'start' => 'nullable|before_or_equal:finish|after_or_equal:conference.start',
        'finish' => 'nullable|after_or_equal:start|before_or_equal:conference.finish',
        'presentation_overlap_count' => 'numeric|min:0|max:0'
    );

    public function validate($data)
    {

        $data->conference = Conference::where('id', '=', $data->conference_id)->firstOrFail();

        if($data->room_id !== null){
            $data->presentation_overlap_count =  Presentation::where('room_id', '=', (int)$data->room_id)->where('id', '!=', (int)$data->id)
            ->where(function ($query){ //Inside interval
                $query->where('start', '>=', $this->start)
                ->where('finish', '<=', $this->finish);
            })
            ->orWhere(function ($query){ //Left overlap
                $query->where('start', '<=', $this->start)
                ->where('finish', '>', $this->start);
            })
            ->where('room_id', '=', (int)$data->room_id)->where('id', '!=', (int)$data->id)
            ->orWhere(function ($query){ //Right overlap
                $query->where('start', '<', $this->finish)
                ->where('finish', '>=', $this->finish);
            })
            ->where('room_id', '=', (int)$data->room_id)->where('id', '!=', (int)$data->id)
            ->count();
        }
        else{
            $data->presentation_overlap_count = 0;
        }


        // make a new validator object
        $v = Validator::make($data->toArray(), $this->rules, [
            'presentation_overlap_count.max' => "The room is occupied at this time, pick different time slot or room!"
        ]);


        unset($this->conference);
        unset($this->presentation_overlap_count);

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
            File::delete($this->image);
            $this->image = null;
        }

        if($request->hasFile('file')){
            $path = $request->file("file")->storePublicly("public/files");
            $this->file = Storage::url($path);
        }
        else{
            File::delete($this->file);
            $this->file = null;
        }
    }


}
