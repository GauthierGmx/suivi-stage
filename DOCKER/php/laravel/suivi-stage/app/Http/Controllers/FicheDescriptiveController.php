<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FicheDescriptive;
use Carbon\Carbon;

class FicheDescriptiveController extends Controller
{

    /**
     * Enregistre les données du formulaire d'une fiche descriptive
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        try{
            $validatedData = $request->validate([
                'dateCreation' => 'bail|required|date|date-format:Y-m-d',
                'dateDerniereModification' => 'bail|required|date|date-format:Y-m-d',
                'contenuStage' => 'nullable|string',
                'thematique' => 'nullable|string',
                'sujet' => 'nullable|string',
                'fonctions' => 'nullable|string',
                'taches' => 'nullable|string',
                'competences' => 'nullable|string',
                'details' => 'nullable|string',
                'debutStage' => 'nullable|date|date-format:Y-m-d',
                'finStage' => 'nullable|date|date-format:Y-m-d',
                'nbJourSemaine' => 'nullable|integer',
                'nbHeureSemaine' => 'nullable|integer',
                'clauseConfidentialite' => 'nullable|boolean',
                'statut' => 'bail|required|string|in:En cours,Validee,Refusée',
                'numeroConvention' => 'nullable|string',
                'interruptionStage' => 'nullable|boolean',
                'dateDebutInterruption' => 'nullable|date|date-format:Y-m-d',
                'dateFinInterruption' => 'nullable|date|date-format:Y-m-d',
                'personnelTechniqueDisponible' => 'nullable||boolean',
                'materielPrete' => 'nullable|string',
                'idEntreprise' => 'bail|required|integer',
                'idTuteurEntreprise' => 'bail|required|integer',
                'idUPPA' => 'bail|required|integer'
            ]);

            $uneFicheDescriptive = FicheDescriptive::create([
                'dateCreation' => $validatedData['dateCreation'],
                'dateDerniereModification' => $validatedData['dateDerniereModification'],
                'contenuStage' => $validatedData['contenuStage'] ?? null,
                'thematique' => $validatedData['thematique']?? null,
                'sujet' => $validatedData['sujet']?? null,
                'fonctions' => $validatedData['fonctions']?? null,
                'taches' => $validatedData['taches']?? null,
                'competences' => $validatedData['competences']?? null,
                'details' => $validatedData['details']?? null,
                'debutStage' => $validatedData['debutStage']?? null,
                'finStage' => $validatedData['finStage']?? null,
                'nbJourSemaine' => $validatedData['nbJourSemaine']?? null,
                'nbHeureSemaine' => $validatedData['nbHeureSemaine']?? null,
                'clauseConfidentialite' => $validatedData['clauseConfidentialite']?? null,
                'statut' => $validatedData['statut'],
                'numeroConvention' => $validatedData['numeroConvention']?? null,
                'interruptionStage' => $validatedData['interruptionStage']?? null,
                'dateDebutInterruption' => $validatedData['dateDebutInterruption'] ?? null,
                'dateFinInterruption' => $validatedData['dateFinInterruption'] ?? null,
                'personnelTechniqueDisponible' => $validatedData['personnelTechniqueDisponible']?? null,
                'materielPrete' => $validatedData['materielPrete']?? null,
                'idEntreprise' => $validatedData['idEntreprise'],
                'idTuteurEntreprise' => $validatedData['idTuteurEntreprise'],
                'idUPPA' => $validatedData['idUPPA']
            ]);

            return response()->json([
                'message' => 'Fiche Descriptive créée avec succès.',
                'ficheDescriptive' => $uneFicheDescriptive
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
     * Met à jour les données d'une fiche descriptive
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function update(Request $request, $id){
        try{
            $validatedData = $request->validate([
                'dateDerniereModification' => 'bail|required|date|date-format:Y-m-d',
                'contenuStage' => 'nullable|string',
                'thematique' => 'nullable|string',
                'sujet' => 'nullable|string',
                'fonctions' => 'nullable|string',
                'taches' => 'nullable|string',
                'competences' => 'nullable|string',
                'details' => 'nullable|string',
                'debutStage' => 'nullable|date|date-format:Y-m-d',
                'finStage' => 'nullable|date|date-format:Y-m-d',
                'nbJourSemaine' => 'nullable|integer',
                'nbHeureSemaine' => 'nullable|integer',
                'clauseConfidentialite' => 'nullable|boolean',
                'statut' => 'bail|required|string|in:En cours,Validee,Refusée',
                'numeroConvention' => 'nullable|string',
                'interruptionStage' => 'nullable|boolean',
                'dateDebutInterruption' => 'nullable|date|date-format:Y-m-d',
                'dateFinInterruption' => 'nullable|date|date-format:Y-m-d',
                'personnelTechniqueDisponible' => 'nullable||boolean',
                'materielPrete' => 'nullable|string',
            ]);
            
            // Récupération et mise à jour en une seule ligne
            FicheDescriptive::findOrFail($id)->update($validatedData);
            $validatedData['dateDerniereModification'] = Carbon::now()->format('Y-m-d');

            return response()->json([
                'message' => 'Fiche Descriptive mise à jour avec succès.'
            ], 200);
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
                'message' => 'Fiche Descriptive non trouvée',
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

    /**
     * Récupère les données d'une fiche descriptive
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id){
        try{
            $ficheDescriptive = FicheDescriptive::findOrFail($id);
            return response()->json([
                'ficheDescriptive' => $ficheDescriptive
            ], 200);
        }
        catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e){
            return response()->json([
                'message' => 'Fiche Descriptive non trouvée',
                'erreurs' => $e->getMessage()
            ], 404);
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
     * Récupère l'ensemble des fiches descriptives
     * @return \Illuminate\Http\JsonResponse
     * 
     */
    public function showAlls(){
        try{
            $fichesDescriptives = FicheDescriptive::all();
            return response()->json([
                'fichesDescriptives' => $fichesDescriptives
            ], 200);
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
?>
