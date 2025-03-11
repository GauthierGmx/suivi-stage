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

        // **1️⃣ Tableau de correspondance des champs Front -> Base**
        $mapping = [
            'nomTuteur' => 'nom',
            'prenomTuteur' => 'prenom',
            'telephoneTuteur' => 'telephone',
            'adresseMailTuteur' => 'adresseMail',
            'fonctionTuteur' => 'fonction'
        ];

        // **2️⃣ Initialisation des tableaux de données**
        $triData = [
            'etudiant' => [],
            'entreprise' => [],
            'ficheDescriptive' => [],
            'tuteurEntreprise' => []
        ];

        // **3️⃣ Trier les données en fonction de leur type et appliquer le mapping**
        foreach ($data as $key => $item) {
            if (isset($item['type'], $item['value'])) {
                $type = $item['type'];
                $value = $item['value'];

                // Vérifier si le champ doit être renommé (ex: nomTuteur -> nom)
                $key = $mapping[$key] ?? $key;

                // Vérifier que le type correspond à une catégorie existante
                if (array_key_exists($type, $triData)) {
                    $triData[$type][$key] = $value;
                }
            }
        }

        // **4️⃣ Gérer le tuteurEntreprise (création ou récupération)**
        if (!empty($triData['tuteurEntreprise'])) {
            $tuteur = TuteurEntreprise::firstOrCreate(
                ['adresseMail' => $triData['tuteurEntreprise']['adresseMail'] ?? null],
                [
                    'nom' => $triData['tuteurEntreprise']['nom'] ?? '',
                    'prenom' => $triData['tuteurEntreprise']['prenom'] ?? '',
                    'telephone' => $triData['tuteurEntreprise']['telephone'] ?? '',
                    'idEntreprise' => $triData['tuteurEntreprise']['idEntreprise'] ?? null,
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