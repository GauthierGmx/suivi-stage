<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\RechercheStage;
use App\Models\Etudiant;
use App\Models\FicheDescriptive;
use App\Models\Parcours; 
use App\Models\AnneeUniversitaire;  
use Illuminate\Support\Facades\DB;

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

    /**
     * La méthode index va retourner une confirmation 200 et la liste de tous les étudiants
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_de_tous_les_etudiants()
    {
        $etudiants = Etudiant::all();

        $response = $this->get('/api/etudiants');

        $response->assertStatus(200)
                 ->assertJson($etudiants->toArray());
    }

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

    /**
     * La méthode show va retourner une confirmation 200 et les détails de l'étudiant
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_informations_de_l_etudiant()
    {
        $unEtudiant = Etudiant::first();

        $response = $this->get('/api/etudiants/'.$unEtudiant->idUPPA);

        $response->assertStatus(200)
                 ->assertJson($unEtudiant->toArray());
    }

    /**
     * La méthode show va retourner une confirmation 404 si l'étudiant n'a pas été trouvée
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_non_trouvee_en_cas_d_etudiant_non_trouvee()
    {
        $idEtudiant = PHP_INT_MAX;

        $response = $this->get('/api/etudiants/'.$idEtudiant);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun étudiant trouvé']);
    }

    /**
     * La méthode show va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle Etudiant pour déclencher une exception
        $this->mock(\App\Http\Controllers\EtudiantController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });

        $unEtudiant = Etudiant::first();

        $response = $this->get('/api/etudiants/'.$unEtudiant->idUPPA);

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
                 ->assertJson($rechercheStage->toArray());
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

        $response->assertStatus(204);
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

        $response = $this->get('/api/etudiants/'.$idEtudiant.'/recherches-stages');

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

     /*
    ======================================
    TEST DE LA METHODE INDEXFICHEDESCRIPTIVE
    ======================================
    */

    /**
     * La méthode indexFicheDescriptive doit retourner une confirmation 200 et la liste des fiches descriptives
     * 
     * @return void
     */
    public function test_indexFicheDescriptive_methode_doit_retourner_200_et_la_liste_des_fiches_descriptives(){
        $etudiantFirst = Etudiant::first();
        $ficheDescriptiveEtudiant = FicheDescriptive::where('idUPPA', $etudiantFirst->idUPPA)->get();

        $response = $this->get('/api/etudiants/'.$etudiantFirst->idUPPA.'/fiches-descriptives');

        $response->assertStatus(200)
                 ->assertJson($ficheDescriptiveEtudiant->toArray());
    }

    /**
     * La méthode indexFicheDescriptive doit retourner une erreur 404 si l'étudiant n'a pas de fiche descriptive
     * 
     * 
     * @return void
     */
    public function test_indexFicheDescriptive_methode_doit_retourner_une_erreur_404_si_l_etudiant_n_a_pas_de_fiche_descriptive(){
        $idEtudiant ='613453';

        $response = $this->get('/api/etudiants/'.$idEtudiant.'/fiches-descriptives');

        $response->assertStatus(204);
    }
    /**
     * LA méthode indexFicheDescriptive doit retourner une erreur 500 si une erreur survient lors de la récupération
     * 
     * @return void
     */
    public function test_indexFicheDescriptive_methode_doit_retourner_une_erreur_500_si_une_erreur_survient(){
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\EtudiantController::class, function ($mock) {
            $mock->shouldReceive('indexFicheDescriptive')->once()->andThrow(new \Exception('Erreur simulée'));
        });

        $etudiantFirst = Etudiant::first();

        $response = $this->get('/api/etudiants/'.$etudiantFirst->idUPPA.'/fiches-descriptives');

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }
    /**
     * LA méthode indexFicheDescriptive doit retourner une erreur 404 si un étudiant n'existe pas
     * 
     * @return void
     */
    public function test_indexFicheDescriptive_methode_doit_retourner_une_erreur_404_si_l_etudiant_n_existe_pas(){
        $idEtudiant = PHP_INT_MAX;
        $response = $this->get('/api/etudiants/'.$idEtudiant.'/fiches-descriptives');

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun étudiant trouvé']);
    }

    /*
    =========================================
        TEST DE LA METHODE INDEXPARCOURS
    ========================================
    */

    /**
     * La méthode indexParcours doit retourner une confirmation 200 et la liste des parcours de l'étudiant
     * 
     * @return void
     */
    public function test_indexParcours_methode_doit_retourner_200_et_la_liste_des_parcours_de_l_etudiant() {
        $etudiantFirst = Etudiant::first();
        $parcoursFirst = Parcours::first();
        $anneeUniv = AnneeUniversitaire::first();
        $response = $this->get('/api/etudiants/'.$etudiantFirst->idUPPA.'/parcours');
        $response->assertStatus(200);
        $response->assertJson([
            [
                'idUPPA' => $etudiantFirst->idUPPA,
                'codeParcours' => $parcoursFirst->codeParcours,
                'idAnneeUniversitaire' => $anneeUniv->idAnneeUniversitaire
            ]
        ]);
        
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }
}
