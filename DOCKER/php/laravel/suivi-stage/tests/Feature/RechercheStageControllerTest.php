<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

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
    public function test_store_renvoie_une_erreur_generique()
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
            'idEntreprise' => 100,
        ];

        $response = $this->postJson('/api/recherches-stages/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Erreur dans la base de données']);
    }
    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

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
