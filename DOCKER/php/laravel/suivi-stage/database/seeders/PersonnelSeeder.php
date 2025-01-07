<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('personnels')->insert([
            [
                'roles' => 'Enseignant',
                'nom' => 'LOPISTEGUY',
                'prenom' => 'Philippe',
                'telephone' => '+33601020304',
                'adresseMail' => 'philippe.lopisteguy@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16
            ],
            [
                'roles' => 'Enseignant',
                'nom' => 'DOURISBOURE',
                'prenom' => 'Yon',
                'telephone' => '+33601020304',
                'adresseMail' => 'yon.dourisboure@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 8
            ],
            [
                'roles' => 'Enseignant',
                'nom' => 'CARPENTIER',
                'prenom' => 'Yann',
                'telephone' => '+33601020304',
                'adresseMail' => 'yann.carpentier@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16
            ],
            [
                'roles' => 'Enseignant',
                'nom' => 'VOISIN',
                'prenom' => 'Sophie',
                'telephone' => '+33601020304',
                'adresseMail' => 'sophie.voisin@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16
            ],
            [
                'roles' => 'Enseignant',
                'nom' => 'BORTHWICK',
                'prenom' => 'Margaret',
                'telephone' => '+33601020304',
                'adresseMail' => 'margaret.borthwick@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16
            ]
        ]);
    }
}
