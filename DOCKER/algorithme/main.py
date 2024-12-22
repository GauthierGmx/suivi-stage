#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 11 14:49:23 2024

@author: max

@version : 0.1

"""

def aleatoire(matrice, criteres):
    """
    Fonction de test qui permet de tester l'algorithme en fonction des critères 
    avec différentes valeurs'
    """
    # Remplir la matrice avec des exemples de données aléatoires pour les critères
    import random
    for i in range(len(matrice)):  # Parcourir les lignes (professeurs)
        for j in range(len(criteres) - 1):  # Parcourir les colonnes (sauf "SOMME")
            matrice[i][j] = random.randint(1, 10)  # Exemples de valeurs aléatoires
        # Calculer la colonne "SOMME" comme la somme des critères
        matrice[i][-1] = sum(matrice[i][:-1])
        
    return matrice

def main() -> int:
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

    matrice_critere = aleatoire(matrice_critere, criteres)

    # Afficher la matrice avec indices des colonnes (critères) et des lignes (professeurs)
    print(f"{'':<15} " + " ".join([f"{crit:<10}" for crit in criteres]))
    for i, row in enumerate(matrice_critere):
        print(f"{professeurs[i]:<15} " + " ".join([f"{cell:<10}" for cell in row]))

    # Appeler la fonction finish pour trier les professeurs
    liste_prof = finish(matrice_critere, professeurs)
    print("\nProfesseurs triés par SOMME :", liste_prof)
    
    return 0


def finish(matrice, professeurs):
    
    """
    Trie les professeurs par ordre croissant en fonction de la colonne "SOMME".

    Arguments :
    - matrice : Liste imbriquée représentant la matrice initiale (lignes = professeurs, colonnes = critères + SOMME).
    - professeurs : Liste des noms des professeurs correspondant aux lignes de la matrice.

    Retourne :
    - Une liste des noms des professeurs triés par la colonne "SOMME".
    """
    
    # Dernier indice de colonne (SOMME)
    dernier_indice = len(matrice[0]) - 1

    # Associer chaque professeur à la valeur dans la colonne "SOMME"
    prof_somme = [(professeurs[i], matrice[i][dernier_indice]) for i in range(len(professeurs))]

    # Trier par la valeur de la colonne "SOMME"
    prof_somme_tries = sorted(prof_somme, key=lambda x: x[1])

    # Retourner uniquement les noms triés
    return [prof[0] for prof in prof_somme_tries]



"""
    APPELLE DE LA FONCTION PRINCIPALE
"""
main()
