-- Dernière modification : 16/12/2024
-- Par : Gauthier GOUMEAUX

INSERT INTO departementIUT (libelle) VALUES ('Informatique');
INSERT INTO departementIUT (libelle) VALUES ('Génie Industriel et Maintenance');
INSERT INTO departementIUT (libelle) VALUES ('Technique de commercialisation');
INSERT INTO departementIUT (libelle) VALUES ('Gestion des Entreprises et des Associations');

INSERT INTO Parcours (libelle, idDepartement) VALUES ('IAMSI',1);
INSERT INTO Parcours (libelle, idDepartement) VALUES ('RACDV',1);

INSERT INTO anneeFormation (libelle) VALUES ('1ère année');
INSERT INTO anneeFormation (libelle) VALUES ('2ème année');
INSERT INTO anneeFormation (libelle) VALUES ('3ème année');

INSERT INTO TD (libelle) VALUES ('TD1');
INSERT INTO TD (libelle) VALUES ('TD2');
INSERT INTO TD (libelle) VALUES ('TD3');

INSERT INTO TP (libelle) VALUES ('TP1');
INSERT INTO TP (libelle) VALUES ('TP2');
INSERT INTO TP (libelle) VALUES ('TP3');
INSERT INTO TP (libelle) VALUES ('TP4');
INSERT INTO TP (libelle) VALUES ('TP5');

INSERT INTO AnneeUniversitaire (libelle) VALUES ('2024-2025');
INSERT INTO AnneeUniversitaire (libelle) VALUES ('2025-2026');
INSERT INTO AnneeUniversitaire (libelle) VALUES ('2026-2027');

INSERT INTO Personnel (roles, nom, prenom, adresse, ville, codePostal, telephone, adresseMail, coptaEtudiant) VALUES ('Enseignant','CARPENTIER','Yann','2 allée du Parc Montaury','Anglet','64600','0601020304','yann.carpentier@iutbayonne.univ-pau.fr',16);
INSERT INTO Personnel (roles, nom, prenom, adresse, ville, codePostal, telephone, adresseMail, coptaEtudiant) VALUES ('Enseignant','VALLES-PARLANGEAU','Nathalie','2 Rue Henri Garcia','Boucau','64340','0609080706','nathalie.valles-parlangeau@iutbayonne.univ-pau.fr',16);
INSERT INTO Personnel (roles, nom, prenom, adresse, ville, codePostal, telephone, adresseMail, coptaEtudiant) VALUES ('Enseignant','ROOSE','Philippe','2 impasse d Aguilera','Biarritz','64200','0601010101','philippe.roose@iutbayonne.univ-pau.fr',8);
INSERT INTO Personnel (roles, nom, prenom, adresse, ville, codePostal, telephone, adresseMail) VALUES ('Gestionnaire','KERSTEN','Amaia','34 rue Port Neuf','Bayonne','64100','0609090909','amaia.kersten@iutbayonne.univ-pau.fr');

INSERT INTO Entreprise (numSIRET, raisonSociale, typeEtablissement, adresseEntreprise, villeEntreprise, codePostalEntreprise, paysEntreprise, telephoneEntreprise, codeAPE_NAF) VALUES ('21640260200017','Commune d Hendaye','SAS','Place de la République','Hendaye','64700','France','0559482323','84.11Z');
INSERT INTO Entreprise (numSIRET, raisonSociale, typeEtablissement, adresseEntreprise, villeEntreprise, codePostalEntreprise, paysEntreprise, telephoneEntreprise, codeAPE_NAF) VALUES ('38428263800103','Izarralde','SAS','45 allée Théodore Monod','Bidart','64210','France','0559010203','64.30Z');
INSERT INTO Entreprise (numSIRET, raisonSociale, typeEtablissement, adresseEntreprise, villeEntreprise, codePostalEntreprise, paysEntreprise, telephoneEntreprise, codeAPE_NAF) VALUES ('89294533800028','Contractant Genral Ingieneries (CGI)','SAS','1bis rue Mazagran','Biarritz','64200','France','0559090807','43.99C');

INSERT INTO TuteurEntreprise (nom, prenom, telephone, email, fonction, idEntreprise) VALUES ('PIQUEREY','Philippe','0559482323','ppiquerey@hendaye.fr','Directeur du Système d Informations',1);
INSERT INTO TuteurEntreprise (nom, prenom, telephone, email, fonction, idEntreprise) VALUES ('JEAN','Jacques','0559123456','jean.jacques@cgi.fr','Manager',3);

INSERT INTO Etudiant (idUPPA, nomEtudiant, prenomEtudiant, adresseEtudiant, villeEtudiant, codePostalEtudiant, adresseMailEtudiant, telephoneEtudiant, idParcours, idDepartement, idEntreprise, idTuteur) VALUES ('583303','GOUMEAUX','Gauthier','52 rue de Hirigogne','Anglet','64600','ggoumeaux001@iutbayonne.univ-pau.fr','0647906555',1,1,1,1);