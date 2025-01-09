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
        "SELECT idUPPA, nomEtudiant, prenomEtudiant, longitudeAdresse, latitudeAdresse, codePostalEntreprise, idEntreprise FROM Entreprise JOIN Etudiant ON Entreprise.idUPPA=Etudiant.idUPPA WHERE idUPPA = %s",
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
    RAYON_TERRE = 6371.0

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
    distance = RAYON_TERRE * c
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


def est_etudiant_deja_present_ville(codePostalEntreprise:str, cursor) -> [bool, int]:
    """
    Chreche dans la base si un étudiant est déjà présent dans cette entreprise
    
    Paramètre:
        - code Postal de l'entreprise si il n'est pas dans le 64/40
    
    Retourne:
        - un booléen pour savoir si il existe un étudiant déjà présent dans la ville
        - si il existe un seul étudiant, retourne aussi son nom sinon un étudiant dans l
    """
    
    cursor.execute(
        """
        SELECT idEntreprise, nomEntreprise, codePostalEntreprise, nomEtudiant, count(idUPPA)
        FROM Entreprise 
        JOIN Etudiant ON Entreprise.idUPPA = Etudiant.idUPPA
        WHERE LEFT(codePostalEntreprise, 2) NOT IN ('64', '40');
         """)
    
    rows = cursor.fetchall()
    
    # Gestion des résultats
    if not rows:
        print(f"Aucun étudiant n'effectute de stage dans des villes en dehors des Pyrénées Atlantique et des Landes")
        return [0,0]
    else:
        #On regarde si plusieurs étudiants sont dans d'autres villes
        count_etudiant_ville =  #nombre d'étudiant déjà présent dans d'autres villes
        if rows[count_etudiant_ville] > 1 :
            
            #recherche entreprise 
            idEntreprise = rows[0]
            est_deja_dans_entreprise, indiceEtudiantDejaPresent= est_deja_dans_entreprise(idEntreprise, cursor)
        else: 
            code_postal_entreprise = 2 #colonne dans la requête
            return [1, rows[code_postal_entreprise]]
        


def est_deja_dans_entreprise(idEntreprise: int, cursor) -> [bool, int]:
    """
    Cherche dans la base si un étudiant est déjà présent dans cette entreprise
    
    Paramètre:
        - idEntreprise : l'identifiant de l'entreprise
    
    Retourne:
        - Un booléen pour savoir s'il existe un étudiant déjà présent dans l'entreprise
        - Si un étudiant existe, retourne aussi son nom sinon retourne 0
    """
    
    cursor.execute(
        """
        SELECT idEntreprise, nomEntreprise, codePostalEntreprise, nomEtudiant, idUPPA
        FROM Entreprise 
        JOIN Etudiant ON Entreprise.idUPPA = Etudiant.idUPPA
        WHERE idEntreprise = %s;
        """,
        (idEntreprise,)
    )
    
    rows = cursor.fetchall()
    
    # Gestion des résultats
    if not rows:
        print(f"Aucun étudiant n'effectue de stage dans cette entreprise")
        return [False, 0]
    
    # Si plusieurs étudiants sont présents dans l'entreprise
    if len(rows) > 1:
        return [True, 0]
    
    # Si un seul étudiant est trouvé
    nomEtudiant = rows[0][3]  # L'indice 3 correspond à la colonne 'nomEtudiant' dans le SELECT
    return [True, nomEtudiant]
