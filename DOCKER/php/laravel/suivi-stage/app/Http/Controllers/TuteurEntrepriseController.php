<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\TuteurEntreprise;
use App\Http\Controllers\EtudiantController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FicheDescriptiveController;
use App\Http\Controllers\TuteurEntrepriseController;

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
            
            // Représentant de l'entreprise 
            'nomRepresentantEntreprise' => 'nomRepresentant',
            'prenomRepresentantEntreprise' => 'prenomRepresentant',
            'telephoneRepresentantEntreprise' => 'telephoneRepresentant',
            'adresseMailRepresentantEntreprise' => 'adresseMailRepresentant',
            'fonctionRepresentantEntreprise' => 'fonctionRepresentant',

            // Tuteur Entreprise (table séparée)
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
            'clauseConfidentialiteFicheDescriptive' => 'clauseConfidentialite'
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

        // **4️⃣ Gestion spécifique du tuteurEntreprise**
        if (!empty($triData['tuteurEntreprise'])) {
            $tuteur = TuteurEntreprise::firstOrCreate(
                ['adresseMail' => $triData['tuteurEntreprise']['adresseMail'] ?? null],
                [
                    'nom' => $triData['tuteurEntreprise']['nom'] ?? '',
                    'prenom' => $triData['tuteurEntreprise']['prenom'] ?? '',
                    'telephone' => $triData['tuteurEntreprise']['telephone'] ?? '',
                    'fonction' => $triData['tuteurEntreprise']['fonction'] ?? ''
                ]
            );
            $triData['tuteurEntreprise']['id'] = $tuteur->id;
        }

        // **5️⃣ Appel des contrôleurs**
        $etudiantController = new EtudiantController();
        $entrepriseController = new EntrepriseController();
        $ficheDescriptiveController = new FicheDescriptiveController();
        $tuteurController = new TuteurEntrepriseController();

        $responses = [
            'etudiant' => !empty($triData['etudiant']) ? $etudiantController->store(new Request($triData['etudiant']))->getData() : null,
            'entreprise' => !empty($triData['entreprise']) ? $entrepriseController->store(new Request($triData['entreprise']))->getData() : null,
            'ficheDescriptive' => !empty($triData['ficheDescriptive']) ? $ficheDescriptiveController->store(new Request($triData['ficheDescriptive']))->getData() : null,
            'tuteur' => !empty($triData['tuteurEntreprise']) ? $tuteurController->store(new Request($triData['tuteurEntreprise']))->getData() : null
        ];

        return response()->json($responses);
    }
}
