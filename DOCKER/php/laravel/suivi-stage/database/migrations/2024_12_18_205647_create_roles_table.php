<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->tinyIncrements('idRole');

            // Attributs
            $table->string('libelle', 50);
            $table->boolean('voirRechercheStageEtudiant');
            $table->boolean('voirFicheDescriptiveEtudiant');
            $table->boolean('extraireAttributionEnseignant');
            $table->boolean('modifierCoptaEtudiantEnseignant');
            $table->boolean('modifierParametresDepartement');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
