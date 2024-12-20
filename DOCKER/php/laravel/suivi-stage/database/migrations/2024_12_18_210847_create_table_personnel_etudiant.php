<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePersonnelEtudiant extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_personnel_etudiant', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idPersonnel','idEtudiant']);

            // Clé étrangère
            $table->unsignedInteger('idPersonnel');
            $table->foreign('idPersonnel')->references('idPersonnel')->on('personnels')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_personnel_etudiant');
    }
}
