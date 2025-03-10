export class Student {
  idUPPA: string;
  nom: string | null;
  prenom: string | null;
  adresse: string | null;
  ville: string | null;
  codePostal: string | null;
  telephone: string | null;
  adresseMail: string | null;
  idParcours: number | null;
  idDepartement: number | null;
  idEntreprise: number | null;
  idTuteur: number | null;

  constructor(
    idUPPA: string,
    nom: string,
    prenom: string,
    adresse: string | null,
    ville: string | null,
    codePostal: string | null,
    telephone: string | null,
    adresseMail: string | null,
    idParcours: number | null,
    idDepartement: number | null,
    idEntreprise: number | null,
    idTuteur: number | null
  ) {
    this.idUPPA = idUPPA;
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
    this.ville = ville;
    this.codePostal = codePostal;
    this.telephone = telephone;
    this.adresseMail = adresseMail;
    this.idParcours = idParcours;
    this.idDepartement = idDepartement;
    this.idEntreprise = idEntreprise;
    this.idTuteur = idTuteur;
  }
}