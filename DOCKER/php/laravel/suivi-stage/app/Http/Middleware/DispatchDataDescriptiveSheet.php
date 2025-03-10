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
        $data = $request->json()->all(); // Récupère les données JSON
        
        if (!is_array($data)) {
            return response()->json(['error' => 'Invalid JSON format'], 400);
        }

        // Trier les données par type
        $etudiant = [];
        $entreprise = [];
        $ficheDescriptive = [];
        $tuteur = null;

        foreach ($data as $item) {
            if (isset($item['type'])) {
                switch ($item['type']) {
                    case 'etudiant':
                        $etudiant[] = $item;
                        break;
                    case 'entreprise':
                        $entreprise[] = $item;
                        break;
                    case 'ficheDescriptive':
                        $ficheDescriptive[] = $item;
                        break;
                    case 'tuteurEntreprise':
                        if (!isset($item['adresseMail'], $item['nom'], $item['prenom'], $item['telephone'], $item['idEntreprise'], $item['fonction'])) {
                            return response()->json(['error' => 'Données incomplètes pour le tuteur'], 400);
                        }

                        $tuteur = TuteurEntreprise::firstOrCreate(
                            ['adresseMail' => $item['adresseMail']],
                            [
                                'nom' => $item['nom'],
                                'prenom' => $item['prenom'],
                                'telephone' => $item['telephone'],
                                'idEntreprise' => (int) $item['idEntreprise'],
                                'fonction' => $item['fonction']
                            ]
                        );
                        break;
                }
            }
        }

        // Instancier les contrôleurs et leur envoyer les données
        $etudiantController = new EtudiantController();
        $entrepriseController = new EntrepriseController();
        $ficheDescriptiveController = new FicheDescriptiveController();
        $tuteurController = new TuteurEntrepriseController();

        $responses = [
            'etudiant' => $etudiantController->store(new Request(['etudiant' => $etudiant]))->getData(),
            'entreprise' => $entrepriseController->store(new Request(['entreprise' => $entreprise]))->getData(),
            'ficheDescriptive' => $ficheDescriptiveController->store(new Request(['ficheDescriptive' => $ficheDescriptive]))->getData(),
            'tuteur' => $tuteur ? $tuteurController->store(new Request(['tuteur' => $tuteur]))->getData() : null
        ];

        return response()->json($responses);
    }
}
