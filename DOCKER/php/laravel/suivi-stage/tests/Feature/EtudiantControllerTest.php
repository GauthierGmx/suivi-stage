<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\RechercheStage;
use App\Models\Etudiant;

class EtudiantControllerTest extends TestCase
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

    /*
    ===============================================
        TEST DE LA METHODE INDEXRECHERCHESTAGE
    ===============================================
    */

    /**
     * La méthode indexRechercheStage va retourner une confirmation 200 et toutes les recherches de stages de l'étudiant
     * 
     * @return void
     */
    public function test_indexRechercheStage_renvoie_une_confirmation_et_toutes_les_recherches_de_stage_de_l_etudiant()
    {
        $idEtudiant ='611082';
        $rechercheStage = RechercheStage::where('idUPPA', $idEtudiant)->get();

        $response = $this->get('/api/etudiants/'.$idEtudiant.'/recherches-stages');

        $response->assertStatus(200)
                 ->assertJson(["recherchesStage" => $rechercheStage->toArray()]);
    }

    /**
     * La méthode indexRechercheStage va retourner une erreur 404 en précisant que l'étudiant n'a pas de recherche de stage
     * 
     * @return void
     */
    public function test_indexRechercheStage_renvoie_une_erreur_404_en_precisant_que_l_etudiant_n_a_pas_de_recherche_de_stage()
    {
        $idEtudiant = '610001';
        
        $response = $this->get('/api/etudiants/'.$idEtudiant.'/recherches-stages');

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune recherche de stage trouvée pour cet étudiant']);
    }

    /**
     * La méthode indexRechercheStage va retourner une erreur 404 si l'étudiant n'a pas été trouvé
     * 
     * @return void
     */
    public function test_indexRechercheStage_renvoie_une_erreur_404_si_l_etudiant_n_a_pas_ete_trouvee()
    {
        $idEtudiant = PHP_INT_MAX;
        
        $response = $this->get('/api/etudiants/'.$idEtudiant.'/recherches-stages');

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun étudiant trouvé']);
    }

    /**
     * La méthode indexRechercheStage va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_indexRechercheStage_renvoie_une_erreur_500_en_cas_d_exception()
    {
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\EtudiantController::class, function ($mock) {
            $mock->shouldReceive('indexRechercheStage')->once()->andThrow(new \Exception('Erreur simulée'));
        });

        $idEtudiant ='611082';
        $rechercheStage = RechercheStage::where('idUPPA', $idEtudiant)->get();

        $response = $this->get('/api/etudiants/'.$idEtudiant.'/recherches-stages');

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }
}
