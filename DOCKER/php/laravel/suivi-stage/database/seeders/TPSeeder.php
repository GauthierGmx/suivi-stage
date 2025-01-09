<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TPSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('t_p_s')->insert([
            [
                'libelle' => 'TP 1'
            ],
            [
                'libelle' => 'TP 2'
            ],
            [
                'libelle' => 'TP 3'
            ],
            [
                'libelle' => 'TP 4'
            ],
            [
                'libelle' => 'TP 5'
            ]
        ]);
    }
}
