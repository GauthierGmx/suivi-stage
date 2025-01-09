<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EtudiantTpAnneeunivSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_etudiant_tp_anneeuniv')->insert([
            [
                'idUPPA' => '610000',
                'idTP' => 4,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610001',
                'idTP' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611000',
                'idTP' => 1,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611082',
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610459',
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '613453',
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610000',
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610001',
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611000',
                'idTP' => 1,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611082',
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610459',
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '613453',
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
