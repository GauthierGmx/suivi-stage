<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnneeFormationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annee_formations', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            // Clé primaire
            $table->tinyIncrements('idAnneeFormation');
            
            // Attributs
            $table->string('libelle',6);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('annee_formations');
    }
}
