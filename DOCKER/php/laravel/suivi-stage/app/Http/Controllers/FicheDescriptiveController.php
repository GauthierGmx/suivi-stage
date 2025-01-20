<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FicheDescriptiveController extends Controller
{
    public function storeJson(Request $request)
    {
        // Valider les données JSON
        $validatedData = $request->validate([
            'dateCreation' => 'required|date',
            'dateDerniereModification' => 'required|date',
            'contenuStage' => 'required|string',
            'thematique' => 'required|string',
            'sujet' => 'required|string',
            'fonctions' => 'required|string',
            'taches' => 'required|string',
            'competences' => 'required|string',
            'details' => 'required|string',
            'debutStage' => 'required|date',
            'finStage' => 'required|date',
            'nbJourSemaine' => 'required|integer',
            'nbHeureSemaine' => 'required|integer',
            'clauseConfidentialite' => 'required|boolean',
            'statut' => 'required|string',
            'numeroConvention' => 'required|string',
            'interruptionEntreprise' => 'required|boolean',
            'dateDebutInterruption' => 'required|date',
            'dateFinInterruption' => 'required|date',
            'personnelTechniqueDisponible' => 'required|boolean',
            'materielPrete' => 'required|string',
            'idEntreprise' => 'required|integer',
            'idTuteurEntreprise' => 'required|integer',
            'idUPPA' => 'required|integer'
        ]);

        try {
            // Enregistrement dans la base de données
            Data::create($validatedData);

            // Répondre avec un message de succès
            return response()->json([
                'message' => 'Données enregistrées avec succès.',
                'status' => 'success'
            ], 200);
        } catch (\Exception $e) {
            // Gérer une erreur et répondre avec un message d'erreur
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }
    }
}
