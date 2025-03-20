<?php

require __DIR__ . '/vendor/autoload.php';
require_once 'DatabaseConnection.php';
require_once 'AlgorithmeRepartition.php';

use App\AlgorithmeAttribution\DatabaseConnection;
use App\AlgorithmeAttribution\AlgorithmeRepartition;

try {
    $db = DatabaseConnection::connect();
    $algorithme = new AlgorithmeRepartition($db);
    $resultat = $algorithme->executeForStudent('610000');
    
    if ($resultat) {
        echo "Attribution réussie !\n";
        print_r($resultat);
    } else {
        echo "Aucune attribution possible.\n";
    }
} catch (Exception $e) {
    echo "ERREUR : " . $e->getMessage() . "\n";
}