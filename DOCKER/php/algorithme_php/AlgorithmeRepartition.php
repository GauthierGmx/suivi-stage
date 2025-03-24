<?php

namespace App\AlgorithmeAttribution;

require __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/FonctionsAlgorithme.php';
require_once __DIR__ . '/Affichage.php';

use PDO;
use Exception;
use App\AlgorithmeAttribution\FonctionsAlgorithme;
use App\AlgorithmeAttribution\Affichage;

class AlgorithmeRepartition 
{
    private PDO $db;
    private array $professeursMatrix;

    public function __construct(PDO $db) 
    {
        $this->db = $db;
        $this->professeursMatrix = [];
    }

    public function executeForStudent(string $idUPPA, string $idFicheDescriptive): ?array 
    {
        try {
            echo "Traitement pour l'étudiant avec l'ID : $idUPPA (Fiche descriptive: $idFicheDescriptive)\n";
            
            // Récupération des données
            $this->professeursMatrix = $this->getProfesseursMatrix();
            $etudiantData = $this->getEtudiantData($idUPPA, $idFicheDescriptive);
            
            if (empty($etudiantData)) {
                echo "Erreur : Données insuffisantes pour poursuivre le traitement.\n";
                return null;
            }

            echo "Données de l'étudiant récupérées avec succès\n";
            echo "Données de l'étudiant : \n";
            print_r($etudiantData);

            // Vérification des données requises
            $requiredFields = ['latitudeStage', 'longitudeStage', 'codePostalStage', 'idEntreprise'];
            foreach ($requiredFields as $field) {
                if (!isset($etudiantData[0][$field])) {
                    echo "Erreur : Donnée manquante : $field\n";
                    return null;
                }
            }

            // Extraction des données de l'étudiant
            $coordonneesEtudiant = [
                'lat' => $etudiantData[0]['latitudeStage'],
                'lng' => $etudiantData[0]['longitudeStage']
            ];
            $codePostal = $etudiantData[0]['codePostalStage'];
            $idEntreprise = $etudiantData[0]['idEntreprise'];

            // Définition des critères
            $criteres = [
                "NOM",
                "COMPTEUR_ETUDIANT",
                "DISTANCE_GPS_PROF_ENTREPRISE",
                "ETUDIANT_DEJA_PRESENT_VILLE",
                "ETUDIANT_DEJA_PRESENT_ENREPRISE",
                "EQUITE_DEUX_TROIS_ANNEE"
            ];
            echo "Critères de sélection : " . implode(", ", $criteres) . "\n";

            // Initialisation de la matrice de résultats
            $resultats = [];
            foreach ($this->professeursMatrix as $prof) {
                $resultats[$prof['nom']] = array_fill_keys($criteres, 0);
            }

            // Calcul des critères pour chaque professeur
            foreach ($this->professeursMatrix as $prof) {
                $coordonneesProf = [
                    'lat' => $prof['latitudeAdresse'],  // Changed from 'latitude'
                    'lng' => $prof['longitudeAdresse']  // Changed from 'longitude'
                ];

                // Compteur étudiant
                $resultats[$prof['nom']]['COMPTEUR_ETUDIANT'] = 1;

                // Distance GPS
                $distance = $this->calculateDistance($coordonneesProf, $coordonneesEtudiant);
                $resultats[$prof['nom']]['DISTANCE_GPS_PROF_ENTREPRISE'] =
                    ($distance > 20 && !in_array($codePostal, ['64', '40'])) ? 1 : 0;
                
                echo "Distance entre le professeur " . $prof['nom'] . " et l'étudiant : $distance km\n";

                // Vérification présence ville et entreprise
                $presentVille = $this->isEtudiantPresentVille($codePostal, $idUPPA);
                if ($presentVille) {
                    $resultats[$prof['nom']]['ETUDIANT_DEJA_PRESENT_VILLE'] = 1;
                    $etudiantPresentResult = $this->isEtudiantPresentEntreprise($idEntreprise, $idUPPA);
                    if ($etudiantPresentResult['present']) {
                        // On utilise l'ID de l'étudiant déjà présent dans l'entreprise
                        $profAssocié = $this->getProfesseurAssocie($etudiantPresentResult['idUPPA']);
                        $resultats[$prof['nom']]['ETUDIANT_DEJA_PRESENT_ENREPRISE'] = 
                            ($profAssocié === $prof['nom']) ? 1000 : 0;
                    }
                }

                // Équité 2ème/3ème année
                $resultats[$prof['nom']]['EQUITE_DEUX_TROIS_ANNEE'] = 
                    $this->checkEquiteDeuxTrois($prof['idPersonnel']) ? 1 : 0;  // Changed from 'id'
            }

            // Affichage des résultats
            echo "\nRésultats finaux :\n";
            print_r($resultats);

            // Tri des professeurs
            $professeursTries = $this->trierProfesseurs($resultats);
            echo "\nProfesseurs triés par probabilité :\n";
            print_r($professeursTries);

            return $professeursTries;

        } catch (Exception $e) {
            echo "ERREUR : " . $e->getMessage() . "\n";
            throw $e;
        }
    }

    private function getProfesseursMatrix(): array 
    {
        return FonctionsAlgorithme::getProfesseursMatrix($this->db);
    }

    private function getEtudiantData(string $idUPPA, string $idFicheDescriptive): array 
    {
        return FonctionsAlgorithme::getEtudiantData($idUPPA, $idFicheDescriptive, $this->db);
    }

    private function calculateDistance(array $coordsProf, array $coordsEtudiant): float 
    {
        return FonctionsAlgorithme::calculateDistance($coordsProf, $coordsEtudiant);
    }

    private function trierProfesseurs(array $resultats): array 
    {
        return Affichage::maxProf($resultats);
    }

    private function isEtudiantPresentVille(string $codePostal, string $idUPPA): bool 
    {
        return FonctionsAlgorithme::isEtudiantPresentVille($codePostal, $idUPPA, $this->db);
    }

    private function isEtudiantPresentEntreprise(string $idEntreprise, string $idUPPA): array 
    {
        return FonctionsAlgorithme::isEtudiantPresentEntreprise($idEntreprise, $idUPPA, $this->db);
    }

    private function getProfesseurAssocie(string $idUPPA): ?string 
    {
        return FonctionsAlgorithme::getProfesseurAssocie($idUPPA, $this->db);
    }

    private function checkEquiteDeuxTrois(string $idProf): bool 
    {
        return FonctionsAlgorithme::checkEquiteDeuxTrois($idProf, $this->db);
    }
}