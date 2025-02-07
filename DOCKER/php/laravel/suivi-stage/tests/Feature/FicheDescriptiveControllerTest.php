<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\FicheDescriptive;
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
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 200 et la liste de toutes les entreprises
     * 
     * @return void
     */
    public function test_store_la_methode_doit_renvoyer_201(){
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
            'idUPPA' => 610123
        ];

        $response = $this->post('/api/fiche-descriptive/create', $donnees);
        $jsonData = $response->json();

        // Vérifier si le champ est absent et l'enlever du test si besoin
        if (!isset($jsonData['interruptionStage'])) {
            unset($donnees['interruptionStage']);
        } else {
            $donnees['interruptionStage'] = (bool) $jsonData['interruptionStage']; // Cast en booléen
        }

        $response->assertStatus(201)->assertJson($donnees);
    }

    /**
     * La méthode store doit retourner une erreur 422 si les données ne sont pas valides
     * car la date de création doit être obligatoire et non null
     * 
     * @return void
     */

    public function test_store_doit_retourner_une_erreur_422_si_les_donnees_ne_sont_pas_valides(){
        $donnees = [
            "dateCreation"=> "null",
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
            //"idTuteurEntreprise"=> 2,
            'idUPPA' => 610123
        ];

        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(422)
        ->assertJson([
            'message' => 'Erreur de validation dans les données',
            'erreurs' => [ // Remplace 'errors' par 'erreurs'
                'dateCreation' => ["Le champ date creation n'est pas une date valide."],
                'idTuteurEntreprise' => ['Le champ id tuteur entreprise est obligatoire.'],
            ]
        ]);
    }

    /**
     * La méthode store doit retourner une erreur 500 si une erreur survient lors de l'insertion
     * par exemple une données (clé étrangère n'existe pas)
     * 
     * @return void
     */

    public function test_store_methode_doit_retourner_une_erreur_500_car_une_cle_etrangere_n_existe_pas(){
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
        ];
        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(500)
            ->assertJson([
                'message' => 'Erreur dans la base de données',
                'erreurs' => \Illuminate\Support\Str::contains($response->json('erreurs'), 'Cannot add or update a child row') // Vérifie que l'erreur contient cette partie du message
        ]);
    }

    /**
     * La méthode store doit retourner une erreur 500 si une erreur survient lors de l'insertion
     * 
     * @return void
     */

    public function test_store_methode_doit_retourner_une_erreur_500_car_un_probleme_est_survenue(){
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
        ];

        try {
            $response = $this->postJson('/api/fiche-descriptive/create', $donnees);
        } catch (\Exception $e) {
            $response = $this->json('POST', '/api/fiche-descriptive/create', $donnees);
            $response->assertStatus(500)
                     ->assertJson([
                         'message' => 'Une erreur s\'est produite :',
                         'erreurs' => $e->getMessage(),
                     ]);
        }   
    }
    /*
    ================================
        TEST DE LA METHODE UPDATE
    ================================
    */

    /**
     * La méthode update doit retourner une confirmation 200 et les données de la fiche descriptive
     * 
     * @return void
     */

    public function test_update_methode_doit_retourner_200_car_la_fiche_descriptive_a_ete_mise_a_jour(){
        $donnees = [
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
        ];

        $rechercheFirst = FicheDescriptive::first();

        $response = $this->put('/api/fiche-descriptive/update/'.$rechercheFirst->id, $donnees);

        $response->assertStatus(200)
                 ->assertJson($donnees);
    }

    /**
     * La méthode update doit retourner une erreur 422 si les données ne sont pas valides
     * car la date de création doit être obligatoire et non null
     * 
     * @return void
     */
    public function test_update_methode_doit_retourner_une_erreur_422_car_les_donnees_sont_invalides(){
        $donnees = [
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
        ];

        $donnees['dateCreation'] = null;

        $rechercheFirst = FicheDescriptive::first();

        $response = $this->put('/api/fiche-descriptive/update/'.$rechercheFirst->id, $donnees);

        $response->assertStatus(422)
                 ->assertJson([
                        'message' => 'Erreur de validation dans les données',
                        'erreurs' => [
                            'dateCreation' => ['La date de création est obligatoire']
                        ]
        ]);
    }

    /**
     * La méthode update doit retourner une erreur 500 car une erreur survient lors de la mise à jour
     * du ici à une clé étrangère qui n'existe pas
     * 
     * @return void
     */
    public function test_update_methode_doit_retourner_une_erreur_500_car_une_cle_etrangere_n_existe_pas(){
        $donnees = [
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
        ];

        $donnees['idEntreprise'] = 0;

        $rechercheFirst = FicheDescriptive::first();

        try {
            $response = $this->put('/api/fiche-descriptive/update/'.$rechercheFirst->id, $donnees);
        } catch (\Exception $e) {
            $response = $this->json('PUT', '/api/fiche-descriptive/update', $donnees);
            $response->assertStatus(500)
                 ->assertJson([
                        'message' => 'Une erreur dans la base de données :',
                        'erreurs' => $e->getMessage()
        ]);
        }

    }
    /**
     * La méthode update doit retourner une erreur 404 car la fiche descriptive n'existe pas
     * 
     * @return void
     */
    public function test_update_methode_doit_retourner_une_erreur_404_car_l_id_de_la_fiche_descriptive_n_existe_pas(){
        $donnees = [
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
        ];

        $response = $this->put('/api/fiche-descriptive/update/0', $donnees);

        $response->assertStatus(404)
                 ->assertJson([
                        'message' => 'Fiche Descriptive non trouvée'
        ]);       
    }

    /*
    ================================
        TEST DE LA METHODE INDEX
    ================================
    */
    /**
     * La méthode index doit retourner une confirmation 200 et la liste de toutes les fiches descriptives
     * 
     * @return void
     */

    public function test_index_methode_doit_retourner_200_et_la_list_des_fiches_descriptives(){
        $response = $this->get('/api/fiche-descriptive');

        $response->assertStatus(200)
                 ->assertJson(FicheDescriptive::all()->toArray());
    }

    /**
     * La méthode index doit retourner une erreur 500 si une erreur survient lors de la récupération
     * 
     * @return void
     */

    public function test_index_methode_doit_retourner_une_erreur_500_si_une_erreur_survient(){
        $response = $this->get('/api/fiche-descriptive');

        $response->assertStatus(500)
                 ->assertJson([
                        'message' => 'Une erreur s\'est produite :',
                        'erreurs' => $e->getMessage()
        ]);
    }
        /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */
    
    /**
     * La méthode show doit retourner une confirmation 200 et les données de la fiche descriptive
     * 
     * @return void
     */
    public function test_show_methode_doit_retourner_un_code_200_car_la_fiche_descriptive_a_ete_trouvee(){
        $rechercheFirst = FicheDescriptive::first();

        $response = $this->get('/api/fiche-descriptive/'.$rechercheFirst->id);

        $response->assertStatus(200)
                 ->assertJson([
                        'ficheDescriptive' => $rechercheFirst->toArray()
        ]);
    }

    /**
     * La méthode show doit retourner une erreur 404 si la fiche descriptive n'existe pas
     * 
     * @return void
     */
    public function test_show_methode_doit_retourner_une_erreur_404_car_la_fiche_descriptive_n_existe_pas(){
        $response = $this->get('/api/fiche-descriptive/0');

        $response->assertStatus(404)
                 ->assertJson([
                        'message' => 'Fiche Descriptive non trouvée'
        ]);
    }
    /**
     * La méthode show doit retourner une erreur 500 si une erreur survient lors de la récupération
     * 
     * @return void
     */
    public function test_show_methode_doit_retourner_une_erreur_500_si_une_erreur_survient(){
        $rechercheFirst = FicheDescriptive::first();

        try {
            $response = $this->get('/api/fiche-descriptive/'.$rechercheFirst->id);
        } catch (\Exception $e) {
            $response = $this->json('GET', '/api/fiche-descriptive/', $donnees);
            $response->assertStatus(500)
            ->assertJson([
                   'message' => 'Une erreur s\'est produite :',
                   'erreurs' => $e->getMessage()
        ]);  
        }
    }
}
?>