#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Dec 22 19:17:23 2024
Modified on Sun Jan 05 2025

Author: Max
"""

from dotenv import load_dotenv
import os
import logging
import mysql.connector
from mysql.connector import Error

# Configuration du journal
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# Charger le fichier .env
path = "../html/suivi-stage/.env"
load_dotenv(path)

# Vérifier les variables essentielles
required_vars = ["DB_HOST", "DB_USERNAME", "DB_PASSWORD"]
missing_vars = [var for var in required_vars if not os.getenv(var)]

if missing_vars:
    raise ValueError(f"Les variables d'environnement suivantes sont manquantes : {', '.join(missing_vars)}")

# Récupérer les variables
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USERNAME")
db_pass = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_DATABASE")  # Valeur par défaut si non définie
api_key = os.getenv("API_KEY")

# Utilisation (sans afficher les secrets)
logging.info("Les variables d'environnement ont été chargées avec succès.")


def active_connection():
    """
    Établit une connexion à la base de données MySQL.

    Retourne:
        - Une instance de connexion MySQL si la connexion réussit.
    Lève:
        - mysql.connector.Error en cas d'erreur de connexion.
    """
    try:
        conn = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_pass,
            database=db_name,
        )
        if conn.is_connected():
            logging.info("Connexion réussie à la base de données.")
        return conn
    except Error as e:
        logging.error(f"Erreur lors de la connexion à la base de données : {e}")
        raise