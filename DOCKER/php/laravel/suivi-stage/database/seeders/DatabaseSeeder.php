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
        DroitSeeder::class,
        TPSeeder::class,
        TDSeeder::class,
        AnneeFormationSeeder::class,
        AnneeUniversitaireSeeder::class,
        ParametresGenerauxSeeder::class,
        DepartementIUTSeeder::class,
        PersonnelSeeder::class,
        EntrepriseSeeder::class,
        ParcoursSeeder::class,
        AdminSeeder::class,
        TuteurEntrepriseSeeder::class,
        EtudiantSeeder::class,
        FicheDescriptiveSeeder::class,
        RechercheStageSeeder::class,
        DroitPersonnelSeeder::class,
        PersonnelDepartementSeeder::class,
        PersonnelEtudiantAnneeunivSeeder::class,
        EtudiantTpAnneeunivSeeder::class,
        EtudiantTdAnneeunivSeeder::class,
        EtudiantAnneeformAnneeunivSeeder::class
       ]);
    }
}
