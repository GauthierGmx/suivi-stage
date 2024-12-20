<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableEtudiantFichedescriptive extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table__etudiant__fichedescriptive', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idEtudiant','idFicheDescriptive']);

            // Clé étrangère
            $table->unsignedInteger('idEtudiant');
            $table->foreign('idEtudiant')->references('idEtudiant')->on('etudiants')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedInteger('idFicheDescriptive');
            $table->foreign('idFicheDescriptive')->references('idFicheDescriptive')->on('fichesDescriptive')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table__etudiant__fichedescriptive');
    }
}
