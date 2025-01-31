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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     *  Une réponse JSON avec :
     *      - Code 201 : si l'enregistrement a été effectué avec succès
     *      - Code 500 : en cas d'erreur
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
                'telephoneContact'      => ['nullable','string','regex:/^(\+33|0)\d{9}$/m'],
                'adresseMailContact'    => 'nullable|string|email|max:100',
                'observations'          => 'nullable|string',
                'dateRelance'           => 'nullable|date',
                'statut'                => 'bail|required|string|in:En cours,Validé,Refusé,Relancé',
                'idUPPA'                => 'bail|required|string|exists:etudiants,idUPPA',
                'idEntreprise'          => 'required|integer|exists:entreprises,idEntreprise',
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
    
            return response()->json([
                'message' => 'Recherche de stage créée avec succès',
                'rechercheStage' => $uneRechercheStage
            ], 201);
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