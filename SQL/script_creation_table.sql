-- Dernière modification : 16/12/2024
-- Par : Gauthier GOUMEAUX

CREATE TABLE Personnel(
   idPersonnel INT AUTO_INCREMENT,
   roles ENUM('Enseignant','Gestionnaire') NOT NULL,
   nom VARCHAR(50)  NOT NULL,
   prenom VARCHAR(50)  NOT NULL,
   adresse VARCHAR(50)  NOT NULL,
   ville VARCHAR(50)  NOT NULL,
   codePostal VARCHAR(50)  NOT NULL,
   telephone VARCHAR(50) ,
   adresseMail VARCHAR(50) ,
   longGPS VARCHAR(50),
   latGPS VARCHAR(50),
   coptaEtudiant TINYINT,
   PRIMARY KEY(idPersonnel)
);

CREATE TABLE departementIUT(
   idDepartement INT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idDepartement)
);

CREATE TABLE Parcours(
   idParcours INT AUTO_INCREMENT,
   libelle VARCHAR(100)  NOT NULL,
   idDepartement INT NOT NULL,
   PRIMARY KEY(idParcours),
   FOREIGN KEY(idDepartement) REFERENCES departementIUT(idDepartement)
);

CREATE TABLE droit(
   idDroit INT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idDroit)
);

CREATE TABLE admin(
   idAdmin INT AUTO_INCREMENT,
   motDePasse VARCHAR(64)  NOT NULL,
   sel VARCHAR(32)  NOT NULL,
   idDroit INT NOT NULL,
   idPersonnel INT NOT NULL,
   PRIMARY KEY(idAdmin),
   FOREIGN KEY(idDroit) REFERENCES droit(idDroit),
   FOREIGN KEY(idPersonnel) REFERENCES Personnel(idPersonnel)
);

CREATE TABLE anneeFormation(
   idAnneeFormation TINYINT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idAnneeFormation)
);

CREATE TABLE TD(
   idTD TINYINT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idTD)
);

CREATE TABLE TP(
   idTP TINYINT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idTP)
);

CREATE TABLE Entreprise(
   idEntreprise INT AUTO_INCREMENT,
   numSIRET VARCHAR(14) ,
   raisonSociale VARCHAR(50)  NOT NULL,
   typeEtablissement ENUM('SAS','SARL') NOT NULL,
   adresseEntreprise VARCHAR(50)  NOT NULL,
   villeEntreprise VARCHAR(50)  NOT NULL,
   codePostalEntreprise VARCHAR(5)  NOT NULL,
   paysEntreprise VARCHAR(50)  NOT NULL,
   telephoneEntreprise VARCHAR(12)  NOT NULL,
   codeAPE_NAF VARCHAR(50) ,
   statutJuridique VARCHAR(50) ,
   effectif INT,
   representantLegal VARCHAR(100) ,
   longGPS VARCHAR(50),
   latGPS VARCHAR(50),
   PRIMARY KEY(idEntreprise),
   UNIQUE(numSIRET)
);

CREATE TABLE TuteurEntreprise(
   idTuteur INT AUTO_INCREMENT,
   nom VARCHAR(50) ,
   prenom VARCHAR(50) ,
   telephone VARCHAR(50) ,
   email VARCHAR(50) ,
   fonction VARCHAR(50) ,
   idEntreprise INT NOT NULL,
   PRIMARY KEY(idTuteur),
   FOREIGN KEY(idEntreprise) REFERENCES Entreprise(idEntreprise)
);

CREATE TABLE FicheDescriptive(
   idFicheDescriptive INT AUTO_INCREMENT,
   contenuDuStage TEXT,
   thematique VARCHAR(50) ,
   Sujet TEXT,
   fonctionEtTaches VARCHAR(140) ,
   competences VARCHAR(140) ,
   details TEXT,
   debutStage DATE,
   finStage DATE,
   nbJourParSemaine INT,
   nbHeureParSemaine INT,
   clauseConfidentialite BOOLEAN,
   statut ENUM('Validé','En attente') NOT NULL,
   numeroConvention VARCHAR(50),
   idTuteur INT NOT NULL,
   PRIMARY KEY(idFicheDescriptive),
   FOREIGN KEY(idTuteur) REFERENCES TuteurEntreprise(idTuteur)
);

CREATE TABLE AnneeUniversitaire(
   idAnneeUniversitaire INT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idAnneeUniversitaire)
);

CREATE TABLE ParametresGeneraux(
   idParametre INT AUTO_INCREMENT,
   libelle VARCHAR(50)  NOT NULL,
   valeur INT NOT NULL,
   description VARCHAR(50)  NOT NULL,
   PRIMARY KEY(idParametre)
);

