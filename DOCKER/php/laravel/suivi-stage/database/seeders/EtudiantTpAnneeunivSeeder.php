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
                'idEtudiant' => 1,
                'idTP' => 4,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 2,
                'idTP' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 3,
                'idTP' => 1,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 4,
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 5,
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 6,
                'idTP' => 3,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 1,
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 2,
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 3,
                'idTP' => 1,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 4,
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 5,
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 6,
                'idTP' => 2,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
