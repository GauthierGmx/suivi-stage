<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\AnneeUniversitaire;

class AnneeUniversitaireControllerTest extends TestCase
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
     * La méthode index va retourner une confirmation 200 et la liste des années universitaires
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_des_annees_universitaires()
    {
        $anneesUniversitaires = AnneeUniversitaire::all();

        $response = $this->get('/api/annee-universitaire');

        $response->assertStatus(200)
                 ->assertJson($anneesUniversitaires->toArray());
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 et l'année universitaire créée
     * 
     * @return void
     */
    public function test_store_renvoie_une_confirmation_et_l_annee_universitaire_creee()
    {
        $donnees = [
            'libelle' => '2025-2026',
        ];

        $response = $this->post('/api/annee-universitaire/create', $donnees);

        $response->assertStatus(201)
                 ->assertJson($donnees);
    }

    /**
     * La méthode store va retourner une erreur 422 si les données ne sont pas valides
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_de_validation()
    {
        $donnees = [
            'libelle' => null
        ];

        $response = $this->post('/api/annee-universitaire/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation des données']);
    }

    /**
     * La méthode store va retourner une erreur 500 si une exception est levée
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle AnneeUniversitaire pour déclencher une exception
        $this->mock(\App\Http\Controllers\AnneeUniversitaireController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });

        $donnees = [
            'libelle' => '2025-2026',
        ];

        $response = $this->post('/api/annee-universitaire/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et les détails de l'année universitaire
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_informations_de_l_annee_universitaire()
    {
        $anneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->get('/api/annee-universitaire/'.$anneeUniversitaire->idAnneeUniversitaire);

        $response->assertStatus(200)
                 ->assertJson($anneeUniversitaire->toArray());
    }

    /**
     * La méthode show va retourner une erreur 404 si l'année universitaire n'a pas été trouvée
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_non_trouvee_en_cas_d_annee_universitaire_non_trouvee()
    {
        $idAnneeUniversitaire = PHP_INT_MAX;

        $response = $this->get('/api/annee-universitaire/'.$idAnneeUniversitaire);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune année universitaire trouvée']);
    }

    /**
     * La méthode show va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle AnneeUniversitaire pour déclencher une exception
        $this->mock(\App\Http\Controllers\AnneeUniversitaireController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });

        $uneAnneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->get('/api/annee-universitaire/'.$uneAnneeUniversitaire->idAnneeUniversitaire);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    =================================
        TEST DE LA METHODE UPDATE
    =================================
    */

    /**
     * La méthode update va retourner une confirmation 200 et l'année universitaire modifiée
     * 
     * @return void
     */
    public function test_update_renvoie_une_confirmation_et_l_annee_universitaire_modifiee()
    {
        $donnees = [
            'libelle' => '2000-2001',
        ];

        $uneAnneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->putJson('/api/annee-universitaire/update/'.$uneAnneeUniversitaire->idAnneeUniversitaire, $donnees);

        $response->assertStatus(200)
                 ->assertJson($donnees);
    }

    /**
     * La méthode update va retourner une erreur 422 si une donnée n'est pas valide
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_de_validation_en_cas_de_donnees_invalides()
    {
        $donnees = [
            'libelle' => null,
        ];

        $uneAnneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->putJson('/api/annee-universitaire/update/'.$uneAnneeUniversitaire->idAnneeUniversitaire, $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode update va retourner une erreur 404 si l'année universitaire n'a pas été trouvée
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_non_trouvee_en_cas_d_annee_universitaire_non_trouvee()
    {
        $idAnneeUniversitaire = PHP_INT_MAX;

        $donnees = [
            'libelle' => '2000-2001',
        ];

        $response = $this->putJson('/api/annee-universitaire/update/'.$idAnneeUniversitaire, $donnees);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune année universitaire trouvée']);
    }

    /**
     * La méthode update va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle AnneeUniversitaire pour déclencher une exception
        $this->mock(\App\Http\Controllers\AnneeUniversitaireController::class, function ($mock) {
            $mock->shouldReceive('update')->andThrow(new \Exception('Erreur simulée'));
        });

        $donnees = [
            'libelle' => '2000-2001',
        ];

        $uneAnneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->putJson('/api/annee-universitaire/update/'.$uneAnneeUniversitaire->idAnneeUniversitaire, $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ==================================
        TEST DE LA METHODE DESTROY
    ==================================
    */

    /**
     * La méthode destroy va retourne une confirmation 200 si la recherche de stage a été supprimée
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_confirmation_de_la_suppression_de_l_annee_universitaire()
    {
        $uneAnneeUniversitaire = AnneeUniversitaire::orderBy('idAnneeUniversitaire', 'desc')->first();

        $response = $this->delete('/api/annee-universitaire/delete/'.$uneAnneeUniversitaire->idAnneeUniversitaire);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'L\'année universitaire a bien été supprimée']);
    }

    /**
     * La méthode destroy va retourner une erreur 404 si l'année universitaire n'a pas été trouvée
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_non_trouvee_en_cas_d_annee_universitaire_non_trouvee()
    {
        $idAnneeUniversitaire = PHP_INT_MAX;

        $response = $this->delete('/api/annee-universitaire/delete/'.$idAnneeUniversitaire);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune année universitaire trouvée']);
    }

    /**
     * La méthode destroy va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle AnneeUniversitaire pour déclencher une exception
        $this->mock(\App\Http\Controllers\AnneeUniversitaireController::class, function ($mock) {
            $mock->shouldReceive('destroy')->andThrow(new \Exception('Erreur simulée'));
        });

        $uneAnneeUniversitaire = AnneeUniversitaire::first();

        $response = $this->delete('/api/annee-universitaire/delete/'.$uneAnneeUniversitaire->idAnneeUniversitaire);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }

}
