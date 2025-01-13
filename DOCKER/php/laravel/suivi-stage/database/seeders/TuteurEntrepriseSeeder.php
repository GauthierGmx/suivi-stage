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
                'telephone' => '0559010203',
                'adresseMail' => 'pnavaud@gmail.com',
                'fonction' => 'Chef de projet - développeur',
                'idEntreprise' => 1,
            ],
            [
                'nom' => 'GUILLOT',
                'prenom' => 'Romain',
                'telephone' => '0559040506',
                'adresseMail' => 'rguillot@gmail.com',
                'fonction' => 'Chef de projet - responsable roadmap produit',
                'idEntreprise' => 2,
            ],
            [
                'nom' => 'ROCQUES',
                'prenom' => 'Lionel',
                'telephone' => '0559070809',
                'adresseMail' => 'lrocques@gmail.com',
                'fonction' => 'Chef de projet',
                'idEntreprise' => 3,
            ],
            [
                'nom' => 'BAGIEU',
                'prenom' => 'Pascal',
                'telephone' => '0559030201',
                'adresseMail' => 'pbagieu@gmail.com',
                'fonction' => 'Responsable scolarité',
                'idEntreprise' => 4,
            ],
            [
                'nom' => 'DARRIEUTORT',
                'prenom' => 'Alban',
                'telephone' => '0559060504',
                'adresseMail' => 'adarrieutort@gmail.com',
                'fonction' => 'Chef de projet - développeur',
                'idEntreprise' => 5,
            ],
            [
                'nom' => 'GUIDICE',
                'prenom' => 'Dorian',
                'telephone' => '0559090807',
                'adresseMail' => 'dguidice@gmail.com',
                'fonction' => 'Chef de projet - développeur',
                 'numSIRET' => '09080706059876'
            ],
            [
                'nom' => 'DUPONT',
                'prenom' => 'Jean',
                'telephone' => '0559020304',
                'adresseMail' => 'jdupont@gmail.com',
                'fonction' => 'Chef de projet - développeur',
                'numSIRET' => '12345678901234'
            ]
        ]);
    }
}
