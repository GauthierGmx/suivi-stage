<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AlgorithmeController extends Controller
{
    /**
     * Execute the algorithm
     * 
     * @param int $idUPPA
     * @param int $idFicheDescriptive
     * @return string
     */
    public function run($idUPPA, $idFicheDescriptive)
    {
        $scriptPath = env('ALGO_AFFECTATION_URL');
        
        $command = "php " . escapeshellarg($scriptPath) . " " . escapeshellarg($idUPPA) . " " . escapeshellarg($idFicheDescriptive);
        $output = shell_exec($command);

        return $output;
    }
}
