<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FicheDescriptiveControllerTest extends TestCase
{
    /**
     * Recréer les tables avec les seeders
     * 
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh');
        $this->artisan('db:seed');
    }

    /*
    ================================
        TEST DE LA METHODE CREATE
    ================================
    */

    /**
     * La méthode index va retourner une confirmation 200 et la liste de toutes les entreprises
     * 
     * @return void
     */
    public function test_create_la_methode_doit_renvoyer_201(){
        $donnees = [
            "dateCreation"=> "2025-01-20",
            "dateDerniereModification"=> "2025-01-21",
            "contenuStage"=>  "Développement d'une application web",
            "thematique"=>  "Développement logiciel",
            "sujet"=>  "Création d'un outil de gestion des tâches",
            "fonctions"=>  "Développeur logiciel",
            "taches"=>  "Analyser, développer et tester",
            "competences"=>  "PHP, Laravel, JavaScript",
            "details"=>  "Travail en collaboration avec l'équipe backend",
            "debutStage"=>  "2025-02-01",
            "finStage"=>  "2025-06-30",
            "nbJourSemaine"=>  5,
            "nbHeureSemaine"=>  35,
            "clauseConfidentialite"=>  true,
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
            "idEntreprise"=> 1,
            "idTuteurEntreprise"=> 2,
            'idUPPA' => "640123"
        ]

        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(201)
                 ->assertJson([
                        'message' => 'Fiche Descritpive créée avec succès',
                        'message' => $donnees
        ]);
    }

    /**
     * La méthode create doit retourner une erreur 422 si les données ne sont pas valides
     * car la date de création doit être obligatoire et non null
     * 
     * @return void
     */

    public function test_create_doit_retourner_une_erreur_422_si_les_donnees_ne_sont_pas_valides(){
        $donnees = [
            "dateCreation"=> "2025-01-20",
            "dateDerniereModification"=> "2025-01-21",
            "contenuStage"=>  "Développement d'une application web",
            "thematique"=>  "Développement logiciel",
            "sujet"=>  "Création d'un outil de gestion des tâches",
            "fonctions"=>  "Développeur logiciel",
            "taches"=>  "Analyser, développer et tester",
            "competences"=>  "PHP, Laravel, JavaScript",
            "details"=>  "Travail en collaboration avec l'équipe backend",
            "debutStage"=>  "2025-02-01",
            "finStage"=>  "2025-06-30",
            "nbJourSemaine"=>  5,
            "nbHeureSemaine"=>  35,
            "clauseConfidentialite"=>  true,
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
            "idEntreprise"=> 1,
            "idTuteurEntreprise"=> 2,
            'idUPPA' => "610123"
        ]

        $donnees['dateCreation'] = null;

        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson([
                        'message' => 'Erreur de validation dans les données',
                        'erreurs' => [
                            'dateCreation' => ['La date de création est obligatoire']
                        ]
        ]);
    }

    /**
     * La méthode create doit retourner une erreur 500 si une erreur survient lors de l'insertion
     * par exemple une données (clé étrangère n'existe pas)
     * 
     * @return void
     */

    public function test_create_methode_doit_retourner_une_erreur_500_car_une_cle_etrangere_n_existe_pas(){
        $donnees = [
            "dateCreation"=> "2025-01-20",
            "dateDerniereModification"=> "2025-01-21",
            "contenuStage"=>  "Développement d'une application web",
            "thematique"=>  "Développement logiciel",
            "sujet"=>  "Création d'un outil de gestion des tâches",
            "fonctions"=>  "Développeur logiciel",
            "taches"=>  "Analyser, développer et tester",
            "competences"=>  "PHP, Laravel, JavaScript",
            "details"=>  "Travail en collaboration avec l'équipe backend",
            "debutStage"=>  "2025-02-01",
            "finStage"=>  "2025-06-30",
            "nbJourSemaine"=>  5,
            "nbHeureSemaine"=>  35,
            "clauseConfidentialite"=>  true,
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
            "idEntreprise"=> 1,
            "idTuteurEntreprise"=> 2,
            'idUPPA' => 64105202
        ]
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_example()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
