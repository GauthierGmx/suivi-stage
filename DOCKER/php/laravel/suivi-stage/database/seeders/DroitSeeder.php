<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DroitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('droits')->insert([
            [
                'libelle' => 'Lire fiche étudiant'
            ],
            [
                'libelle' => 'Modifier paramètres parcours'
            ],
            [
                'libelle' => 'Modifier paramètres application'
            ]
        ]);
    }
}
