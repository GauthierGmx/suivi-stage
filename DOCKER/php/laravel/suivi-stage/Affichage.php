<?php

namespace App\AlgorithmeAttribution;

class Affichage 
{
    /**
     * Calcule la somme des valeurs pour chaque professeur en excluant certaines colonnes,
     * et ajoute cette somme dans une clé 'SOMME'. Trie ensuite les résultats par la somme.
     *
     * @param array $data Tableau associatif contenant les données des professeurs
     * @return array Tableau trié par la somme des critères (ordre décroissant)
     */
    public static function maxProf(array $data): array 
    {
        // Parcourir chaque professeur
        foreach ($data as $nom => &$criteres) {
            // Vérifier si la somme n'existe pas déjà
            if (!isset($criteres['SOMME'])) {
                // Calculer la somme en excluant la colonne 'NOM'
                $somme = 0;
                foreach ($criteres as $critere => $valeur) {
                    if ($critere !== 'NOM' && is_numeric($valeur)) {
                        $somme += $valeur;
                    }
                }
                $criteres['SOMME'] = $somme;
            }
        }
        unset($criteres); // Détacher la référence

        // Trier le tableau par la somme en ordre décroissant
        uasort($data, function($a, $b) {
            return $b['SOMME'] <=> $a['SOMME'];
        });


        $result = array_map(function($row) {
            return $row;
        }, $data);

        return $result;
    }

    /**
     * Fonction de test qui remplit la matrice avec des valeurs aléatoires
     *
     * @param array $matrice Tableau initial des professeurs
     * @param array $criteres Liste des critères à évaluer
     * @return array Matrice remplie avec des valeurs aléatoires
     */
    public static function aleatoire(array $matrice, array $criteres): array 
    {
        foreach ($matrice as &$prof) {
            $somme = 0;
            foreach ($criteres as $critere) {
                if ($critere !== 'SOMME') {
                    $valeur = random_int(1, 10);
                    $prof[$critere] = $valeur;
                    $somme += $valeur;
                }
            }
            $prof['SOMME'] = $somme;
        }
        unset($prof); // Détacher la référence

        return $matrice;
    }
}