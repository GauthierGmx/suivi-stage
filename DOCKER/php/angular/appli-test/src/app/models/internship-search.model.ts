export class InternshipSearch {
  idRecherche: number;
  idEntreprise: number;
  idUPPA: string;
  dateCreation: Date;
  date1erContact: Date;
  typeContact: ContactType;
  nomContact: string;
  prenomContact: string;
  fonctionContact: string;
  telephoneContact: string;
  adresseMailContact: string;
  statut: SearchStatus;
  dateModification?: Date;
  observations?: string;
  dateRelance?: Date;

  constructor(
    idRecherche: number = 0,
    idEntreprise: number = 0,
    idUPPA: string = '',
    dateCreation: Date = new Date(),
    dateModification: Date = new Date(),
    date1erContact: Date = new Date(),
    typeContact: ContactType = 'Mail',
    nomContact: string = '',
    prenomContact: string = '',
    fonctionContact: string = '',
    telephoneContact: string = '',
    adresseMailContact: string = '',
    statut: SearchStatus = 'En cours',
    observations?: string,
    dateRelance?: Date
  ) {
    this.idRecherche = idRecherche;
    this.idEntreprise = idEntreprise;
    this.idUPPA = idUPPA;
    this.dateCreation = dateCreation;
    this.date1erContact = date1erContact;
    this.typeContact = typeContact;
    this.nomContact = nomContact;
    this.prenomContact = prenomContact;
    this.fonctionContact = fonctionContact;
    this.telephoneContact = telephoneContact;
    this.adresseMailContact = adresseMailContact;
    this.statut = statut;
    this.dateModification = dateModification;
    this.observations = observations;
    this.dateRelance = dateRelance;
  }
}

export type ContactType = 'Courrier' | 'Mail' | 'Présentiel' | 'Téléphone' | 'Site de recrutement';
export type SearchStatus = 'Refusé' | 'En cours' | 'Relancé' | 'Validé';