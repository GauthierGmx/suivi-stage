<?php

namespace App\Http\Controllers;

use App\Models\RechercheStage;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RechercheStageController extends Controller
{
    /**
     * Retourne toutes les recherches de stage
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return RechercheStage::all();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Créer une nouvelle recherche de stage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *  Une réponse JSON avec :
     *      - Code 201 : si l'enregistrement a été effectué avec succès
     *      - Code 422 : en cas d'erreur de validation
     *      - Code 500 : en cas d'erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        try
        {
            $donneesValidees = $request->validate([
                'dateCreation'          => 'bail|required|date',
                'dateModification'      => 'bail|required|date',
                'date1erContact'        => 'bail|required|date',
                'typeContact'           => 'bail|required|string|in:Courrier,Mail,Présentiel,Téléphone,Site de recrutement',
                'nomContact'            => 'bail|required|string|max:50',
                'prenomContact'         => 'bail|required|string|max:50',
                'fonctionContact'       => 'bail|required|string|max:50',
                'telephoneContact'      => ['nullable','string','regex:/^(\+33|0)\d{9}$/m'], // Obligé de passer les paramètres dans un tableau puisque la règle "regex" est utilisée avec d'autres
                'adresseMailContact'    => 'nullable|string|email|max:100',
                'observations'          => 'nullable|string',
                'dateRelance'           => 'nullable|date',
                'statut'                => 'bail|required|string|in:En cours,Validé,Refusé,Relancé',
                'idUPPA'                => 'bail|required|string',
                'idEntreprise'          => 'required|integer',
            ]);
    
            $uneRechercheStage = RechercheStage::create([
                'dateCreation' => Carbon::parse($donneesValidees['dateCreation'])->format('Y-m-d'),
                'dateModification' => Carbon::parse($donneesValidees['dateModification'])->format('Y-m-d'),
                'date1erContact' => Carbon::parse($donneesValidees['date1erContact'])->format('Y-m-d'),
                'typeContact' => $donneesValidees['typeContact'],
                'nomContact' => $donneesValidees['nomContact'],
                'prenomContact' => $donneesValidees['prenomContact'],
                'fonctionContact' => $donneesValidees['fonctionContact'],
                'telephoneContact' => $donneesValidees['telephoneContact'] ?? null,
                'adresseMailContact' => $donneesValidees['adresseMailContact'] ?? null,
                'observations' => $donneesValidees['observations'] ?? null,
                'dateRelance' => isset($donneesValidees['dateRelance']) ? Carbon::parse($donneesValidees['dateRelance'])->format('Y-m-d') : null,
                'statut' => $donneesValidees['statut'],
                'idUPPA' => $donneesValidees['idUPPA'],
                'idEntreprise' => $donneesValidees['idEntreprise'],
            ]);
    
            return response()->json($uneRechercheStage, 201);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreurs' => $e->errors()
            ], 422);
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
    
    /**
     * Retourne une recherche de stage particulier
     * Code HTTP retourné :
     *      - Code 200 : si la recherche de stage a été trouvée
     *      - Code 404 : si la recherche de stage n'a pas été trouvée
     *      - Code 500 : s'il y a une erreur
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function show($id)
    {
        try
        {
            $uneRechercheStage = RechercheStage::findOrFail($id);
            return response()->json($uneRechercheStage, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucune recherche de stage trouvée'
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
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Modifie une recherche de stage particulière
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try
        {
            $donneesValidees = $request->validate([
                'date1erContact'        => 'bail|required|date',
                'typeContact'           => 'bail|required|string|in:Courrier,Mail,Présentiel,Téléphone,Site de recrutement',
                'nomContact'            => 'bail|required|string|max:50',
                'prenomContact'         => 'bail|required|string|max:50',
                'fonctionContact'       => 'bail|required|string|max:50',
                'telephoneContact'      => ['nullable','string','regex:/^(\+33|0)\d{9}$/m'], // Obligé de passer les paramètres dans un tableau puisque la règle "regex" est utilisée avec d'autres
                'adresseMailContact'    => 'nullable|string|email|max:100',
                'observations'          => 'nullable|string',
                'dateRelance'           => 'nullable|date',
                'statut'                => 'bail|required|string|in:En cours,Validé,Refusé,Relancé',
            ]);
            $donneesValidees['dateModification'] = Carbon::now()->format('Y-m-d'); // Ajout de la date de modification
    
            $uneRechercheStage = RechercheStage::findOrFail($id);
            $uneRechercheStage->update($donneesValidees);

            return response()->json($uneRechercheStage, 200);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreurs' => $e->errors()
            ],422);   
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucune recherche de stage trouvée'
            ],404);
        }
        catch (\Illuminate\Database\QueryException $e)
        {
            return response()->json([
                'message' => 'Erreur dans la base de données',
                'erreurs' => $e->getMessage()
            ],500);
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
     * Supprime une recherche de stage particulière
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try
        {
            $uneRechercheStage = RechercheStage::findOrFail($id);
            $uneRechercheStage->delete();
            
            return response()->json([
                'message' => 'La recherche de stage a bien été supprimée'
            ], 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucune recherche de stage trouvée'
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
}