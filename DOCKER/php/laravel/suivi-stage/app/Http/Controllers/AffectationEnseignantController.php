<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\Personnel;
use App\Models\AnneUniversitaire;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AffectationsExport;
use Illuminate\Support\Facades\Log;

class AffectationEnseignantController extends Controller
{
    /**
     * Retourne toutes les affectations existantes
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $affectations = \DB::table('table_personnel_etudiant_anneeuniv')
            ->join('personnels', 'table_personnel_etudiant_anneeuniv.idPersonnel', '=', 'personnels.idPersonnel')
            ->join('etudiants', 'table_personnel_etudiant_anneeuniv.idUPPA', '=', 'etudiants.idUPPA')
            ->join('annee_universitaires', 'table_personnel_etudiant_anneeuniv.idAnneeUniversitaire', '=', 'annee_universitaires.idAnneeUniversitaire')
            ->select('annee_universitaires.libelle as anneeUniversitaire','personnels.nom as nomPersonnel', 'personnels.prenom as prenomPersonnel', 'etudiants.nom as nomEtudiant', 'etudiants.prenom as prenomEtudiant')
            ->get();

        return response()->json($affectations, 200);
    }

    /**
     * Créer une nouvelle affectation
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 201 : si l'affectation a bien été créée
     *      - Code 422 : s'il y a eu une erreur de validation des données
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Illuminate\Database\QueryException
     * @throws \Exception
     */
    public function store(Request $request)
    {
        try
        {
            $donneesValidees = $request->validate([
                'idPersonnel'           => 'bail|required|integer',
                'idUPPA'                => 'bail|required|integer',
                'idAnneeUniversitaire'  => 'required|integer'
            ]);

            // Création des données à partir d'une requête SQL
            $affectation = \DB::table('table_personnel_etudiant_anneeuniv')->insert([
                'idPersonnel' => $donneesValidees['idPersonnel'],
                'idUPPA' => $donneesValidees['idUPPA'],
                'idAnneeUniversitaire' => $donneesValidees['idAnneeUniversitaire']
            ]);

            // Récupération des données après insertion
            $affectation = \DB::table('table_personnel_etudiant_anneeuniv')
                ->where('idPersonnel', $donneesValidees['idPersonnel'])
                ->where('idUPPA', $donneesValidees['idUPPA'])
                ->where('idAnneeUniversitaire', $donneesValidees['idAnneeUniversitaire'])
                ->first();
            return response()->json($affectation, 201);
        }	
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreur' => $e->errors()
            ], 422);
        }
        catch (\Illuminate\Database\QueryException $e)
        {
            return response()->json([
                'message' => 'Erreur dans la base de données :',
                'erreur' => $e->getMessage()
            ], 500);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retourne une affectation particulière
     *
     * @param  int  $idPersonnel
     * @param  int  $idUPPA
     * @param  int  $idAnneeUniversitaire
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 200 : si l'affectation a été trouvée
     *      - Code 404 : si l'affectation n'a pas été trouvée
     */
    public function show($idPersonnel, $idUPPA, $idAnneeUniversitaire)
    {
        // Récupère les informations de l'affectation avec les noms-prénoms de l'étudiant et du personnel
        $affectation = \DB::table('table_personnel_etudiant_anneeuniv')
            ->join('personnels', 'table_personnel_etudiant_anneeuniv.idPersonnel', '=', 'personnels.idPersonnel')
            ->join('etudiants', 'table_personnel_etudiant_anneeuniv.idUPPA', '=', 'etudiants.idUPPA')
            ->join('annee_universitaires', 'table_personnel_etudiant_anneeuniv.idAnneeUniversitaire', '=', 'annee_universitaires.idAnneeUniversitaire')
            ->select('annee_universitaires.libelle as anneeUniversitaire','personnels.nom as nomPersonnel', 'personnels.prenom as prenomPersonnel', 'etudiants.nom as nomEtudiant', 'etudiants.prenom as prenomEtudiant')
            ->where('personnels.idPersonnel', $idPersonnel)
            ->where('etudiants.idUPPA', $idUPPA)
            ->where('annee_universitaires.idAnneeUniversitaire', $idAnneeUniversitaire)
            ->first();
        
        if (!$affectation)
        {
            return response()->json([
                'message' => 'Aucune affectation trouvée'
            ], 404);
        }

        return response()->json($affectation, 200);
    }

    /**
     * Met à jour une affectation particulière
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $idPersonnel
     * @param  int  $idUPPA
     * @param  int  $idAnneeUniversitaire
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 200 : si l'affectation a bien été mise à jour
     *      - Code 404 : si l'affectation n'a pas été trouvée
     *      - Code 422 : s'il y a eu une erreur de validation des données
     *      - Code 500 : s'il y a eu une erreur
     * @throws \Illuminate\Validation\ValidationException
     * @throws \Exception
     */
    public function update(Request $request, $idPersonnel, $idUPPA, $idAnneeUniversitaire)
    {
        try
        {
            $donneesValidees = $request->validate([
                'idPersonnel'           => 'required|integer'
            ]);

            // Met à jour les données
            $affectation = \DB::table('table_personnel_etudiant_anneeuniv')
                ->where('idPersonnel', $idPersonnel)
                ->where('idUPPA', $idUPPA)
                ->where('idAnneeUniversitaire', $idAnneeUniversitaire)
                ->update($donneesValidees);

            // Vérifie si l'affectation existe
            if (!$affectation)
            {
                return response()->json([
                    'message' => 'Aucune affectation trouvée'
                ], 404);
            }            

            // Récupère les données mises à jour
            $affectationMiseAJour = \DB::table('table_personnel_etudiant_anneeuniv')
            ->where('idPersonnel', $donneesValidees)
            ->where('idUPPA', $idUPPA)
            ->where('idAnneeUniversitaire', $idAnneeUniversitaire)
            ->first();

            // Renvoie des données mises à jour
            return response()->json($affectationMiseAJour, 200);
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            return response()->json([
                'message' => 'Erreur de validation dans les données',
                'erreur' => $e->errors()
            ], 422);
        }
        catch (\Illuminate\Database\QueryException $e)
        {
            return response()->json([
                'message' => 'Erreur dans la base de données :',
                'erreur' => $e->getMessage()
            ], 500);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une affectation particulière
     *
     * @param  int  $idPersonnel
     * @param  int  $idUPPA
     * @param  int  $idAnneeUniversitaire
     * @return \Illuminate\Http\Response
     * Code HTTP retourné :
     *      - Code 200 : si l'affectation a bien été supprimée
     *      - Code 404 : si l'affectation n'a pas été trouvée
     *      - Code 500 : s'il y a une erreur
     * @throws \Exception
     */
    public function destroy($idPersonnel, $idUPPA, $idAnneeUniversitaire)
    {
        try
        {
            $affectation = \DB::table('table_personnel_etudiant_anneeuniv')
            ->where('idPersonnel', $idPersonnel)
            ->where('idUPPA', $idUPPA)
            ->where('idAnneeUniversitaire', $idAnneeUniversitaire)
            ->delete();

            if (!$affectation)
            {
                return response()->json([
                    'message' => 'Aucune affectation trouvée'
                ], 404);
            }

            return response()->json([
                'message' => 'L\'affectation a bien été supprimée'
            ], 200);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Une erreur s\'est produite :',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exporte les affectations de l'année universitaire courante en Excel
     *
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * Code HTTP retourné :
     *      - Code 200 : si le fichier Excel est généré avec succès
     *      - Code 204 : si aucune affectation n'est trouvée pour l'année courante
     *      - Code 500 : s'il y a une erreur
     * @throws \Exception
     */
    public function extractStudentTeacherAssignments()
    {
        try
        {
            if (date('m') >= 9) {
                $anneeUniversitaireCourante = date('Y').'-'.(date('Y')+1);
            }
            else {
                $anneeUniversitaireCourante = (date('Y')-1).'-'.date('Y');
            }

            $affectations = \DB::table('table_personnel_etudiant_anneeuniv')
                ->join('personnels', 'table_personnel_etudiant_anneeuniv.idPersonnel', '=', 'personnels.idPersonnel')
                ->join('etudiants', 'table_personnel_etudiant_anneeuniv.idUPPA', '=', 'etudiants.idUPPA')
                ->join('annee_universitaires', 'table_personnel_etudiant_anneeuniv.idAnneeUniversitaire', '=', 'annee_universitaires.idAnneeUniversitaire')
                ->where('annee_universitaires.libelle', $anneeUniversitaireCourante)
                ->select(
                    'annee_universitaires.libelle as anneeUniversitaire',
                    \DB::raw("CONCAT(personnels.nom, ' ', personnels.prenom) as nomPersonnel"),
                    \DB::raw("CONCAT(etudiants.nom, ' ', etudiants.prenom) as nomEtudiant")
                )
                ->get();

            if ($affectations->isEmpty()) {
                return response()->json([
                    'message' => "Aucune affectation trouvée pour l'année universitaire courante"
                ], 204);
            }

            $fileName = 'affectations-' . $anneeUniversitaireCourante . '.xlsx';
            
            // Force le téléchargement avec les bons headers
            return Excel::download(new AffectationsExport($affectations), $fileName, \Maatwebsite\Excel\Excel::XLSX, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition' => 'attachment; filename="' . $fileName . '"'
            ]);
        }
        catch (\Exception $e)
        {
            \Log::error("Erreur lors de l'extraction Excel : " . $e->getMessage());
            return response()->json([
                'message' => 'Une erreur s\'est produite lors de l\'export Excel',
                'erreur' => $e->getMessage()
            ], 500);
        }
    }
}
