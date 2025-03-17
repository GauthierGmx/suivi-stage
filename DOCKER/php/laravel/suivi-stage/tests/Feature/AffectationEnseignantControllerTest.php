<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AffectationEnseignantControllerTest extends TestCase
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
     * La méthode index va retourner une confirmation 200 et la liste des affectations
     * 
     * @return void
     */
    public function test_index_renvoie_une_confirmation_et_la_liste_des_affectations()
    {
        $response = $this->getJson('/api/affectation');
        
        $response->assertStatus(200);
        
        $responseData = $response->json();
        
        $this->assertArrayHasKey('anneeUniversitaire', $responseData[0]);
        $this->assertArrayHasKey('nomPersonnel', $responseData[0]);
        $this->assertArrayHasKey('prenomPersonnel', $responseData[0]);
        $this->assertArrayHasKey('nomEtudiant', $responseData[0]);
        $this->assertArrayHasKey('prenomEtudiant', $responseData[0]);
    }

    /*
    ================================
        TEST DE LA METHODE STORE
    ================================
    */

    /**
     * La méthode store va retourner une confirmation 201 et les données de l'affectation créée
     * 
     * @return void
     */
    public function test_store_renvoie_une_confirmation_et_les_informations_de_l_affectation_creee()
    {
        // Récupération des IDs existants pour le test
        $personnel = \DB::table('personnels')->first();
        $etudiant = \DB::table('etudiants')->first();
        $anneeUniv = \DB::table('annee_universitaires')->first();
        
        // Supprimer l'affectation si elle existe déjà pour éviter les erreurs d'unicité
        \DB::table('table_personnel_etudiant_anneeuniv')
            ->where('idPersonnel', $personnel->idPersonnel)
            ->where('idUPPA', $etudiant->idUPPA)
            ->where('idAnneeUniversitaire', $anneeUniv->idAnneeUniversitaire)
            ->delete();
        
        // Données à envoyer
        $donnees = [
            'idPersonnel' => $personnel->idPersonnel,
            'idUPPA' => $etudiant->idUPPA,
            'idAnneeUniversitaire' => $anneeUniv->idAnneeUniversitaire
        ];
        
        // Appel de la route store
        $response = $this->postJson('/api/affectation/create', $donnees);
        
        $response->assertStatus(201)
                 ->assertJson([
                    'idPersonnel' => $donnees['idPersonnel'],
                    'idUPPA' => $donnees['idUPPA'],
                    'idAnneeUniversitaire' => $donnees['idAnneeUniversitaire']
        ]);
    }

    /**
     * La méthode store va retourner une erreur 422 si les données sont invalides
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_422_si_les_donnees_sont_invalides()
    {
        // Données invalides (manque idUPPA)
        $donnees = [
            'idPersonnel' => 1,
            'idAnneeUniversitaire' => 1
        ];
        
        $response = $this->postJson('/api/affectation/create', $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode store va retourner une erreur 500 si une erreur SQL se produit
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_500_s_il_y_a_une_erreur_dans_la_base()
    {
        // IdPersonnel non existant dans la base
        $donnees = [
            'idPersonnel' => 1,
            'idUPPA' => 1,
            'idAnneeUniversitaire' => 1
        ];

        $response = $this->postJson('/api/affectation/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Erreur dans la base de données :']);
    }

    /**
     * La méthode store va retourner une erreur 500 en cas d'exception
     * 
     * @return void
     */
    public function test_store_renvoie_une_erreur_generique_en_cas_d_exeception()
    {
        // Récupération des IDs existants pour le test
        $personnel = \DB::table('personnels')->first();
        $etudiant = \DB::table('etudiants')->first();
        $anneeUniv = \DB::table('annee_universitaires')->first();
                
        // Données à envoyer
        $donnees = [
            'idPersonnel' => $personnel->idPersonnel,
            'idUPPA' => $etudiant->idUPPA,
            'idAnneeUniversitaire' => $anneeUniv->idAnneeUniversitaire
        ];

        // Mock du modèle AffectationEnseignant pour déclencher une exception
        $this->mock(\App\Http\Controllers\AffectationEnseignantController::class, function ($mock) {
            $mock->shouldReceive('store')->andThrow(new \Exception('Erreur simulée'));
        });

        $response = $this->postJson('/api/affectation/create', $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }

    /*
    ================================
        TEST DE LA METHODE SHOW
    ================================
    */

    /**
     * La méthode show va retourner une confirmation 200 et les informations de l'affectation
     * 
     * @return void
     */
    public function test_show_renvoie_une_confirmation_et_les_informations_de_l_affectation()
    {
        // Récupération des ID existants pour le test
        $personnel = \DB::table('personnels')->first();
        $etudiant = \DB::table('etudiants')->first();
        $anneeUniv = \DB::table('annee_universitaires')->first();

        $response = $this->getJson("/api/affectation/{$personnel->idPersonnel}-{$etudiant->idUPPA}-{$anneeUniv->idAnneeUniversitaire}");
        
        $response->assertStatus(200)
                 ->assertJson([
                    'anneeUniversitaire' => $anneeUniv->libelle,
                    'nomPersonnel' => $personnel->nom,
                    'prenomPersonnel' => $personnel->prenom,
                    'nomEtudiant' => $etudiant->nom,
                    'prenomEtudiant' => $etudiant->prenom
        ]);
    }

    /**
     * La méthode show va retourner une erreur 404 si l'affectation n'existe pas
     * 
     * @return void
     */
    public function test_show_renvoie_une_erreur_404_si_l_affectation_n_a_pas_ete_trouvee()
    {
        // idUPPA inexistant en base
        $idPersonnel = 1;
        $idUPPA = 1;
        $idAnneeUniv = 1;

        $response = $this->getJson("/api/affectation/{$idPersonnel}-{$idUPPA}-{$idAnneeUniv}");

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune affectation trouvée']);
    }

    /*
    =================================
        TEST DE LA METHODE UPDATE
    =================================
    */

    /**
     * La méthode update va retourner une confirmation 200 et les informations de l'affectation modifiée
     * 
     * @return void
     */
    public function test_update_renvoie_une_confirmation_et_les_informations_de_l_affectation_modifiee()
    {
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        $autrePersonnel = \DB::table('personnels')
            ->where('idPersonnel', '!=', $affectation->idPersonnel)
            ->first();

        $donnees = [
            'idPersonnel' => $autrePersonnel->idPersonnel
        ];

        $response = $this->putJson("/api/affectation/update/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}", $donnees);

        $response->assertStatus(200)
                ->assertJson([
                    'idPersonnel' => $donnees['idPersonnel'],
                    'idUPPA' => $affectation->idUPPA,
                    'idAnneeUniversitaire' => $affectation->idAnneeUniversitaire
                ]);
    }

    /**
     * La méthode update va retourner une erreur 404 si l'affectation n'a pas été trouvée
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_non_trouvee_si_l_affectation_n_a_pas_ete_trouvee()
    {
        // idUPPA inexistant en base
        $idPersonnel = 1;
        $idUPPA = 1;
        $idAnneeUniv = 1;

        $donnees = [
            'idPersonnel' => 2
        ];

        $response = $this->putJson("/api/affectation/update/{$idPersonnel}-{$idUPPA}-{$idAnneeUniv}", $donnees);

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune affectation trouvée']);
    }

    /**
     * La méthode update va retourner une erreur 422 si les données ne sont pas valides
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_de_validation_si_les_donnees_ne_sont_pas_valides()
    {
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        // Données invalides (manque idPersonnel)
        $donnees = [
            'idUPPA' => $affectation->idUPPA
        ];

        $response = $this->putJson("/api/affectation/update/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}", $donnees);

        $response->assertStatus(422)
                 ->assertJson(['message' => 'Erreur de validation dans les données']);
    }

    /**
     * La méthode update va retourner une erreur 500 s'il y a une erreur dans la base de données
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_generique_s_il_y_a_eu_une_erreur_dans_la_base()
    {
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        // Id non existant dans la base
        $donnees = [
            'idPersonnel' => PHP_INT_MAX
        ];

        $response = $this->putJson("/api/affectation/update/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}", $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Erreur dans la base de données :']);
    }

    /**
     * La méthode update va retourner une erreur 500 s'il y a une erreur
     * 
     * @return void
     */
    public function test_update_renvoie_une_erreur_generique_s_il_y_a_eu_une_erreur()
    {
        // Mock du modèle AffectationEnseignant pour déclencher une exception
        $this->mock(\App\Http\Controllers\AffectationEnseignantController::class, function ($mock) {
            $mock->shouldReceive('update')->andThrow(new \Exception('Erreur simulée'));
        });

        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        $autrePersonnel = \DB::table('personnels')
            ->where('idPersonnel', '!=', $affectation->idPersonnel)
            ->first();

        $donnees = [
            'idPersonnel' => $autrePersonnel->idPersonnel
        ];

        $response = $this->putJson("/api/affectation/update/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}", $donnees);

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }

    /*
    ==================================
        TEST DE LA METHODE DESTROY
    ==================================
    */

    /**
     * La méthode destroy va retourner une confirmation 200 et un message confirmant la suppression
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_confirmation_et_un_message_de_la_suppression()
    {
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        $response = $this->deleteJson("/api/affectation/delete/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'L\'affectation a bien été supprimée']);
    }

    /**
     * La méthode destroy va retourner une erreur 404 si l'affectation n'a pas été trouvée
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_non_trouvee_si_aucune_affectation_n_a_ete_trouvee()
    {
        $idPersonnel = 1;
        $idUPPA = 1;
        $idAnneeUniv = 1;

        $response = $this->deleteJson("/api/affectation/delete/{$idPersonnel}-{$idUPPA}-{$idAnneeUniv}");

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Aucune affectation trouvée']);
    }

    /**
     * La méthode destroy va retourner une erreur 500 si l'affectation n'a pas été trouvée
     * 
     * @return void
     */
    public function test_destroy_renvoie_une_erreur_generique_s_il_y_a_eu_une_erreur()
    {
        // Mock du modèle AffectationEnseignant pour déclencher une exception
        $this->mock(\App\Http\Controllers\AffectationEnseignantController::class, function ($mock) {
            $mock->shouldReceive('destroy')->andThrow(new \Exception('Erreur simulée'));
        });
        
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->first();

        $response = $this->deleteJson("/api/affectation/delete/{$affectation->idPersonnel}-{$affectation->idUPPA}-{$affectation->idAnneeUniversitaire}");

        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }
}
