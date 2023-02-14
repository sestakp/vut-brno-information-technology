<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTicketsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->boolean('paid');
            $table->timestamps();

            $table->bigInteger('user_id')->unsigned();
            //$table->foreign('user_id')->references('id')->on('users')->delete('cascade');
            
            $table->bigInteger('conference_id')->unsigned();
            //$table->foreign('conference_id')->references('id')->on('conference')->delete('cascade');
        
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tickets');
    }
}
