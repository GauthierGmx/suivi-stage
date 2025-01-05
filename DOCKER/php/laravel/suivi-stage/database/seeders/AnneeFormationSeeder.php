<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnneeFormationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('annee_formations')->insert([
            [
                'libelle' => 'BUT 1'
            ],
            [
                'libelle' => 'BUT 2'
            ],
            [
                'libelle' => 'BUT 3'
            ]
        ]);
    }
}
