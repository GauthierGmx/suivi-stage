<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Entreprise;
use App\Models\TuteurEntreprise;

class TuteurEntrepriseController extends Controller
{
    /**
     * Retourne tous les tuteurs d'entreprise
     * @param \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * 
     */
    public function index(Request $request)
    {
        $fields = explode(',', request()->query('fields', '*'));

        $allowedFields = ['idTuteur', 'nom', 'prenom', 'telephone', 'adresseMail', 'fonction', 'idEntreprise'];
        $fields = array_intersect($fields, $allowedFields);

        $tuteurEntreprise = TuteurEntreprise::select(empty($fields) ? '*' : $fields)->get();
        return response()->json($tuteurEntreprise, 200);
    }

    /**
     * Renvoie un tuteur d'entreprise particulier
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Une réponse JSON avec :
     *      - Code 200 : si le tuteur d'entreprise a bien été trouvé
     *      - Code 404 : si le tuteur d'entreprise n'a pas été trouvé
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Exception
     */
    public function show($id)
    {
        try
        {
            $unTuteurEntreprise = TuteurEntreprise::findOrFail($id);
            return response()->json($unTuteurEntreprise, 200);
        }
        catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e)
        {
            return response()->json([
                'message' => 'Aucun tuteur d\'entreprise trouvé'
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
     * Créer un nouveau tuteur d'entreprise
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Une réponse JSON avec :
     *      - Code 201 : si le tuteur d'entreprise a bien été créé
     *      - Code 422 : s'il y a eu une erreur de validation des données
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        try {
            $donneesValidees = $request->validate([
                'adresseMail'   => 'required|email|max:100',
                'nom'           => 'required|string|max:50',
                'prenom'        => 'required|string|max:50',
                'telephone'     => ['required', 'string', 'regex:/^(\+33|0)\d{9}$/'],
                'fonction'      => 'required|string|max:50',
                'idEntreprise'  => 'required|integer',
            ]);
    
            // Création du tuteur avec l'ID de l'entreprise
            $unTuteurEntreprise = TuteurEntreprise::create([
                'nom'           => $donneesValidees['nom'],
                'prenom'        => $donneesValidees['prenom'],
                'telephone'     => $donneesValidees['telephone'],
                'adresseMail'   => $donneesValidees['adresseMail'],
                'idEntreprise'  => $donneesValidees['idEntreprise'],
                'fonction'      => $donneesValidees['fonction'],
            ]);
    
            return response()->json($unTuteurEntreprise, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'erreurs' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Erreur dans la base de données',
                'erreur' => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur s\'est produite',
                'erreur' => $e->getMessage(),
            ], 500);
        }
    }   
    
    /**
     * Met à jour un tuteur particulier
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     * Une réponse JSON avec :
     *      - Code 200 : si le tuteur d'entreprise a bien été modifiée
     *      - Code 404 : si le tuteur d'entreprise n'a pas été trouvé
     *      - Code 422 : s'il y a eu une erreur de validation des données
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function update(Request $request,$id){
        try{
            $validatedData = $request->validate([
                'adresseMail'   => 'required|email|max:100',
                'nom'           => 'required|string|max:50',
                'prenom'        => 'required|string|max:50',
                'telephone'     => ['required', 'string', 'regex:/^(\+33|0)\d{9}$/'],
                'fonction'      => 'required|string|max:50',
            ]);
            
            TuteurEntreprise::findOrFail($id)->update($validatedData);
           
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
                'message' => 'Tuteur non trouvée',
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

}
