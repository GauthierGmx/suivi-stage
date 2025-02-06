<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\RechercheStage;

class RechercheStageControllerTest extends TestCase
{
    /**
     * Recréer les tables avec ces seeders
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
        TEST DE LA METHODE INDEX
    ================================
    */

    /**
     * La méthode index va retourner une confirmation 200 et la liste de toutes les recherches de stage
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_des_recherches_de_stage()
    {
        $response = $this->get('/api/recherches-stages');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                    '*' => [
                        'idRecherche',
                        'dateCreation',
                        'dateModification',
                        'date1erContact',
                        'typeContact',
                        'nomContact',
                        'prenomContact',
                        'fonctionContact',
                        'telephoneContact',
                        'adresseMailContact',
                        'observations',
                        'dateRelance',
                        'statut',
                        'idUPPA',
                        'idEntreprise',
                    ]
                 ]);
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 pour la recherche de stage
     *
     * @return void
     */
    public function test_store_renvoie_une_confirmation_de_la_creation_de_la_recherche()
    {
        $donnees = [
            'dateCreation' => now()->toDateString(),
            'dateModification' => now()->toDateString(),
            'date1erContact' => now()->toDateString(),
            'typeContact' => 'Mail',
            'nomContact' => 'Doe',
            'prenomContact' => 'John',
            'fonctionContact' => 'Manager',
            'telephoneContact' => '+33612345678',
            'adresseMailContact' => 'john.doe@example.com',
            'observations' => 'Aucune observation',
            'dateRelance' => now()->toDateString(),
            'statut' => 'En cours',
            'idUPPA' => '610000',
            'idEntreprise' => 1,
        ];

        $response = $this->postJson('/api/recherches-stages/create', $donnees);

        $response->assertStatus(201)
                 ->assertJson([
                        'message' => 'Recherche de stage créée avec succès',
                        'rechercheStage' => $donnees
        ]);
    }

    /**
     * La méthode store va retourner une erreur 422 si une donnée n'est pas validée
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_de_validation()
    {
        $donnees = [
            'dateCreation' => null,
            'dateModification' => now()->toDateString(),
            'date1erContact' => now()->toDateString(),
            'typeContact' => 'Mail',
            'nomContact' => 'Doe',
            'prenomContact' => 'John',
            'fonctionContact' => 'Manager',
            'telephoneContact' => '+33612345678',
            'adresseMailContact' => 'john.doe@example.com',
            'observations' => 'Aucune observation',
            'dateRelance' => now()->toDateString(),
            'statut' => 'En cours',
            'idUPPA' => '610000',
            'idEntreprise' => 1,
        ];

        $response = $this->postJson('/api/recherches-stages/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode store va retourner une erreur 500 en cas d'une QueryException
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_erreur_dans_la_base_de_donnees()
    {
        $donnees = [
            'dateCreation' => now()->toDateString(),
            'dateModification' => now()->toDateString(),
            'date1erContact' => now()->toDateString(),
            'typeContact' => 'Mail',
            'nomContact' => 'Doe',
            'prenomContact' => 'John',
            'fonctionContact' => 'Manager',
            'telephoneContact' => '+33612345678',
            'adresseMailContact' => 'john.doe@example.com',
            'observations' => 'Aucune observation',
            'dateRelance' => now()->toDateString(),
            'statut' => 'En cours',
            'idUPPA' => '610000',
            'idEntreprise' => PHP_INT_MAX, // Fausse ID entreprise
        ];

        $response = $this->postJson('/api/recherches-stages/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Erreur dans la base de données']);
    }

    /**
     * La méthode store va retourner une erreur 500 en cas d'exception
     * 
     * @return void 
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\RechercheStageController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });

        $donnees = [
            'dateCreation' => now()->toDateString(),
            'dateModification' => now()->toDateString(),
            'date1erContact' => now()->toDateString(),
            'typeContact' => 'Mail',
            'nomContact' => 'Doe',
            'prenomContact' => 'John',
            'fonctionContact' => 'Manager',
            'telephoneContact' => '+33612345678',
            'adresseMailContact' => 'john.doe@example.com',
            'observations' => 'Aucune observation',
            'dateRelance' => now()->toDateString(),
            'statut' => 'En cours',
            'idUPPA' => '610000',
            'idEntreprise' => 1,
        ];

        $response = $this->postJson('/api/recherches-stages/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }


    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et les détails de la recherche de stage
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_informations_de_la_recherche_de_stage()
    {
        $uneRecherche = RechercheStage::first();

        $response = $this->get('/api/recherches-stages/'.$uneRecherche->idRecherche);

        $response->assertStatus(200)
                 ->assertJson(['rechercheStage' => [
                    'idRecherche' => $uneRecherche->idRecherche,
                    'dateCreation' => $uneRecherche->dateCreation,
                    'dateModification' => $uneRecherche->dateModification,
                    'date1erContact' => $uneRecherche->date1erContact,
                    'typeContact' => $uneRecherche->typeContact,
                    'nomContact' => $uneRecherche->nomContact,
                    'prenomContact' => $uneRecherche->prenomContact,
                    'fonctionContact' => $uneRecherche->fonctionContact,
                    'telephoneContact' => $uneRecherche->telephoneContact,
                    'adresseMailContact' => $uneRecherche->adresseMailContact,
                    'observations' => $uneRecherche->observations,
                    'dateRelance' => $uneRecherche->dateRelance,
                    'statut' => $uneRecherche->statut,
                    'idUPPA' => $uneRecherche->idUPPA,
                    'idEntreprise' => $uneRecherche->idEntreprise,
                 ]
                 ]);
    }

    /**
     * La méthode show va retourner une confirmation 404 si la recherche de stage n'a pas été trouvée
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_non_trouvee()
    {
        $idRecherche = PHP_INT_MAX;

        $response = $this->get('/api/recherches-stages/'.$idRecherche);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune recherche de stage trouvée']);
    }

    /**
     * La méthode show va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_generique()
    {
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\RechercheStageController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });

        $uneRecherhe = RechercheStage::first();

        $response = $this->get('/api/recherches-stages/'.$uneRecherhe->idRecherche);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    =================================
        TEST DE LA METHODE UPDATE
    =================================
    */

    /*
    ==================================
        TEST DE LA METHODE DESTROY
    ==================================
    */


    public function tearDown(): void
    {
        parent::tearDown();
    }
}
