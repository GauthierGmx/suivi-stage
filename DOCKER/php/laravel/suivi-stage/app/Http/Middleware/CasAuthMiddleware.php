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
            // Set headers for CORS
            $headers = [
                'Access-Control-Allow-Origin' => env('ANGULAR_URL'),
                'Access-Control-Allow-Credentials' => 'true',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS'
            ];

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
            $secureCookie = app()->environment('production');

            // Create cookies with proper expiration
            $userIdCookie = cookie()->make(
                'user_id',
                '',
                -1,
                '/',
                $domain,
                $secureCookie,
                true,
                false,
                'Lax'
            );

            $userTypeCookie = cookie()->make(
                'user_type',
                '',
                -1,
                '/',
                $domain,
                $secureCookie,
                true,
                false,
                'Lax'
            );

            // Create response with cookies and headers
            return response()
                ->json(['message' => 'Déconnexion en cours'])
                ->withHeaders($headers)
                ->withCookie(cookie()->forget($userIdCookie))
                ->withCookie(cookie()->forget($userTypeCookie));

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la déconnexion : ' . $e->getMessage());
            return response()
                ->json(['error' => 'Erreur lors de la déconnexion'], 500)
                ->withHeaders($headers);
        }
    }
}