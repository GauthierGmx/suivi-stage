<?php

namespace App\AlgorithmeAttribution;

use PDO;

class FonctionsAlgorithme 
{
    private const RAYON_TERRE = 6371.0;

    public static function getProfesseursMatrix(PDO $db): array 
    {
        $query = "SELECT 
            personnels.nom,
            personnels.codePostal,
            personnels.longitudeAdresse,
            personnels.latitudeAdresse,
            personnels.coptaEtudiant,
            COUNT(etudiants.idUPPA) AS totalEtudiants,
            personnels.idPersonnel
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

        echo "La matrice des professeurs contient uniquement les entrées valides :\n";
        foreach ($rows as $row) {
            print_r($row);
        }

        return $rows;
    }

    public static function getEtudiantData(string $idUPPA, PDO $db): array 
    {
        $query = "SELECT etudiants.idUPPA, etudiants.nom, etudiants.prenom, 
                        entreprises.longitudeAdresse, entreprises.latitudeAdresse, 
                        entreprises.codePostal, entreprises.idEntreprise 
                 FROM entreprises 
                 JOIN fiche_descriptives ON entreprises.idEntreprise=fiche_descriptives.idEntreprise
                 JOIN etudiants ON fiche_descriptives.idUPPA=etudiants.idUPPA 
                 WHERE etudiants.idUPPA = :idUPPA";

        $stmt = $db->prepare($query);
        $stmt->execute(['idUPPA' => $idUPPA]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($rows)) {
            echo "Aucune donnée trouvée pour l'étudiant avec idUPPA=$idUPPA\n";
            return [];
        }

        echo "Données de l'étudiant récupérées avec succès\n";
        print_r($rows);
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
        $query = "SELECT entreprises.idEntreprise 
                FROM entreprises 
                JOIN fiche_descriptives ON entreprises.idEntreprise = fiche_descriptives.idEntreprise
                JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
                WHERE LEFT(entreprises.codePostal, 2) NOT IN ('64', '40') 
                AND entreprises.codePostal = :codePostal 
                AND etudiants.idUPPA != :idUPPA
                LIMIT 1";

        $stmt = $db->prepare($query);
        $stmt->execute([
            'codePostal' => $codePostal,
            'idUPPA' => $idUPPA
        ]);

        return $stmt->rowCount() > 0;
    }

    public static function isEtudiantPresentEntreprise(string $idEntreprise, string $idUPPA, PDO $db): bool 
    {
        $query = "SELECT etudiants.nom
                FROM entreprises
                JOIN fiche_descriptives ON entreprises.idEntreprise = fiche_descriptives.idEntreprise
                JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
                WHERE entreprises.idEntreprise = :idEntreprise 
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
            echo "Un étudiant est déjà présent dans cette entreprise : {$result['nom']}\n";
            return true;
        }

        echo "Aucun étudiant n'effectue de stage dans cette entreprise\n";
        return false;
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
        $query = "SELECT personnels.nom
                 FROM personnels
                 JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
                 JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA 
                 WHERE etudiants.idUPPA = :idUPPA";

        $stmt = $db->prepare($query);
        $stmt->execute(['idUPPA' => $idUPPA]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ? $result['nom'] : null;
    }
}