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
        // Changement du nom de table : "table_etudiant_tp_anneeuniversitaire" (trop long) en "table_etudiant_tp_anneeuniv"
        Schema::create('table_etudiant_tp_anneeuniv', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idEtudiant','idTP','idAnneeUniversitaire'],'etudiant_tp_anneeUniv_primary');

            // Clé étrangère
            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onUpdate('cascade');

            $table->unsignedTinyInteger('idTP');
            $table->foreign('idTP')->references('idTP')->on('t_p_s')->onUpdate('cascade');

            $table->unsignedInteger('idAnneeUniversitaire');
            $table->foreign('idAnneeUniversitaire')->references('idAnneeUniversitaire')->on('annee_universitaires')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Changement du nom de table : "table_etudiant_tp_anneeuniversitaire" (trop long) en "table_etudiant_tp_anneeuniv"
        Schema::dropIfExists('table_etudiant_tp_anneeuniv');
    }
}
