<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEtudiantAnneeformationAnneeuniversitaire extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_etudiant_anneeformation_anneeuniversitaire', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idEtudiant','idAnneeFormation','idAnneeUniversitaire']);

            // Clé étrangère
            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onUpdate('cascade');

            $table->unsignedTinyInteger('idAnneeFormation');
            $table->foreign('idAnneeFormation')->references('idAnneeFormation')->on('anneesFormation')->onUpdate('cascade');

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
        Schema::dropIfExists('table_etudiant_anneeformation_anneeuniversitaire');
    }
}
