<?php

namespace App\AlgorithmeAttribution;

use PDO;

class FonctionsAlgorithme
{
    private const RAYON_TERRE = 6371.0;
    private const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

    public static function getProfesseursMatrix(PDO $db): array
    {
        $query = "SELECT
            personnels.idPersonnel,
            personnels.nom,
            personnels.prenom,
            personnels.codePostal,
            personnels.longitudeAdresse,
            personnels.latitudeAdresse,
            personnels.coptaEtudiant,
            COUNT(etudiants.idUPPA) AS totalEtudiants
        FROM personnels
        JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
        JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA
        WHERE personnels.roles = :role
        GROUP BY personnels.idPersonnel
        HAVING personnels.coptaEtudiant > COUNT(etudiants.idUPPA) AND (personnels.coptaEtudiant - totalEtudiants) > 0
        ORDER BY personnels.coptaEtudiant DESC";

        $stmt = $db->prepare($query);
        $stmt->execute(['role' => 'Enseignant']);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //echo "La matrice des professeurs contient uniquement les entrées valides :\n";
        foreach ($rows as $row) {
            // print_r($row);
        }

        return $rows;
    }

    public static function getEtudiantData(string $idUPPA, string $idFicheDescriptive, PDO $db): array
    {
        $query = "SELECT etudiants.idUPPA,
                    etudiants.nom,
                    etudiants.prenom,
                    fiche_descriptives.longitudeStage,
                    fiche_descriptives.latitudeStage,
                    fiche_descriptives.adresseStage,
                    fiche_descriptives.codePostalStage,
                    fiche_descriptives.villeStage,
                    fiche_descriptives.paysStage,
                    fiche_descriptives.idFicheDescriptive,
                    entreprises.idEntreprise
            FROM entreprises
            JOIN fiche_descriptives ON entreprises.idEntreprise = fiche_descriptives.idEntreprise
            JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
            WHERE etudiants.idUPPA = :idUPPA
            AND fiche_descriptives.idFicheDescriptive = :idFicheDescriptive";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'idUPPA' => $idUPPA,
            'idFicheDescriptive' => $idFicheDescriptive
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($rows)) {
            // echo "Aucune donnée trouvée pour l'étudiant avec idUPPA=$idUPPA et idFicheDescriptive=$idFicheDescriptive\n";
            return [];
        }

        // Vérifier si les coordonnées GPS existent
        if (empty($rows[0]['longitudeStage']) || empty($rows[0]['latitudeStage'])) {
            // Nettoyer et formater l'adresse pour Nominatim
            $adresseElements = array_filter([
                $rows[0]['adresseStage'],
                $rows[0]['villeStage'],
                $rows[0]['codePostalStage'],
                $rows[0]['paysStage']
            ]);

            // Supprimer les mentions "CS", "Cedex" etc.
            $adresseElements = array_map(function($element) {
                return preg_replace([
                    '/\bCS\b.*/',
                    '/\bCedex\b.*/i',
                    '/\bBP\b.*/i'
                ], '', $element);
            }, $adresseElements);

            // Construire l'adresse finale
            $adresse = trim(implode(', ', $adresseElements));

            // echo "Recherche des coordonnées GPS pour l'adresse formatée : $adresse\n";
            
            // Récupérer les coordonnées via l'API
            $coordinates = self::getGpsCoordinates($adresse);
            
            if ($coordinates) {
                // Mettre à jour la fiche descriptive avec les nouvelles coordonnées
                $updateQuery = "UPDATE fiche_descriptives
                            SET longitudeStage = :lng,
                                latitudeStage = :lat
                            WHERE idFicheDescriptive = :idFiche";
                
                $updateStmt = $db->prepare($updateQuery);
                $updateStmt->execute([
                    'lng' => $coordinates['lng'],
                    'lat' => $coordinates['lat'],
                    'idFiche' => $rows[0]['idFicheDescriptive']
                ]);
                
                // Mettre à jour les données récupérées
                $rows[0]['longitudeStage'] = $coordinates['lng'];
                $rows[0]['latitudeStage'] = $coordinates['lat'];
                
                // echo "Coordonnées GPS mises à jour en base de données\n";
            } else {
                // echo "Impossible de récupérer les coordonnées GPS pour cette adresse\n";
            }
        }

