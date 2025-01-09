<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
       $this->call([
        TPSeeder::class,
        TDSeeder::class,
        AnneeFormationSeeder::class,
        AnneeUniversitaireSeeder::class,
        RoleSeeder::class,
        DepartementIUTSeeder::class,
        PersonnelSeeder::class,
        EntrepriseSeeder::class,
        ParcoursSeeder::class,
        TuteurEntrepriseSeeder::class,
        EtudiantSeeder::class,
        FicheDescriptiveSeeder::class,
        RechercheStageSeeder::class,
        PersonnelDepartementSeeder::class,
        PersonnelEtudiantAnneeunivSeeder::class,
        EtudiantTpAnneeunivSeeder::class,
        EtudiantTdAnneeunivSeeder::class,
        EtudiantAnneeformAnneeunivSeeder::class,
        EtudiantParcoursAnneeunivSeeder::class,
        PersonnelRoleDepartementSeeder::class,
       ]);
    }
}
