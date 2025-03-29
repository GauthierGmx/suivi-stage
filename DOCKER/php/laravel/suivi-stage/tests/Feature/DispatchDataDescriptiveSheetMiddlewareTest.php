<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\FicheDescriptive;
use App\Models\Entreprise;
use App\Models\TuteurEntreprise;
use App\Models\Etudiant;
use App\Http\Middleware\DispatchDataDescriptiveSheet;
use Carbon\Carbon;
use Exception;
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
                        'value' => $ficheDescriptive->idPays,
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
        $this->partialMock(\App\Http\Middleware\DispatchDataDescriptiveSheet::class, function ($mock) {
            $mock->shouldReceive('handleSheetGet')->andThrow(new Exception);
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

     public function test_handleSheetCreate_renvoie_une_confirmation_et_les_infos_de_la_fiche_descriptive()
     {
        $entreprise = Entreprise::first();       
        $etudiant   = Etudiant::first();
        $donnees = [
            "idUPPA" => [
                "value" => $etudiant->idUPPA,
                "type" => "ficheDescriptive"
            ],
            "statut" => [
                "value" => "En cours",
                "type" => "ficheDescriptive"
            ],
            "nomEtudiant" => [
                "value" => $etudiant->nom,
                "type" => "etudiant"
            ],
            "prenomEtudiant" => [
                "value" => $etudiant->prenom,
                "type" => "etudiant"
            ],
            "telephoneEtudiant" => [
                "value" => $etudiant->telephone,
                "type" => "etudiant"
            ],
            "adresseMailEtudiant" => [
                "value" => $etudiant->adresseMail,
                "type" => "etudiant"
            ],
            "adresseEtudiant" => [
                "value" => $etudiant->adresse,
                "type" => "etudiant"
            ],
            "codePostalEtudiant" => [
                "value" => $etudiant->codePostal,
                "type" => "etudiant"
            ],
            "villeEtudiant" => [
                "value" => $etudiant->ville,
                "type" => "etudiant"
            ],
            "composanteEtablissement" => [
                "value" => "181 - IUT de Bayonne et du Pays Basque (Anglet)",
                "type" => "etablissement"
            ],
            "parcoursEtablissement" => [
                "value" => "BBWIA2 - BUT2 - INFO - Intégration d'Applications et Management du SI",
                "type" => "etablissement"
            ],
            "adresseEtablissement" => [
                "value" => "2 allée du Parc Montaury, 64600 Anglet",
                "type" => "etablissement"
            ],
            "telephoneEtablissement" => [
                "value" => "05.59.57.43.02",
                "type" => "etablissement"
            ],
            "raisonSocialeEntreprise" => [
                "value" => $entreprise->raisonSociale,
                "type" => "entreprise"
            ],
            "adresseEntreprise" => [
                "value" => $entreprise->adresse,
                "type" => "entreprise"
            ],
            "codePostalEntreprise" => [
                "value" => $entreprise->codePostal,
                "type" => "entreprise"
            ],
            "villeEntreprise" => [
                "value" => $entreprise->ville,
                "type" => "entreprise"
            ],
            "paysEntreprise" => [
                "value" => $entreprise->pays,
                "type" => "entreprise"
            ],
            "telephoneEntreprise" => [
                "value" => $entreprise->telephone,
                "type" => "entreprise"
            ],
            "serviceEntreprise" => [
                "value" => $entreprise->service,
                "type" => "ficheDescriptive"
            ],
            "typeEtablissementEntreprise" => [
                "value" => $entreprise->typeEtablissement,
                "type" => "entreprise"
            ],
            "numSIRETEntreprise" => [
                "value" => $entreprise->numSIRET,
                "type" => "entreprise"
            ],
            "codeAPE_NAFEntreprise" => [
                "value" => $entreprise->codeAPE_NAF,
                "type" => "entreprise"
            ],
            "statutJuridiqueEntreprise" => [
                "value" => $entreprise->statutJuridique,
                "type" => "entreprise"
            ],
            "effectifEntreprise" => [
                "value" => $entreprise->effectif,
                "type" => "entreprise"
            ],
            "nomRepresentantEntreprise" => [
                "value" => $entreprise->nomRepresentant,
                "type" => "entreprise"
            ],
            "prenomRepresentantEntreprise" => [
                "value" => $entreprise->prenomRepresentant,
                "type" => "entreprise"
            ],
            "telephoneRepresentantEntreprise" => [
                "value" => $entreprise->telephoneRepresentant,
                "type" => "entreprise"
            ],
            "adresseMailRepresentantEntreprise" => [
                "value" => $entreprise->adresseMailRepresentant,
                "type" => "entreprise"
            ],
            "fonctionRepresentantEntreprise" => [
                "value" => $entreprise->fonctionRepresentant,
                "type" => "entreprise"
            ],
            "adresseMailStageFicheDescriptive" => [
                "value" => "testtt@gmail.com",
                "type" => "ficheDescriptive"
            ],
            "telephoneStageFicheDescriptive" => [
                "value" => "0504050608",
                "type" => "ficheDescriptive"
            ],
            "adresseStageFicheDescriptive" => [
                "value" => "15 rue de la Victoire",
                "type" => "ficheDescriptive"
            ],
            "codePostalStageFicheDescriptive" => [
                "value" => "47000",
                "type" => "ficheDescriptive"
            ],
            "villeStageFicheDescriptive" => [
                "value" => "Agen",
                "type" => "ficheDescriptive"
            ],
            "paysStageFicheDescriptive" => [
                "value" => 67,
                "type" => "ficheDescriptive"
            ],
            "nomTuteurEntreprise" => [
                "value" => "HAKKE",
                "type" => "tuteurEntreprise"
            ],
            "prenomTuteurEntreprise" => [
                "value" => "Idil",
                "type" => "tuteurEntreprise"
            ],
            "telephoneTuteurEntreprise" => [
                "value" => "0405060504",
                "type" => "tuteurEntreprise"
            ],
            "adresseMailTuteurEntreprise" => [
                "value" => "hakkeidil@test.eu",
                "type" => "tuteurEntreprise"
            ],
            "fonctionTuteurEntreprise" => [
                "value" => "Chef de projet",
                "type" => "tuteurEntreprise"
            ],
            "typeStageFicheDescriptive" => [
                "value" => "Obligatoire",
                "type" => "ficheDescriptive"
            ],
            "thematiqueFicheDescriptive" => [
                "value" => "Développement",
                "type" => "ficheDescriptive"
            ],
            "sujetFicheDescriptive" => [
                "value" => "Sujet",
                "type" => "ficheDescriptive"
            ],
            "tachesFicheDescriptive" => [
                "value" => "Taches",
                "type" => "ficheDescriptive"
            ],
            "fonctionsFicheDescriptive" => [
                "value" => "Fonctions",
                "type" => "ficheDescriptive"
            ],
            "competencesFicheDescriptive" => [
                "value" => "Compétences",
                "type" => "ficheDescriptive"
            ],
            "detailsFicheDescriptive" => [
                "value" => "",
                "type" => "ficheDescriptive"
            ],
            "debutStageFicheDescriptive" => [
                "value" => "2025-03-05",
                "type" => "ficheDescriptive"
            ],
            "finStageFicheDescriptive" => [
                "value" => "2025-03-19",
                "type" => "ficheDescriptive"
            ],
            "nbJourSemaineFicheDescriptive" => [
                "value" => 5,
                "type" => "ficheDescriptive"
            ],
            "nbHeuresSemaineFicheDescriptive" => [
                "value" => 35,
                "type" => "ficheDescriptive"
            ],
            "personnelTechniqueDisponibleFicheDescriptive" => [
                "value" => true,
                "type" => "ficheDescriptive"
            ],
            "materielPreteFicheDescriptive" => [
                "value" => "Ordinateur, téléphone, voiture",
                "type" => "ficheDescriptive"
            ],
            "clauseConfidentialiteFicheDescriptive" => [
                "value" => false,
                "type" => "ficheDescriptive"
            ]
        ];
         // Appel API
         $response = $this->postJson('/api/fiche-descriptive/create', $donnees);
    
         $response->assertStatus(200)
                    ->assertJson([
             "ficheDescriptive" => [
                 "dateCreation" => Carbon::now()->format('Y-m-d'),
                 "dateDerniereModification" => Carbon::now()->format('Y-m-d'),
                 "contenuStage" => null,
                 "thematique" => "Développement",
                 "sujet" => "Sujet",
                 "fonctions" => "Fonctions",
                 "taches" => "Taches",
                 "competences" => "Compétences",
                 "details" => null,
                 "debutStage" => "2025-03-05",
                 "finStage" => "2025-03-19",
                 "nbJourSemaine" => 5,
                 "nbHeureSemaine" => 35,
                 "clauseConfidentialite" => false,
                 "serviceEntreprise" => null,
                 "adresseMailStage" => "testtt@gmail.com",
                 "telephoneStage" => "0504050608",
                 "adresseStage" => "15 rue de la Victoire",
                 "codePostalStage" => "47000",
                 "villeStage" => "Agen",
                 "idPays" => 67,
                 "longitudeStage" => null,
                 "latitudeStage" => null,
                 "statut" => "En cours",
                 "numeroConvention" => null,
                 "interruptionStage" => null,
                 "dateDebutInterruption" => null,
                 "dateFinInterruption" => null,
                 "personnelTechniqueDisponible" => true,
                 "materielPrete" => "Ordinateur, téléphone, voiture",
                 "idEntreprise" => $entreprise->idEntreprise,
                 "idTuteurEntreprise" => 8,
                 "idUPPA" => $etudiant->idUPPA,
                 "idFicheDescriptive" => 5
             ],
             "tuteur" => [
                 "nom" => "HAKKE",
                 "prenom" => "Idil",
                 "telephone" => "0405060504",
                 "adresseMail" => "hakkeidil@test.eu",
                 "idEntreprise" => $entreprise->idEntreprise,
                 "fonction" => "Chef de projet",
                 "idTuteur" => 8
             ]
         ]);
     }

    /**
     * La méthode handleSheetCreate doit retourner une erreur 404 car l'entreprise n'existe pas
     * 
     * @return void
     */
    public function test_handleSheetCreate_renvoie_une_erreur_404_car_l_entreprise_n_existe_pas(){
        $etudiant   = Etudiant::first();
        $donnees = [
            "idUPPA" => [
                "value" => $etudiant->idUPPA,
                "type" => "ficheDescriptive"
            ],
            "statut" => [
                "value" => "En cours",
                "type" => "ficheDescriptive"
            ],
            "nomEtudiant" => [
                "value" => $etudiant->nom,
                "type" => "etudiant"
            ],
            "prenomEtudiant" => [
                "value" => $etudiant->prenom,
                "type" => "etudiant"
            ],
            "telephoneEtudiant" => [
                "value" => $etudiant->telephone,
                "type" => "etudiant"
            ],
            "adresseMailEtudiant" => [
                "value" => $etudiant->adresseMail,
                "type" => "etudiant"
            ],
            "adresseEtudiant" => [
                "value" => $etudiant->adresse,
                "type" => "etudiant"
            ],
            "codePostalEtudiant" => [
                "value" => $etudiant->codePostal,
                "type" => "etudiant"
            ],
            "villeEtudiant" => [
                "value" => $etudiant->ville,
                "type" => "etudiant"
            ],
            "composanteEtablissement" => [
                "value" => "181 - IUT de Bayonne et du Pays Basque (Anglet)",
                "type" => "etablissement"
            ],
            "parcoursEtablissement" => [
                "value" => "BBWIA2 - BUT2 - INFO - Intégration d'Applications et Management du SI",
                "type" => "etablissement"
            ],
            "adresseEtablissement" => [
                "value" => "2 allée du Parc Montaury, 64600 Anglet",
                "type" => "etablissement"
            ],
            "telephoneEtablissement" => [
                "value" => "0101010101",
                "type" => "etablissement"
            ],
            "raisonSocialeEntreprise" => [
                "value" => "LA RAISON SOCIALE N EXISTE PAS",
                "type" => "entreprise"
            ],
            "adresseEntreprise" => [
                "value" => "12 rue des choux fleurs",
                "type" => "entreprise"
            ],
            "codePostalEntreprise" => [
                "value" => "64100",
                "type" => "entreprise"
            ],
            "villeEntreprise" => [
                "value" => "Bayonne",
                "type" => "entreprise"
            ],
            "paysEntreprise" => [
                "value" => "France",
                "type" => "entreprise"
            ],
            "telephoneEntreprise" => [
                "value" => "0101010101",
                "type" => "entreprise"
            ],
            "serviceEntreprise" => [
                "value" => "Service",
                "type" => "ficheDescriptive"
            ],
            "typeEtablissementEntreprise" => [
                "value" => "Public",
                "type" => "entreprise"
            ],
            "numSIRETEntreprise" => [
                "value" => "123458952954198561856419865",
                "type" => "entreprise"
            ],
            "codeAPE_NAFEntreprise" => [
                "value" => "1234Z",
                "type" => "entreprise"
            ],
            "statutJuridiqueEntreprise" => [
                "value" => "SA",
                "type" => "entreprise"
            ],
            "effectifEntreprise" => [
                "value" => 10,
                "type" => "entreprise"
            ],
            "nomRepresentantEntreprise" => [
                "value" => "Nom",
                "type" => "entreprise"
            ],
            "prenomRepresentantEntreprise" => [
                "value" => "Prenom",
                "type" => "entreprise"
            ],
            "telephoneRepresentantEntreprise" => [
                "value" => "0101010101",
                "type" => "entreprise"
            ],
            "adresseMailRepresentantEntreprise" => [
                "value" => "entreprise@gmail.fr",
                "type" => "entreprise"
            ],
            "fonctionRepresentantEntreprise" => [
                "value" => "Fonction",
                "type" => "entreprise"
            ],
            "adresseMailStageFicheDescriptive" => [
                "value" => "contact@rh.fr",
                "type" => "ficheDescriptive"
            ],
            "telephoneStageFicheDescriptive" => [
                "value" => "0101010101",
                "type" => "ficheDescriptive"
            ],
            "adresseStageFicheDescriptive" => [
                "value" => "Adresse",
                "type" => "ficheDescriptive"
            ],
            "codePostalStageFicheDescriptive" => [
                "value" => "47000",
                "type" => "ficheDescriptive"
            ],
            "villeStageFicheDescriptive" => [
                "value" => "Agen",
                "type" => "ficheDescriptive"
            ],
            "paysStageFicheDescriptive" => [
                "value" => "France",
                "type" => "ficheDescriptive"
            ],
            "nomTuteurEntreprise" => [
                "value" => "Nom",
                "type" => "tuteurEntreprise"
            ],
            "prenomTuteurEntreprise" => [
                "value" => "Prenom",
                "type" => "tuteurEntreprise"
            ],
            "telephoneTuteurEntreprise" => [
                "value" => "0101010101",
                "type" => "tuteurEntreprise"
            ],
            "adresseMailTuteurEntreprise" => [
                "value" => "tuteur@entreprise.fr",
                "type" => "tuteurEntreprise"
            ],
            "fonctionTuteurEntreprise" => [
                "value" => "Fonction",
                "type" => "tuteurEntreprise"
            ],
            "typeStageFicheDescriptive" => [
                "value" => "Obligatoire",
                "type" => "ficheDescriptive"
            ],
            "thematiqueFicheDescriptive" => [
                "value" => "Développement",
                "type" => "ficheDescriptive"
            ],
            "sujetFicheDescriptive" => [
                "value" => "Sujet",
                "type" => "ficheDescriptive"
            ],
            "tachesFicheDescriptive" => [
                "value" => "Taches",
                "type" => "ficheDescriptive"
            ],
            "fonctionsFicheDescriptive" => [
                "value" => "Fonctions",
                "type" => "ficheDescriptive"
            ],
            "competencesFicheDescriptive" => [
                "value" => "Compétences",
                "type" => "ficheDescriptive"
            ],
            "detailsFicheDescriptive" => [
                "value" => "",
                "type" => "ficheDescriptive"
            ],
            "debutStageFicheDescriptive" => [
                "value" => "2025-03-05",
                "type" => "ficheDescriptive"
            ],
            "finStageFicheDescriptive" => [
                "value" => "2025-03-19",
                "type" => "ficheDescriptive"
            ],
            "nbJourSemaineFicheDescriptive" => [
                "value" => 5,
                "type" => "ficheDescriptive"
            ],
            "nbHeuresSemaineFicheDescriptive" => [
                "value" => 35,
                "type" => "ficheDescriptive"
            ],
            "personnelTechniqueDisponibleFicheDescriptive" => [
                "value" => true,
                "type" => "ficheDescriptive"
            ],
            "materielPreteFicheDescriptive" => [
                "value" => "Ordinateur, téléphone, voiture",
                "type" => "ficheDescriptive"
            ],
            "clauseConfidentialiteFicheDescriptive" => [
                "value" => false,
                "type" => "ficheDescriptive"
            ]
        ];
        $response = $this->postJson('/api/fiche-descriptive/create', $donnees)
                            ->assertStatus(404)
                            ->assertJson([
                                'message' => 'L\'entreprise avec ce SIRET ou cette raison sociale n\'existe pas'
                            ]);
    }
    /**
     * La méthode handleSheetCreation doit renvoyer 400 car le numSIRET et la raison sociale sont null
     * 
     * @return void 
     */
    public function test_handleSheetCreate_renvoie_une_erreur_400_car_donnees_null(){
        $etudiant   = Etudiant::first();
        $donnees = [
            "idUPPA" => [
                "value" => $etudiant->idUPPA,
                "type" => "ficheDescriptive"
            ],
            "statut" => [
                "value" => "En cours",
                "type" => "ficheDescriptive"
            ],
            "nomEtudiant" => [
                "value" => $etudiant->nom,
                "type" => "etudiant"
            ],
            "prenomEtudiant" => [
                "value" => $etudiant->prenom,
                "type" => "etudiant"
            ],
            "telephoneEtudiant" => [
                "value" => $etudiant->telephone,
                "type" => "etudiant"
            ],
            "adresseMailEtudiant" => [
                "value" => $etudiant->adresseMail,
                "type" => "etudiant"
            ],
            "adresseEtudiant" => [
                "value" => $etudiant->adresse,
                "type" => "etudiant"
            ],
            "codePostalEtudiant" => [
                "value" => $etudiant->codePostal,
                "type" => "etudiant"
            ],
            "villeEtudiant" => [
                "value" => $etudiant->ville,
                "type" => "etudiant"
            ],
            "composanteEtablissement" => [
                "value" => "181 - IUT de Bayonne et du Pays Basque (Anglet)",
                "type" => "etablissement"
            ],
            "parcoursEtablissement" => [
                "value" => "BBWIA2 - BUT2 - INFO - Intégration d'Applications et Management du SI",
                "type" => "etablissement"
            ],
            "adresseEtablissement" => [
                "value" => "2 allée du Parc Montaury, 64600 Anglet",
                "type" => "etablissement"
            ],
            "telephoneEtablissement" => [
                "value" => "0101010101",
                "type" => "etablissement"
            ],
            "raisonSocialeEntreprise" => [
                "value" => null,
                "type" => "entreprise"
            ],
            "adresseEntreprise" => [
                "value" => "12 rue des choux fleurs",
                "type" => "entreprise"
            ],
            "codePostalEntreprise" => [
                "value" => "64100",
                "type" => "entreprise"
            ],
            "villeEntreprise" => [
                "value" => "Bayonne",
                "type" => "entreprise"
            ],
            "paysEntreprise" => [
                "value" => "France",
                "type" => "entreprise"
            ],
            "telephoneEntreprise" => [
                "value" => "0101010101",
                "type" => "entreprise"
            ],
            "serviceEntreprise" => [
                "value" => "Service",
                "type" => "ficheDescriptive"
            ],
            "typeEtablissementEntreprise" => [
                "value" => "Public",
                "type" => "entreprise"
            ],
            "numSIRETEntreprise" => [
                "value" => null,
                "type" => "entreprise"
            ],
            "codeAPE_NAFEntreprise" => [
                "value" => "1234Z",
                "type" => "entreprise"
            ],
            "statutJuridiqueEntreprise" => [
                "value" => "SA",
                "type" => "entreprise"
            ],
            "effectifEntreprise" => [
                "value" => 10,
                "type" => "entreprise"
            ],
            "nomRepresentantEntreprise" => [
                "value" => "Nom",
                "type" => "entreprise"
            ],
            "prenomRepresentantEntreprise" => [
                "value" => "Prenom",
                "type" => "entreprise"
            ],
            "telephoneRepresentantEntreprise" => [
                "value" => "0101010101",
                "type" => "entreprise"
            ],
            "adresseMailRepresentantEntreprise" => [
                "value" => "entreprise@gmail.fr",
                "type" => "entreprise"
            ],
            "fonctionRepresentantEntreprise" => [
                "value" => "Fonction",
                "type" => "entreprise"
            ],
            "adresseMailStageFicheDescriptive" => [
                "value" => "contact@rh.fr",
                "type" => "ficheDescriptive"
            ],
            "telephoneStageFicheDescriptive" => [
                "value" => "0101010101",
                "type" => "ficheDescriptive"
            ],
            "adresseStageFicheDescriptive" => [
                "value" => "Adresse",
                "type" => "ficheDescriptive"
            ],
            "codePostalStageFicheDescriptive" => [
                "value" => "47000",
                "type" => "ficheDescriptive"
            ],
            "villeStageFicheDescriptive" => [
                "value" => "Agen",
                "type" => "ficheDescriptive"
            ],
            "paysStageFicheDescriptive" => [
                "value" => "France",
                "type" => "ficheDescriptive"
            ],
            "nomTuteurEntreprise" => [
                "value" => "Nom",
                "type" => "tuteurEntreprise"
            ],
            "prenomTuteurEntreprise" => [
                "value" => "Prenom",
                "type" => "tuteurEntreprise"
            ],
            "telephoneTuteurEntreprise" => [
                "value" => "0101010101",
                "type" => "tuteurEntreprise"
            ],
            "adresseMailTuteurEntreprise" => [
                "value" => "tuteur@entreprise.fr",
                "type" => "tuteurEntreprise"
            ],
            "fonctionTuteurEntreprise" => [
                "value" => "Fonction",
                "type" => "tuteurEntreprise"
            ],
            "typeStageFicheDescriptive" => [
                "value" => "Obligatoire",
                "type" => "ficheDescriptive"
            ],
            "thematiqueFicheDescriptive" => [
                "value" => "Développement",
                "type" => "ficheDescriptive"
            ],
            "sujetFicheDescriptive" => [
                "value" => "Sujet",
                "type" => "ficheDescriptive"
            ],
            "tachesFicheDescriptive" => [
                "value" => "Taches",
                "type" => "ficheDescriptive"
            ],
            "fonctionsFicheDescriptive" => [
                "value" => "Fonctions",
                "type" => "ficheDescriptive"
            ],
            "competencesFicheDescriptive" => [
                "value" => "Compétences",
                "type" => "ficheDescriptive"
            ],
            "detailsFicheDescriptive" => [
                "value" => "",
                "type" => "ficheDescriptive"
            ],
            "debutStageFicheDescriptive" => [
                "value" => "2025-03-05",
                "type" => "ficheDescriptive"
            ],
            "finStageFicheDescriptive" => [
                "value" => "2025-03-19",
                "type" => "ficheDescriptive"
            ],
            "nbJourSemaineFicheDescriptive" => [
                "value" => 5,
                "type" => "ficheDescriptive"
            ],
            "nbHeuresSemaineFicheDescriptive" => [
                "value" => 35,
                "type" => "ficheDescriptive"
            ],
            "personnelTechniqueDisponibleFicheDescriptive" => [
                "value" => true,
                "type" => "ficheDescriptive"
            ],
            "materielPreteFicheDescriptive" => [
                "value" => "Ordinateur, téléphone, voiture",
                "type" => "ficheDescriptive"
            ],
            "clauseConfidentialiteFicheDescriptive" => [
                "value" => false,
                "type" => "ficheDescriptive"
            ]
        ];
        $response = $this->postJson('/api/fiche-descriptive/create', $donnees)
                            ->assertStatus(400)
                            ->assertJson([
                                'message' => 'Le numéro SIRET ou la raison sociale est obligatoire'
                            ]); 
    }
    /**
     * La méthode handleSheetCreation doit renvoyer 500 car on simule une erreur
     * 
     * @return void 
     */
    public function test_handleSheetCreate_renvoie_une_erreur_500_car_une_erreur_est_simule(){
        $this->partialMock(\App\Http\Middleware\DispatchDataDescriptiveSheet::class, function ($mock) {
            $mock->shouldReceive('handleSheetCreate')->andThrow(new Exception);
        });
        $response = $this->get('/api/fiche-descriptive/create');
    
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }

    /*
    =============================================
        TEST DE LA METHODE handleSheetUpdate
    =============================================
    */

    /**
     * La méthode handleSheetUpdate doit retourner une confirmation 200 car la fiche descriptive a bien été modifiée
     * 
     * @return void
     */
    public function test_handleSheetUpdate_doit_renvoyer_200_car_la_fiche_descriptive_a_ete_mise_a_jour(){
        $ficheDescriptive = FicheDescriptive::first();

        $ficheDescriptive->statut = "Validée";
        $response = $this->putJson('/api/fiche-descriptive/update/'.$ficheDescriptive->idFicheDescriptive, $ficheDescriptive->toArray());
        $response->assertStatus(200)
                 ->assertJson([
                     'entreprise' => null,
                     'tuteurEntreprise' => null,
                 ]);
    }

    /**
     * La méthode handleSheetUpdate doit retourner une erreur 404 car la fiche descriptive n'existe pas
     * 
     * @return void
     */
    public function test_handleSheetUpdate_renvoie_une_erreur_404_car_la_fiche_descriptive_n_existe_pas(){
        $ficheDescriptive = 100000;
        $response = $this->put('/api/fiche-descriptive/update/'.$ficheDescriptive);
        $response->assertStatus(404)
                 ->assertJson([
                    'message' => 'Fiche descriptive non trouvée'
                ]);
    }

    /**
     * La méthode handleSheetUpdate doit retourner une erreur 400 car le format JSON est invalide
     * 
     * @return void
     */
    public function test_handleSheetUpdate_renvoie_une_erreur_400_car_le_format_JSON_est_invalide(){
        $ficheDescriptive = FicheDescriptive::first();
        $jsonInvalide = ["idFicheDescriptive"=>1]; // Virgule en trop
        
        $response = $this->putJson('/api/fiche-descriptive/update/'.$ficheDescriptive->idFicheDescriptive,$jsonInvalide);
        $response->assertStatus(400)
                 ->assertJson([
                    'message' => 'Le format JSON est invalide'
                ]);
    }

        /**
     * La méthode handleSheetUpdate doit renvoyer 500 car on simule une erreur
     * 
     * @return void 
     */
    public function test_handleSheetUpdate_renvoie_une_erreur_500_car_une_erreur_est_simule(){
        $this->partialMock(\App\Http\Middleware\DispatchDataDescriptiveSheet::class, function ($mock) {
            $mock->shouldReceive('handleSheetUpdate')->andThrow(new Exception);
        });
        $ficheDescriptive = FicheDescriptive::first();
        $response = $this->putJson('/api/fiche-descriptive/update'.$ficheDescriptive->idFicheDescriptive);
    
        $response->assertStatus(500)
                 ->assertJson(['message' => 'Une erreur s\'est produite :']);
    }
}
