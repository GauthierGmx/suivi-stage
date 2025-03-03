export class InternshipSearch {
  idRecherche: number;
  idEntreprise: number | null;
  idUPPA: string | null;
  dateCreation: Date | null;
  date1erContact: Date | null;
  typeContact: ContactType | null;
  nomContact: string | null;
  prenomContact: string | null;
  fonctionContact: string | null;
  telephoneContact: string | null;
  adresseMailContact: string | null;
  statut: SearchStatus | null;
  dateModification?: Date | null;
  observations?: string | null;
  dateRelance?: Date | null;

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