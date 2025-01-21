<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FicheDescriptive;

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
            'interruptionStage' => 'required|boolean',
            'dateDebutInterruption' => 'nullable|date',
            'dateFinInterruption' => 'nullable|date',
            'personnelTechniqueDisponible' => 'required|boolean',
            'materielPrete' => 'required|string',
            'idEntreprise' => 'required|integer',
            'idTuteurEntreprise' => 'required|integer',
            'idUPPA' => 'required|string'
        ]);
        
        try {
            // Enregistrement dans la base de données
            FicheDescriptive::create($validatedData);
    
            // Répondre avec un message de succès
            return response()->json([
                'message' => 'Données enregistrées avec succès.',
                'status' => 'success'
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur d\'enregistrement : ' . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'enregistrement.',
                'error' => $e->getMessage(),
                'status' => 'error'
            ], 500);
        }

    }
    
}
