#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""

Created on Sun Dec 22 19:17:23 2024
Modified on Sun Jan 05 2025

@author: max
"""

from dotenv import load_dotenv
import os
import logging
import mysql.connector

# Configuration du journal
logging.basicConfig(level=logging.INFO)

# Charger le fichier .env
path="./DOCKER/php/laravel/suivi-stage/.env"
load_dotenv(path)

# Vérifier les variables essentielles
#required_vars = ["API_KEY", "DB_HOST", "DB_USERNAME", "DB_PASSWORD"]
required_vars = ["DB_HOST", "DB_USERNAME", "DB_PASSWORD"]
for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"La variable d'environnement {var} est manquante.")

# Récupérer les variables
api_key = os.getenv("API_KEY")
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USERNAME")
db_pass = os.getenv("DB_PASSWORD")

# Utilisation (sans afficher les secrets)
logging.info("Les variables d'environnement ont été chargées avec succès.")

def active_connection():
    conn = mysql.connector.connect(host=db_host,user=db_user,password=db_pass, database="db_suivi_stage")
    return conn