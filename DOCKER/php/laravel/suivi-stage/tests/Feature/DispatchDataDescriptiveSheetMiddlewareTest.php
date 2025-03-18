<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\FicheDescriptive;
use App\Models\Entreprise;
use App\Models\TuteurEntreprise;
use App\Models\Etudiant;
use App\Http\Middleware\DispatchDataDescriptiveSheet;
use Tests\TestCase;

class DispatchDataDescriptiveSheetMiddlewareTest extends TestCase
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
    =============================================
        TEST DE LA METHODE handleSheetGet
    =============================================
    */

    /**
     * La méthode handleSheetGet va retourner une confirmation 200 et l'ensemble des infos liés à la fiche descriptive
     * 
     * @return void
     */

    public function test_handleSheetGet_renvoie_une_confirmation_et_les_infos_de_la_fiche_descriptive(){

        $ficheDescriptive = FicheDescriptive::first();
        $idEntreprise = $ficheDescriptive->idEntreprise;
        $entreprise = Entreprise::find($idEntreprise);
        $idTuteurEntreprise = $ficheDescriptive->idTuteurEntreprise;
        $tuteur = TuteurEntreprise::find($idTuteurEntreprise);
        $idEtudiant = $ficheDescriptive->idUPPA;
        $etudiant = Etudiant::find($idEtudiant);
        $response = $this->get('/api/fiche-descriptive/'.$ficheDescriptive->idFicheDescriptive);
        $response->assertStatus(200)
                 ->assertJson([
                    //Informations Fiche Descriptive
                     'idFicheDescriptive' => [
                        'value' => $ficheDescriptive->idFicheDescriptive,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateCreationFicheDescriptive' => [
                        'value' => $ficheDescriptive->dateCreation,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateDerniereModificationFicheDescriptive' => [
                        'value' => $ficheDescriptive->dateDerniereModification,
                        'type' => 'ficheDescriptive',
                     ],
                     'contenuStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->contenuStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'thematiqueFicheDescriptive' => [
                        'value' => $ficheDescriptive->thematique,
                        'type' => 'ficheDescriptive',
                     ],
                     'sujetFicheDescriptive' => [
                        'value' => $ficheDescriptive->sujet,
                        'type' => 'ficheDescriptive',
                     ],
                     'fonctionsFicheDescriptive' => [
                        'value' => $ficheDescriptive->fonctions,
                        'type' => 'ficheDescriptive',
                     ],
                     'tachesFicheDescriptive' => [
                        'value' => $ficheDescriptive->taches,
                        'type' => 'ficheDescriptive',
                     ],
                     'competencesFicheDescriptive' => [
                        'value' => $ficheDescriptive->competences,
                        'type' => 'ficheDescriptive',
                     ],
                     'detailsFicheDescriptive' => [
                        'value' => $ficheDescriptive->details,
                        'type' => 'ficheDescriptive',
                     ],
                     'debutStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->debutStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'finStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->finStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'nbJourSemaineFicheDescriptive' => [
                        'value' => $ficheDescriptive->nbJourSemaine,
                        'type' => 'ficheDescriptive',
                     ],
                     'nbHeureSemaineFicheDescriptive' => [
                        'value' => $ficheDescriptive->nbHeureSemaine,
                        'type' => 'ficheDescriptive',
                     ],
                     'clauseConfidentialiteFicheDescriptive' => [
                        'value' => $ficheDescriptive->clauseConfidentialite,
                        'type' => 'ficheDescriptive',
                     ],
                     'serviceEntrepriseFicheDescriptive' => [
                        'value' => $ficheDescriptive->serviceEntreprise,
                        'type' => 'ficheDescriptive',
                     ],
                     'adresseMailStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->adresseMailStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'telephoneStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->telephoneStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'adresseStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->adresseStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'codePostalStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->codePostalStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'villeStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->villeStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'paysStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->paysStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'statut' => [
                        'value' => $ficheDescriptive->statut,
                        'type' => 'ficheDescriptive',
                    ],
                     'numeroConventionFicheDescriptive' => [
                        'value' => $ficheDescriptive->numeroConvention,
                        'type' => 'ficheDescriptive',
                     ],
                     'interruptionStageFicheDescriptive' => [
                        'value' => $ficheDescriptive->interruptionStage,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateDebutInterruptionFicheDescriptive' => [
                        'value' => $ficheDescriptive->dateDebutInterruption,
                        'type' => 'ficheDescriptive',
                     ],
                     'dateFinInterruptionFicheDescriptive' => [
                        'value' => $ficheDescriptive->dateFinInterruption,
                        'type' => 'ficheDescriptive',
                     ],
                     'personnelTechniqueDisponibleFicheDescriptive' => [
                        'value' => $ficheDescriptive->personnelTechniqueDisponible,
                        'type' => 'ficheDescriptive',
                     ],
                     'materielPreteFicheDescriptive' => [
                        'value' => $ficheDescriptive->materielPrete,
                        'type' => 'ficheDescriptive',
                     ],
                     'idEntreprise' => [
                        'value' => $ficheDescriptive->idEntreprise,
                        'type' => 'ficheDescriptive',
                     ],
                     'idTuteurEntreprise' => [
                        'value' => $ficheDescriptive->idTuteurEntreprise,
                        'type' => 'ficheDescriptive',
                     ],
                     //Informations étudiant 
                     'idUPPA' => [
                        'value' => $etudiant->idUPPA,
                        'type' => 'etudiant',
                    ],
                     'nomEtudiant' => [
                         'value' => $etudiant->nom,
                         'type' => 'etudiant',
                     ],
                     'prenomEtudiant' => [
                         'value' => $etudiant->prenom,
                         'type' => 'etudiant',
                     ],
                     'telephoneEtudiant' => [
                         'value' => $etudiant->telephone,
                         'type' => 'etudiant',
                     ],
        
                     // Informations du tuteur
                     'nomTuteurEntreprise' => [
                         'value' => $tuteur->nom,
                         'type' => 'tuteurEntreprise',
                     ],
                     'prenomTuteurEntreprise' => [
                         'value' => $tuteur->prenom,
                         'type' => 'tuteurEntreprise',
                     ],
                     'telephoneTuteurEntreprise' => [
                         'value' => $tuteur->telephone,
                         'type' => 'tuteurEntreprise',
                     ],
                     'adresseMailTuteurEntreprise' => [
                         'value' => $tuteur->adresseMail,
                         'type' => 'tuteurEntreprise',
                     ],
                     'fonctionTuteurEntreprise' => [
                         'value' => $tuteur->fonction,
                         'type' => 'tuteurEntreprise',
                     ],
         
                     // Informations de l'entreprise
                     'numSIRETEntreprise' => [
                        'value' => $entreprise->numSIRET,
                        'type' => 'entreprise',
                    ],
                     'raisonSocialeEntreprise' => [
                         'value' => $entreprise->raisonSociale,
                         'type' => 'entreprise',
                     ],
                     'adresseEntreprise' => [
                         'value' => $entreprise->adresse,
                         'type' => 'entreprise',
                     ],
                     'typeEtablissementEntreprise' => [
                         'value' => $entreprise->typeEtablissement,
                         'type' => 'entreprise',
                     ],
                     'telephoneEntreprise' => [
                        'value' => $entreprise->telephone,
                        'type' => 'entreprise',
                    ],
                     'codePostalEntreprise' => [
                         'value' => $entreprise->codePostal,
                         'type' => 'entreprise',
                     ],
                     'villeEntreprise' => [
                         'value' => $entreprise->ville,
                         'type' => 'entreprise',
                     ],
                     'paysEntreprise' => [
                         'value' => $entreprise->pays,
                         'type' => 'entreprise',
                     ],
                     'codeAPE_NAFEntreprise' => [
                         'value' => $entreprise->codeAPE_NAF,
                         'type' => 'entreprise',
                     ],
                     'statutJuridiqueEntreprise' => [
                         'value' => $entreprise->statutJuridique,
                         'type' => 'entreprise',
                     ],
                     'effectifEntreprise' => [
                         'value' => $entreprise->effectif,
                         'type' => 'entreprise',
                     ],
                     'nomRepresentantEntreprise' => [
                         'value' => $entreprise->nomRepresentant,
                         'type' => 'entreprise',
                     ],
                     'prenomRepresentantEntreprise' => [
                         'value' => $entreprise->prenomRepresentant,
                         'type' => 'entreprise',
                     ],
                     'telephoneRepresentantEntreprise' => [
                         'value' => $entreprise->telephoneRepresentant,
                         'type' => 'entreprise',
                     ],
                     'adresseMailRepresentantEntreprise' => [
                         'value' => $entreprise->adresseMailRepresentant,
                         'type' => 'entreprise',
                     ],
                     'fonctionRepresentantEntreprise' => [
                         'value' => $entreprise->fonctionRepresentant,
                         'type' => 'entreprise',
                     ],
         
                 ]);
    }

    /**
     * La méthode handleSheetGet va retourner une erreur 404 si la fiche descriptive n'existe pas
     * 
     * @return void
     */
    public function test_handleSheetGet_renvoie_une_erreur_404_si_la_fiche_descriptive_n_existe_pas(){
        $ficheDescriptive = 100000;
        $response = $this->get('/api/fiche-descriptive/'.$ficheDescriptive);
        $response->assertStatus(404)
                 ->assertJson([
                    'message' => 'Fiche descriptive non trouvée'
                ]);
    }

    /**
     * La méthode handleSheetGet va retourner une erreur 500 car on simule une erreur
     * 
     * @return void
     */

    public function test_handleSheetGet_renvoie_une_erreur_500_en_simulant_une_erreur(){
        // Mock du modèle FicheDescriptive pour déclencher une exception
        $this->partialMock(\App\Http\Controllers\FicheDescriptiveController::class, function ($mock) {
            $mock->shouldReceive('show')->andThrow(new Exception);
        });
        $ficheDescriptive = FicheDescriptive::first();
        $response = $this->get('/api/fiche-descriptive/'.$ficheDescriptive->idFicheDescriptive);
    
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }

        /*
    =============================================
        TEST DE LA METHODE handleSheetCreate
    =============================================
    */

    /**
     * La méthode handleSheetGet va retourner une confirmation 200 car la fiche descriptive a bien été créée
     * 
     * @return void
     */

    public function test_handleSheetCreate_renvoie_une_confirmation_et_les_infos_de_la_fiche_descriptive(){
        $
    }
}
