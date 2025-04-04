<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\FicheDescriptive;
use Tests\TestCase;
use Tests\Feature\Exception;

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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
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

        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(201)
                 ->assertJson($donnees);
    }

    /**
     * La méthode store doit retourner une erreur 422 si les données ne sont pas valides
     * car la date de création doit être obligatoire et non null
     * 
     * @return void
     */

    public function test_store_doit_retourner_une_erreur_422_si_les_donnees_ne_sont_pas_valides(){
        $donnees = [
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En france",
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

        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode store doit retourner une erreur 500 si une erreur survient lors de l'insertion
     * par exemple une données (clé étrangère n'existe pas)
     * 
     * @return void
     */

    public function test_store_methode_doit_retourner_une_erreur_500_car_une_cle_etrangere_n_existe_pas(){
        $donnees = [
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
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
                 ->assertJson(['message' => 'Erreur dans la base de données']);
    }

    /**
     * La méthode store doit retourner une erreur 500 si une erreur survient lors de l'insertion
     * 
     * @return void
     */

    public function test_store_methode_doit_retourner_une_erreur_500_car_un_probleme_est_survenue(){
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });
        
        $donnees = [
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
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

        // Envoi d'une requête avec des données incorrectes
        $response = $this->postJson('/api/fiche-descriptive/create', $donnees);

        // Vérification que l'API retourne une erreur 500
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion"
        ];

        $rechercheFirst = FicheDescriptive::first();
        $response = $this->putJson('/api/fiche-descriptive/update/'.$rechercheFirst->idFicheDescriptive, $donnees);    
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En france",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
        ];

        $rechercheFirst = FicheDescriptive::first();

        $response = $this->putJson('/api/fiche-descriptive/update/'.$rechercheFirst->idFicheDescriptive, $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }
    
    /**
     * La méthode update doit retourner une erreur 500 car une erreur survient lors de la mise à jour
     * du ici à une clé étrangère qui n'existe pas
     * 
     * @return void
     */
    public function test_update_methode_doit_retourner_une_erreur_500_car_une_erreur_de_base_de_donnees_a_eu_lieu(){
        // Mock du modèle FicheDescriptive pour déclencher une exception
        $this->partialMock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('update')->andThrow(new QueryException('',[],new \Exception('Erreur SQL')));
        });
        
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
        ];

        $rechercheFirst = FicheDescriptive::first();

        $response = $this->putJson('/api/fiche-descriptive/update/'.$rechercheFirst->idFicheDescriptive, $donnees);
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Erreur dans la base de données']);

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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion",
        ];

        $fausseFiche = PHP_INT_MAX;
        $response = $this->putJson('/api/fiche-descriptive/update/'.$fausseFiche, $donnees);

        $response->assertStatus(404)
                 ->assertJson(['error' => 'Fiche descriptive non trouvée']);       
    }

    /**
     * La méthode update doit retourner une erreur 500 si une erreur survient lors de la mise à jour
     * 
     * @return void
     */
    public function test_update_methode_doit_retourner_une_erreur_500_car_un_probleme_est_survenu(){
        // Mock du modèle FicheDescriptive pour déclencher une exception
        $this->partialMock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('update')->andThrow(new \Exception);
        });
        
        $donnees = [
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
            "serviceEntreprise" => "Service informatique",
            "adresseMailStage" => "perigueux@zero-infini.fr",
            "telephoneStage" => "0556010203",
            "adresseStage" => "20 Rue Ernest Guillier",
            "codePostalStage" => "24000",
            "villeStage" => "Périgueux",
            "paysStage" => "France",
            "longitudeStage" => "0.716667",
            "latitudeStage" => "45.183333",
            "statut"=>  "En cours",
            "numeroConvention"=>  "12345-ABCDE",
            "interruptionStage"=>  false,
            "dateDebutInterruption"=>  null,
            "dateFinInterruption"=>  null,
            "personnelTechniqueDisponible"=>  true,
            "materielPrete"=>  "Ordinateur, logiciel de gestion"
        ];

        $rechercheFirst = FicheDescriptive::first();
        $response = $this->putJson('/api/fiche-descriptive/update/'.$rechercheFirst->idFicheDescriptive, $donnees);    
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
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
        $fiches = FicheDescriptive::all();
        
        $response = $this->get('/api/fiche-descriptive');

        $response->assertStatus(200)
                 ->assertJson($fiches->toArray());
    }

    /**
     * La méthode index doit retourner une erreur 500 si une erreur survient lors de la récupération
     * 
     * @return void
     */

    /*public function test_index_methode_doit_retourner_une_erreur_500_si_une_erreur_survient(){
        // Créer un "partial mock" qui simule uniquement la méthode `all` de FicheDescriptive
        $ficheDescriptiveMock = \Mockery::mock('App\Models\FicheDescriptive[all]');  // On ne mock que la méthode all()
        $ficheDescriptiveMock->shouldReceive('all')
                            ->andThrow(new \Exception("Erreur simulée"));

        // Remplacer la méthode all() dans l'application par le mock
        app()->instance('App\Models\FicheDescriptive', $ficheDescriptiveMock);

        // Appeler la route
        $response = $this->get('/fiche-descriptive');

        // Vérifier la réponse
        $response->assertStatus(500)
                ->assertJson([
                    'message' => 'Une erreur s\'est produite :',
                    'erreurs' => 'Erreur simulée',
                ]);
    }*/
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
        $ficheFirst = FicheDescriptive::first();

        // Effectuer la requête GET
        $response = $this->get('/api/fiche-descriptive/'.$ficheFirst->idFicheDescriptive);
    
        // Vérifier le code de statut 200 et la réponse JSON
        $response->assertStatus(200)
                 ->assertJson([
                    //Informations Fiche Descriptive
                     'idFicheDescriptive' => [
                        'value' => $ficheFirst->idFicheDescriptive,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateCreationFicheDescriptive' => [
                        'value' => $ficheFirst->dateCreation,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateDerniereModificationFicheDescriptive' => [
                        'value' => $ficheFirst->dateDerniereModification,
                        'type' => 'ficheDescriptive',
                     ],
                     'contenuStageFicheDescriptive' => [
                        'value' => $ficheFirst->contenuStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'thematiqueFicheDescriptive' => [
                        'value' => $ficheFirst->thematique,
                        'type' => 'ficheDescriptive',
                     ],
                     'sujetFicheDescriptive' => [
                        'value' => $ficheFirst->sujet,
                        'type' => 'ficheDescriptive',
                     ],
                     'fonctionsFicheDescriptive' => [
                        'value' => $ficheFirst->fonctions,
                        'type' => 'ficheDescriptive',
                     ],
                     'tachesFicheDescriptive' => [
                        'value' => $ficheFirst->taches,
                        'type' => 'ficheDescriptive',
                     ],
                     'competencesFicheDescriptive' => [
                        'value' => $ficheFirst->competences,
                        'type' => 'ficheDescriptive',
                     ],
                     'detailsFicheDescriptive' => [
                        'value' => $ficheFirst->details,
                        'type' => 'ficheDescriptive',
                     ],
                     'debutStageFicheDescriptive' => [
                        'value' => $ficheFirst->debutStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'finStageFicheDescriptive' => [
                        'value' => $ficheFirst->finStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'nbJourSemaineFicheDescriptive' => [
                        'value' => $ficheFirst->nbJourSemaine,
                        'type' => 'ficheDescriptive',
                     ],
                     'nbHeureSemaineFicheDescriptive' => [
                        'value' => $ficheFirst->nbHeureSemaine,
                        'type' => 'ficheDescriptive',
                     ],
                     'clauseConfidentialiteFicheDescriptive' => [
                        'value' => $ficheFirst->clauseConfidentialite,
                        'type' => 'ficheDescriptive',
                     ],
                     'serviceEntrepriseFicheDescriptive' => [
                        'value' => $ficheFirst->serviceEntreprise,
                        'type' => 'ficheDescriptive',
                     ],
                     'adresseMailStageFicheDescriptive' => [
                        'value' => $ficheFirst->adresseMailStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'telephoneStageFicheDescriptive' => [
                        'value' => $ficheFirst->telephoneStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'adresseStageFicheDescriptive' => [
                        'value' => $ficheFirst->adresseStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'codePostalStageFicheDescriptive' => [
                        'value' => $ficheFirst->codePostalStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'villeStageFicheDescriptive' => [
                        'value' => $ficheFirst->villeStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'paysStageFicheDescriptive' => [
                        'value' => $ficheFirst->paysStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'statut' => [
                        'value' => $ficheFirst->statut,
                        'type' => 'ficheDescriptive',
                    ],
                     'numeroConventionFicheDescriptive' => [
                        'value' => $ficheFirst->numeroConvention,
                        'type' => 'ficheDescriptive',
                     ],
                     'interruptionStageFicheDescriptive' => [
                        'value' => $ficheFirst->interruptionStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateDebutInterruptionFicheDescriptive' => [
                        'value' => $ficheFirst->dateDebutInterruption,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateFinInterruptionFicheDescriptive' => [
                        'value' => $ficheFirst->dateFinInterruption,
                        'type' => 'ficheDescriptive',
                     ],
                     'personnelTechniqueDisponibleFicheDescriptive' => [
                        'value' => $ficheFirst->personnelTechniqueDisponible,
                        'type' => 'ficheDescriptive',
                     ],
                     'materielPreteFicheDescriptive' => [
                        'value' => $ficheFirst->materielPrete,
                        'type' => 'ficheDescriptive',
                     ],
                     'idEntreprise' => [
                        'value' => $ficheFirst->idEntreprise,
                        'type' => 'ficheDescriptive',
                     ],
                     'idTuteurEntreprise' => [
                        'value' => $ficheFirst->idTuteurEntreprise,
                        'type' => 'ficheDescriptive',
                     ],                 
                 ]);
    }

    /**
     * La méthode show doit retourner une erreur 404 si la fiche descriptive n'existe pas
     * 
     * @return void
     */
    public function test_show_methode_doit_retourner_une_erreur_404_car_la_fiche_descriptive_n_existe_pas(){
        $idFiche = PHP_INT_MAX;
        
        $response = $this->get('/api/fiche-descriptive/'.$idFiche);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Fiche descriptive non trouvée']);
    }

    /**
     * La méthode show doit retourner une erreur 500 si une erreur survient lors de la récupération
     * 
     * @return void
     */
    public function test_show_methode_doit_retourner_une_erreur_500_si_une_erreur_survient(){
        // Mock du modèle FicheDescriptive pour déclencher une exception
        $this->partialMock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception);
        });

        $ficheDescriptive = FicheDescriptive::first();

        $response = $this->get('/api/fiche-descriptive/'.$ficheDescriptive->idFicheDescriptive);
    
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }

    /*
    ==================================
        TEST DE LA METHODE DESTROY
    ==================================
    */

    /**
     * La méthode destroy doit retourner une confirmation 200 et un message de suppression
     * 
     * @return void
     */
    public function test_destroy_doit_retourner_un_code_200()
    {
        $uneFicheDescriptive = FicheDescriptive::first();

        $response = $this->delete('/api/fiche-descriptive/delete/'.$uneFicheDescriptive->idFicheDescriptive);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'La fiche descriptive a bien été supprimée']);
    }

    /**
     * La méthode destroy doit retourner une erreur 404 si la fiche descriptive n'a pas été trouvée
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_non_trouvee_en_cas_de_fiche_non_trouvee()
    {
        $idFiche = PHP_INT_MAX;

        $response = $this->delete('/api/fiche-descriptive/delete/'.$idFiche);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune fiche descriptive trouvée']);
    }

    /**
     * La méthode destroy doit retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle FicheDescriptive pour déclencher une exception
        $this->partialMock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('destroy')->andThrow(new \Exception);
        });

        $uneFicheDescriptive = FicheDescriptive::first();

        $response = $this->delete('/api/fiche-descriptive/delete/'.$uneFicheDescriptive->idFicheDescriptive);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }
}
?>