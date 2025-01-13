<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntreprisesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('entreprises', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->increments('idEntreprise');

            // Attributs
            $table->string('numSIRET',14)->unique();
            $table->string('raisonSociale',100);
            $table->enum('typeEtablissement',['Administration','Association','Entreprise privé','Entreprise public','Mutuelle coopérative','Autre'])->nullable();
            $table->string('adresse',100)->nullable();
            $table->string('ville',50)->nullable();
            $table->string('codePostal',5)->nullable();
            $table->string('pays',50)->nullable();
            $table->string('telephone',12)->nullable();
            $table->string('codeAPE_NAF',5)->nullable();
            $table->enum('statutJuridique',['EI','EURL','SARL','SASU','SAS','SA','SNC','SCS','SCA'])->nullable();
            $table->unsignedSmallInteger('effectif')->nullable();
            $table->string('representantLegal',100)->nullable();
            $table->string('longitudeAdresse',20)->nullable();
            $table->string('latitudeAdresse',20)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entreprises');
    }
}
