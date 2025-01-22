<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    /**
     * Retourne toutes les entreprises
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Entreprise::all();
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
     * Créer une nouvelle entreprise
     * 
     * @warning Lors de la création de l'entreprise, il suffit de renseigner seulement la raison sociale
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try
        {
            $donneesValidees = $request->validate([
                'numSIRET'          => ["nullable","string","regex:/^\d{14}$/"],
                'raisonSociale'     => 'bail|required|string|max:100',
                'typeEtablissement' => 'nullable|string|in:Administration,Association,Entreprise,Etablissement public',
                'adresse'           => 'nullable|string|max:100',
                'ville'             => 'nullable|string|max:50',
                'codePostal'        => ["nullable","string","regex:/^\d{5}$/"],
                'pays'              => 'nullable|string|max:50',
                'telephone'         => ["nullable","string","regex:/^(\+33|0)\d{9}$/"],
                'codeAPE_NAF'       => ["nullable","string","regex:/^\d{2}\.\d{2}[A-Z]$/"],
                'statutJuridique'   => 'nullable|string|in:EI,EURL,SARL,SASU,SAS,SA,SNC,SCS,SCA',
                'effectif'          => 'nullable|integer',
                'representantLegal' => 'nullable|string|max:100',
                'longitudeAdresse'  => 'nullable|string|max:20',
                'latitudeAdresse'   => 'nullable|string|max:20',
            ]);
    
            $uneEntreprise = Entreprise::create([
                'numSIRET'          => $donneesValidees['numSIRET'] ?? null, // Ajoute la valeur si elle est présente, sinon null
                'raisonSociale'     => $donneesValidees['raisonSociale'],
                'typeEtablissement' => $donneesValidees['typeEtablissement'] ?? null,
                'adresse'           => $donneesValidees['adresse'] ?? null,
                'ville'             => $donneesValidees['ville'] ?? null,
                'codePostal'        => $donneesValidees['codePostal'] ?? null,
                'pays'              => $donneesValidees['pays'] ?? null,
                'telephone'         => $donneesValidees['telephone'] ?? null,
                'codeAPE_NAF'       => $donneesValidees['codeAPE_NAF'] ?? null,
                'statutJuridique'   => $donneesValidees['statutJuridique'] ?? null,
                'effectif'          => $donneesValidees['effectif'] ?? null,
                'representantLegal' => $donneesValidees['representantLegal'] ?? null,
                'longitudeAdresse'  => $donneesValidees['longitudeAdresse'] ?? null,
                'latitudeAdresse'   => $donneesValidees['latitudeAdresse'] ?? null,
            ]);
    
            return response()->json([
                'message' => 'Entreprise créée avec succès',
                'entreprise' => $uneEntreprise
            ],201);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation',
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

    /**
     * Retourne une entreprise particulière
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try
        {
            $uneEntreprise = Entreprise::findOrFail($id);
            return response()->json([
                'entreprise' => $uneEntreprise
            ], 200);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite',
                'erreur' => $e->getMessage()
            ], 500);
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
     * Modifie une entreprise particulière
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
     * Supprime une entreprise particulière
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
