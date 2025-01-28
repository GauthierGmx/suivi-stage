<?php

namespace App\Http\Controllers;

use App\Models\RechercheStage;
use Illuminate\Http\Request;

class RechercheStageController extends Controller
{
    /**
     * Retourne toutes les recherches de stage
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
                'dateCreation'          => 'bail|required|date|date-format:Y-m-d',
                'dateModification'      => 'bail|required|date|date-format:Y-m-d',
                'date1erContact'        => 'bail|required|date|date-format:Y-m-d',
                'typeContact'           => 'bail|required|string|in:Courrier,Mail,Présentiel,Téléphone,Site de recrutement',
                'nomContact'            => 'bail|required|string|max:50',
                'prenomContact'         => 'bail|required|string|max:50',
                'fonctionContact'       => 'bail|required|string|max:50',
                'telephoneContact'      => ['nullable','string','regex:/^(\+33|0)\d{9}$/m'], // Obligé de passer les paramètres dans un tableau puisque la règle "regex" est utilisée avec d'autres
                'adresseMailContact'    => 'nullable|string|email|max:100',
                'observations'          => 'nullable|string',
                'dateRelance'           => 'nullable|date|date-format:Y-m-d',
                'statut'                => 'bail|required|string|in:En cours,Validé,Refusé,Relancé',
                'idUPPA'                => 'bail|required|string',
                'idEntreprise'          => 'required|integer',
            ]);
    
            $uneRechercheStage = RechercheStage::create([
                'dateCreation' => $donneesValidees['dateCreation'],
                'dateModification' => $donneesValidees['dateModification'],
                'date1erContact' => $donneesValidees['date1erContact'],
                'typeContact' => $donneesValidees['typeContact'],
                'nomContact' => $donneesValidees['nomContact'],
                'prenomContact' => $donneesValidees['prenomContact'],
                'fonctionContact' => $donneesValidees['fonctionContact'],
                'telephoneContact' => $donneesValidees['telephoneContact'] ?? null,
                'adresseMailContact' => $donneesValidees['adresseMailContact'] ?? null,
                'observations' => $donneesValidees['observations'] ?? null,
                'dateRelance' => $donneesValidees['dateRelance'] ?? null,
                'statut' => $donneesValidees['statut'],
                'idUPPA' => $donneesValidees['idUPPA'],
                'idEntreprise' => $donneesValidees['idEntreprise'],
            ]);
    
            return response()->json([
                'message' => 'Recherche de stage créée avec succès',
                'rechercheStage' => $uneRechercheStage
            ], 201);
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
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }

    /**
     * Supprime une recherche de stage particulière
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
