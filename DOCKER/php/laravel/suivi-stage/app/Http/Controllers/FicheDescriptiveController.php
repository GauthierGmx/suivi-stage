<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FicheDescriptiveController extends Controller
{
    public function storeJson(Request $request)
    {
        // Valider les données JSON
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
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
