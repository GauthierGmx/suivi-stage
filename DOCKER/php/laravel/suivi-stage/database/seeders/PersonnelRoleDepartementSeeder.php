<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PersonnelRoleDepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('table_personnel_role_departement')->insert([
            [
                'idPersonnel' => 3,
                'idRole' => 1,
                'idDepartement' => 1,
            ],
            [
                'idPersonnel' => 3,
                'idRole' => 2,
                'idDepartement' => 1,
            ]
            ]);
    }
}
