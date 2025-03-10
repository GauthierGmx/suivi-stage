<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TuteurEntrepriseController extends Controller
{
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try
        {
            $unTuteurEntreprise = Etudiant::findOrFail($id);
            return response()->json($unTuteurEntreprise, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucun tuteur d\'entreprise trouvé'
            ],404);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite',
                'erreurs' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            $donneesValidees = $request->validate([
                'adresseMail'   => 'required|email|max:100',
                'nom'           => 'required|string|max:50',
                'prenom'        => 'required|string|max:50',
                'telephone'     => ["required","string","regex:/^(\+33|0)\d{9}$/"],
                'fonction'      => 'required|string|max:50',
                'idEntreprise'  => 'required|integer',
            ]);
    
            $unTuteurEntreprise = TuteurEntreprise::create([
                'nom'           => $donneesValidees['nom'] ?? null, // Ajoute la valeur si elle est présente, sinon null
                'prenom'        => $donneesValidees['prenom'] ?? null,
                'telephone'     => $donneesValidees['telephone'] ?? null,
                'adresseMail'   => $donneesValidees['adresseMail'],
                'idEntreprise'  => $donneesValidees['ville'] ?? null,
                'fonction'      => $donneesValidees['fonction'] ?? null,
            ]);
    
            return response()->json($unTuteurEntreprise,201);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreur' => $e->errors()
            ],422);
        }
        catch (\Illuminate\Database\QueryException $e)
        {
            return response()->json([
                'message' => 'Erreur dans la base de données',
                'erreur' => $e->getMessage()
            ],500);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite',
                'erreur' => $e->getMessage()
            ],500);
        }
    }
}
