<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TuteurEntrepriseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tuteur_entreprises')->insert([
            [
                'nom' => 'NAVAUD',
                'prenom' => 'Pierre-Louis',
                'fonction' => 'Chef de projet - développeur',
                'idEntreprise' => 1,
            ],
            [
                'nom' => 'GUILLOT',
                'prenom' => 'Romain',
                'fonction' => 'Chef de projet - responsable roadmap produit',
                'idEntreprise' => 2,
            ],
            [
                'nom' => 'ROCQUES',
                'prenom' => 'Lionel',
                'fonction' => 'Chef de projet',
                'idEntreprise' => 3,
            ],
            [
                'nom' => 'BAGIEU',
                'prenom' => 'Pascal',
                'fonction' => 'Responsable scolarité',
                'idEntreprise' => 4,
            ],
            [
                'nom' => 'DARRIEUTORT',
                'prenom' => 'Alban',
                'fonction' => 'Chef de projet - développeur',
                'idEntreprise' => 5,
            ],
            [
                'nom' => 'GUIDICE',
                'prenom' => 'Dorian',
                'fonction' => 'Chef de projet - développeur',
                'idEntreprise' => 6,
            ]
        ]);
    }
}
