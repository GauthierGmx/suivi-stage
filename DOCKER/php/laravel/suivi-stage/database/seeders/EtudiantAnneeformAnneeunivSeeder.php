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
                'idEtudiant' => 1,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 2,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 3,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 4,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 5,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 6,
                'idAnneeFormation' => 2,
                'idAnneeUniversitaire' => 1,
            ],
            [
                'idEtudiant' => 1,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 2,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 3,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 4,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 5,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ],
            [
                'idEtudiant' => 6,
                'idAnneeFormation' => 3,
                'idAnneeUniversitaire' => 2,
            ]
        ]);
    }
}
