<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParcoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('parcours')->insert([
            [
                'libelle' => 'Réalisation d\'Applications : Conception, Développement, Validation',
                'idDepartement' => 1
            ],
            [
                'libelle' => 'Intégration d\'Applications et Mangement du Système d\'Informations',
                'idDepartement' => 1
            ]
        ]);
    }
}
