<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonnelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('personnels', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idPersonnel');

            // Attributs
            $table->enum('roles', ['Gestionnaire','Enseignant']);
            $table->string('nom', 50);
            $table->string('prenom', 50);
            $table->string('adresse', 100)->nullable();
            $table->string('ville', 50)->nullable();
            $table->string('codePostal', 5)->nullable();
            $table->string('telephone', 12);
            $table->string('adresseMail', 50);
            $table->string('longGPS', 20)->nullable();
            $table->string('latGPS', 20)->nullable();
            $table->unsignedTinyInteger('coptaEtudiant');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('personnels');
    }
}
