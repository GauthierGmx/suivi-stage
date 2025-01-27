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
                'dateCreation' => 'bail|required|date',
                'dateDerniereModification' => 'bail|required|date',
                'contenuStage' => 'bail|required|string',
                'thematique' => 'bail|required|string',
                'sujet' => 'bail|required|string',
                'fonctions' => 'bail|required|string',
                'taches' => 'bail|required|string',
                'competences' => 'bail|required|string',
                'details' => 'bail|required|string',
                'debutStage' => 'bail|required|date',
                'finStage' => 'bail|required|date',
                'nbJourSemaine' => 'bail|required|integer',
                'nbHeureSemaine' => 'bail|required|integer',
                'clauseConfidentialite' => 'bail|required|boolean',
                'statut' => 'bail|required|string',
                'numeroConvention' => 'bail|required|string',
                'interruptionStage' => 'bail|required|boolean',
                'dateDebutInterruption' => 'nullable|date',
                'dateFinInterruption' => 'nullable|date',
                'personnelTechniqueDisponible' => 'bail|required|boolean',
                'materielPrete' => 'bail|required|string',
                'idEntreprise' => 'bail|required|integer',
                'idTuteurEntreprise' => 'bail|required|integer',
                'idUPPA' => 'bail|required|integer'
            ]);

            $uneFicheDescriptive = FicheDescriptive::create([
                'dateCreation' => $validatedData['dateCreation'],
                'dateDerniereModification' => $validatedData['dateDerniereModification'],
                'contenuStage' => $validatedData['contenuStage'],
                'thematique' => $validatedData['thematique'],
                'sujet' => $validatedData['sujet'],
                'fonctions' => $validatedData['fonctions'],
                'taches' => $validatedData['taches'],
                'competences' => $validatedData['competences'],
                'details' => $validatedData['details'],
                'debutStage' => $validatedData['debutStage'],
                'finStage' => $validatedData['finStage'],
                'nbJourSemaine' => $validatedData['nbJourSemaine'],
                'nbHeureSemaine' => $validatedData['nbHeureSemaine'],
                'clauseConfidentialite' => $validatedData['clauseConfidentialite'],
                'statut' => $validatedData['statut'],
                'numeroConvention' => $validatedData['numeroConvention'],
                'interruptionStage' => $validatedData['interruptionStage'],
                'dateDebutInterruption' => $validatedData['dateDebutInterruption'],
                'dateFinInterruption' => $validatedData['dateFinInterruption'],
                'personnelTechniqueDisponible' => $validatedData['personnelTechniqueDisponible'],
                'materielPrete' => $validatedData['materielPrete'],
                'idEntreprise' => $validatedData['idEntreprise'],
                'idTuteurEntreprise' => $validatedData['idTuteurEntreprise'],
                'idUPPA' => $validatedData['idUPPA']
            ]);

            return response()->json([
                'message' => 'Données enregistrées avec succès.',
                'status' => 'success'
            ], 200);

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

    #public fonction show($id){}
}
?>
