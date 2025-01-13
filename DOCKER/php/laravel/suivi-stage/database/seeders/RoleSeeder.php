<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([
            [
                'libelle' => 'Administrateur de département',
                'voirRechercheStageEtudiant' => 0,
                'voirFicheDescriptiveEtudiant' => 0,
                'extraireAttributionEnseignant' => 0,
                'modifierCoptaEtudiantEnseignant' => 1,
                'modifierParametresDepartement' => 1
            ],
            [
                'libelle' => 'Responsable de stage',
                'voirRechercheStageEtudiant' => 1,
                'voirFicheDescriptiveEtudiant' => 1,
                'extraireAttributionEnseignant' => 1,
                'modifierCoptaEtudiantEnseignant' => 0,
                'modifierParametresDepartement' => 0
            ],
            [
                'libelle' => 'Secrétaire de département',
                'voirRechercheStageEtudiant' => 0,
                'voirFicheDescriptiveEtudiant' => 0,
                'extraireAttributionEnseignant' => 1,
                'modifierCoptaEtudiantEnseignant' => 0,
                'modifierParametresDepartement' => 0
            ]
            ]);
    }
}
