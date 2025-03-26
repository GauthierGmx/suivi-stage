
## Table des matières

- [Guide d'installation](#guide-d-installation-de-l-environnement-de-developpement)
  - [Prérequis](#prérequis)
  - [Démarrage rapide](#démarrage-rapide)
  - [Informations importantes](#informations-importantes)
- [Sauvegarde du projet](#sauvegarde-du-projet)

---
## Guide d'installation de l'environnement de développement

> [!TIP]
> Section liée à l'installation de l'environnement de développement identique à celle des développeurs à l'origine du projet.  

### <ins>Prérequis</ins> :

> Afin d'obtenir le même environnement, il est nécessaire d'avoir GIT, DOCKER et Docker Desktop installés sur sa machine. Selon les OS (Windows, Mac ou Linux), l'installation des outils peut différer mais ne sera pas traitée ici.

[Git](https://git-scm.com/downloads)  
[Docker](https://docs.docker.com/get-started/get-docker/)  
[Docker Desktop](https://www.docker.com/products/docker-desktop/)  

### <ins>Démarrage rapide</ins> :

Pour télécharger le projet en local, il faut cloner le projet. 

> Se placer dans le dossier où l'on veut télécharger le projet

```bash
git clone https://github.com/GauthierGmx/suivi-stage
cd suivi-stage/
```

Une fois dans le dossier, il faut lancer Docker et les conteneurs du projet depuis un terminal. 

> PS : Ne pas oublier de se placer dans le dossier du projet

```bash
docker compose up -d
```


### <ins>Informations importantes</ins>

> [!WARNING]
> Nous avons procédé de manière simple. Pour éviter tout conflit avec la branche de travail principale, il est impossible de pousser directement du code dessus. Il est donc nécessaire de passer par des branches. 

> Création d'une branche (être placée sur la main)

```bash
git branch nomBranche
```

> Se déplacer dans cette dernière

```bash
git switch nomBranche
```

C'est bon, vous pouvez développer ! 

### <ins>Mise en place de l'environnement d'execution d'Angular</ins> : 

> [!CAUTION]
> Section en cours de construction
---
## Sauvegarde du projet

Pour le versionning du code, il est donc utile d'utiliser les commandes GIT

Sauvegarde du projet (sur le dossier courant): 

```bash
git add .
git commit -m "MESSAGE"
```

Pour pousser le code sur GITHUB : 

```bash
git push
```