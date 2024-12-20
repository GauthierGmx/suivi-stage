<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEtudiantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idEtudiant');

            // Attributs
            $table->string('idUPPA', 10)->unique();
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('adresse', 100);
            $table->string('ville', 50);
            $table->string('codePostal', 5);
            $table->string('telephone', 12);
            $table->string('adresseMail', 50);

            // Clé étrangère
            $table->unsignedTinyInteger('idParcours');
            $table->foreign('idParcours')->references('idParcours')->on('parcours');

            $table->unsignedTinyInteger('idDepartement');
            $table->foreign('idDepartement')->references('idDepartement')->on('departementsIUT');

            $table->unsignedInteger('idEntreprise');
            $table->foreign('idEntreprise')->references('idEntreprise')->on('entreprises');

            $table->unsignedInteger('idTuteurEntreprise');
            $table->foreign('idTuteurEntreprise')->references('idTuteurEntreprise')->on('tuteursEntreprise');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('etudiants');
    }
}
