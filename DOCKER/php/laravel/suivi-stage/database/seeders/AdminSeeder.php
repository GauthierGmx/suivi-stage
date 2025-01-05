<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('admins')->insert([
            [
                'motDePasse' => 'admin',
                'sel' => '123456789Abc',
                'idDroit' => 2,
                'idPersonnel' => 3
            ],
            [
                'motDePasse' => 'nimda',
                'sel' => 'cbA987654321',
                'idDroit' => 3,
                'idPersonnel' => 3
            ]
        ]);
    }
}
