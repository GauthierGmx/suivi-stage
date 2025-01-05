<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TDSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('t_d_s')->insert([
            [
                'libelle' => 'TD 1'
            ],
            [
                'libelle' => 'TD 2'
            ],
            [
                'libelle' => 'TD 3'
            ]
        ]);
    }
}
