#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Dec 22 19:13:42 2024

@author: max
"""

import numpy as np

def max_prof(df):
    """
    Calcule la somme des valeurs pour chaque ligne du DataFrame en excluant certaines colonnes,
    et ajoute cette somme dans une colonne 'SOMME'. Trie ensuite les lignes par la colonne 'SOMME'.

    Arguments :
    - df : pandas.DataFrame contenant les données.

    Retourne :
    - Le DataFrame mis à jour, trié par la colonne 'SOMME' (en ordre décroissant).
    """

    # Vérifie que la colonne 'SOMME' n'existe pas déjà
    if 'SOMME' not in df.columns:
        # Crée la colonne 'SOMME' en calculant la somme des colonnes numériques (sauf 'NOM')
        df['SOMME'] = df.drop(columns=['NOM'], errors='ignore').select_dtypes(include=[np.number]).sum(axis=1)

    # Réorganiser les colonnes pour que 'SOMME' soit la dernière colonne
    columns = [col for col in df.columns if col != 'SOMME'] + ['SOMME']
    df = df[columns]

    # Trier le DataFrame par la colonne 'SOMME' en ordre décroissant
    df_sorted = df.sort_values(by='SOMME', ascending=False)
    df_sorted = df_sorted.drop(columns=['NOM'])

    return df_sorted



#fonction de test
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


    