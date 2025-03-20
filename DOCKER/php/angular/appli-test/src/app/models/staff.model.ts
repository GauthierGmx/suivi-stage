//ATTENTION
//Champ role implenté de manière à ne pouvoir attribuer qu'un seul role à un personnel en attendant
//d'implémenter la classe d'entité Role et la classe d'association Posseder_Role
export class Staff {
  idPersonnel: number;
  role: StaffRole | null;
  nom: string | null;
  prenom: string | null;
  adresse: string | null;
  ville: string | null;
  codePostal: string | null;
  telephone: string | null;
  adresseMail: string | null;
  longitudeAdresse: string | null;
  latitudeAdresse: string | null;
  quotaEtudiant: number | null;

  constructor(
    idPersonnel: number,
    role: StaffRole,
    nom: string,
    prenom: string,
    adresse: string,
    ville: string,
    codePostal: string,
    telephone: string,
    adresseMail: string,
    longitudeAdresse: string,
    latitudeAdresse: string,
    quotaEtudiant: number
  ) {
    this.idPersonnel = idPersonnel;
    this.role = role;
    this.nom = nom;
    this.prenom = prenom;
    this.adresse = adresse;
    this.ville = ville;
    this.codePostal = codePostal;
    this.telephone = telephone;
    this.adresseMail = adresseMail;
    this.longitudeAdresse = longitudeAdresse;
    this.latitudeAdresse = latitudeAdresse;
    this.quotaEtudiant = quotaEtudiant;
  }
}

export type StaffRole = 'SUPERADMIN' | 'ADMIN' | 'STUDENT' | 'Enseignant' | 'INTERNSHIP_MANAGER' | 'MANAGER';