        // echo "Données de l'étudiant récupérées avec succès\n";
        // print_r($rows);
        return $rows;
    }

    public static function calculateDistance(array $coordsProf, array $coordsEtudiant): float
    {
        $lat1 = deg2rad((float)$coordsProf['lat']);
        $lon1 = deg2rad((float)$coordsProf['lng']);
        $lat2 = deg2rad((float)$coordsEtudiant['lat']);
        $lon2 = deg2rad((float)$coordsEtudiant['lng']);

        $dlat = $lat2 - $lat1;
        $dlon = $lon2 - $lon1;

        $a = sin($dlat/2) * sin($dlat/2) +
             cos($lat1) * cos($lat2) *
             sin($dlon/2) * sin($dlon/2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        
        return self::RAYON_TERRE * $c;
    }

    public static function isEtudiantPresentVille(string $codePostal, string $idUPPA, PDO $db): bool 
    {
        $query = "SELECT 
                entreprises.idEntreprise, 
                entreprises.raisonSociale, 
                fiche_descriptives.codePostalStage, 
                etudiants.nom, 
                COUNT(etudiants.idUPPA) AS nbEtudiants
            FROM entreprises 
            JOIN fiche_descriptives ON entreprises.idEntreprise = fiche_descriptives.idEntreprise
            JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
            WHERE LEFT(fiche_descriptives.codePostalStage, 2) NOT IN ('64', '40') 
            AND fiche_descriptives.codePostalStage = :codePostal 
            AND etudiants.idUPPA != :idUPPA
            AND fiche_descriptives.statut = 'Validee'
            GROUP BY 
                entreprises.idEntreprise, 
                entreprises.raisonSociale, 
                fiche_descriptives.codePostalStage, 
                etudiants.nom";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'codePostal' => $codePostal,
            'idUPPA' => $idUPPA
        ]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!empty($results)) {
            // echo "Étudiants déjà présents dans la ville (code postal: $codePostal):\n";
            foreach ($results as $result) {
                // echo "- {$result['nom']} chez {$result['raisonSociale']}\n";
            }
            return true;
        }

        // echo "Aucun étudiant n'effectue de stage dans cette ville (code postal: $codePostal)\n";
        return false;
    }

    public static function isEtudiantPresentEntreprise(string $idEntreprise, string $idUPPA, PDO $db): array 
    {
        $query = "SELECT etudiants.nom, etudiants.idUPPA
            FROM etudiants
            JOIN fiche_descriptives ON etudiants.idUPPA = fiche_descriptives.idUPPA
            WHERE fiche_descriptives.idEntreprise = :idEntreprise 
            AND fiche_descriptives.statut = 'Validee'
            AND etudiants.idUPPA != :idUPPA
            LIMIT 1";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'idEntreprise' => $idEntreprise,
            'idUPPA' => $idUPPA
        ]);

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            // echo "Un étudiant ({$result['nom']}) est déjà présent dans cette entreprise\n";
            return [
                'present' => true,
                'idUPPA' => $result['idUPPA']
            ];
        }

        // echo "Aucun étudiant n'effectue de stage dans cette entreprise\n";
        return ['present' => false];
    }

    public static function checkEquiteDeuxTrois(string $idProf, PDO $db): bool
    {
        $query = "SELECT COUNT(etudiants.idUPPA) as nbEtudiants, annee_formations.libelle
                FROM etudiants
                JOIN table_etudiant_anneeform_anneeuniv ON etudiants.idUPPA = table_etudiant_anneeform_anneeuniv.idUPPA
                JOIN annee_formations ON table_etudiant_anneeform_anneeuniv.idAnneeFormation = annee_formations.idAnneeFormation
                JOIN table_personnel_etudiant_anneeuniv ON etudiants.idUPPA = table_personnel_etudiant_anneeuniv.idUPPA
                JOIN personnels ON table_personnel_etudiant_anneeuniv.idPersonnel = personnels.idPersonnel
                WHERE annee_formations.libelle IN ('BUT 2', 'BUT 3')
                AND personnels.idPersonnel = :idProf
                GROUP BY annee_formations.libelle";

        $stmt = $db->prepare($query);
        $stmt->execute(['idProf' => $idProf]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) < 2) {
            return false;
        }

        return $rows[0]['nbEtudiants'] !== $rows[1]['nbEtudiants'];
    }

    public static function getProfesseurAssocie(string $idUPPA, PDO $db): ?string
    {
        // echo "Recherche du professeur associé à l'étudiant $idUPPA\n";

        $query = "SELECT personnels.nom, personnels.idPersonnel
                FROM personnels
                JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
                JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA
                WHERE etudiants.idUPPA = :idUPPA";

        $stmt = $db->prepare($query);
        $stmt->execute(['idUPPA' => $idUPPA]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // echo "Professeur associé trouvé : {$result['nom']} (ID: {$result['idPersonnel']})\n";
            return $result['nom'];
        }

        // echo "Aucun professeur associé trouvé pour l'étudiant $idUPPA\n";
        return null;
    }

    private static function getGpsCoordinates(string $adresse): ?array
    {
        $params = [
            'q' => $adresse,
            'format' => 'json',
            'limit' => 1
        ];
        
        $url = self::NOMINATIM_URL . '?' . http_build_query($params);
        
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP Location Finder/1.0',
                    'Accept-Language: fr'
                ]
            ]
        ];
        
        $context = stream_context_create($opts);
        
        try {
            $response = file_get_contents($url, false, $context);
            
            if ($response === false) {
                // echo "Erreur lors de la requête à l'API de géocodage\n";
                return null;
            }
            
            $data = json_decode($response, true);
            
            if (empty($data)) {
                // echo "Aucun résultat trouvé pour l'adresse : $adresse\n";
                return null;
            }
            
            return [
                'lat' => $data[0]['lat'],
                'lng' => $data[0]['lon']
            ];
        } catch (\Exception $e) {
            // echo "Erreur lors de la récupération des coordonnées : " . $e->getMessage() . "\n";
            return null;
        }
    }
}