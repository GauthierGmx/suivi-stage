#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jan  4 12:40:41 2025

@author: max
"""

import math
from typing import List, Any
#from geopy.geocoders import Nominatim

from typing import List, Any

def recup_matrice_prof(cursor) -> List[List[Any]]:
    """
    Récupère les données des professeurs qui peuvent être assignés à des étudiants.
    
    Critères :
        - Le nombre de places disponibles pour les étudiants (coptaEtudiant) est supérieur 
          au nombre d'étudiants actuellement assignés (COUNT(Etudiant.idUPPA)).
    
    Retour :
        - Une liste de listes contenant les données suivantes pour chaque professeur valide :
          [nom, codePostal, longGPS, latGPS, coptaEtudiant, totalEtudiants, idPersonnel].
    """
    # Exécuter la requête SQL
    cursor.execute(
        """
        SELECT 
            personnels.nom,
            personnels.codePostal,
            personnels.longitudeAdresse,
            personnels.latitudeAdresse,
            personnels.coptaEtudiant,
            COUNT(etudiants.idUPPA) AS totalEtudiants,
            personnels.idPersonnel
        FROM personnels
        JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
        JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA
        WHERE personnels.roles = %s
        GROUP BY personnels.idPersonnel
        HAVING personnels.coptaEtudiant > COUNT(etudiants.idUPPA) AND (personnels.coptaEtudiant - totalEtudiants) > 0 
        ORDER BY  personnels.coptaEtudiant DESC;
        """,
        ("Enseignant",)
    )

    # Récupérer les résultats
    rows = cursor.fetchall()

    # Construire la matrice des données
    matrice_data_prof = [list(row) for row in rows]

    # Afficher un résumé des données récupérées
    print("La matrice des professeurs contient uniquement les entrées valides :")
    for row in matrice_data_prof:
        print(row)

    return matrice_data_prof


def recup_donnees_etudiant(idEtud: int, cursor) -> List[List[Any]]:
    '''
    Cette fonction récupère toutes les données nécessaires pour un étudiant donné.
    '''
    # Initialiser la liste des données
    donnees_etud = []
    
    # Exécuter la requête
    cursor.execute(
        """SELECT etudiants.idUPPA, etudiants.nom, etudiants.prenom, entreprises.longitudeAdresse, entreprises.latitudeAdresse, entreprises.codePostal, entreprises.idEntrepriseRET FROM entreprises 
            JOIN fiche_descriptives ON entreprises.idEntrepriseRET=fiche_descriptives.idEntrepriseRET
            JOIN etudiants ON fiche_descriptives.idUPPA=etudiants.idUPPA 
            WHERE etudiants.idUPPA = %s""",
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


def flatten_coords(coords):
    """
    Aplatit une liste/tuple imbriquée contenant des coordonnées.
    Exemple :
        [(43.123, -0.456)] -> [43.123, -0.456]
        [[43.123, -0.456]] -> [43.123, -0.456]
    """
    if isinstance(coords, (list, tuple)) and len(coords) == 1:
        if isinstance(coords[0], (list, tuple)):
            return coords[0]
    return coords


def calculate_distance(prof_coords, student_coords):
    """
    Calcule la distance entre deux points donnés par leur latitude et longitude.

    Arguments :
    prof_coords : list ou tuple - [latitude, longitude] du prof
    student_coords : list ou tuple - [latitude, longitude] de l'étudiant

    Retourne :
    float - Distance en kilomètres
    """
    # Rayon de la Terre en kilomètres
    RAYON_TERRE = 6371.0

    # Aplatir les coordonnées si nécessaire
    prof_coords = flatten_coords(prof_coords)
    student_coords = flatten_coords(student_coords)

    # Assurez-vous que les coordonnées sont converties en float
    prof_coords = [float(coord) for coord in prof_coords]
    student_coords = [float(coord) for coord in student_coords]

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


def est_etudiant_deja_present_ville(codePostal, idUPPA, cursor) -> bool:
    """
    Vérifie si un étudiant est déjà en stage dans une entreprise située en dehors des Pyrénées-Atlantiques (64) et des Landes (40).
    
    Paramètre:
        - cursor : curseur de base de données pour exécuter les requêtes.
        
    Retourne:
        - Un tuple (bool, str) :
            - bool : True si un étudiant est présent, False sinon.
            - str : Si un seul étudiant est trouvé, retourne son nom. Si aucun ou plusieurs, retourne un message d'information.
    """
    
    # Requête SQL pour rechercher des étudiants dans des entreprises hors des départements 64 et 40
    cursor.execute(
        """
        SELECT entreprises.idEntrepriseRET, entreprises.raisonSociale, entreprises.codePostal, etudiants.nom, COUNT(etudiants.idUPPA) AS nbEtudiants
        FROM entreprises 
        JOIN fiche_descriptives ON entreprises.idEntrepriseRET = fiche_descriptives.idEntrepriseRET
        JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
        WHERE LEFT(entreprises.codePostal, 2) NOT IN ('64', '40') AND entreprises.codePostal = %s AND etudiants.idUPPA != %s
        GROUP BY entreprises.idEntrepriseRET, entreprises.raisonSociale, entreprises.codePostal, etudiants.nom;
        """
    ,(codePostal, idUPPA)
    )
    
    rows = cursor.fetchall()
    
    if not rows:
        # Aucun étudiant trouvé
        return False
    else:
        return True



def est_deja_dans_entreprise(idEntrepriseRETEntreprise: int, idUPPA: int, cursor) -> bool:
    """
    Cherche dans la base si un étudiant est déjà présent dans cette entreprise
    
    Paramètre:
        - idEntrepriseRETEntreprise : l'identifiant de l'entreprise
    
    Retourne:
        - Un booléen pour savoir s'il existe un étudiant déjà présent dans l'entreprise
        - Si un étudiant existe, retourne aussi son nom sinon retourne 0
    """
    
    cursor.execute(
        """
        SELECT entreprises.idEntrepriseRET, entreprises.raisonSociale, entreprises.codePostal, etudiants.nom, etudiants.idUPPA
        FROM entreprises 
        JOIN fiche_descriptives ON entreprises.idEntrepriseRET = fiche_descriptives.idEntrepriseRET
        JOIN etudiants ON fiche_descriptives.idUPPA = etudiants.idUPPA
        WHERE entreprises.idEntrepriseRET = %s AND etudiants.idUPPA != %s;
        """,
        (idEntrepriseRETEntreprise,idUPPA)
    )
    
    rows = cursor.fetchall()
    
    # Gestion des résultats
    if not rows:
        print(f"Aucun étudiant n'effectue de stage dans cette entreprise")
        return False
    else:
        print(f"Un étudiant est déjà présent dans cette entreprise : {rows[0][3]}")
        return True

def equite_deux_trois(idProf, cursor) -> bool:
    """
    Vérifie l'équité des étudiants de 2ème et 3ème année.
    
    Paramètre:
        - nomProf : le nom du professeur
    
    Retourne:
        - Un booléen pour savoir si l'équité est respectée
    """
    
    # Requête SQL pour vérifier l'équité des étudiants de 2ème et 3ème année
    cursor.execute(
        """
        SELECT COUNT(etudiants.idUPPA) AS nbEtudiants, annee_formations.libelle
        FROM etudiants JOIN table_etudiant_anneeform_anneeuniv ON etudiants.idUPPA = table_etudiant_anneeform_anneeuniv.idUPPA
        JOIN annee_formations ON table_etudiant_anneeform_anneeuniv.idAnneeFormation = annee_formations.idAnneeFormation
        JOIN table_personnel_etudiant_anneeuniv ON etudiants.idUPPA = table_personnel_etudiant_anneeuniv.idUPPA
        JOIN personnels ON table_personnel_etudiant_anneeuniv.idPersonnel = personnels.idPersonnel
        WHERE annee_formations.libelle IN ("BUT 2", "BUT 3") AND personnels.idPersonnel = %s
        GROUP BY annee_formations.libelle;
        """
    ,(idProf,))
    
    rows = cursor.fetchall()
    
    # Gestion des résultats
    if not rows:
        print(f"Aucun étudiant de 2ème ou 3ème année n'est présent")
        return False
    
    # Vérifier l'équité entre les étudiants de 2ème et 3ème année
    else:
        if rows[0][0] == rows[1][0]:
            return False
        else:
            return True
        


def professeur_deja_associé(etudiant_present, cursor):
    """
    Recherche l'id du professeur déjà associé à l'étudiant présent dans l'entreprise.

    Paramètre :
        - etudiant_present : int - l'identifiant de l'étudiant présent dans l'entreprise.
        - cursor : curseur de base de données pour exécuter les requêtes.

    Retourne :
        - str : le nom du professeur déjà associé à l'étudiant.

    """
    # Requête SQL pour récupérer le nom du professeur associé à l'étudiant présent
    cursor.execute(
        """
        SELECT personnels.nom, personnels.idPersonnel
        FROM personnels
        JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
        JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA
        WHERE etudiants.idUPPA = %s;
        """
    ,(etudiant_present,))
    
    row = cursor.fetchone()
    
    # Gestion des résultats
    if not row:
        print(f"Aucun professeur n'est associé à l'étudiant avec idUPPA={etudiant_present}")
        return None
    else:
        return row[1]
    

                   
def trouver_prof_associe(idEtudiant, cursor):
    """
        Trouver le professeur associé 
    """

    cursor.execute(
        """
        SELECT personnels.nom
        FROM personnels
        JOIN table_personnel_etudiant_anneeuniv ON personnels.idPersonnel = table_personnel_etudiant_anneeuniv.idPersonnel
        JOIN etudiants ON table_personnel_etudiant_anneeuniv.idUPPA = etudiants.idUPPA 
        WHERE etudiants.idUPPA = %s
    """,(idEtudiant,)
    )

    rows = cursor.fetchall()

    if not rows:
        return 0 
    else:
        return rows[0][0]