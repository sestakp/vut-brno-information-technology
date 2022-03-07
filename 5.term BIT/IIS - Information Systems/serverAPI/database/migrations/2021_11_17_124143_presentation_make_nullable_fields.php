<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PresentationMakeNullableFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {  
        Schema::table('presentations', function (Blueprint $table) {
            $table->dateTime('start')->nullable()->change();
            $table->dateTime('finish')->nullable()->change();
            $table->bigInteger('room_id')->unsigned()->nullable()->change();
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
            $table->dateTime('start')->nullable(false)->change();
            $table->dateTime('finish')->nullable(false)->change();
            $table->bigInteger('room_id')->unsigned()->nullable(false)->change();
        });

    }
}
