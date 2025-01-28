export class Student {
  idUPPA: string;
  nomEtudiant: string;
  prenomEtudiant: string;
  adresseEtudiant: string;
  villeEtudiant: string;
  codePostalEtudiant: string;
  telephoneEtudiant: string;
  adresseMailEtudiant: string;
  idParcours: number;
  idDepartement: number;
  idEntreprise: number | null;
  idTuteur: number | null;

  constructor(
    idUPPA: string,
    nomEtudiant: string,
    prenomEtudiant: string,
    adresseEtudidant: string,
    villeEtudiant: string,
    codePostalEtudiant: string,
    telephoneEtudiant: string,
    adresseMailEtudiant: string,
    idParcours: number,
    idDepartement: number = 1,
    idEntreprise: number | null,
    idTuteur: number | null
  ) {
    this.idUPPA = idUPPA;
    this.nomEtudiant = nomEtudiant;
    this.prenomEtudiant = prenomEtudiant;
    this.adresseEtudiant = adresseEtudidant;
    this.villeEtudiant = villeEtudiant;
    this.codePostalEtudiant = codePostalEtudiant;
    this.telephoneEtudiant = telephoneEtudiant;
    this.adresseMailEtudiant = adresseMailEtudiant;
    this.idParcours = idParcours;
    this.idDepartement = idDepartement;
    this.idEntreprise = idEntreprise;
    this.idTuteur = idTuteur;
  }
}