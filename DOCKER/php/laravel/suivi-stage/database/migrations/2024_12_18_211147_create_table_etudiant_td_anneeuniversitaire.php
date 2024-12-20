<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEtudiantTdAnneeuniversitaire extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_etudiant_td_anneeuniversitaire', function (Blueprint $table) {
            $table->engine = 'InnoDB';
             // Clé primaire
            $table->primary(['idEtudiant','idTD','idAnneeUniversitaire']);

            // Clé étrangère
            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onUpdate('cascade');

            $table->unsignedTinyInteger('idTD');
            $table->foreign('idTD')->references('idTD')->on('TDs')->onUpdate('cascade');

            $table->unsignedInteger('idAnneeUniversitaire');
            $table->foreign('idAnneeUniversitaire')->references('idAnneeUniversitaire')->on('anneesUniversitaire')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_etudiant_td_anneeuniversitaire');
    }
}
