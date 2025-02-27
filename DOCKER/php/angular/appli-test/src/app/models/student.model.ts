export class Student {
  idUPPA: string;
  nom: string | null;
  prenom: string | null;
  adresseEtudiant: string | null;
  villeEtudiant: string | null;
  codePostalEtudiant: string | null;
  telephoneEtudiant: string | null;
  adresseMailEtudiant: string | null;
  idParcours: number | null;
  idDepartement: number | null;
  idEntreprise: number | null;
  idTuteur: number | null;

  constructor(
    idUPPA: string,
    nomEtudiant: string,
    prenomEtudiant: string,
    adresseEtudidant: string | null,
    villeEtudiant: string | null,
    codePostalEtudiant: string | null,
    telephoneEtudiant: string | null,
    adresseMailEtudiant: string | null,
    idParcours: number | null,
    idDepartement: number | null,
    idEntreprise: number | null,
    idTuteur: number | null
  ) {
    this.idUPPA = idUPPA;
    this.nom = nomEtudiant;
    this.prenom = prenomEtudiant;
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