<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParcoursTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parcours', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->tinyIncrements('idParcours');

            // Attributs
            $table->string('libelle', 50);

            // Clé étrangère
            $table->unsignedTinyInteger('idDepartement');
            $table->foreign('idDepartement')->references('idDepartement')->on('departements_i_u_t_s');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parcours');
    }
}
