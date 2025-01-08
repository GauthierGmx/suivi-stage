<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EtudiantAnneeformAnneeunivSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_etudiant_anneeform_anneeuniv')->insert([
            [
                'idUPPA' => '610000',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610001',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611000',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611082',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610459',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '613453',
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610000',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610001',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611000',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611082',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610459',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '613453',
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
