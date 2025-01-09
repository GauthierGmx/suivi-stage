<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTuteurEntreprisesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tuteur_entreprises', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idTuteur');

            // Attributs
            $table->string('nom',50);
            $table->string('prenom',50);
            $table->string('telephone',12)->nullable();
            $table->string('adresseMail',50)->nullable();
            $table->string('fonction',50)->nullable();

            // Clé étrangère
            $table->string('numSIRET');
            $table->foreign('numSIRET')->references('numSIRET')->on('entreprises');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tuteur_entreprises');
    }
}
