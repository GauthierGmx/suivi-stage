<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTDSTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('t_d_s', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->tinyIncrements('idTD');
        
            // Attributs
            $table->string('libelle',2);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('t_d_s');
    }
}
