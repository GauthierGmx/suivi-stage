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
        // Changement du nom de table : "table_etudiant_td_anneeuniversitaire" (trop long) en "table_etudiant_td_anneeuniv"
        Schema::create('table_etudiant_td_anneeuniv', function (Blueprint $table) {
            $table->engine = 'InnoDB';
             // Clé primaire
            $table->primary(['idUPPA','idTD','idAnneeUniversitaire'],'etudiant_td_anneeUniv_primary');

            // Clé étrangère
            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');

            $table->unsignedTinyInteger('idTD');
            $table->foreign('idTD')->references('idTD')->on('t_d_s');

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
        // Changement du nom de table : "table_etudiant_td_anneeuniversitaire" (trop long) en "table_etudiant_td_anneeuniv"
        Schema::dropIfExists('table_etudiant_td_anneeuniv');
    }
}
