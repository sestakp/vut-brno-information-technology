<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ConferenceMakeColumnsNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conferences', function (Blueprint $table) {

            $table->string('description')->nullable()->change();
            $table->string('genre')->nullable()->change();
            $table->string('location')->nullable()->change();
   
            $table->unsignedDecimal('price')->nullable()->change();

            $table->string('image')->nullable();
            });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conferences', function (Blueprint $table) {
            $table->$table->dropColumn('image');
            $table->string('description')->nullable(false)->change();
            $table->string('genre')->nullable(false)->change();
            $table->string('location')->nullable(false)->change();
            $table->unsignedDecimal('price')->nullable(false)->change();
        });
    }
}
