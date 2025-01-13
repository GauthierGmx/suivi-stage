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


def main_old():
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
    
    idEtud = 610124 #valeur de test actuelle

    print(f"Traitement pour l'étudiant avec l'ID : {idEtud}")
        
    # Récupérer les données
    #conn, cursor = fn.setup_test_database("jeu_donnees_test.json")
    conn = bd.active_connection()
    matrice_data_prof = fn.recup_matrice_prof(conn.cursor())
    donnees_etudiant = fn.recup_donnees_etudiant(idEtud, conn.cursor())
    
    # Extraire les coordonnées GPS de l'étudiant
    coordonnees_gps_etud = [(row[3], row[4]) for row in donnees_etudiant]
    idEntrepriseEntreprise = donnees_etudiant[0][6] if donnees_etudiant and len(donnees_etudiant[0]) > 6 else None
    
    # Définir les critères et les professeurs
    criteres = ["NOM", "COMPTEUR_ETUDIANT", "DISTANCE_GPS_PROF_ENTREPRISE", "ETUDIANT_DEJA_PRESENT_VILLE", "ETUDIANT_DEJA_PRESENT_ENREPRISE", "EQUITE_DEUX_TROIS_ANNEE"]
    print("Critères de sélection :", criteres)
    professeurs = [matrice_data_prof[i][0] for i in range(len(matrice_data_prof))]
    
    # Créer le DataFrame 
    df = pd.DataFrame(np.zeros((len(professeurs), len(criteres)), dtype=int), columns=criteres, index=professeurs)


    print("\nDataFrame initial :\n", df)
    
    """
    ######################
        CORPS ALGO
    #####################
    """
    
    for prof_index, prof_nom in enumerate(professeurs):
        # Récuperer l'id du professeur 
        idProf = matrice_data_prof[prof_index][len(matrice_data_prof[prof_index])-1]

        # Pour les professeurs de la liste, on ajoute un compteur d'étudiants
        df.loc[prof_nom, "COMPTEUR_ETUDIANT"] = 1

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
               
        # Vérifier si l'étudiant est déjà présent dans la ville
        present_ville = fn.est_etudiant_deja_present_ville(code_postal,idEtud,conn.cursor())
        if present_ville == False:

            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_VILLE"] = 0
            #Aucun étudiant dans la même entreprise si aucun est dans la même ville 
            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0 

        else:
            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_VILLE"] = 1

            # Vérifier si un étudiant est déjà présent dans l'entreprise
            etudiant_present = fn.est_deja_dans_entreprise(idEntrepriseEntreprise, idEtud, conn.cursor())
            if etudiant_present == True:
                prof_present = fn.professeur_deja_associé(idEtud, conn.cursor())

                if prof_present != 0:
                    prof_associe = fn.trouver_prof_associe(idEtud, conn.cursor())
                    if prof_associe == prof_nom:

                        df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 1000
                        print(f"Le professeur {prof_nom} est déjà associé à un étudiant dans l'entreprise")

                    else: 
                        df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENTREPRISE"] = 0
                else:
                    df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0
            else:
                df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0


        #Verifie l'équité des étudiants de 2ème et 3ème année
        equite = fn.equite_deux_trois(idProf, conn.cursor())
        if equite == False:
            df.loc[prof_nom, "EQUITE_DEUX_TROIS_ANNEE"] = 0
        else:
            df.loc[prof_nom, "EQUITE_DEUX_TROIS_ANNEE"] = 1

    """
    ######################
          FERMETURE
    #####################
    """

    #Afficher le dataframe
    print("\nDataFrame final :\n", df)
          
    #Fermeture de l'accès à la BD       
    conn.cursor()
    conn.close()


    # Trier les professeurs
    liste_prof = aff.max_prof(df)
    print("\nProfesseurs triés par probabilité :")
    print(liste_prof)
    return liste_prof