CREATE TABLE Etudiant(
   idUPPA INT,
   nomEtudiant VARCHAR(50)  NOT NULL,
   prenomEtudiant VARCHAR(50)  NOT NULL,
   adresseEtudiant VARCHAR(50)  NOT NULL,
   villeEtudiant VARCHAR(50)  NOT NULL,
   codePostalEtudiant VARCHAR(5)  NOT NULL,
   adresseMailEtudiant VARCHAR(100)  NOT NULL,
   telephoneEtudiant VARCHAR(12)  NOT NULL,
   idParcours INT NOT NULL,
   idDepartement INT NOT NULL,
   idEntreprise INT,
   idTuteur INT,
   PRIMARY KEY(idUPPA),
   FOREIGN KEY(idParcours) REFERENCES Parcours(idParcours),
   FOREIGN KEY(idDepartement) REFERENCES departementIUT(idDepartement),
   FOREIGN KEY(idEntreprise) REFERENCES Entreprise(idEntreprise),
   FOREIGN KEY(idTuteur) REFERENCES TuteurEntreprise(idTuteur)
);

CREATE TABLE RechercheStage(
   idRecherche INT AUTO_INCREMENT,
   dateCreation DATETIME NOT NULL,
   dateModification DATETIME NOT NULL,
   date1erContact DATETIME NOT NULL,
   typeContact ENUM('Courrier','Mail','Présentiel','Téléphone','Site de recrutement') NOT NULL,
   nomEntreprise VARCHAR(50)  NOT NULL,
   adresseEntreprise VARCHAR(50)  NOT NULL,
   villeEntreprise VARCHAR(50)  NOT NULL,
   CPEntreprise VARCHAR(50)  NOT NULL,
   nomContact VARCHAR(50)  NOT NULL,
   fonctionContact VARCHAR(50) ,
   telContact VARCHAR(50) ,
   mailContact VARCHAR(50) ,
   dateRelance DATETIME,
   statut ENUM('Refusé','En cours','Relancé','Validé') NOT NULL,
   idUPPA INT NOT NULL,
   PRIMARY KEY(idRecherche),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA)
);

CREATE TABLE Attribuer(
   idUPPA INT,
   idPersonnel INT,
   PRIMARY KEY(idUPPA, idPersonnel),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA),
   FOREIGN KEY(idPersonnel) REFERENCES Personnel(idPersonnel)
);

CREATE TABLE Enseigner_pour(
   idPersonnel INT,
   idDepartement INT,
   PRIMARY KEY(idPersonnel, idDepartement),
   FOREIGN KEY(idPersonnel) REFERENCES Personnel(idPersonnel),
   FOREIGN KEY(idDepartement) REFERENCES departementIUT(idDepartement)
);

CREATE TABLE Avoir(
   idPersonnel INT,
   idDroit INT,
   PRIMARY KEY(idPersonnel, idDroit),
   FOREIGN KEY(idPersonnel) REFERENCES Personnel(idPersonnel),
   FOREIGN KEY(idDroit) REFERENCES droit(idDroit)
);

CREATE TABLE Suivre_annee(
   idUPPA INT,
   idAnneeFormation TINYINT,
   idAnneeUniversitaire INT,
   PRIMARY KEY(idUPPA, idAnneeFormation, idAnneeUniversitaire),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA),
   FOREIGN KEY(idAnneeFormation) REFERENCES anneeFormation(idAnneeFormation),
   FOREIGN KEY(idAnneeUniversitaire) REFERENCES AnneeUniversitaire(idAnneeUniversitaire)
);

CREATE TABLE Faire_partie_TD(
   idUPPA INT,
   idTD TINYINT,
   idAnneeUniversitaire INT,
   PRIMARY KEY(idUPPA, idTD, idAnneeUniversitaire),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA),
   FOREIGN KEY(idTD) REFERENCES TD(idTD),
   FOREIGN KEY(idAnneeUniversitaire) REFERENCES AnneeUniversitaire(idAnneeUniversitaire)
);

CREATE TABLE Faire_partie_TP(
   idUPPA INT,
   idTP TINYINT,
   idAnneeUniversitaire INT,
   PRIMARY KEY(idUPPA, idTP, idAnneeUniversitaire),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA),
   FOREIGN KEY(idTP) REFERENCES TP(idTP),
   FOREIGN KEY(idAnneeUniversitaire) REFERENCES AnneeUniversitaire(idAnneeUniversitaire)
);

CREATE TABLE Remplir(
   idUPPA INT,
   idFicheDescriptive INT,
   PRIMARY KEY(idUPPA, idFicheDescriptive),
   FOREIGN KEY(idUPPA) REFERENCES Etudiant(idUPPA),
   FOREIGN KEY(idFicheDescriptive) REFERENCES FicheDescriptive(idFicheDescriptive)
);
