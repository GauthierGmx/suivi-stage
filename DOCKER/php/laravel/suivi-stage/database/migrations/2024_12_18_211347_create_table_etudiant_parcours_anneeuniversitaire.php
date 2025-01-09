<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEtudiantParcoursAnneeuniversitaire extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Changement du nom de table : "table_etudiant_anneeformation_anneeuniversitaire" (trop long) en "table_etudiant_parcours_anneeuniv"
        Schema::create('table_etudiant_parcours_anneeuniv', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idUPPA','codeParcours','idAnneeUniversitaire'],'etudiant_parcours_anneeUniversitaire_primary');

            // Clé étrangère
            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');

            $table->string('codeParcours');
            $table->foreign('codeParcours')->references('codeParcours')->on('parcours');

            $table->unsignedInteger('idAnneeUniversitaire');
            $table->foreign('idAnneeUniversitaire')->references('idAnneeUniversitaire')->on('annee_universitaires');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Changement du nom de table : "table_etudiant_anneeformation_anneeuniversitaire" (trop long) en "table_etudiant_parcours_anneeuniv"
        Schema::dropIfExists('table_etudiant_parcours_anneeuniv');
    }
}