def main():
    """
    Script principal pour traiter les données des étudiants et associer des professeurs.

    Ce script utilise les données des étudiants et des professeurs stockées dans une base de données.
    Il applique un ensemble de critères pour évaluer et trier les professeurs en fonction de leur 
    compatibilité avec un étudiant donné. Le résultat est un classement des professeurs basé sur des critères définis.

    Étapes principales :
    1. Initialisation des données de l'étudiant.
    2. Connexion à la base de données.
    3. Récupération et traitement des données.
    4. Calcul des critères pour chaque professeur.
    5. Tri des professeurs en fonction des résultats.
    6. Fermeture de la connexion à la base de données.
    """

    # Étape 1 : Initialisation
    idEtud = 610000  # ID de l'étudiant à traiter (valeur statique pour ce test)
    print(f"Traitement pour l'étudiant avec l'ID : {idEtud}")
    
    # Étape 2 : Connexion à la base de données
    try:
        conn = bd.active_connection()  # Établir une connexion à la base de données
        cursor = conn.cursor()  # Créer un curseur pour exécuter des requêtes SQL
    except Exception as e:
        # Gestion des erreurs en cas de problème de connexion
        print(f"Erreur lors de la connexion à la base de données : {e}")
        return

    try:
        # Étape 3 : Récupération des données
        matrice_data_prof = fn.recup_matrice_prof(cursor)  # Données sur les professeurs
        donnees_etudiant = fn.recup_donnees_etudiant(idEtud, cursor)  # Données de l'étudiant

        # Vérification de la disponibilité des données
        if not matrice_data_prof or not donnees_etudiant:
            print("Erreur : Données insuffisantes pour poursuivre le traitement.")
            return

        # Extraction des données spécifiques à l'étudiant
        coordonnees_gps_etud = (donnees_etudiant[0][3], donnees_etudiant[0][4])  # Coordonnées GPS
        code_postal = donnees_etudiant[0][5] if len(donnees_etudiant[0]) > 5 else None  # Code postal
        idEntrepriseEntreprise = donnees_etudiant[0][6] if len(donnees_etudiant[0]) > 6 else None  # Numéro SIRET

        # Création du DataFrame pour stocker les critères d'évaluation
        criteres = ["NOM", "COMPTEUR_ETUDIANT", "DISTANCE_GPS_PROF_ENTREPRISE", 
                    "ETUDIANT_DEJA_PRESENT_VILLE", "ETUDIANT_DEJA_PRESENT_ENREPRISE", 
                    "EQUITE_DEUX_TROIS_ANNEE"]  # Liste des critères
        professeurs = [row[0] for row in matrice_data_prof]  # Liste des noms des professeurs
        df = pd.DataFrame(np.zeros((len(professeurs), len(criteres)), dtype=int), 
                          columns=criteres, index=professeurs)  # Initialisation du DataFrame

        print("\nDataFrame initial :\n", df)

        # Étape 4 : Calcul des critères pour chaque professeur
        for prof_index, prof_nom in enumerate(professeurs):
            try:
                # Récupération des données spécifiques au professeur
                idProf = matrice_data_prof[prof_index][-1]  # ID du professeur
                coordonnees_prof = (matrice_data_prof[prof_index][3], matrice_data_prof[prof_index][4])  # Coordonnées GPS

                # Critère : COMPTEUR_ETUDIANT (présence d'au moins un étudiant)
                df.loc[prof_nom, "COMPTEUR_ETUDIANT"] = 1

                # Critère : DISTANCE_GPS_PROF_ENTREPRISE
                distance = fn.calculate_distance(coordonnees_prof, coordonnees_gps_etud)  # Calcul de la distance
                if distance > 20 and code_postal not in ["64", "40"]:
                    df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 1
                    
                elif distance > 20 and code_postal in ["64", "40"]:
                    df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 1
                    
                else:
                    df.loc[prof_nom, "DISTANCE_GPS_PROF_ENTREPRISE"] = 0

                # Critères : ETUDIANT_DEJA_PRESENT_VILLE et ENREPRISE
                present_ville = fn.est_etudiant_deja_present_ville(code_postal, idEtud, cursor)  # Vérifier la présence dans la ville
                if present_ville:
                    df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_VILLE"] = 1
                    etudiant_present = fn.est_deja_dans_entreprise(idEntrepriseEntreprise, idEtud, cursor)  # Vérifier la présence dans l'entreprise
                    if etudiant_present:
                        prof_associe = fn.trouver_prof_associe(idEtud, cursor)  # Trouver le professeur déjà associé
                        if prof_associe == prof_nom:
                            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 1000  # Pondération élevée pour un match parfait
                        else:
                            df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0
                    else:
                        df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0
                else:
                    df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_VILLE"] = 0
                    df.loc[prof_nom, "ETUDIANT_DEJA_PRESENT_ENREPRISE"] = 0

                # Critère : EQUITE_DEUX_TROIS_ANNEE
                equite = fn.equite_deux_trois(idProf, cursor)  # Évaluer l'équilibre entre 2ème et 3ème année
                df.loc[prof_nom, "EQUITE_DEUX_TROIS_ANNEE"] = 1 if equite else 0

            except Exception as e:
                # Gestion des erreurs spécifiques à un professeur
                print(f"Erreur lors du traitement du professeur {prof_nom} : {e}")

        # Affichage du DataFrame final avec les critères évalués
        print("\nDataFrame final :\n", df)

        # Étape 5 : Tri des professeurs selon les critères
        liste_prof = aff.max_prof(df)  # Fonction pour trier les professeurs
        print("\nProfesseurs triés par probabilité :")
        print(liste_prof)

        return liste_prof  # Retourne le classement des professeurs

    except Exception as e:
        # Gestion des erreurs dans le traitement principal
        print(f"Erreur dans le traitement principal : {e}")

    finally:
        # Étape 6 : Fermeture de la connexion
        try:
            cursor.close()  # Fermer le curseur
            conn.close()  # Fermer la connexion à la base de données
        except Exception as e:
            print(f"Erreur lors de la fermeture de la connexion : {e}")


"""
    APPELLE DE LA FONCTION PRINCIPALE
"""

if __name__ == "__main__":
    main()

