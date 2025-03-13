<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Etudiant;
use App\Models\Personnel;
use Illuminate\Support\Facades\Auth;

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

        // TO BE REMOVED IN PRODUCTION (This method deactivates the SSL verification)
        if (app()->environment() !== 'production') {
            \phpCAS::setNoCasServerValidation();
        }

        // Force the user to authenticate if not already done
        if (!\phpCAS::isAuthenticated()) {
            \phpCAS::forceAuthentication();
        }

        $userLogin = \phpCAS::getUser();
                
        // Vérifier si l'utilisateur existe en base de données
        if (!session()->has('cas_login'))
        {
            $user = Etudiant::where('login', $userLogin)->first();
            $userType = "Etudiant";

            // Si aucun étudiant trouvé, chercher dans les personnels
            if (!$user)
            {
                $user = Personnel::where('login', $userLogin)->first();$userType = "Personnel";
            }

            // Si aucun utilisateur trouvé
            if (!$user)
            {
                abort(403, "Vous n'êtes pas autorisé à accéder à cette page.");
            }

            // Log the user info for debugging
            \Log::info('User login:', ['user' => $userLogin]);

            // Remplir la session avec les informations de l'utilisateur
            session([
                'cas_login' => $userLogin,
                'id' => $userType === "Etudiant" ? $user->idUPPA : $user->idPersonnel,
                'user' => $user,
                'user_type' => $userType
            ]);
        }
        return redirect()->away(env('ANGULAR_URL') . '/dashboard');
    }
}