<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FicheDescriptive;

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
            
        }
    }
}
?>
