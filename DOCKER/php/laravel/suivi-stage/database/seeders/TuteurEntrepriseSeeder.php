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
                'numSIRET' => '33530702100030',
            ],
            [
                'nom' => 'GUILLOT',
                'prenom' => 'Romain',
                'fonction' => 'Chef de projet - responsable roadmap produit',
                'numSIRET' => '01020304051234',
            ],
            [
                'nom' => 'ROCQUES',
                'prenom' => 'Lionel',
                'fonction' => 'Chef de projet',
                'numSIRET' => '89746755100023',
            ],
            [
                'nom' => 'BAGIEU',
                'prenom' => 'Pascal',
                'fonction' => 'Responsable scolarité',
                'numSIRET' => '82445767500059',
            ],
            [
                'nom' => 'DARRIEUTORT',
                'prenom' => 'Alban',
                'fonction' => 'Chef de projet - développeur',
                'numSIRET' => '33027484600030',
            ],
            [
                'nom' => 'GUIDICE',
                'prenom' => 'Dorian',
                'fonction' => 'Chef de projet - développeur',
                'numSIRET' => '09080706059876',
            ],
            [
                'nom' => 'DUPONT',
                'prenom' => 'Jean',
                'fonction' => 'Chef de projet - développeur',
                'numSIRET' => '12345678901234'
            ]
        ]);
    }
}
