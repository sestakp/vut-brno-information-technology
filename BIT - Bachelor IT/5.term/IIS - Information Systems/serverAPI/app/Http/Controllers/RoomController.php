<?php

/**
* Author: Vojtěch Kulíšek
*/

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
//use Request;

class RoomController extends BaseController
{
    private $room;
    protected $request;
    public function __construct(Request $request){
        $this->room = new Room();
        parent::__construct($this->room);
        $this->request = $request;
    }

    public function getAll()
    {
        $conference_id = $this->request->input('conference_id', null);

        $rooms = $this->room;

        //Filter only for current conferencef
        if($conference_id != null){
            $rooms = $rooms->where('conference_id', "=", $conference_id);
        }

        $rooms = $rooms->join('conferences', 'rooms.conference_id', '=', 'conferences.id')
        ->select('rooms.*','conferences.user_id');

        return $rooms->get();
    }
}
