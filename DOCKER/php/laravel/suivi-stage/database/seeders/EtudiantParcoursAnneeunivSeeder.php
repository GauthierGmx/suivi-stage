<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EtudiantParcoursAnneeunivSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_etudiant_parcours_anneeuniv')->insert([
            [
                'idUPPA' => '610000',
                'codeParcours' => 'BBWIA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610001',
                'codeParcours' => 'BBWIA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611000',
                'codeParcours' => 'BBWRA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '611082',
                'codeParcours' => 'BBWIA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610459',
                'codeParcours' => 'BBWIA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '613453',
                'codeParcours' => 'BBWIA2',
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idUPPA' => '610000',
                'codeParcours' => 'BBWIA3',
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610001',
                'codeParcours' => 'BBWIA3',
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611000',
                'codeParcours' => 'BBWRA3',
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '611082',
                'codeParcours' => 'BBWIA3',
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '610459',
                'codeParcours' => 'BBWIA3',
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idUPPA' => '613453',
                'codeParcours' => 'BBWIA3',
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
