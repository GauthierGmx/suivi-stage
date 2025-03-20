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
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
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
     * Gestion de la déconnexion
     */
    public function handleLogout()
    {
        try {
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

            $domain = parse_url(env('ANGULAR_URL'), PHP_URL_HOST);
            
            // Créer la réponse JSON
            $response = response()->json(['message' => 'Envoie de la demande de suppression des cookies']);
            
            // Supprimer les cookies avec le bon domaine
            $response->withCookie(Cookie::forget('user_id', '/', $domain));
            $response->withCookie(Cookie::forget('user_type', '/', $domain));
            
            //dd($response);

            // Envoyer la réponse
            $response->send();

            \Log::info('Cookies supprimés');
            
            // Déconnexion du CAS
            \phpCAS::logout();
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la déconnexion : ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la déconnexion'], 500);
        }
    }

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

    public function handleCasLogout()
    {
        try {
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