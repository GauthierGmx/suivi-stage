<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParametresGenerauxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parametres_generauxes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->tinyIncrements('idParametre');

            // Attributs
            $table->string('libelle',50);
            $table->integer('valeur');
            $table->string('description',100);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parametres_generauxes');
    }
}
