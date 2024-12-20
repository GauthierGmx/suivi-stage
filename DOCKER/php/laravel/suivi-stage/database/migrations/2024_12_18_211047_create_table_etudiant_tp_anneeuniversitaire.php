<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEtudiantTpAnneeuniversitaire extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_etudiant_tp_anneeuniversitaire', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idEtudiant','idTP','idAnneeUniversitaire']);

            // Clé étrangère
            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onUpdate('cascade');

            $table->unsignedTinyInteger('idTP');
            $table->foreign('idTP')->references('idTP')->on('TPs')->onUpdate('cascade');

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
        Schema::dropIfExists('table_etudiant_tp_anneeuniversitaire');
    }
}
