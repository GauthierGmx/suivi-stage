r#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 11 14:49:23 2024

@author: max

@version : 0.1

"""

"""
importation des différents fichiers contenant les fonctions de l'algorithme'
"""
import affichage as aff
import connexion_bd as bd
import fonctions as fn
import pandas as pd
import sys 


def main():
    """
    ######################
        INITIALISATION
    #####################
    
    Pour python 
    
    import sys
    
    def main():
        if len(sys.argv) != 2:
            print("Erreur : Vous devez fournir un idEtudiant.")
            return
        
        id_etudiant = sys.argv[1]
        print(f"Traitement pour l'étudiant avec l'ID : {id_etudiant}")
    
    if __name__ == "__main__":
        main()

    Pour php
    ?php
        $idEtudiant = 12345; // Remplacez par l'ID approprié
        $command = escapeshellcmd("python3 script.py " . $idEtudiant);
        $output = shell_exec($command);
        
        echo "Résultat du script Python : <br>";
        echo nl2br($output);
    ?>

    """
    
    idEtud = sys.argv[1]
    print(f"Traitement pour l'étudiant avec l'ID : {idEtud}")
        
    # Récupérer les données
    conn = bd.active_connection()
    matrice_data_prof = fn.recup_matrice_prof(conn.cursor())
    donnees_etudiant = fn.recup_donnees_etudiant(idEtud, conn.cursor())
    
    # Extraire les coordonnées GPS de l'étudiant
    coordonnees_gps_etud = [(row[3], row[4]) for row in donnees_etudiant]
    
    # Définir les critères et les professeurs
    criteres = ["NOM", "COMPTEUR_ETUDIANT", "CODE_POSTAL_VILLE_ENTREPRISE", "DISTANCE_GPS_PROF_ENTREPRISE", "ETUDIANT_DEJA_PRESENT", "EQUITE_DEUX_TROIS_ANNEE", "SOMME"]
    professeurs = [matrice_data_prof[i][0] for i in range(len(matrice_data_prof))]
    
    # Créer le DataFrame
    df = pd.DataFrame(columns=criteres, index=professeurs)
    
    
    """
    ######################
        CORPS ALGO
    #####################
    """
    
    # Calculer les distances
    for prof_index, prof_nom in enumerate(professeurs):
        coordonnees_prof = (matrice_data_prof[prof_index][3], matrice_data_prof[prof_index][4])
        distance = fn.calculate_distance(coordonnees_prof, coordonnees_gps_etud)
        df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = distance
    


    """
    ######################
          FERMETURE
    #####################
    """
    
    #Fermeture de l'accès à la BD    
    conn.cursor()
    conn.close()
    
    # Trier les professeurs
    liste_prof = aff.max_prof(df, professeurs)
    print("\nProfesseurs triés par probabilité :", liste_prof)
    return liste_prof


"""
    APPELLE DE LA FONCTION PRINCIPALE
"""

if __name__ == "__main__":
    main()

