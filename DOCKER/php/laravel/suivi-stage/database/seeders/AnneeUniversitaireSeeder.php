<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnneeUniversitaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('annee_universitaires')->insert([
            [
                'libelle' => '2023-2024'
            ],
            [
                'libelle' => '2024-2025'
            ]
        ]);
    }
}
