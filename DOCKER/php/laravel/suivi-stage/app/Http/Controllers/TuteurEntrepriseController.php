<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entreprise;
use App\Models\TuteurEntreprise;

class TuteurEntrepriseController extends Controller
{
    /**
     * Index all tutors
     * @return \Illuminate\Http\Response
     * 
     */
    public function index()
    {
        return TuteurEntreprise::all();
    }

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
            $unTuteurEntreprise = TuteurEntreprise::findOrFail($id);
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
        try {
            $donneesValidees = $request->validate([
                'adresseMail'   => 'required|email|max:100',
                'nom'           => 'required|string|max:50',
                'prenom'        => 'required|string|max:50',
                'telephone'     => ['required', 'string', 'regex:/^(\+33|0)\d{9}$/'],
                'fonction'      => 'required|string|max:50',
                'idEntreprise'  => 'required|integer|exists:entreprises,idEntreprise',  // Vérification si l'entreprise existe
            ]);
    
            // Vérification supplémentaire
            if (!isset($donneesValidees['idEntreprise'])) {
                return response()->json(['error' => "L'ID de l'entreprise est manquant."], 400);
            }
    
            // Vérifier si l'entreprise existe
            $entreprise = Entreprise::find($donneesValidees['idEntreprise']);
            if (!$entreprise) {
                return response()->json(['error' => "L'entreprise spécifiée n'existe pas."], 404);
            }
    
            // Création du tuteur avec l'ID de l'entreprise
            $unTuteurEntreprise = TuteurEntreprise::create([
                'nom'           => $donneesValidees['nom'],
                'prenom'        => $donneesValidees['prenom'],
                'telephone'     => $donneesValidees['telephone'],
                'adresseMail'   => $donneesValidees['adresseMail'],
                'idEntreprise'  => $donneesValidees['idEntreprise'],
                'fonction'      => $donneesValidees['fonction'],
            ]);
    
            return response()->json($unTuteurEntreprise, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'erreurs' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erreur dans la base de données',
                'erreur' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur s\'est produite',
                'erreur' => $e->getMessage(),
            ], 500);
        }
    }   
    
    /**
     * Update the specified resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id){
        try{
            $validatedData = $request->validate([
                'adresseMail'   => 'required|email|max:100',
                'nom'           => 'required|string|max:50',
                'prenom'        => 'required|string|max:50',
                'telephone'     => ['required', 'string', 'regex:/^(\+33|0)\d{9}$/'],
                'fonction'      => 'required|string|max:50',
            ]);
            
            TuteurEntreprise::findOrFail($id)->update($validatedData);
           
            return response()->json($validatedData, 200);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreurs' => $e->errors()
            ], 422);
        }

        catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e){
            return response()->json([
                'message' => 'Tuteur non trouvée',
                'erreurs' => $e->getMessage()
            ], 404);
        }
        catch (\Illuminate\Database\QueryException $e)
        {
            return response()->json([
                'message' => 'Erreur dans la base de données',
                'erreurs' => $e->getMessage()
            ], 500);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'erreurs' => $e->getMessage()
            ], 500);
        }
    }

}
