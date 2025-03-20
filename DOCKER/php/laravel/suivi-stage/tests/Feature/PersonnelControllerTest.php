<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Personnel;

class PersonnelControllerTest extends TestCase
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
     * La méthode index va retourner une confirmation 200  et la liste des membres du personnel
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_des_membres_du_personnel()
    {
        $personnels = Personnel::all();

        $response = $this->get('/api/personnel');

        $response->assertStatus(200)
                 ->assertJson($personnels->toArray());
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 et le membre du personnel créé
     * 
     * @return void
     */
    public function test_store_renvoie_une_confirmation_et_le_membre_du_personnel_cree()
    {
        $donnees = [
            'login'             => 'jdupont',
            'roles'             => 'Enseignant',
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $response = $this->post('/api/personnel/create', $donnees);

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
            'login'             => 'jdupont',
            'roles'             => 'TEST',  // Rôle incorrect
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $response = $this->post('/api/personnel/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode store va retourner une erreur 500 si une erreur se produit
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle Personnel pour déclencher une exception
        $this->mock(\App\Http\Controllers\PersonnelController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });

        $donnees = [
            'login'             => 'jdupont',
            'roles'             => 'Enseignant',
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $response = $this->post('/api/personnel/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et les détails du membre du personnel
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_details_du_membre_du_personnel()
    {
        $personnel = Personnel::first();

        $response = $this->get('/api/personnel/'.$personnel->idPersonnel);

        $response->assertStatus(200)
                 ->assertJson($personnel->toArray());
    }

    /**
     * La méthode show va retourner une erreur 404 si le membre du personnel n'a pas été trouvé
     * 
     * @return void
     */
    public function test_showèrenvoie_une_erreur_non_trouvee_en_cas_de_personnel_non_trouve()
    {
        $idPersonnel = PHP_INT_MAX;

        $response = $this->get('/api/personnel/'.$idPersonnel);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun personnel trouvé']);
    }

    /**
     * La méthode show va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle Personnel pour déclencher une exception
        $this->mock(\App\Http\Controllers\PersonnelController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new \Exception('Erreur simulée'));
        });
        
        $personnel = Personnel::first();

        $response = $this->get('/api/personnel/'.$personnel->idPersonnel);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    =================================
        TEST DE LA METHODE UPDATE
    =================================
    */

    /**
     * La méthode update va retourner une confirmation 200 et le membre du personnel modifié
     * 
     * @return void
     */
    public function test_update_renvoie_une_confirmation_et_le_personnel_modifie()
    {
        $donnees = [
            'login'             => 'jdupont',
            'roles'             => 'Enseignant',
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $personnel = Personnel::first();

        $response = $this->putJson('/api/personnel/update/'.$personnel->idPersonnel, $donnees);

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
            'login'             => 'jdupont',
            'roles'             => 'TEST',  // Rôle incorrect
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $personnel = Personnel::first();

        $response = $this->putJson('/api/personnel/update/'.$personnel->idPersonnel, $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode update va retourner une erreur 404 si le membre du personnel n'a pas été trouvé
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_non_trouvee_en_cas_de_personnel_non_trouve()
    {
        $donnees = [
            'login'             => 'jdupont',
            'roles'             => 'Enseignant',
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $idPersonnel = PHP_INT_MAX;

        $response = $this->putJson('/api/personnel/update/'.$idPersonnel, $donnees);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun personnel trouvé']);
    }

    /**
     * La méthode update va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle Personnel pour déclencher une exception
        $this->mock(\App\Http\Controllers\PersonnelController::class, function ($mock) {
            $mock->shouldReceive('update')->andThrow(new \Exception('Erreur simulée'));
        });

        $donnees = [
            'login'             => 'jdupont',
            'roles'             => 'Enseignant',
            'nom'               => 'Dupont',
            'prenom'            => 'Jean',
            'adresse'           => null,
            'ville'             => null,
            'codePostal'        => null,
            'telephone'         => null,
            'adresseMail'       => 'jdupont@univ-pau.fr',
            'longitudeAdresse'  => null,
            'latitudeAdresse'   => null,
            'coptaEtudiant'     => 8,
        ];

        $personnel = Personnel::first();

        $response = $this->putJson('/api/personnel/update/'.$personnel->idPersonnel, $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    /*
    ==================================
        TEST DE LA METHODE DESTROY
    ==================================
    */

    /**
     * La méthode destroy va retourner une confirmation 200 si le membre du personnel a été supprimé
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_confirmation_de_la_suppression_du_personnel()
    {
        $personnel = Personnel::orderBy('idPersonnel', 'desc')->first(); // Sélectionne l'id le plus grand

        $response = $this->delete('/api/personnel/delete/'.$personnel->idPersonnel);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Le personnel a bien été supprimé']);
    }

    /**
     * La méthode destroy va retourner une erreur 404 si le membre du personnel n'a pas été trouvé
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_non_trouvee_en_cas_de_personnel_non_trouve()
    {
        $idPersonnel = PHP_INT_MAX;

        $response = $this->delete('/api/personnel/delete/'.$idPersonnel);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucun personnel trouvé']);
    }

    /**
     * La méthode destroy va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_generique_en_cas_d_exception()
    {
        // Mock du modèle Personnel pour déclencher une exception
        $this->mock(\App\Http\Controllers\PersonnelController::class, function ($mock) {
            $mock->shouldReceive('destroy')->andThrow(new \Exception('Erreur simulée'));
        });

        $personnel = Personnel::first();

        $response = $this->delete('/api/personnel/delete/'.$personnel->idPersonnel);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite']);
    }

    public function tearDown(): void
    {
        parent::tearDown();
    }
}
