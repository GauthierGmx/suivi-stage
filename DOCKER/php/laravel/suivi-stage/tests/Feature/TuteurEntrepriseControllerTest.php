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

        $unEtudiant = Etudiant::first();

        $response = $this->get('/api/etudiants/'.$unEtudiant->idUPPA);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /*
    ================================
        TEST DE LA METHODE UPDATE
    ================================
    */
}
