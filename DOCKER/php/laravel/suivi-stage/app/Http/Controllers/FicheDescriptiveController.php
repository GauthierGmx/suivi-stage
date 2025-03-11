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
                'contenuStage'                  => 'nullable|string',
                'thematique'                    => 'nullable|string|max:50',
                'sujet'                         => 'nullable|string|max:50',
                'fonctions'                     => 'nullable|string|max:50',
                'taches'                        => 'nullable|string|max:50',
                'competences'                   => 'nullable|string|max:50',
                'details'                       => 'nullable|string|max:50',
                'debutStage'                    => 'nullable|date',
                'finStage'                      => 'nullable|date',
                'nbJourSemaine'                 => 'nullable|integer',
                'nbHeureSemaine'                => 'nullable|integer',
                'clauseConfidentialite'         => 'nullable|boolean',
                'serviceEntreprise'             => 'nullable|string|max:100',
                'adresseMailStage'             => 'nullable|string|email|max:100',
                'telephoneStage'                => ['nullable','string','regex:/^(\+33|0)\d{9}$/m','max:20'],
                'adresseStage'                  => 'nullable|string|max:100',
                'codePostalStage'               => ['nullable','string','regex:/^\d{5}$/'],
                'villeStage'                    => 'nullable|string|max:50',
                'paysStage'                     => 'nullable|string|max:50',
                'longitudeStage'                => 'nullable|string|max:20',
                'latitudeStage'                 => 'nullable|string|max:20',
                'statut'                        => 'bail|required|string|in:En cours,Validee,Refusée',
                'numeroConvention'              => 'nullable|string|max:50',
                'interruptionStage'             => 'nullable|boolean',
                'dateDebutInterruption'         => 'nullable|date',
                'dateFinInterruption'           => 'nullable|date',
                'personnelTechniqueDisponible'  => 'nullable|boolean',
                'materielPrete'                 => 'nullable|string',
                'idEntreprise'                  => 'bail|required|integer',
                'idTuteurEntreprise'            => 'bail|required|integer',
                'idUPPA'                        => 'bail|required|integer'
            ]);

            $uneFicheDescriptive = FicheDescriptive::create([
                'dateCreation' => Carbon::now()->format('Y-m-d'),
                'dateDerniereModification' => Carbon::now()->format('Y-m-d'),
                'contenuStage' => $validatedData['contenuStage'] ?? null,
                'thematique' => $validatedData['thematique']?? null,
                'sujet' => $validatedData['sujet']?? null,
                'fonctions' => $validatedData['fonctions']?? null,
                'taches' => $validatedData['taches']?? null,
                'competences' => $validatedData['competences']?? null,
                'details' => $validatedData['details']?? null,
                'debutStage' => isset($validatedData['debutStage']) ? Carbon::parse($validatedData['debutStage'])->format('Y-m-d') : null,
                'finStage' => isset($validatedData['finStage']) ? Carbon::parse($validatedData['finStage'])->format('Y-m-d') : null,
                'nbJourSemaine' => $validatedData['nbJourSemaine']?? null,
                'nbHeureSemaine' => $validatedData['nbHeureSemaine']?? null,
                'clauseConfidentialite' => $validatedData['clauseConfidentialite']?? null,
                'serviceEntreprise' => $validatedData['serviceEntreprise']?? null,
                'adresseMailStage' => $validatedData['adresseMailStage']?? null,
                'telephoneStage' => $validatedData['telephoneStage']?? null,
                'adresseStage' => $validatedData['adresseStage']?? null,
                'codePostalStage' => $validatedData['codePostalStage']?? null,
                'villeStage' => $validatedData['villeStage']?? null,
                'paysStage' => $validatedData['paysStage']?? null,
                'longitudeStage' => $validatedData['longitudeStage']?? null,
                'latitudeStage' => $validatedData['latitudeStage']?? null,
                'statut' => $validatedData['statut'],
                'numeroConvention' => $validatedData['numeroConvention']?? null,
                'interruptionStage' => $validatedData['interruptionStage']?? null,
                'dateDebutInterruption' => isset($validatedData['dateDebutInterruption']) ? Carbon::parse($validatedData['dateDebutInterruption'])->format('Y-m-d') : null,
                'dateFinInterruption' => isset($validatedData['dateFinInterruption']) ? Carbon::parse($validatedData['dateFinInterruption'])->format('Y-m-d') : null,
                'personnelTechniqueDisponible' => $validatedData['personnelTechniqueDisponible']?? null,
                'materielPrete' => $validatedData['materielPrete']?? null,
                'idEntreprise' => $validatedData['idEntreprise'],
                'idTuteurEntreprise' => $validatedData['idTuteurEntreprise'],
                'idUPPA' => $validatedData['idUPPA']
            ]);

            return response()->json($uneFicheDescriptive,201);

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
                'contenuStage'                  => 'nullable|string',
                'thematique'                    => 'nullable|string|max:50',
                'sujet'                         => 'nullable|string|max:50',
                'fonctions'                     => 'nullable|string|max:50',
                'taches'                        => 'nullable|string|max:50',
                'competences'                   => 'nullable|string|max:50',
                'details'                       => 'nullable|string|max:50',
                'debutStage'                    => 'nullable|date|date-format:Y-m-d',
                'finStage'                      => 'nullable|date|date-format:Y-m-d',
                'nbJourSemaine'                 => 'nullable|integer',
                'nbHeureSemaine'                => 'nullable|integer',
                'clauseConfidentialite'         => 'nullable|boolean',
                'serviceEntreprise'             => 'nullable|string|max:100',
                'adresseMailStage'             => 'nullable|string|email|max:100',
                'telephoneStage'                => ['nullable','string','regex:/^(\+33|0)\d{9}$/m','max:20'],
                'adresseStage'                  => 'nullable|string|max:100',
                'codePostalStage'               => ['nullable','string','regex:/^\d{5}$/'],
                'villeStage'                    => 'nullable|string|max:50',
                'paysStage'                     => 'nullable|string|max:50',
                'longitudeStage'                => 'nullable|string|max:20',
                'latitudeStage'                 => 'nullable|string|max:20',
                'statut'                        => 'bail|required|string|in:En cours,Validee,Refusée',
                'numeroConvention'              => 'nullable|string|max:50',
                'interruptionStage'             => 'nullable|boolean',
                'dateDebutInterruption'         => 'nullable|date|date-format:Y-m-d',
                'dateFinInterruption'           => 'nullable|date|date-format:Y-m-d',
                'personnelTechniqueDisponible'  => 'nullable||boolean',
                'materielPrete'                 => 'nullable|string',
            ]);
            
            // Récupération et mise à jour en une seule ligne
            $validatedData['dateDerniereModification'] = Carbon::now()->format('Y-m-d');
            FicheDescriptive::findOrFail($id)->update($validatedData);
           
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
            return response()->json($ficheDescriptive,200);
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
    public function index(){
        try{
            $fichesDescriptives = FicheDescriptive::all();
            return response()->json($fichesDescriptives, 200);
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
