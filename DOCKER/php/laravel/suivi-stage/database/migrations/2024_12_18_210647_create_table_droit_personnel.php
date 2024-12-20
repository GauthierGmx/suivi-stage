<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableDroitPersonnel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_droit_personnel', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idDroit','idPersonnel']);
            
            // Clé étrangère
            $table->unsignedInteger('idDroit');
            $table->foreign('idDroit')->references('idDroit')->on('droits')->onDelete('cascade')->onUpdate('cascade');
            
            $table->unsignedInteger('idPersonnel');
            $table->foreign('idPersonnel')->references('idPersonnel')->on('personnels')->onDelete('cascade')->onUpdate('cascade');
            });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_droit_personnel');
    }
}
