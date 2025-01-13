<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EtudiantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('etudiants')->insert([
            [
                'idUPPA' => '610000',
                'nom' => 'MONTOURO',
                'prenom' => 'Maxime',
                'adresseMail' => 'mmontour@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 1,
                'idTuteur' => 1
            ],
            [
                'idUPPA' => '610001',
                'nom' => 'CONGUISTI',
                'prenom' => 'Nicolas',
                'adresseMail' => 'nconguisti@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 2,
                'idTuteur' => 2
            ],
            [
                'idUPPA' => '611000',
                'nom' => 'CONSTANS',
                'prenom' => 'Fanny',
                'adresseMail' => 'fconstant@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 3,
                'idTuteur' => 3
            ],
            [
                'idUPPA' => '611082',
                'nom' => 'MARTIN',
                'prenom' => 'Solène',
                'adresseMail' => 'smartin@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 4,
                'idTuteur' => 4
            ],
            [
                'idUPPA' => '610459',
                'nom' => 'VERNIS',
                'prenom' => 'Gabriel',
                'adresseMail' => 'gvernis@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 5,
                'idTuteur' => 5
            ],
            [
                'idUPPA' => '613453',
                'nom' => 'LORIDANT',
                'prenom' => 'Julien',
                'adresseMail' => 'jloridant@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 6,
                'idTuteur' => 6
            ],
            [
                'idUPPA' => '610123',
                'nom' => 'CRUSSIERE',
                'prenom' => 'Lucas',
                'adresseMail' => 'lcrussiere@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 7,
                'idTuteur' => 7
            ],
            [
                'idUPPA' => '610124',
                'nom' => 'LAVERGNE',
                'prenom' => 'Elsa',
                'adresseMail' => 'elavergne@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'idEntreprise' => 2,
                'idTuteur' => 2
            ]
        ]);
    }
}
