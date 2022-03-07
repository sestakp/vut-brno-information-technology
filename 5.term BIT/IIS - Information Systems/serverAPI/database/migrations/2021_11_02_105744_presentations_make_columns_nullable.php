<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class PresentationsMakeColumnsNullable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('presentations', function (Blueprint $table) {
            $table->dropColumn('photo');
            $table->string('description')->nullable()->change();
            $table->string('tags')->nullable()->change();
            $table->string('location')->nullable()->change();
            $table->string('state')->nullable()->change();
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
        Schema::table('presentations', function (Blueprint $table) {
            $table->string('photo');
            $table->string('description')->nullable(false)->change();
            $table->string('tags')->nullable(false)->change();
            $table->string('location')->nullable(false)->change();
            $table->string('state')->nullable(false)->change();
            $table->dropColumn('image');
        });
    }
}
