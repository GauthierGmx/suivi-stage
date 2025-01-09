#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jan  4 12:40:41 2025

@author: max
"""

import math
from typing import List, Any
#from geopy.geocoders import Nominatim
import json 

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
            Personnel.nom,
            Personnel.codePostal,
            Personnel.longGPS,
            Personnel.latGPS,
            Personnel.coptaEtudiant,
            COUNT(Etudiant.idUPPA) AS totalEtudiants,
            Personnel.idPersonnel
        FROM Personnel
        JOIN Appartenir ON Personnel.idPersonnel = Appartenir.idPersonnel
        LEFT JOIN Etudiant ON Personnel.idPersonnel = Etudiant.idResponsable
        WHERE Appartenir.roles = %s
        GROUP BY Personnel.idPersonnel
        HAVING Personnel.coptaEtudiant > COUNT(Etudiant.idUPPA);
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


def est_etudiant_deja_present_ville(cursor) -> bool:
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
        SELECT idEntreprise, nomEntreprise, codePostalEntreprise, nomEtudiant, COUNT(Etudiant.idUPPA) AS nbEtudiants
        FROM Entreprise 
        JOIN Etudiant ON Entreprise.idUPPA = Etudiant.idUPPA
        WHERE LEFT(codePostalEntreprise, 2) NOT IN ('64', '40')
        GROUP BY idEntreprise, nomEntreprise, codePostalEntreprise, nomEtudiant;
        """
    )
    
    rows = cursor.fetchall()
    
    if not rows:
        # Aucun étudiant trouvé
        return False
    else:
        return True



def est_deja_dans_entreprise(idEntreprise: int, cursor) -> bool:
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
        return False
    else:
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
        SELECT COUNT(Etudiant.idUPPA) AS nbEtudiants, anneeFormation.libelle
        FROM Etudiant JOIN Suivre_annee ON Etudiant.idUPPA = Suivre_annee.idUPPA
                      JOIN anneeFormation ON Suivre_annee.idAnneeFormation = anneeFormation.idAnneeFormation
        WHERE anneeFormation IN ("BUT 2", "BUT 3") AND idProf = %s
        GROUP BY anneeEtude;
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
        
"""
        JEU DE TESTS

"""
import sqlite3
import json
from typing import Tuple

def setup_test_database(json_path: str) -> Tuple[sqlite3.Connection, sqlite3.Cursor]:
    """
    Charge un jeu de données JSON, configure une base de données SQLite temporaire,
    et insère les données dans les tables correspondantes.

    Paramètre:
        - json_path: Chemin vers le fichier JSON contenant les données.

    Retourne:
        - Une connexion et un curseur SQLite pour exécuter des requêtes.
    """
    # Charger les données JSON
    with open(json_path, "r") as file:
        data = json.load(file)

    # Connexion à SQLite (en mémoire pour les tests)
    connection = sqlite3.connect(":memory:")
    cursor = connection.cursor()

    # Création des tables
    cursor.execute("""
    CREATE TABLE anneeFormation (
        idAnneeFormation TINYINT PRIMARY KEY,
        libelle VARCHAR(50) NOT NULL
    );
    """)
    cursor.execute("""
    CREATE TABLE Personnel (
        idPersonnel INT PRIMARY KEY,
        roles TEXT NOT NULL,
        nom VARCHAR(50) NOT NULL,
        prenom VARCHAR(50) NOT NULL,
        adresse VARCHAR(50) NOT NULL,
        ville VARCHAR(50) NOT NULL,
        codePostal VARCHAR(50) NOT NULL,
        telephone VARCHAR(50),
        adresseMail VARCHAR(50),
        longGPS VARCHAR(50),
        latGPS VARCHAR(50),
        coptaEtudiant TINYINT
    );
    """)
    cursor.execute("""
    CREATE TABLE Entreprise (
        idEntreprise INT PRIMARY KEY,
        numSIRET VARCHAR(14),
        raisonSociale VARCHAR(50) NOT NULL,
        typeEtablissement TEXT NOT NULL,
        adresseEntreprise VARCHAR(50) NOT NULL,
        villeEntreprise VARCHAR(50) NOT NULL,
        codePostalEntreprise VARCHAR(5) NOT NULL,
        paysEntreprise VARCHAR(50) NOT NULL,
        telephoneEntreprise VARCHAR(12) NOT NULL,
        codeAPE_NAF VARCHAR(50),
        statutJuridique VARCHAR(50),
        effectif INT,
        representantLegal VARCHAR(100),
        longGPS VARCHAR(50),
        latGPS VARCHAR(50)
    );
    """)
    cursor.execute("""
    CREATE TABLE Etudiant (
        idUPPA INT PRIMARY KEY,
        nomEtudiant VARCHAR(50) NOT NULL,
        prenomEtudiant VARCHAR(50) NOT NULL,
        adresseEtudiant VARCHAR(50) NOT NULL,
        villeEtudiant VARCHAR(50) NOT NULL,
        codePostalEtudiant VARCHAR(5) NOT NULL,
        adresseMailEtudiant VARCHAR(100) NOT NULL,
        telephoneEtudiant VARCHAR(12) NOT NULL,
        idParcours INT NOT NULL,
        idDepartement INT NOT NULL,
        idEntreprise INT,
        idTuteur INT
    );
    """)

    # Insertion des données
    for row in data["anneeFormation"]:
        cursor.execute("INSERT INTO anneeFormation VALUES (?, ?)", (row["idAnneeFormation"], row["libelle"]))
    for row in data["Personnel"]:
        cursor.execute("INSERT INTO Personnel VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                       (row["idPersonnel"], row["roles"], row["nom"], row["prenom"], row["adresse"],
                        row["ville"], row["codePostal"], row["telephone"], row["adresseMail"],
                        row["longGPS"], row["latGPS"], row["coptaEtudiant"]))
    for row in data["Entreprise"]:
        cursor.execute("INSERT INTO Entreprise VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                       (row["idEntreprise"], row["numSIRET"], row["raisonSociale"], row["typeEtablissement"],
                        row["adresseEntreprise"], row["villeEntreprise"], row["codePostalEntreprise"], 
                        row["paysEntreprise"], row["telephoneEntreprise"], row["codeAPE_NAF"],
                        row["statutJuridique"], row["effectif"], row["representantLegal"], 
                        row["longGPS"], row["latGPS"]))
    for row in data["Etudiant"]:
        cursor.execute("INSERT INTO Etudiant VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                       (row["idUPPA"], row["nomEtudiant"], row["prenomEtudiant"], row["adresseEtudiant"],
                        row["villeEtudiant"], row["codePostalEtudiant"], row["adresseMailEtudiant"], 
                        row["telephoneEtudiant"], row["idParcours"], row["idDepartement"], 
                        row["idEntreprise"], row["idTuteur"]))

    # Retourner la connexion et le curseur pour exécuter des tests
    return connection, cursor

