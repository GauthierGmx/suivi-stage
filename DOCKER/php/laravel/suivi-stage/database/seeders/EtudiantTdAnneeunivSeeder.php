<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EtudiantTdAnneeunivSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_etudiant_td_anneeuniv')->insert([
            [
                'idUPPA' => '610000',
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610001',
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611000',
                'idTD' => 1,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611082',
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610459',
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '613453',
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610000',
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610001',
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611000',
                'idTD' => 1,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611082',
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610459',
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '613453',
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
