<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFicheDescriptivesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fiche_descriptives', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idFicheDescriptive');

            // Attributs
            $table->date('dateCreation');
            $table->text('contenuStage')->nullable();
            $table->string('thematique', 50)->nullable();
            $table->string('sujet', 50)->nullable();
            $table->string('fonctions', 50)->nullable();
            $table->string('taches', 50)->nullable();
            $table->string('competences', 50)->nullable();
            $table->string('details', 50)->nullable();
            $table->date('debutStage');
            $table->date('finStage');
            $table->unsignedTinyInteger('nbJourSemaine')->nullable();
            $table->unsignedTinyInteger('nbHeureSemaine')->nullable();
            $table->boolean('clauseConfidentialite')->nullable();
            $table->enum('statut', ['En attente','Validee']);
            $table->string('numeroConvention', 50)->nullable();

            // Clé étrangère
            $table->unsignedInteger('idTuteurEntreprise');
            $table->foreign('idTuteurEntreprise')->references('idTuteurEntreprise')->on('tuteursEntreprise');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fiche_descriptives');
    }
}
