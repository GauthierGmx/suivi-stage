export class Factsheets {
  idFicheDescriptive: number;
  dateCreation: Date | null;
  dateDerniereModification: Date | null;
  contenuStage: string | null;
  thematique: string | null;
  sujet: string | null;
  fonctions: string | null;
  taches: string | null;
  competences: string | null;
  details: string | null;
  debutStage: Date | null;
  finStage: Date | null;
  nbJourParSemaine: number | null;
  nbHeureParSemaine: number | null;
  clauseConfidentialite: boolean | null;
  adresseMailStage: string | null;
  telephoneStage: string | null;
  adresseStage: string | null;
  codePostalStage: string | null;
  villeStage: string | null;
  paysStage: string | null;
  longitudeStage: string | null;
  latitudeStage: string | null;
  statut: SheetStatus | null;
  personnelTechnique: boolean | null;
  materielPrete: string | null;
  idEntreprise: number | null;
  idTuteur: number | null;
  idUPPA: string | null;
  numeroConvention?: string | null;
  interruptionStage?: boolean | null;
  dateDebutInterruption?: Date | null;
  dateFinInterruption?: Date | null;
  serviceEntreprise?: string | null;

  constructor(
    idFicheDescriptive: number,
    dateCreation: Date,
    dateDerniereModification: Date,
    contenuStage: string,
    thematique: string,
    sujet: string,
    fonctions: string,
    taches: string,
    competences: string,
    details: string,
    debutStage: Date,
    finStage: Date,
    nbJourParSemaine: number,
    nbHeureParSemaine: number,
    clauseConfidentialite: boolean,
    adresseMailStage: string,
    telephoneStage: string,
    adresseStage: string,
    codePostalStage: string,
    villeStage: string,
    paysStage: string,
    longitudeStage: string,
    latitudeStage: string,
    statut: SheetStatus,
    personnelTechnique: boolean,
    materielPrete: string,
    idEntreprise: number,
    idTuteur: number,
    idUPPA: string,
    numeroConvention?: string,
    interruptionStage?: boolean,
    dateDebutInterruption?: Date,
    dateFinInterruption?: Date,
    serviceEntreprise?: string
  ) {
    this.idFicheDescriptive = idFicheDescriptive;
    this.dateCreation = dateCreation;
    this.dateDerniereModification = dateDerniereModification;
    this.contenuStage = contenuStage;
    this.thematique = thematique;
    this.sujet = sujet;
    this.fonctions = fonctions;
    this.taches = taches;
    this.competences = competences;
    this.details = details;
    this.debutStage = debutStage;
    this.finStage = finStage;
    this.nbJourParSemaine = nbJourParSemaine;
    this.nbHeureParSemaine = nbHeureParSemaine;
    this.clauseConfidentialite = clauseConfidentialite;
    this.adresseMailStage = adresseMailStage;
    this.telephoneStage = telephoneStage;
    this.adresseStage = adresseStage;
    this.codePostalStage = codePostalStage;
    this.villeStage = villeStage;
    this.paysStage = paysStage;
    this.longitudeStage = longitudeStage;
    this.latitudeStage = latitudeStage;
    this.statut = statut;
    this.personnelTechnique = personnelTechnique;
    this.materielPrete = materielPrete;
    this.idEntreprise = idEntreprise;
    this.idTuteur = idTuteur;
    this.idUPPA = idUPPA;
    this.numeroConvention = numeroConvention;
    this.interruptionStage = interruptionStage;
    this.dateDebutInterruption = dateDebutInterruption;
    this.dateFinInterruption = dateFinInterruption;
    this.serviceEntreprise = serviceEntreprise;
  }
}

export type SheetStatus = 'En cours' | 'Validee' | 'Refusée' ; 