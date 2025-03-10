<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class DispatchDataDescriptiveSheet
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    <?php

    namespace App\Http\Middleware;
    
    use Closure;
    use Illuminate\Http\Request;
    use Symfony\Component\HttpFoundation\Response;
    
    class DispatchData
    {
        /**
         * Handle an incoming request.
         */
        public function handle(Request $request, Closure $next): Response
        {
            $data = $request->json()->all(); // Récupère les données JSON
    
            if (!is_array($data)) {
                return response()->json(['error' => 'Invalid JSON format'], 400);
            }
    
            // Trier les données par type
            $etudiant = [];
            $entreprise = [];
            $ficheDescriptive = [];
    
            foreach ($data as $item) {
                if (isset($item['type'])) {
                    switch ($item['type']) {
                        case 'etudiant':
                            $etudiant[] = $item;
                            break;
                        case 'entreprise':
                            $entreprise[] = $item;
                            break;
                        case 'ficheDescriptive':
                            $ficheDescriptive[] = $item;
                            break;
                    }
                }
            }
    
            // Injecter les données triées dans la requête
            $request->merge([
                'etudiant' => $etudiant,
                'entreprise' => $entreprise,
                'ficheDescriptive' => $ficheDescriptive
            ]);
    
            return $next($request); // Laisser passer la requête
        }
    }
    
}
