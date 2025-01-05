<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DroitPersonnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_droit_personnel')->insert([
            [
                'idDroit' => 1,
                'idPersonnel' => 1
            ],
            [
                'idDroit' => 1,
                'idPersonnel' => 2
            ],
            [
                'idDroit' => 1,
                'idPersonnel' => 3
            ],
            [
                'idDroit' => 2,
                'idPersonnel' => 3
            ],
            [
                'idDroit' => 3,
                'idPersonnel' => 3
            ],
            [
                'idDroit' => 1,
                'idPersonnel' => 4
            ],
            [
                'idDroit' => 1,
                'idPersonnel' => 5
            ]
        ]);
    }
}
