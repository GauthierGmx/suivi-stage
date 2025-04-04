<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\Personnel;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cookie;

class CasAuthMiddleware
{
    /**
     * Gère la requête entrante et l'authentification CAS.
     * Configure le client CAS, vérifie l'authentification et crée les cookies de session.
     *
     * @param  \Illuminate\Http\Request  $request La requête HTTP entrante
     * @param  \Closure  $next La fonction suivante dans le pipeline middleware
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Http\Exceptions\HttpResponseException Si l'utilisateur n'est pas autorisé
     */
    public function handle(Request $request, Closure $next)
    {
        \phpCAS::setVerbose(true);
        \phpCAS::setDebug(storage_path('logs/cas.log'));

        \phpCAS::client(
            CAS_VERSION_2_0,
            config('auth.cas.server.hostname'),
            config('auth.cas.server.port'),
            config('auth.cas.server.uri'),
            config('auth.cas.server.basename'),
        );

        if (app()->environment() !== 'production') {
            \phpCAS::setNoCasServerValidation();
        }

        if (!\phpCAS::isAuthenticated()) {
            \phpCAS::forceAuthentication();
        }

        $userLogin = \phpCAS::getUser();
                    
        $user = Etudiant::where('login', $userLogin)->first();
        $userType = "Etudiant";

        if (!$user) {
            $user = Personnel::where('login', $userLogin)->first();
            $userType = "Personnel";
        }

        if (!$user) {
            abort(403, "Vous n'êtes pas autorisé à accéder à cette page.");
        }
        
        $userId = $userType === "Etudiant" ? $user->idUPPA : $user->idPersonnel;

        \Log::info('User login :', ['user' => $userLogin]);
        \Log::info('User ID :', ['userId' => $userId]);
        \Log::info('User Type :', ['userType' => $userType]);

        $secureCookie = app()->environment('production');
        $domain = parse_url(env('ANGULAR_URL'), PHP_URL_HOST);

        $response = redirect()->away(env('ANGULAR_URL'));

        $cookieLifetime = 120;
        
        $response->cookie(
            'user_id',
            $userId,
            $cookieLifetime,
            '/',
            $domain,
            $secureCookie,
            true,
            false,
            'Lax'
        );

        $response->cookie(
            'user_type',
            $userType,
            $cookieLifetime,
            '/',
            $domain,
            $secureCookie,
            true,
            false,
            'Lax'
        );

        return $response;
    }

    /**
     * Gère uniquement la suppression des cookies d'authentification.
     * Ne déconnecte pas l'utilisateur du CAS.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function handleCookieLogout()
    {
        try {
            $domain = parse_url(env('ANGULAR_URL'), PHP_URL_HOST);
            
            return response()
                ->json(['success' => true])
                ->withCookie(Cookie::forget('user_id', '/', $domain))
                ->withCookie(Cookie::forget('user_type', '/', $domain));
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la suppression des cookies : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la déconnexion'], 500);
        }
    }

    /**
     * Gère la déconnexion du CAS uniquement.
     * Déconnecte l'utilisateur du service CAS central.
     *
     * @return void|\Illuminate\Http\RedirectResponse En cas d'erreur, redirige vers l'URL Angular
     */
    public function handleCasLogout()
    {
        try {
            \Log::info('Suppression des cookies --> SUCCESS');
            \Log::info('Envoi de la demande de déconnexion au CAS');

            \phpCAS::client(
                CAS_VERSION_2_0,
                config('auth.cas.server.hostname'),
                config('auth.cas.server.port'),
                config('auth.cas.server.uri'),
                config('auth.cas.server.basename'),
            );

            if (app()->environment() !== 'production') {
                \phpCAS::setNoCasServerValidation();
            }

            \phpCAS::logout();
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la déconnexion CAS : ' . $e->getMessage());
            return redirect()->away(env('ANGULAR_URL'));
        }
    }
}