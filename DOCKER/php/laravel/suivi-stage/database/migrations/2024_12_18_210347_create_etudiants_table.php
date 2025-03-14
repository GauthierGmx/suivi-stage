<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEtudiantsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('etudiants', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->string('idUPPA', 10)->primary();

            // Attributs
            $table->string('login', 50)->unique();
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('adresse', 100)->nullable();
            $table->string('ville', 50)->nullable();
            $table->string('codePostal', 5)->nullable();
            $table->string('telephone', 12)->nullable();
            $table->string('adresseMail', 100);

            // Clé étrangère
            $table->unsignedTinyInteger('idDepartement');
            $table->foreign('idDepartement')->references('idDepartement')->on('departement_i_u_t_s');

            $table->unsignedInteger('idEntreprise');
            $table->foreign('idEntreprise')->references('idEntreprise')->on('entreprises');

            $table->unsignedInteger('idTuteur');
            $table->foreign('idTuteur')->references('idTuteur')->on('tuteur_entreprises');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('etudiants');
    }
}
