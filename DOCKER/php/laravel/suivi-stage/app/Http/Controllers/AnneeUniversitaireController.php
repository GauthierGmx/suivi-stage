<?php

namespace App\Http\Controllers;

use App\Models\AnneeUniversitaire;
use Illuminate\Http\Request;

class AnneeUniversitaireController extends Controller
{
    /**
     * Retourne toutes les années universitaires existantes
     *
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Récupère les champs demandés dans la requête (ou "*" par défaut)
        $fields = explode(',', $request->query('fields', '*'));

        // Vérifie si les champs demandés existent dans la table
        $allowedFields = ['idAnneeUniversitaire','libelle'];
        $fields = array_intersect($fields, $allowedFields);

        // si aucun champ valide n'est fourni, on récupère tout par défaut
        $anneeUniversitaire = AnneeUniversitaire::select(empty($fields) ? '*' : $fields)->get();

        return response()->json($anneeUniversitaire,200);
    }

    /**
     * Créer une nouvelle année universitaire
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * Une réponse JSON avec :
     *     - Code 201 : si l'année universitaire a été créée
     *     - Code 422 : s'il y a eu une erreur de validation des données
     *     - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        try
        {
            $donneesValidees = $request->validate([
                'libelle' => 'required|string|max:10'
            ]);

            $anneeUniversitaire = AnneeUniversitaire::create([
                'libelle' => $donneesValidees['libelle']
            ]);

            return response()->json($anneeUniversitaire, 201);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation des données',
                'erreurs' => $e->errors()
            ],422);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'exception' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Retourne une année universitaire particulier
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 200 : si l'année universitaire a été trouvée
     *      - Code 404 : si l'année universitaire n'a pas été trouvée
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function show($id)
    {
        try
        {
            $uneAnneeUniversitaire = AnneeUniversitaire::findOrFail($id);
            return response()->json($uneAnneeUniversitaire, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucune année universitaire trouvée'
            ],404);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'exception' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Modifie une année universitaire particulière
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Cote HTTP retourné :
     *      - Code 200 : si l'année universitaire a été modifiée
     *      - Code 404 : si l'année universitaire n'a pas été trouvée
     *      - Code 422 : s'il y a eu une erreur de validation des données
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function update(Request $request, $id)
    {
        try
        {
            $donneesValidees = $request->validate([
                'libelle' => 'required|string|max:10'
            ]);

            $uneAnneeUniversitaire = AnneeUniversitaire::findOrFail($id);
            $uneAnneeUniversitaire->update($donneesValidees);

            return response()->json($uneAnneeUniversitaire, 200);
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
                'message' => 'Aucune année universitaire trouvée'
            ],404);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'exception' => $e->getMessage()
            ],500);
        }
    }

    /**
     * Supprime une année universitaire particulière
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 200 : si l'année universitaire a été supprimée
     *      - Code 404 : si l'année universitaire n'a pas été trouvée
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function destroy($id)
    {
        try
        {
            $uneAnneeUniversitaire = AnneeUniversitaire::findOrFail($id);
            $uneAnneeUniversitaire->delete();

            return response()->json([
                'message' => 'L\'année universitaire a bien été supprimée'
            ], 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucune année universitaire trouvée'
            ],404);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'exception' => $e->getMessage()
            ],500);
        }
    }
}
