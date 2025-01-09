#!/usr/bin/env python3
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
import numpy as np
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
    
    #idEtud = sys.argv[1]
    
    idEtud = 3 #valeur de test actuelle

    print(f"Traitement pour l'étudiant avec l'ID : {idEtud}")
        
    # Récupérer les données
    #conn, cursor = fn.setup_test_database("jeu_donnees_test.json")
    conn = bd.active_connection()
    matrice_data_prof = fn.recup_matrice_prof(conn.cursor())
    donnees_etudiant = fn.recup_donnees_etudiant(idEtud, conn.cursor())
    
    # Extraire les coordonnées GPS de l'étudiant
    coordonnees_gps_etud = [(row[3], row[4]) for row in donnees_etudiant]
    idEntreprise = donnees_etudiant[0][6] if donnees_etudiant and len(donnees_etudiant[0]) > 6 else None
    
    # Définir les critères et les professeurs
    criteres = ["NOM", "COMPTEUR_ETUDIANT", "CODE_POSTAL_VILLE_ENTREPRISE", "DISTANCE_GPS_PROF_ENTREPRISE", "ETUDIANT_DEJA_PRESENT", "EQUITE_DEUX_TROIS_ANNEE", "SOMME"]
    professeurs = [matrice_data_prof[i][0] for i in range(len(matrice_data_prof))]
    
    # Créer le DataFrame
    df = pd.DataFrame(np.zeros((len(professeurs), len(criteres))), columns=criteres, index=professeurs)

    
    
    """
    ######################
        CORPS ALGO
    #####################
    """
    
    for prof_index, prof_nom in enumerate(professeurs):
        # Récuperer l'id du professeur 
        idProf = matrice_data_prof[prof_index][len(matrice_data_prof[prof_index])-1]

        # Récupérer les coordonnées GPS du professeur
        coordonnees_prof = (matrice_data_prof[prof_index][3], matrice_data_prof[prof_index][4])
        
        # Calculer la distance entre le professeur et l'étudiant
        distance = fn.calculate_distance(coordonnees_prof, coordonnees_gps_etud)
        
        # Vérifier les conditions sur la distance et le code postal
        if distance > 20:
            # Vérifier si le code postal de l'étudiant n'est pas dans ["64", "40"]
            code_postal = donnees_etudiant[0][5] if donnees_etudiant and len(donnees_etudiant[0]) > 5 else None
            if code_postal not in ["64", "40"]:
                # Affecter la distance dans le DataFrame
                df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 1
            else:
                df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 0
        else:
            df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 1
               
        # Vérifier si un étudiant est déjà présent dans l'entreprise
        etudiant_present = fn.etudiant_deja_present(idEntreprise, conn.cursor())
        if etudiant_present != 0:
            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT"] = 1
        else:
            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT"] = 0

        #Verifie l'équité des étudiants de 2ème et 3ème année
        equite = fn.equite_deux_trois_annee(idProf, conn.cursor())

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

