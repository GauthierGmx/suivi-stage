<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRechercheStagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('recherche_stages', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idRecherche');

            // Attributs
            $table->date('dateCreation');
            $table->date('dateModification');
            $table->date('date1erContact');
            $table->enum('typeContact',['Courrier','Mail','Présentiel','Téléphone','Site de recrutement']);
            $table->string('nomPrenomContact', 50);
            $table->string('fonctionContact', 50);
            $table->string('telephoneContact', 12)->nullable();
            $table->string('adresseMailContact', 50)->nullable();
            $table->date('dateRelance')->nullable();
            $table->enum('statut',['En cours','Validé','Refusé','Relancé'])->default('En cours');

            // Clé étrangère
            $table->string('idUPPA');
            $table->foreign('idUPPA')->references('idUPPA')->on('etudiants');

            $table->string('numSIRET');
            $table->foreign('numSIRET')->references('numSIRET')->on('entreprises');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('recherche_stages');
    }
}
