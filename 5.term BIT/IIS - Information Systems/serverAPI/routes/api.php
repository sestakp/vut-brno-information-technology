<?php

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\PresentationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



Route::middleware(['auth:sanctum'])->group(function(){

    Route::get('/user', function (Request $request) {
        return new UserResource($request->user());
    });
    
    
    Route::middleware(['roleChecker:admin,null'])
        ->get('/users', [UserController::class,'getAllUsers']);
    
    Route::middleware(['roleChecker:admin,null'])
        ->delete('/users', [UserController::class,'deleteUser']);
    
    Route::put('/users', [UserController::class,'updateUser']);

    //Tickets
    Route::get('/tickets', [TicketController::class, 'getAll']);
    Route::put('/tickets', [TicketController::class, 'update']);
    Route::delete('/tickets', [TicketController::class, 'delete']);
    Route::get('/tickets/getById', [TicketController::class, 'getById']);
    Route::get('/tickets/getVisitors', [TicketController::class, 'getVisitors']);

    //Conferences
    Route::post('/conferences', [ConferenceController::class, 'create']);
    Route::put('/conferences', [ConferenceController::class, 'update']);
    Route::delete('/conferences', [ConferenceController::class, 'delete']);

    //Presentations
    Route::post('/presentations', [PresentationController::class, 'create']);
    Route::put('/presentations', [PresentationController::class, 'update']);
    Route::delete('/presentations', [PresentationController::class, 'delete']);

    //Rooms
    Route::post('/rooms', [RoomController::class, 'create']);
    Route::put('/rooms', [RoomController::class, 'update']);
    Route::delete('/rooms', [RoomController::class, 'delete']);
});
  //Unregister user can reserve tickets
  Route::post('/users/registerGuestAccount', [UserController::class, 'registerGuestAccount']);
  Route::post('/tickets', [TicketController::class, 'create']);


  //Conferences
  Route::get('/conferences', [ConferenceController::class, 'getAll']);
  Route::get('/conferences/getById', [ConferenceController::class, 'getById']);
  

  //Presentations
  Route::get('/presentations', [PresentationController::class, 'getAll']);
  Route::get('/presentations/getById', [PresentationController::class, 'getById']);

  //Rooms
  Route::get('/rooms', [RoomController::class, 'getAll']);
  Route::get('/rooms/getById', [RoomController::class, 'getById']);

