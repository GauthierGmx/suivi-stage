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


def main():
    """
    ######################
        INITIALISATION
    #####################
    """
    # Noms des critères (colonnes)
    criteres = [f"crit{i+1}" for i in range(8)] + ["SOMME"]
    
    # Noms des professeurs (lignes)
    professeurs = [f"M. X{i+1}" if i % 2 == 0 else f"Mme Y{i+1}" for i in range(8)]
    
    # Initialiser une matrice vide (8x9)
    matrice_critere = [[0 for _ in criteres] for _ in professeurs]

    matrice_critere = aff.aleatoire(matrice_critere, criteres)

    # Afficher la matrice avec indices des colonnes (critères) et des lignes (professeurs)
    print(f"{'':<15} " + " ".join([f"{crit:<10}" for crit in criteres]))
    for i, row in enumerate(matrice_critere):
        print(f"{professeurs[i]:<15} " + " ".join([f"{cell:<10}" for cell in row]))

    # Appeler la fonction affichage pour trier les professeurs
    liste_prof = aff.max_prof(matrice_critere, professeurs)
    print("\nProfesseurs triés par SOMME :", liste_prof)
    

"""
    APPELLE DE LA FONCTION PRINCIPALE
"""
main()
