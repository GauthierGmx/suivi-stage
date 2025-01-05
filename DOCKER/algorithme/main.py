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

def main():
    """
    ######################
        INITIALISATION
    #####################
    """
    conn = bd.active_connection()
    matrice_data_prof = fn.recup_matrice_prof(conn.cursor)
    
    # Noms des critères (colonnes)
    criteres = [["NOM"] + ["COMPTEUR_ETUDIANT_MAX"] + ["COMPTEUR_ACTUEL"] +["CODE_POSTAL_VILLE_ENTREPRISE"] + ["DISTANCE_GPS_PROF_ENTREPRISE"] + ["ETUDIANT_DEJA_PRESENT"] + ["EQUITE_DEUX_TROIS_ANNEE"] + ["SOMME"]]
    
    # Noms des professeurs (lignes)
    professeurs = []
    for i in range(len(matrice_data_prof)):
        professeurs.append(matrice_data_prof[0][i])
    
    # Création du DataFrame avec les critères en ligne et les professeurs comme colonnes
    df = pd.DataFrame(columns=professeurs, index=criteres)
    
    
    """
    ######################
       CORPS ALGORITHME
    #####################
    """

    # Afficher la matrice avec indices des colonnes (critères) et des lignes (professeurs)
    print(f"{'':<15} " + " ".join([f"{crit:<10}" for crit in criteres]))
    for i, row in enumerate(matrice_critere):
        print(f"{professeurs[i]:<15} " + " ".join([f"{cell:<10}" for cell in row]))

    # Appeler la fonction affichage pour trier les professeurs
    liste_prof = aff.max_prof(matrice_critere, professeurs)
    print("\nProfesseurs triés par SOMME :", liste_prof)
    
    
    #Fermeture de l'accès à la BD    
    cursor = conn.cursor()
    conn.close()

"""
    APPELLE DE LA FONCTION PRINCIPALE
"""
main()
