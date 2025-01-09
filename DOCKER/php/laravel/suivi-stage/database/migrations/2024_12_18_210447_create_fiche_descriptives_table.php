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
            $table->datetime('dateCreation');
            $table->datetime('dateDerniereModification');
            $table->text('contenuStage')->nullable();
            $table->string('thematique', 50)->nullable();
            $table->string('sujet', 50)->nullable();
            $table->string('fonctions', 50)->nullable();
            $table->string('taches', 50)->nullable();
            $table->string('competences', 50)->nullable();
            $table->string('details', 50)->nullable();
            $table->date('debutStage')->nullable();
            $table->date('finStage')->nullable();
            $table->unsignedTinyInteger('nbJourSemaine')->nullable();
            $table->unsignedTinyInteger('nbHeureSemaine')->nullable();
            $table->boolean('clauseConfidentialite')->nullable();
            $table->enum('statut', ['En cours','Validee','Refusée'])->default('En cours');
            $table->string('numeroConvention', 50)->nullable();
            $table->boolean('interruptionStage')->nullable();
            $table->date('dateDebutInterruption')->nullable();
            $table->date('dateFinInterruption')->nullable();
            $table->boolean('personnelTechniqueDisponible')->nullable();
            $table->text('materielPrete')->nullable();

            // Clé étrangère
            $table->unsignedInteger('idEntreprise');
            $table->foreign('idEntreprise')->references('idEntreprise')->on('entreprises');

            $table->unsignedInteger('idTuteurEntreprise');
            $table->foreign('idTuteurEntreprise')->references('idTuteur')->on('tuteur_entreprises');

            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');
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
