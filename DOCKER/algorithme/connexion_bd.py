#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Dec 22 19:17:23 2024

@author: max
"""

from dotenv import load_dotenv
import os
import logging

# Configuration du journal
logging.basicConfig(level=logging.INFO)

# Charger le fichier .env
load_dotenv()

# Vérifier les variables essentielles
required_vars = ["API_KEY", "DB_HOST", "DB_USER", "DB_PASS"]
for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"La variable d'environnement {var} est manquante.")

# Récupérer les variables
api_key = os.getenv("API_KEY")
db_host = os.getenv("DB_HOST")
db_user = os.getenv("DB_USER")
db_pass = os.getenv("DB_PASS")

# Utilisation (sans afficher les secrets)
logging.info("Les variables d'environnement ont été chargées avec succès.")


