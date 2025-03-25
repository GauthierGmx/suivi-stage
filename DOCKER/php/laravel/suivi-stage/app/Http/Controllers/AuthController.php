<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use App\Models\Etudiant;
use App\Models\Personnel;

class AuthController extends Controller
{
    /**
     * Récupère les informations de l'utilisateur authentifié à partir des cookies.
     * Vérifie la validité des cookies et retourne les données de l'utilisateur correspondant.
     *
     * @param Request $request La requête HTTP contenant les cookies
     * @return \Illuminate\Http\JsonResponse
     *         - 200: Données de l'utilisateur
     *         - 401: Non authentifié
     *         - 404: Utilisateur non trouvé
     *         - 400: Erreur de décryptage des cookies
     */
    public function getUser(Request $request)
    {
        try {
            $userId = $request->cookie('user_id');
            $userType = $request->cookie('user_type');

            if (!$userId || !$userType) {
                return response()->json(['error' => 'Non authentifié'], 401);
            }

            Log::info('Valeur brute des cookies :', [
                'user_id' => $userId,
                'user_type' => $userType
            ]);

            // Récupération de l'utilisateur en base de données
            $model = $userType === 'Etudiant' ? Etudiant::class : Personnel::class;

            Log::info('Model à interroger :', ['model' => $model]);

            $user = $model::find($userId);

            return $user 
                ? response()->json($user, 200)
                : response()->json(['error' => 'Utilisateur non trouvé'], 404);
        } 
        catch (\Exception $e) {
            Log::error('Erreur lors du décryptage des cookies : ' . $e->getMessage());
            return response()->json(['error' => 'Cookie invalide ou corrompu'], 400);
        }
    }
}