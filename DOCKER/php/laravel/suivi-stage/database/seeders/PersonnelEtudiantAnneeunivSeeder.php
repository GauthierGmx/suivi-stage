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
                'idUPPA' => '610000',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 1,
                'idUPPA' => '583303',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '610001',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 3,
                'idUPPA' => '611000',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 4,
                'idUPPA' => '611082',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 5,
                'idUPPA' => '610459',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '613453',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '610124',
                'idAnneeUniversitaire' => 1
            ],
            [
                'idPersonnel' => 1,
                'idUPPA' => '610000',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 1,
                'idUPPA' => '583303',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '610001',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 3,
                'idUPPA' => '611000',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 4,
                'idUPPA' => '611082',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 5,
                'idUPPA' => '610459',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '613453',
                'idAnneeUniversitaire' => 2
            ],
            [
                'idPersonnel' => 2,
                'idUPPA' => '610124',
                'idAnneeUniversitaire' => 2
            ]
        ]);
    }
}
