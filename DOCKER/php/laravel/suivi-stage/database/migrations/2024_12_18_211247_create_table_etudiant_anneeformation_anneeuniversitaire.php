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
        // Changement du nom de table : "table_etudiant_anneeformation_anneeuniversitaire" (trop long) en "table_etudiant_anneeform_anneeuniv"
        Schema::create('table_etudiant_anneeform_anneeuniv', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idUPPA','idAnneeFormation','idAnneeUniversitaire'],'etudiant_anneeFormation_anneeUniversitaire_primary');

            // Clé étrangère
            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');

            $table->unsignedTinyInteger('idAnneeFormation');
            $table->foreign('idAnneeFormation')->references('idAnneeFormation')->on('annee_formations');

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
        // Changement du nom de table : "table_etudiant_anneeformation_anneeuniversitaire" (trop long) en "table_etudiant_anneeform_anneeuniv"
        Schema::dropIfExists('table_etudiant_anneeform_anneeuniv');
    }
}
