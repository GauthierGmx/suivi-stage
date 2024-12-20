<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePersonnelDepartementIUT extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('table_personnel_departement_i_u_t', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idPersonnel','idDepartement']);

            // Clé étrangère
            $table->unsignedInteger('idPersonnel');
            $table->foreign('idPersonnel')->references('idPersonnel')->on('personnels')->onDelete('cascade')->onUpdate('cascade');

            $table->unsignedTinyInteger('idDepartement');
            $table->foreign('idDepartement')->references('idDepartement')->on('departementsIUT')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_personnel_departement_i_u_t');
    }
}
