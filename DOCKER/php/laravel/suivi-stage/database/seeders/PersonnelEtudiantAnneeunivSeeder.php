<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonnelEtudiantAnneeunivSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_personnel_etudiant_anneeuniv')->insert([
            [
                'idPersonnel' => 1,
                'idEtudiant' => 1,
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 2,
                'idEtudiant' => 2,
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 3,
                'idEtudiant' => 3,
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 4,
                'idEtudiant' => 4,
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 5,
                'idEtudiant' => 5,
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 2,
                'idEtudiant' => 6,
                'idAnneeUniversitaire' => 1
            ]
        ]);
    }
}
