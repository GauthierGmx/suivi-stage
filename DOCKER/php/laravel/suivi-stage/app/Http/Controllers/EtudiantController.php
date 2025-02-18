<?php

namespace App\Http\Controllers;

use App\Models\Etudiant;
use App\Models\RechercheStage;
use App\Models\FicheDescriptive;
use Illuminate\Http\Request;

class EtudiantController extends Controller
{
    /**
     * Display a listing of the resource.
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
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
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
     * Update the specified resource in storage.
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Retourne toutes les recherches de stage d'un étudiant donné
     * Code HTTP retourné :
     *      - Code 200 : si l'étudiant a été trouvé et qu'il a des recherches de stage
     *      - Code 404 : si l'étudiant a été trouvé mais qu'il n'a pas de recherche de stage ou si l'étudiant n'a pas été trouvé
     *      - Code 500 : s'il y a une erreur
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function indexRechercheStage($id)
    {
        try
        {
            // Vérifie si l'étudiant existe
            $unEtudiant = Etudiant::findOrFail($id);

            $desRecherches = RechercheStage::where('idUPPA',$id)->get();

            if($desRecherches->isEmpty())
            {
                return response()->json([
                    'message' => 'Aucune recherche de stage trouvée pour cet étudiant'
                ],404);
            }
            
            return response()->json($desRecherches, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucun étudiant trouvé'
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
     * Retourne toutes les recherches de stage d'un étudiant donné
     * Code HTTP retourné :
     *      - Code 200 : si l'étudiant a été trouvé et qu'il a des recherches de stage
     *      - Code 404 : si l'étudiant a été trouvé mais qu'il n'a pas de recherche de stage ou si l'étudiant n'a pas été trouvé
     *      - Code 500 : s'il y a une erreur
     * @param int $id
     * @return \Illuminate\Http\Response
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function indexFicheDescriptive($id)
    {
        try
        {
            // Vérifie si l'étudiant existe
            $unEtudiant = Etudiant::findOrFail($id);

            $desFiches = FicheDescriptive::where('idUPPA',$id)->get();

            if($desFiches->isEmpty())
            {
                return response()->json([
                    'message' => 'Aucune fiche descriptive trouvée pour cet étudiant'
                ],404);
            }
            
            return response()->json($desFiches, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucun étudiant trouvé'
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
