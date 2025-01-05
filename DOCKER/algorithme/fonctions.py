#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jan  4 12:40:41 2025

@author: max
"""

def recup_matrice_prof(cursor):
    
    '''
        Le but de cette fonction est de récupérer l'ensemble des data qui correspondent à chaque professeurs selon les critères données
    '''
    # Initialiser la matrice comme une liste vide
    matrice_data_prof = []
    
    # Exécuter la requête
    cursor.execute(
        "SELECT nom, codePostal, longGPS, latGPS, coptaEtudiant FROM Personnel WHERE roles = %s",
        ("Enseignant",)
    )
    rows = cursor.fetchall()
    
    # Ajouter chaque ligne directement dans la matrice
    for row in rows:
        matrice_data_prof.append(list(row))
    
    # Exemple d'affichage de la matrice
    '''print("Matrice des données des enseignants :")
    for ligne in matrice_data_prof:
        print(ligne)
'''
    return matrice_data_prof
    
    