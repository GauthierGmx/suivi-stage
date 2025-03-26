# suivi-stage
Projet de SAE pour le suivi des stages des étudiants du BUT Informatique de l'IUT de Bayonne

---
## Arborescence des dossiers
* SQL : contient les scripts de création des tables SQL et de peuplement des tables
* DOCKER : contient les fichiers permettant de lancer le docker-compose
* DOCKER/php : contient le code source
* DOCKER/php/angular : contient le code source propre à Angular
* DOCKER/php/laravel : contient le code source propre à Laravel


---
## Guide d'installation de développement

Section liée à l'installation de l'environnement de développement identique à celle des développeurs à l'origine du projet.  

### Prérequis :

> Afin d'obtenir le même environnement, il est nécessaire d'avoir GIT, DOCKER et Docker Desktop installés sur sa machine. Selon les OS (Windows, Mac ou Linux), l'installation des outils peut différer mais ne sera pas traitée ici.

[Git](https://git-scm.com/downloads)  
[Docker](https://docs.docker.com/get-started/get-docker/)  
[Docker Desktop](https://www.docker.com/products/docker-desktop/)  

### Démarrage rapide :

Pour télécharger le projet en local, il faut cloner le projet. 

> Se placer dans le dossier ou l'on veut télécharger le projet

```bash
git clone https://github.com/GauthierGmx/suivi-stage
cd suivi-stage/
```

Une fois dans le dossier, il faut lancer docker et les conteneurs du projet depuis un terminal. 

> PS: Ne pas oublier de se placer dans le dossier du projet

```bash
docker compose up -d
```
