<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTablePersonnelRoleDepartementIUT extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Changement du nom de table : "table_personnel_role_departement_i_u_t" (trop long) en "table_personnel_role_departement"
        Schema::create('table_personnel_role_departement', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->primary(['idPersonnel','idRole','idDepartement'],'personnel_role_departement_primary');

            // Clé étrangère
            $table->unsignedInteger('idPersonnel');
            $table->foreign('idPersonnel')->references('idPersonnel')->on('personnels');

            $table->unsignedTinyInteger('idRole');
            $table->foreign('idRole')->references('idRole')->on('roles');

            $table->unsignedTinyInteger('idDepartement');
            $table->foreign('idDepartement')->references('idDepartement')->on('departement_i_u_t_s');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('table_personnel_role_departement');
    }
}
