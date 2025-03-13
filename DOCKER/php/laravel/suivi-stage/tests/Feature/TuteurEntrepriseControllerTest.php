<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\TuteurEntreprise;
use Tests\TestCase;

class TuteurEntrepriseControllerTest extends TestCase
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
        TEST DE LA METHODE INDEX
    ================================
    */

    /**
     * La méthode index va retourner une confirmation 200 et la liste de toutes les entreprises
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_des_tuteurs_entreprises()
    {
        $desTuteursEntreprises = TuteurEntreprise::all();

        $response = $this->get('/api/tuteur-entreprise');

        $response->assertStatus(200)
                 ->assertJsonCount($desTuteursEntreprises->count());
    }

    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et le tuteur d'entreprise demandé
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_le_tuteur_entreprise_demande(){
        $unTuteurEntreprise = TuteurEntreprise::first();

        $response = $this->get('/api/tuteur-entreprise/'.$unTuteurEntreprise->idTuteur);

        $response->assertStatus(200)
                 ->assertJson($unTuteurEntreprise->toArray());
    }

    /**
     * La méthode show va retourner une confirmation 404 si le tuteur d'entreprise n'existe pas
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_404_si_le_tuteur_entreprise_n_existe_pas(){
        $response = $this->get('/api/tuteur-entreprise/1000');

        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'Aucun tuteur d\'entreprise trouvé'
        ]);
    }

    /**
     * La méthode show va retourner une confirmation 500 si une erreur survient
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle TuteurEntreprise pour déclencher une exception
        $this->mock(\App\Http\Controllers\TuteurEntreprise::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });

        $unTuteur = TuteurEntreprise::first();

        $response = $this->get('/api/tuteur-entreprise/'.$unTuteur->idTuteur);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 et le tuteur d'entreprise créé
     * 
     * @return void
     */

    public function test_store_renvoie_une_confirmation_et_le_tuteur_entreprise_cree(){
        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'adresseMail' => 'john.doe@gmail.com',
            'telephone' => '0601020304',
            'fonction' => 'Responsable RH',
            'idEntreprise' => 3
        ];

        $response = $this->postJson('/api/tuteur-entreprise/create', $data);
        $response->assertStatus(201)
                 ->assertJson($data);
    }


    /**
     * La méthode store va retourner une erreur 422 si les données ne sont pas valides
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_422_si_les_donnees_ne_sont_pas_valides(){
        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'email' => 'john.doe',
            'telephone' => '0601020304',
            'fonction' => 'Responsable RH',
            'idEntreprise' => 1
        ];

        $response = $this->postJson('/api/tuteur-entreprise/create', $data);
        $response->assertStatus(422);
    }

    /**
     * La méthode store va retourner une confirmation 500 si une erreur survient
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle TuteurEntreprise pour déclencher une exception
        $this->mock(\App\Http\Controllers\TuteurEntreprise::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });

        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'adresseMail' => 'john.doe@gmail.com',
            'telephone' => '0601020304',
            'fonction' => 'Responsable RH',
            'idEntreprise' => 3
        ];

        $response = $this->get('/api/tuteur-entreprise/create', $data);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }
    
    /*
    ================================
        TEST DE LA METHODE UPDATE
    ================================
    */
}
