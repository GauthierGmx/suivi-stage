<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FicheDescriptiveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('fiche_descriptives')->insert([
            [
                'dateCreation' => '2024-01-01',
                'dateDerniereModification' => '2024-01-01',
                'contenuStage' => 'Développement d\'une application web',
                'thematique' => 'Développement web',
                'sujet' => 'Développement d\'une application web',
                'fonctions' => 'Développeur web',
                'taches' => 'Développement d\'une application web',
                'competences' => 'Connaissances en WebDev',
                'details' => 'Développement d\'une application web',
                'debutStage' => '2024-01-01',
                'finStage' => '2024-06-30',
                'nbJourSemaine' => 5,
                'nbHeureSemaine' => 35,
                'clauseConfidentialite' => 1,
                'statut' => 'En cours',
                'numeroConvention' => '37629',
                'interruptionStage' => 0,
                'dateDebutInterruption' => null,
                'dateFinInterruption' => null,
                'personnelTechniqueDisponible' => 1,
                'materielPrete' => 'Ordinateur, écrans, souris, clavier',
                'numSIRET' => '33530702100030',
                'idTuteurEntreprise' => 1,
                'idUPPA' => '610000',
            ],
            [
                'dateCreation' => '2024-01-01',
                'dateDerniereModification' => '2024-01-01',
                'contenuStage' => 'Développement d\'une application web',
                'thematique' => 'Développement web',
                'sujet' => 'Développement d\'une application web',
                'fonctions' => 'Développeur web',
                'taches' => 'Développement d\'une application web',
                'competences' => 'Connaissances en WebDev',
                'details' => 'Développement d\'une application web',
                'debutStage' => '2024-01-01',
                'finStage' => '2024-06-30',
                'nbJourSemaine' => 5,
                'nbHeureSemaine' => 35,
                'clauseConfidentialite' => 1,
                'statut' => 'Validee',
                'numeroConvention' => '39205',
                'interruptionStage' => 0,
                'dateDebutInterruption' => null,
                'dateFinInterruption' => null,
                'personnelTechniqueDisponible' => 1,
                'materielPrete' => 'Ordinateur, écrans, souris, clavier',
                'numSIRET' => '01020304051234',
                'idTuteurEntreprise' => 2,
                'idUPPA' => '610001',
            ],
            [
                'dateCreation' => '2024-01-01',
                'dateDerniereModification' => '2024-01-01',
                'contenuStage' => 'Développement d\'une application web',
                'thematique' => 'Développement web',
                'sujet' => 'Développement d\'une application web',
                'fonctions' => 'Développeur web',
                'taches' => 'Développement d\'une application web',
                'competences' => 'Connaissances en WebDev',
                'details' => 'Développement d\'une application web',
                'debutStage' => '2024-01-01',
                'finStage' => '2024-06-30',
                'nbJourSemaine' => 5,
                'nbHeureSemaine' => 35,
                'clauseConfidentialite' => 1,
                'statut' => 'Validee',
                'numeroConvention' => '37680',
                'interruptionStage' => 0,
                'dateDebutInterruption' => null,
                'dateFinInterruption' => null,
                'personnelTechniqueDisponible' => 1,
                'materielPrete' => 'Ordinateur, écrans, souris, clavier',
                'numSIRET' => '12345678901234',
                'idTuteurEntreprise' => 7,
                'idUPPA' => '610123'
            ],
            [
                'dateCreation' => '2024-01-01',
                'dateDerniereModification' => '2024-01-01',
                'contenuStage' => 'Développement d\'une application web',
                'thematique' => 'Développement web',
                'sujet' => 'Développement d\'une application web',
                'fonctions' => 'Développeur web',
                'taches' => 'Développement d\'une application web',
                'competences' => 'Connaissances en WebDev',
                'details' => 'Développement d\'une application web',
                'debutStage' => '2024-01-01',
                'finStage' => '2024-06-30',
                'nbJourSemaine' => 5,
                'nbHeureSemaine' => 35,
                'clauseConfidentialite' => 1,
                'statut' => 'Validee',
                'numeroConvention' => '37640',
                'interruptionStage' => 0,
                'dateDebutInterruption' => null,
                'dateFinInterruption' => null,
                'personnelTechniqueDisponible' => 1,
                'materielPrete' => 'Ordinateur, écrans, souris, clavier',
                'numSIRET' => '01020304051234',
                'idTuteurEntreprise' => 2,
                'idUPPA' => '610124'
            ]
        ]);        
    }
}
