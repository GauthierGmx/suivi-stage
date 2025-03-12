<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\TuteurEntreprise;
use App\Models\Entreprise;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController;
use App\Http\Controllers\TuteurEntrepriseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DispatchDataDescriptiveSheet
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $data = $request->json()->all();

        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid JSON format'], 400);
        }

        // **1️⃣ Mapping des champs front -> base**
        $mapping = [
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
            'serviceEntreprise' => 'service',
            'typeStageFicheDescriptive' => 'typeStage',
            'thematiqueFicheDescriptive' => 'thematique',
            'sujetFicheDescriptive' => 'sujet',
            'tachesFicheDescriptive' => 'taches',
            'competencesFicheDescriptive' => 'competences',
            'detailsFicheDescriptive' => 'details',
            'debutStageFicheDescriptive' => 'debutStage',
            'finStageFicheDescriptive' => 'finStage',
            'nbJourSemaineFicheDescriptive' => 'nbJourSemaine',
            'nbHeuresSemaineFicheDescriptive' => 'nbHeuresSemaine',
            'personnelTechniqueDisponibleFicheDescriptive' => 'personnelTechniqueDisponible',
            'materielPreteFicheDescriptive' => 'materielPrete',
            'clauseConfidentialiteFicheDescriptive' => 'clauseConfidentialite',
            'adresseMailStageFicheDescriptive' => 'adresseMailStage',
            'telephoneStageFicheDescriptive' => 'telephoneStage',
            'codePostalStageFicheDescriptive'=> 'codePostalStage',
            'villeStageFicheDescriptive' => 'villeStage',
            'paysStageFicheDescriptive' => 'paysStage',
        ];

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
                $tuteur = TuteurEntreprise::create([
                    'nom' => $triData['tuteurEntreprise']['nom'] ?? '',
                    'prenom' => $triData['tuteurEntreprise']['prenom'] ?? '',
                    'telephone' => $triData['tuteurEntreprise']['telephone'] ?? '',
                    'fonction' => $triData['tuteurEntreprise']['fonction'] ?? '',
                    'adresseMail' => $triData['tuteurEntreprise']['adresseMail'] ?? '',
                    'idEntreprise' => $triData['tuteurEntreprise']['idEntreprise'],
                ]);
            }

            // Ajout des ID à la fiche descriptive
            $triData['tuteurEntreprise']['id'] = $tuteur->id;
            $triData['ficheDescriptive']['idTuteurEntreprise'] = $tuteur->idTuteur;
            $triData['ficheDescriptive']['idEntreprise'] = $tuteur->idEntreprise;
        }

        // **6️⃣ Appel des contrôleurs pour enregistrer les autres entités**
        $etudiantController = new EtudiantController();
        $entrepriseController = new EntrepriseController();
        $ficheDescriptiveController = new FicheDescriptiveController();
        $tuteurController = new TuteurEntrepriseController();

        $responses = [
            'etudiant' => !empty($triData['etudiant']) ? $etudiantController->store(new Request($triData['etudiant']))->getData() : null,
            //'entreprise' => !empty($triData['entreprise']) ? $entrepriseController->getOrCreate(new Request($triData['entreprise']))->getData() : null,
            'ficheDescriptive' => !empty($triData['ficheDescriptive']) ? $ficheDescriptiveController->store(new Request($triData['ficheDescriptive']))->getData() : null,
            'tuteur' => !empty($triData['tuteurEntreprise']) ? $this->handleTuteurCreation($triData['tuteurEntreprise']) : null
        ];

        return response()->json($responses);
    }


    // Fonction pour gérer la création ou la récupération du tuteur
    private function handleTuteurCreation($tuteurData)
    {
        // Vérification si le TuteurEntreprise existe déjà avec le même email et la même entreprise
        $tuteur = TuteurEntreprise::where('adresseMail', $tuteurData['adresseMail'])
                    ->where('idEntreprise', $tuteurData['idEntreprise'])
                    ->first();

        if (!$tuteur) {
            // Si le tuteur n'existe pas, on le crée
            $tuteur = TuteurEntreprise::create([
                'nom' => $tuteurData['nom'] ?? '',
                'prenom' => $tuteurData['prenom'] ?? '',
                'telephone' => $tuteurData['telephone'] ?? '',
                'fonction' => $tuteurData['fonction'] ?? '',
                'adresseMail' => $tuteurData['adresseMail'] ?? '',
                'idEntreprise' => $tuteurData['idEntreprise'],
            ]);
        }

        // Retourner le tuteur créé ou trouvé
        return $tuteur ? $tuteur->toArray() : null;
    }
}
