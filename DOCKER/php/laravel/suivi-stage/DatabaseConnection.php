<?php

namespace App\AlgorithmeAttribution;

use PDO;
use PDOException;
use Dotenv\Dotenv;

class DatabaseConnection 
{
    private static ?PDO $connection = null;

    public static function connect(): PDO 
    {
        if (self::$connection === null) {
            // echo "Tentative de connexion à la base de données...\n";
            
            $dotenv = Dotenv::createImmutable(__DIR__);
            $dotenv->load();

            $requiredVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'];
            foreach ($requiredVars as $var) {
                if (!isset($_ENV[$var])) {
                    // echo "ERREUR : Variable d'environnement manquante : $var\n";
                    throw new \RuntimeException("Variable d'environnement manquante : $var");
                }
            }

            // echo "Variables d'environnement vérifiées.\n";


            try {
                self::$connection = new PDO(
                    "mysql:host={$_ENV['DB_HOST']};dbname={$_ENV['DB_DATABASE']}",
                    $_ENV['DB_USERNAME'],
                    $_ENV['DB_PASSWORD'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                    ]
                );
                
                // echo "Connexion réussie à la base de données!\n";
            } catch (PDOException $e) {
                // echo "ERREUR de connexion : " . $e->getMessage() . "\n";
                throw $e;
            }
        }

        return self::$connection;
    }
}