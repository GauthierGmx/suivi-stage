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
                'idEtudiant' => 1,
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 2,
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 3,
                'idTD' => 1,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 4,
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 5,
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 6,
                'idTD' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 1,
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 2,
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 3,
                'idTD' => 1,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 4,
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 5,
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 6,
                'idTD' => 2,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
