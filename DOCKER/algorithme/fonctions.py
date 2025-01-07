#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jan  4 12:40:41 2025

@author: max
"""

import math
from typing import List, Any
from geopy.geocoders import Nominatim

def recup_matrice_prof(cursor) -> List[List[Any]]:
    '''
    Récupère les données des professeurs selon les critères donnés.
    Inclut uniquement les professeurs pour lesquels l'attribution d'étudiants est possible.
    '''
    # Exécuter la requête
    cursor.execute(
        """
        SELECT nom, codePostal, longGPS, latGPS, coptaEtudiant, count(Etudiant.idUPPA)
        FROM Personnel 
        JOIN Appartenir ON Personnel.idPersonnel = Appartenir.idPersonnel
        WHERE roles = %s 
        GROUP BY Personnel.idPersonnel
        """,
        ("Enseignant",)
    )
    rows = cursor.fetchall()

    # Filtrer et construire la matrice des données
    matrice_data_prof = [list(row) for row in rows if row[4] < row[5]]

    # Afficher les données récupérées
    print("La matrice des professeurs contient uniquement les entrées valides :")
    print(matrice_data_prof)

    return matrice_data_prof



def recup_donnees_etudiant(idEtud: int, cursor) -> List[List[Any]]:
    '''
    Cette fonction récupère toutes les données nécessaires pour un étudiant donné.
    '''
    # Initialiser la liste des données
    donnees_etud = []
    
    # Exécuter la requête
    cursor.execute(
        "SELECT idUPPA, nomEtudiant, prenomEtudiant, longGPS, latGPS, codePostalEntreprise FROM Entreprise JOIN Etudiant ON Entreprise.idUPPA=Etudiant.idUPPA WHERE idUPPA = %s",
        (idEtud,)
    )
    rows = cursor.fetchall()
    
    # Gestion des résultats
    if not rows:
        print(f"Aucune donnée trouvée pour l'étudiant avec idUPPA={idEtud}")
        return []
    
    # Ajouter les données à la liste
    donnees_etud = [list(row) for row in rows]
    
    # Log des données récupérées
    print("La matrice donnees_etud contient les données nécessaires au bon déroulement de l'algorithme")
    print(donnees_etud)
    return donnees_etud


    
def calculate_distance(prof_coords, student_coords):
    """
    Calcule la distance entre deux points donnés par leur latitude et longitude.

    Arguments :
    prof_coords : list - [latitude, longitude] du prof
    student_coords : list - [latitude, longitude] de l'étudiant

    Retourne :
    float - Distance en kilomètres
    """
    # Rayon de la Terre en kilomètres
    R = 6371.0

    # Conversion des degrés en radians
    lat1, lon1 = map(math.radians, prof_coords)
    lat2, lon2 = map(math.radians, student_coords)

    # Différences des coordonnées
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Formule de Haversine
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    # Distance
    distance = R * c
    return distance

# Exemple d'utilisation
'''
prof_coords = [48.8566, 2.3522]  # Paris
student_coords = [51.5074, -0.1278]  # Londres

print("Distance:", calculate_distance(prof_coords, student_coords), "km")
'''


def get_gps_coordinates(address: str):
    """
    Récupère les coordonnées GPS (latitude, longitude) d'une adresse donnée.

    Paramètre :
    - address (str) : L'adresse à géocoder.

    Retourne :
    - tuple : (latitude, longitude) ou None si l'adresse est introuvable.
    """
    # Initialiser le géocodeur
    geolocator = Nominatim(user_agent="geoapi_exemple")
    
    # Effectuer le géocodage
    location = geolocator.geocode(address)
    
    if location:
        return location.latitude, location.longitude
    else:
        print("Adresse introuvable")
        return None

# Exemple d'utilisation
"""
adresse = "10 Downing Street, London"
coords = get_gps_coordinates(adresse)
if coords:
    print(f"Les coordonnées GPS de l'adresse '{adresse}' sont : {coords}")
"""