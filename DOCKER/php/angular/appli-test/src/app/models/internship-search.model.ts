export class InternshipSearch {
  idRecherche: number;
  idEntreprise: number;
  idUPPA: string;
  dateCreation: Date;
  dateModification: Date;
  date1erContact: Date;
  typeContact: ContactType;
  nomContact: string;
  prenomContact: string;
  fonctionContact: string;
  telContact: string;
  mailContact: string;
  statut: SearchStatus;
  observations?: string;
  dateRelance?: Date;

  constructor(
    idRecherche: number,
    idEntreprise: number,
    idUPPA: string,
    dateCreation: Date,
    dateModification: Date,
    date1erContact: Date,
    typeContact: ContactType,
    nomContact: string,
    prenomContact: string,
    fonctionContact: string,
    telContact: string,
    mailContact: string,
    statut: SearchStatus,
    observations?: string,
    dateRelance?: Date
  ) {
    this.idRecherche = idRecherche;
    this.idEntreprise = idEntreprise;
    this.idUPPA = idUPPA;
    this.dateCreation = dateCreation;
    this.dateModification = dateModification;
    this.date1erContact = date1erContact;
    this.typeContact = typeContact;
    this.nomContact = nomContact;
    this.prenomContact = prenomContact;
    this.fonctionContact = fonctionContact;
    this.telContact = telContact;
    this.mailContact = mailContact;
    this.statut = statut;
    this.observations = observations;
    this.dateRelance = dateRelance;
  }
}

export type ContactType = 'Courrier' | 'Mail' | 'Présentiel' | 'Téléphone' | 'Site de recrutement';
export type SearchStatus = 'Refusé' | 'En attente' | 'Relancé' | 'Validé';