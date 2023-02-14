<?php

/**
* Author: Vojtěch Kulíšek
*/

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Models\Conference;
use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;

class TicketController extends BaseController
{
    private $ticket;
    protected $request;

    public function __construct(Request $request){
        $this->ticket = new Ticket();
        parent::__construct($this->ticket);
        $this->request = $request;
    }

    public function getAll()
    {
        $tickets = $this->ticket;
        $user_id = $this->request->input('user_id', null);
        $conference_id = $this->request->input('conference_id', null);

        if($user_id != null){
            $tickets = $tickets->where('user_id', '=', $user_id);
        }
        if($conference_id != null){
            $tickets = $tickets->where('conference_id', '=', $conference_id);
        }
        $tickets = $tickets->with('Conference');
        return $tickets->get();
    }

    public function getVisitors(){
        $tickets = $this->ticket;
        $conference_id = $this->request->input('conference_id', null);

        if($conference_id != null){
            $tickets = $tickets->where('tickets.conference_id', '=', $conference_id);
        }

        $tickets = $tickets->with('User');

        return $tickets->get();
    }


    public function create(Request $request)
    {
        $this->ticket->fill($request->all());

        if($this->ticket->user_id == null){
            $this->ticket->user_id = auth()->user()->id;
        }
        $this->ticket->conference_id = (int)$this->ticket->conference_id;

        //Check if same ticket exist
        if ($this->ticket
        ->where('conference_id', '=', $this->ticket->conference_id)
        ->where('user_id', '=', $this->ticket->user_id)
        ->count() != 0){
            return null;
        }

        //Check if capacity is still ok of conference
        $conference = new Conference();
        $conference = $conference::findOrFail($this->ticket->conference_id);
        $tickets = $this->ticket->where('conference_id', '=', $this->ticket->conference_id);
        $ticketCount = $this->ticket->quantity;
        foreach($tickets as $ticket){
            $ticketCount += $ticket->quantity;
        }

        if($conference->capacity <= $ticketCount){
            return null;
        }

        $this->ticket->status = 'reserved';

        if($this->ticket->validate($this->ticket)){

            $this->ticket->save();
            return $this->ticket;
        }
        else{
            return response()->json(['errors' => $this->ticket->errors()]);
        }
    }
}
