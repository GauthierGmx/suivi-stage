<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EntrepriseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('entreprises')->insert([
            [
                'numSIRET' => '33530702100030',
                'raisonSociale' => 'ZERO ET L\'INFINI',
                'adresse' => '20 Rue Ernest Guillier',
                'ville' => 'Périgueux',
                'codePostal' => '24000',
                'pays' => 'France',
                'longitudeAdresse' => '0.716667',
                'latitudeAdresse' => '45.183333'
            ],
            [
                'numSIRET' => '01020304051234',
                'raisonSociale' => 'CGI Bordeaux',
                'adresse' => '6 Rue des cometes',
                'ville' => 'Le haillan',
                'codePostal' => '33185',
                'pays' => 'France',
                'longitudeAdresse' => '-0.666667',
                'latitudeAdresse' => '44.833333'
            ],
            [
                'numSIRET' => '89746755100023',
                'raisonSociale' => 'Geek Tonic',
                'adresse' => '50 Avenue du Lac Marion',
                'ville' => 'Biarritz',
                'codePostal' => '64200',
                'pays' => 'France',
                'longitudeAdresse' => '-1.55',
                'latitudeAdresse' => '43.483333'
            ],
            [
                'numSIRET' => '82445767500059',
                'raisonSociale' => 'ESTIA',
                'adresse' => '90 Allée Fausto de Elhuyar',
                'ville' => 'Bidart',
                'codePostal' => '64210',
                'pays' => 'France',
                'longitudeAdresse' => '-1.55',
                'latitudeAdresse' => '43.45'
            ],
            [
                'numSIRET' => '33027484600030',
                'raisonSociale' => 'BCM Informatique',
                'adresse' => '2 Allée Andromède',
                'ville' => 'Anglet',
                'codePostal' => '64600',
                'pays' => 'France',
                'longitudeAdresse' => '-1.5',
                'latitudeAdresse' => '43.5'
            ],
            [
                'numSIRET' => '09080706059876',
                'raisonSociale' => 'CDG 33',
                'adresse' => '25 Rue du cardinal Richaud',
                'ville' => 'Bordeaux',
                'codePostal' => '33000',
                'pays' => 'France',
                'longitudeAdresse' => '-0.566667',
                'latitudeAdresse' => '44.833333'
            ],
            [
                'numSIRET' => '12345678901234',
                'raisonSociale' => 'IUT de Bayonne',
                'adresse' => '2 allée du parc montaury',
                'ville' => 'Anglet',
                'codePostal' => '64600',
                'pays' => 'France',
                'longitudeAdresse' => '-1.50939',
                'latitudeAdresse' => '43.47977'
            ]
        ]);
    }
}
