<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ConferenceDeleteCascade extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::table('presentations', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->dropForeign(['room_id']);

            $table->foreign('conference_id')->references('id')->on('conferences')->delete('cascade');
            $table->foreign('room_id')->references('id')->on('rooms')->delete('cascade');
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->foreign('conference_id')->references('id')->on('conferences')->delete('cascade');
        });        
        
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);

            $table->foreign('conference_id')->references('id')->on('conferences')->delete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('presentations', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->dropForeign(['room_id']);
            $table->foreign('conference_id')->references('id')->on('conferences')->delete('null');
            $table->foreign('room_id')->references('id')->on('rooms')->delete('null');
        });

        Schema::table('rooms', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->foreign('conference_id')->references('id')->on('conferences')->delete('null');
        });        
        
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['conference_id']);
            $table->foreign('conference_id')->references('id')->on('conferences')->delete('null');
        });
    }
}
