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
                'login' => 'plopisteguy',
                'nom' => 'LOPISTEGUY',
                'prenom' => 'Philippe',
                'telephone' => '+33601020304',
                'adresseMail' => 'philippe.lopisteguy@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16,
                'adresse' => '1 rue de l\'université',
                'ville' => 'Anglet',
                'codePostal' => '64600',
                'longitudeAdresse' => '-1.5',
                'latitudeAdresse' => '43.5'
            ],
            [
                'roles' => 'Enseignant',
                'login' => 'ydourisboure',
                'nom' => 'DOURISBOURE',
                'prenom' => 'Yon',
                'telephone' => '+33601020304',
                'adresseMail' => 'yon.dourisboure@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 8,
                'adresse' => '2 rue du campus',
                'ville' => 'Bayonne',
                'codePostal' => '64100',
                'longitudeAdresse' => '-1.474167',
                'latitudeAdresse' => '43.493056'
            ],
            [
                'roles' => 'Enseignant',
                'login' => 'ycarpentier',
                'nom' => 'CARPENTIER',
                'prenom' => 'Yann',
                'telephone' => '+33601020304',
                'adresseMail' => 'yann.carpentier@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16,
                'adresse' => '10 rue des cordeliers',
                'ville' => 'Bayonne',
                'codePostal' => '64100',
                'longitudeAdresse' => '-1.191667',
                'latitudeAdresse' => '43.483333'
            ],
            [
                'roles' => 'Enseignant',
                'login' => 'svoisin',
                'nom' => 'VOISIN',
                'prenom' => 'Sophie',
                'telephone' => '+33601020304',
                'adresseMail' => 'sophie.voisin@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16,
                'adresse' => '9 rue de la reine Jeanne',
                'ville' => 'Biarrtiz',
                'codePostal' => '64200',
                'longitudeAdresse' => '-1.563611',
                'latitudeAdresse' => '43.480833'
            ],
            [
                'roles' => 'Enseignant',
                'login' => 'mborthwick',
                'nom' => 'BORTHWICK',
                'prenom' => 'Margaret',
                'telephone' => '+33601020304',
                'adresseMail' => 'margaret.borthwick@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 16,
                'adresse' => '1 rue de la poste',
                'ville' => 'Labenne',
                'codePostal' => '40530',
                'longitudeAdresse' => '-1.416667',
                'latitudeAdresse' => '43.583333'
            ],
            [
                'roles' => 'Enseignant',
                'login' => 'cmarquesuzaa',
                'nom' => 'MARQUESUZAA',
                'prenom' => 'Christophe',
                'telephone' => '+33601020304',
                'adresseMail' => 'christophe.marquesuzaa@iutbayonne.univ-pau.fr',
                'coptaEtudiant' => 0,
                'adresse' => '1 rue de la mairie',
                'ville' => 'Saint Jean de Luz',
                'codePostal' => '64500',
                'longitudeAdresse' => '-1.690278',
                'latitudeAdresse' => '43.388056'
            ]
        ]);
    }
}
