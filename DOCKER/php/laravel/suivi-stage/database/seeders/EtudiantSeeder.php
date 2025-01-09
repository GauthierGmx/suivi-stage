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
                'numSIRET' => '33530702100030',
                'idTuteur' => 1
            ],
            [
                'idUPPA' => '610001',
                'nom' => 'CONGUISTI',
                'prenom' => 'Nicolas',
                'adresseMail' => 'nconguisti@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'numSIRET' => '01020304051234',
                'idTuteur' => 2
            ],
            [
                'idUPPA' => '611000',
                'nom' => 'CONSTANS',
                'prenom' => 'Fanny',
                'adresseMail' => 'fconstant@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'numSIRET' => '89746755100023',
                'idTuteur' => 3
            ],
            [
                'idUPPA' => '611082',
                'nom' => 'MARTIN',
                'prenom' => 'Solène',
                'adresseMail' => 'smartin@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'numSIRET' => '82445767500059',
                'idTuteur' => 4
            ],
            [
                'idUPPA' => '610459',
                'nom' => 'VERNIS',
                'prenom' => 'Gabriel',
                'adresseMail' => 'gvernis@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'numSIRET' => '33027484600030',
                'idTuteur' => 5
            ],
            [
                'idUPPA' => '613453',
                'nom' => 'LORIDANT',
                'prenom' => 'Julien',
                'adresseMail' => 'jloridant@iutbayonne.univ-pau.fr',
                'idDepartement' => 1,
                'numSIRET' => '09080706059876',
                'idTuteur' => 6
            ]
        ]);
    }
}
