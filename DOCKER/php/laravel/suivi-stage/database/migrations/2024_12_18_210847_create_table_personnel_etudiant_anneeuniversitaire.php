<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePersonnelEtudiantAnneeuniversitaire extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_personnel_etudiant_anneeuniv', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idPersonnel','idUPPA','idAnneeUniversitaire'],'personnel_etudiant_anneeuniv_primary');

            // Clé étrangère
            $table->unsignedInteger('idPersonnel');
            $table->foreign('idPersonnel')->references('idPersonnel')->on('personnels');

            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');

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
        Schema::dropIfExists('table_personnel_etudiant_anneeuniv');
    }
}
