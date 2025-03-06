<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\Personnel;

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
        // To be removed once in production
        \phpCAS::setVerbose(true);
        \phpCAS::setDebug(storage_path('logs/cas.log'));

        // CAS client configuration
        \phpCAS::client(
            CAS_VERSION_2_0,
            config('auth.cas.server.hostname'),
            config('auth.cas.server.port'),
            config('auth.cas.server.uri'),
            config('auth.cas.server.basename'),
        );

        // TO BE REMOVED IN PRODUCTION (This methode deactivate the SSL verification)
        \phpCAS::setNoCasServerValidation();

        // Force the user to authentify if not already done
        if(!\phpCAS::isAuthenticated()) {
            \phpCAS::forceAuthentication();
        }

        $userLogin = \phpCAS::getUser();
        // Verify if the login has already been in set in session variable
        if(!session()->has('cas_login'))
        {
            $user = Etudiant::where('login', $userLogin)->first();
            $userType = "Etudiant";

            // If no student found
            if (!$user)
            {
                $user = Personnel::where('login', $userLogin)->first();
                $userType = "Personnel";
            }

            // If no student and personnel found
            if (!$user)
            {
                abort(403, "Vous n'êtes pas autorisé à accéder à cette page.");
            }

            // Fill the session with the user informations
            session([
                'cas_login' => $userLogin,
                'id' => $userType === "Etudiant" ? $user->idUPPA : $user->idPersonnel,
                'user' => $user,
                'user_type' => $userType
            ]);
        }
        return $next($request);
    }
}
