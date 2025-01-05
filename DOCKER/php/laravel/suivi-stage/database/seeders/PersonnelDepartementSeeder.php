<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonnelDepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_personnel_departement_i_u_t')->insert([
            [
                'idPersonnel' => 1,
                'idDepartement' => 1
            ],
            [
                'idPersonnel' => 2,
                'idDepartement' => 1
            ],
            [
                'idPersonnel' => 3,
                'idDepartement' => 1
            ],
            [
                'idPersonnel' => 4,
                'idDepartement' => 1
            ],
            [
                'idPersonnel' => 5,
                'idDepartement' => 1
            ],
            [
                'idPersonnel' => 5,
                'idDepartement' => 2
            ]
        ]);
    }
}
