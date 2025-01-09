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
                'codeParcours' => 'BBWRA2',
                'libelle' => 'BUT 2 - Réalisation d\'Applications : Conception, Développement, Validation',
                'idDepartement' => 1
            ],
            [
                'codeParcours' => 'BBWIA2',
                'libelle' => 'BUT 2 - Intégration d\'Applications et Mangement du Système d\'Informations',
                'idDepartement' => 1
            ],
            [
                'codeParcours' => 'BBWRA3',
                'libelle' => 'BUT 3 - Réalisation d\'Applications : Conception, Développement, Validation',
                'idDepartement' => 1
            ],
            [
                'codeParcours' => 'BBWIA3',
                'libelle' => 'BUT 3 - Intégration d\'Applications et Mangement du Système d\'Informations',
                'idDepartement' => 1
            ]
        ]);
    }
}
