<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresentationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('presentations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description');
            $table->string('tags');
            $table->string('location');
            $table->string('photo');
            $table->dateTime('start');
            $table->dateTime('finish');
            $table->string('state');
            $table->timestamps();


            $table->bigInteger('user_id')->unsigned();
            //$table->foreign('user_id')->references('id')->on('users')->delete('cascade');
        
            $table->bigInteger('room_id')->unsigned();
            //$table->foreign('room_id')->references('id')->on('room')->delete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('presentations');
    }
}
