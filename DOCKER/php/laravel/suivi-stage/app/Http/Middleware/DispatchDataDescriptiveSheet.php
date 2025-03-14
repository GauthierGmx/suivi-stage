<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Etudiant;
use App\Models\TuteurEntreprise;
use App\Models\Entreprise;
use App\Models\FicheDescriptive;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController;
use App\Http\Controllers\TuteurEntrepriseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DispatchDataDescriptiveSheet
{
    protected $mapping = [
        // Étudiant
        'nomEtudiant' => 'nom',
        'prenomEtudiant' => 'prenom',
        'telephoneEtudiant' => 'telephone',
        'adresseMailEtudiant' => 'adresseMail',
        'adresseEtudiant' => 'adresse',
        'codePostalEtudiant' => 'codePostal',
        'villeEtudiant' => 'ville',

        // Entreprise
        'raisonSocialeEntreprise' => 'raisonSociale',
        'adresseEntreprise' => 'adresse',
        'codePostalEntreprise' => 'codePostal',
        'villeEntreprise' => 'ville',
        'paysEntreprise' => 'pays',
        'telephoneEntreprise' => 'telephone',
        'numSIRETEntreprise' => 'numSIRET',
        'codeAPE_NAFEntreprise' => 'codeAPE_NAF',
        'statutJuridiqueEntreprise' => 'statutJuridique',
        'effectifEntreprise' => 'effectif',
        'typeEtablissementEntreprise' => 'typeEtablissement',

        // Représentant de l'entreprise
        'nomRepresentantEntreprise' => 'nomRepresentant',
        'prenomRepresentantEntreprise' => 'prenomRepresentant',
        'telephoneRepresentantEntreprise' => 'telephoneRepresentant',
        'adresseMailRepresentantEntreprise' => 'adresseMailRepresentant',
        'fonctionRepresentantEntreprise' => 'fonctionRepresentant',

        // Tuteur Entreprise
        'nomTuteurEntreprise' => 'nom',
        'prenomTuteurEntreprise' => 'prenom',
        'telephoneTuteurEntreprise' => 'telephone',
        'adresseMailTuteurEntreprise' => 'adresseMail',
        'fonctionTuteurEntreprise' => 'fonction',

        // Fiche Descriptive
        'statutFicheDescriptive' => 'statut',
        'serviceEntrepriseFicheDescriptive' => 'serviceEntreprise',
        'typeStageFicheDescriptive' => 'typeStage',
        'thematiqueFicheDescriptive' => 'thematique',
        'sujetFicheDescriptive' => 'sujet',
        'tachesFicheDescriptive' => 'taches',
        'fonctionsFicheDescriptive' => 'fonctions',
        'competencesFicheDescriptive' => 'competences',
        'detailsFicheDescriptive' => 'details',
        'debutStageFicheDescriptive' => 'debutStage',
        'finStageFicheDescriptive' => 'finStage',
        'nbJourSemaineFicheDescriptive' => 'nbJourSemaine',
        'nbHeuresSemaineFicheDescriptive' => 'nbHeureSemaine',
        'personnelTechniqueDisponibleFicheDescriptive' => 'personnelTechniqueDisponible',
        'materielPreteFicheDescriptive' => 'materielPrete',
        'clauseConfidentialiteFicheDescriptive' => 'clauseConfidentialite',
        'adresseMailStageFicheDescriptive' => 'adresseMailStage',
        'telephoneStageFicheDescriptive' => 'telephoneStage',
        'adresseStageFicheDescriptive' => 'adresseStage',
        'codePostalStageFicheDescriptive'=> 'codePostalStage',
        'villeStageFicheDescriptive' => 'villeStage',
        'paysStageFicheDescriptive' => 'paysStage',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $data = $request->json()->all();

        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid JSON format'], 400);
        }

         // Vérifiez si la route demandée correspond à celle de handleSheetCreation
         if ($request->is('api/fiche-descriptive/create')){
            return $this->handleSheetCreation($request);
        }

        //Pour la mise à jour d'une fiche descriptive
        if ($request->is('api/fiche-descriptive/update/*') && $request->route('id')) {
            return $this->handleSheetUpdate($request, $request->route('id'));
        }

        //Pour le renvoie d'une fiche descriptive
        if ($request->is('api/fiche-descriptive/*') && $request->route('id')) {
            return $this->handleSheetGet($request, $request->route('id'));
        }

        return $next($request);
    }

    /**
     * Création d'une fiche descriptive.
     * 
     * @param Request $request
     * @return Response
     */
    public function handleSheetCreation(Request $request)
    {
        $data = $request->json()->all();

        // **1️⃣ Récupération du mapping**
        $mapping = $this->mapping;

        // **2️⃣ Initialisation des catégories**
        $triData = [
            'etudiant' => [],
            'entreprise' => [],
            'ficheDescriptive' => [],
            'tuteurEntreprise' => []
        ];

        // **3️⃣ Parcours des données pour les trier et mapper les champs**
        foreach ($data as $key => $item) {
            if (isset($item['type'], $item['value'])) {
                $type = $item['type'];
                $value = $item['value'];

                // Appliquer le mapping si le champ existe dans la table de correspondance
                $mappedKey = $mapping[$key] ?? $key;

                // Vérifier que la catégorie est valide avant d'insérer
                if (array_key_exists($type, $triData)) {
                    $triData[$type][$mappedKey] = $value;
                }
            }
        }

        // **4️⃣ Récupération de l'ID de l'entreprise via le numSIRET ou raison sociale**
        if (!empty($triData['entreprise']['numSIRET']) || !empty($triData['entreprise']['raisonSociale'])) {
            $numSIRET = $triData['entreprise']['numSIRET'] ?? null;
            $raisonSociale = $triData['entreprise']['raisonSociale'] ?? null;

            // Recherche de l'entreprise par numSIRET ou raison sociale
            $entreprise = Entreprise::where('numSIRET', $numSIRET)
                                    ->orWhere('raisonSociale', $raisonSociale)
                                    ->first();

            // Si l'entreprise existe déjà
            if ($entreprise) {
                // L'entreprise existe déjà, donc tu récupères son ID pour l'utiliser plus tard
                $triData['tuteurEntreprise']['idEntreprise'] = $entreprise->idEntreprise;
                Log::debug("Entreprise existante - ID : " . $entreprise->idEntreprise);

                // Appel de la méthode show pour récupérer les données de l'entreprise existante
                $entrepriseController = new EntrepriseController();
                $response = $entrepriseController->show(new Request(['id' => $entreprise->idEntreprise]));

                // Tu peux obtenir les données de l'entreprise comme ceci
                $entrepriseData = $response->getData();
                // Tu peux ensuite les utiliser comme bon te semble
            } else {
                Log::error("Entreprise non trouvée avec le SIRET : " . $numSIRET . " ou la raison sociale : " . $raisonSociale);
                return response()->json(['error' => "L'entreprise avec ce SIRET ou cette raison sociale n'existe pas"], 404);
            }
        } else {
            Log::error("Numéro SIRET et raison sociale manquants");
            return response()->json(['error' => "Le numéro SIRET ou la raison sociale est obligatoire"], 400);
        }
        // **5️⃣ Création du Tuteur Entreprise s'il n'existe pas**
        if (!empty($triData['tuteurEntreprise'])) {
            // Vérification si le TuteurEntreprise existe déjà avec le même email et la même entreprise
            $tuteur = TuteurEntreprise::where('adresseMail', $triData['tuteurEntreprise']['adresseMail'])
                        ->where('idEntreprise', $triData['tuteurEntreprise']['idEntreprise'])
                        ->first();

            // Si le tuteur n'existe pas, alors on le crée
            if (!$tuteur) {
                $tuteurController = new TuteurEntrepriseController();
                $tuteur = $tuteurController->store(new Request($triData['tuteurEntreprise']))->getData();
            } 

            // Ajout des ID à la fiche descriptive
            $triData['tuteurEntreprise']['id'] = $tuteur->idTuteur;
            $triData['ficheDescriptive']['idTuteurEntreprise'] = $tuteur->idTuteur;
            $triData['ficheDescriptive']['idEntreprise'] = $tuteur->idEntreprise;
        }

        // **6️⃣ Appel des contrôleurs pour enregistrer les autres entités**
        $ficheDescriptiveController = new FicheDescriptiveController();

        $responses = [
            'ficheDescriptive' => !empty($triData['ficheDescriptive']) ? $ficheDescriptiveController->store(new Request($triData['ficheDescriptive']))->getData() : null,
            'tuteur' => $tuteur
        ];

        return response()->json($responses);
    }

    /**
     * Mise à jour de la fiche descriptive.
     * 
     * @param Request $request
     * @param int $id
     * 
     * @return Response
     */

    public function handleSheetUpdate(Request $request, $id)
    {
        // **1️⃣ Récupération de la fiche descriptive**
        $ficheDescriptive = FicheDescriptive::find($id);
        if (!$ficheDescriptive) {
            return response()->json(['error' => 'Fiche descriptive non trouvée'], 404);
        }

        // **2️⃣ Récupérer les IDs de l'entreprise et du tuteur associés**
        $idEntreprise = $ficheDescriptive->idEntreprise;
        $idTuteurEntreprise = $ficheDescriptive->idTuteurEntreprise;

        // **3️⃣ Récupération et validation des données du JSON**
        $data = $request->json()->all();
        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid JSON format'], 400);
        }

        // **4️⃣ Structuration des données avec le mapping**
        $triData = [
            'etudiant' => [],
            'entreprise' => [],
            'ficheDescriptive' => [],
            'tuteurEntreprise' => []
        ];

        $mapping = $this->mapping;
        foreach ($data as $key => $item) {
            if (isset($item['type'], $item['value'])) {
                $type = $item['type'];
                $value = $item['value'];

                // Appliquer le mapping
                $mappedKey = $mapping[$key] ?? $key;

                // Vérifier si le type est valide et appliquer le mapping
                if (array_key_exists($type, $triData)) {
                    $triData[$type][$mappedKey] = $value;
                }
            }
        }

        // **5️⃣ Validation des données après mapping**
        $validatedData = $this->validateData($triData);

        // **6️⃣ Mise à jour de la fiche descriptive**
        $ficheDescriptive->update($validatedData['ficheDescriptive']);

        $tuteurEntreprise = $validatedData['ficheDescriptive']['idTuteurEntreprise'];
        $entreprise = $validatedData['ficheDescriptive']['idEntreprise'];

        // **7️⃣ Mise à jour de l'entreprise si nécessaire**
        $entreprise = null;
        if (!empty($validatedData['entreprise'])) {
            $entreprise = Entreprise::find($tuteurEntreprise);
            if ($entreprise) {
                $entreprise->update($validatedData['entreprise']);
            } else {
                \Log::error("Entreprise non trouvée pour ID: " . $idEntreprise);
            }
        }

        // **8️⃣ Mise à jour du tuteur entreprise si nécessaire**
        $tuteur = null;
        if (!empty($validatedData['tuteurEntreprise'])) {
            $tuteur = TuteurEntreprise::find($entreprise);
            if ($tuteur) {
                $tuteur->update($validatedData['tuteurEntreprise']);
            } else {
                \Log::error("Tuteur entreprise non trouvé pour ID: " . $idTuteurEntreprise);
            }
        }

        // **9️⃣ Générer la réponse finale avec les mises à jour**
        return response()->json([
            'ficheDescriptive' => $ficheDescriptive,
            'entreprise' => $entreprise,
            'tuteurEntreprise' => $tuteur
        ]);
    }

    /**
     * Récupération d'une fiche descriptive.
     * Envoie de la fiche descriptive au front pour affichage.
     * 
     * @param Request $request
     * @return Response
     */
    public function handleSheetGet(Request $request)
    {
        // Logique pour récupérer ou manipuler les données
        $id = $request->route('id'); // Vous pouvez récupérer l'ID de la route

        // Exemple : récupérez les données d'une fiche descriptive, d'un tuteur, ou d'une entreprise
        $ficheDescriptive = FicheDescriptive::findOrFail($id);

        // Si la fiche descriptive n'est pas trouvée
        if (!$ficheDescriptive) {
            return response()->json(['message' => 'Fiche descriptive non trouvée'], 404);
        }

        // Récupérer les données du tuteur et de l'entreprise
        $etudiant = Etudiant::find($ficheDescriptive->idUPPA);
        $tuteur = TuteurEntreprise::find($ficheDescriptive->idTuteurEntreprise);
        $entreprise = Entreprise::find($ficheDescriptive->idEntreprise);

        // Vérifier la présence du tuteur et de l'entreprise
        if (!$tuteur || !$entreprise) {
            return response()->json(['message' => 'Tuteur ou entreprise non trouvée'], 404);
        }

        // Vérification de la validité des champs obligatoires
        if (empty($entreprise->numSIRET) || empty($entreprise->raisonSociale)) {
            return response()->json(['error' => 'Le numéro SIRET ou/et la raison sociale est obligatoire'], 400);
        }
 
         // Construire le tableau des données à renvoyer
         $data = [
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
 
         ];
  
         // Retourner la réponse JSON
         return response()->json($data);
    }
}
