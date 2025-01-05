<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonnelEtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_personnel_etudiant')->insert([
            [
                'idPersonnel' => 1,
                'idEtudiant' => 1
            ],
            [
                'idPersonnel' => 1,
                'idEtudiant' => 2
            ],
            [
                'idPersonnel' => 1,
                'idEtudiant' => 3
            ],
            [
                'idPersonnel' => 1,
                'idEtudiant' => 4
            ],
            [
                'idPersonnel' => 1,
                'idEtudiant' => 5
            ],
            [
                'idPersonnel' => 2,
                'idEtudiant' => 6
            ]
        ]);
    }
}
