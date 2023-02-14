<?php

/**
* Author: Lukáš Plevač
*/

namespace App\Http\Controllers;

use App\Models\Presentation;
use Illuminate\Http\Request;
use App\Models\Room;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Conference;
use Illuminate\Support\Facades\Storage;

class PresentationController extends BaseController
{
    private $presentation;
    protected $request;

    public function __construct(Request $request){
        $this->presentation = new Presentation();
        parent::__construct($this->presentation);
        $this->request = $request;
    }

    /**
     * @OA\Get(
     *     path="/api/presentations",
     *     description="Get all presentations",
     *     tags={"Presentations"},
     *     @OA\Response(response="200", description="Get all presentations")
     * )
     */
    public function getAll()
    {
        $conference_id = $this->request->input('conference_id', null);

        if($conference_id != null){
            $this->presentation = $this->presentation->where('conference_id', "=", $conference_id);
        }

        $room_id = $this->request->input('room_id', null);

        if($room_id != null){
            $this->presentation = $this->presentation->where('room_id', "=", $room_id);
        }

        $this->presentation = $this->presentation->with('User')->with('Conference')->get();

        //remove unauthorized stream links
        $currentUser = auth()->user();
        if($currentUser == null){
            foreach($this->presentation as $presentation){
                $presentation->stream_link = null;
                $this->presentation->file = null;
            }
        }
        else{
            $currentUser = User::findOrFail($currentUser->id);
            $tickets = Ticket::where('user_id', '=', $currentUser->id)->get();

            foreach($this->presentation as $presentation){
                if($currentUser->role == "admin"){
                    break;
                }

                if(
                    $tickets->where("conference_id", '=', $presentation->conference->id)->count() == 0 &&
                    $currentUser->id != $presentation->conference->user_id &&
                    $currentUser->id != $presentation->user_id
                ){
                    $presentation->stream_link = null;
                    $this->presentation->file = null;
                }
            }
        }


        return $this->presentation;
    }


      /**
     * @OA\Post(
     *     path="/api/presentations",
     *     description="Create presentation",
     *     tags={"Presentations"},
     *     @OA\Response(response="200", description="Create presentation")
     * )
     */
    public function create(Request $request)
    {

        $this->presentation->loadMedia($request);

        $this->presentation->fill($request->all());
        $this->presentation->user_id = auth()->user()->id;

        if($this->presentation->state == null){
            $this->presentation->state = 'pending';
        }

        $conference = Conference::findOrFail($this->presentation->conference_id);
        $currentUser = User::findOrFail(auth()->user()->id);


        if($this->presentation->validate($this->presentation)){

            $this->presentation->save();
            $this->presentation->user = $currentUser;
            return $this->presentation;
        }
        else{
            return response()->json(['errors' => $this->presentation->errors()]);
        }
    }

    /**
     * @OA\Put(
     *     path="/api/presentations",
     *     description="Update presentation",
     *     tags={"Presentations"},
     *     @OA\Response(response="200", description="Update presentation")
     * )
     */
    public function update(Request $request)
    {
        $id = $request->id;
        $this->presentation = $this->presentation::with('Conference')->with('User')->findOrFail($id);

        $this->presentation->loadMedia($request);

        $this->presentation->fill($request->all());

        if($this->presentation->state == null){
            $this->presentation->state = 'pending';
        }

        $conference = Conference::findOrFail($this->presentation->conference_id);
        $currentUser = User::findOrFail(auth()->user()->id);

        if($currentUser->id != $conference->user_id && $currentUser->role != "admin"){
            $this->presentation->room_id = null;
            $this->presentation->state = 'pending';
            $this->presentation->start = null;
            $this->presentation->finish = null;
        }


        if($this->presentation->validate($this->presentation)){

            $this->presentation->save();
            $this->presentation->user = $currentUser;
            return $this->presentation;
        }
        else{
            return response()->json(['errors' => $this->presentation->errors()]);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/presentations/{id}",
     *     description="Update presentation",
     *     tags={"Presentations"},
     *     @OA\Response(response="200", description="Update presentation")
     * )
     */
    public function getById(Request $request)
    {
        $id = $request->id;
        $this->presentation = $this->presentation::with("Conference")->with("User")->with("Room")->findOrFail($id);

        //remove unauthorized stream links
        $currentUser = auth()->user();
        if($currentUser == null){
            $this->presentation->stream_link = null;
            $this->presentation->file = null;
        }
        else{
            $currentUser = User::findOrFail($currentUser->id);
            $tickets = Ticket::where('user_id', '=', $currentUser->id)->get();

            if(
                $tickets->where("conference_id", '=', $this->presentation->conference->id)->count() == 0 &&
                $currentUser->id != $this->presentation->conference->user_id &&
                $currentUser->id != $this->presentation->user_id &&
                $currentUser->role !== "admin"
            ){
                $this->presentation->stream_link = null;
                $this->presentation->file = null;
            }

        }

        return $this->presentation;
    }

}
