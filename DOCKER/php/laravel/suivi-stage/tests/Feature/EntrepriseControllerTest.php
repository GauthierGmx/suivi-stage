<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Entreprise;

class EntrepriseControllerTest extends TestCase
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
    public function test_index_renvoie_une_confirmation_et_la_liste_des_entreprises()
    {
        $desEntreprises = Entreprise::all();

        $response = $this->get('/api/entreprises');

        $response->assertStatus(200)
                 ->assertJsonCount($desEntreprises->count());
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 pour l'entreprise
     *
     * @return void
     */
    public function test_store_renvoie_une_confirmation_de_la_creation_de_l_entreprise()
    {
        $donnees = [
            'numSIRET' => null,
            'raisonSociale' => 'TEST API',
            'typeEtablissement' => null,
            'adresse' => null,
            'ville' => null,
            'codePostal' => null,
            'pays' => null,
            'telephone' => null,
            'codeAPE_NAF' => null,
            'statutJuridique' => null,
            'effectif' => null,
            'representantLegal' => null,
            'longitudeAdresse' => null,
            'latitudeAdresse' => null,
        ];

        $response = $this->postJson('/api/entreprises/create', $donnees);

        $response->assertStatus(201)
                 ->assertJson([
                        'message' => 'Entreprise créée avec succès',
                        'entreprise' => $donnees
        ]);
    }

    /**
     * La méthode store va retourner une erreur 422 si une donnée n'est pas valide
     *
     * @return void
     */
    public function test_store_renvoie_une_erreur_de_validation()
    {
        $donnees = [
            'numSIRET' => null,
            'raisonSociale' => null,
            'typeEtablissement' => null,
            'adresse' => null,
            'ville' => null,
            'codePostal' => null,
            'pays' => null,
            'telephone' => null,
            'codeAPE_NAF' => null,
            'statutJuridique' => null,
            'effectif' => null,
            'representantLegal' => null,
            'longitudeAdresse' => null,
            'latitudeAdresse' => null,
        ];

        $response = $this->postJson('/api/entreprises/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode store va retourner une erreur 500 en cas de QueryException
     *
     * @return void
     */
    public function test_store_renvoie_une_erreur_de_base_de_donnees()
    {
        // Mock du modèle RechercheStage pour déclencher une exception
        $this->mock(\App\Http\Controllers\EntrepriseController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Illuminate\Database\QueryException('Erreur simulée',
            [],
            new \Exception('Erreur simulée')
            ));
        });

        $donnees = [
            'numSIRET' => null,
            'raisonSociale' => null,
            'typeEtablissement' => null,
            'adresse' => null,
            'ville' => null,
            'codePostal' => null,
            'pays' => null,
            'telephone' => null,
            'codeAPE_NAF' => null,
            'statutJuridique' => null,
            'effectif' => null,
            'representantLegal' => null,
            'longitudeAdresse' => null,
            'latitudeAdresse' => null,
        ];

        $response = $this->postJson('/api/entreprises/create', $donnees);

        $response->assertStatus(500);
    }

    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et les informations de l'entreprise spécifiée
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_infos_de_l_entreprise_specifiee()
    {
        $entreprise = Entreprise::first();

        $response = $this->get('/api/entreprises/' . $entreprise->idEntreprise);

        $response->assertStatus(200)
                 ->assertJson([
                    'entreprise' => [
                        'idEntreprise' => $entreprise->idEntreprise,
                        'raisonSociale' => $entreprise->raisonSociale,
                        'numSIRET' => $entreprise->numSIRET,
                        'typeEtablissement' => $entreprise->typeEtablissement,
                        'adresse' => $entreprise->adresse,
                        'ville' => $entreprise->ville,
                        'codePostal' => $entreprise->codePostal,
                        'pays' => $entreprise->pays,
                        'telephone' => $entreprise->telephone,
                        'codeAPE_NAF' => $entreprise->codeAPE_NAF,
                        'statutJuridique' => $entreprise->statutJuridique,
                        'effectif' => $entreprise->effectif,
                        'representantLegal' => $entreprise->representantLegal,
                        'longitudeAdresse' => $entreprise->longitudeAdresse,
                        'latitudeAdresse' => $entreprise->latitudeAdresse,
                    ],
                ]);
    }

    /**
     * La méthode show va retourner une erreur 404 si l'entreprise n'existe pas
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_si_l_entreprise_n_est_pas_trouvee()
    {
        $idEntreprise = PHP_INT_MAX;

        $response = $this->get('/api/entreprises/' . $idEntreprise);

        $response->assertStatus(404);
    }

    /**
     * La méthode show va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_show_retourne_une_erreur_en_cas_d_exception()
    {
        // Mock du modèle ENTREPRISE pour déclencher une exception
        $this->mock(\App\Http\Controllers\EntrepriseController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });

        $entreprise = Entreprise::firstOrFail();

        $response = $this->get('/api/entreprises/' . $entreprise->id);

        $response->assertStatus(500);
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
