<?php

/**
* Author: Lukáš Plevač
*/

namespace App\Http\Controllers;

use Auth;
use App\Models\Conference;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;

class ConferenceController extends BaseController
{
    protected $conference;

    public function __construct(){
        $this->conference = new Conference();
        parent::__construct($this->conference);
    }

    /**
     * @OA\Get(
     *     path="/api/conferences",
     *     description="Get all conference",
     *     tags={"Conferences"},
     *     @OA\Response(response="200", description="Get all conferences")
     * )
     */
    public function getAll()
    {
        $conferences = $this->conference::with('User')
                            ->withCount('tickets')
                            ->get();

        return $conferences;
    }

      /**
     * @OA\Post(
     *     path="/api/conferences",
     *     description="Create conference",
     *     tags={"Conferences"},
     *     @OA\Response(response="200", description="Create conference")
     * )
     */
    public function create(Request $request)
    {
        $this->conference->loadMedia($request);
        $this->conference->fill($request->all());
        $this->conference->user_id = auth()->user()->id;

        if($this->conference->validate($this->conference)){
            $this->conference->save();
            return $this->conference;
        }
        else{
            return response()->json(['errors' => $this->conference->errors()]);
        }
    }


      /**
     * @OA\Put(
     *     path="/api/conferences",
     *     description="Update conference",
     *     tags={"Conferences"},
     *     @OA\Response(response="200", description="Update conference")
     * )
     */
    public function update(Request $request)
    {


        $id = $request->input('id');
        $this->conference = Conference::findOrFail($id);


        $currentUser = auth()->user();
        if($currentUser->id != $this->conference->user_id && $currentUser->role !== "admin"){

            $errors = new stdClass();
            $errors->name = "Unauthorized access to this conference";
            return response()->json($errors);
        }


        $this->conference->loadMedia($request);

        $this->conference->fill($request->all());





        if($this->conference->validate($this->conference)){

            $this->conference->save();
            return $this->conference;
        }
        else{
            return response()->json(['errors' => $this->conference->errors()]);
        }
    }
}
