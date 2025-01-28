export class DescriptiveSheet {
  idFicheDescriptive: number;
  dateCreation: Date;
  dateDerniereModification: Date;
  contenuStage: string;
  thematique: string;
  sujet: string;
  fonction: string;
  taches: string;
  competences: string;
  details: string;
  debutStage: Date;
  finStage: Date;
  nbJourParSemaine: number;
  nbHeureParSemaine: number;
  clauseConfidentialite: Boolean;
  statut: SheetStatus;
  personnelTechnique: Boolean;
  materielPrete: Boolean;
  idEntreprise: number;
  idTuteur: number;
  idUPPA: string;
  numeroConvention?: string;
  interruptionStage?: Boolean;
  dateDebutInterruption?: Date;
  dateFinInterruption?: Date;

  constructor(
    idFicheDescriptive: number,
    dateCreation: Date,
    dateDerniereModification: Date,
    contenuStage: string,
    thematique: string,
    sujet: string,
    fonction: string,
    taches: string,
    competences: string,
    details: string,
    debutStage: Date,
    finStage: Date,
    nbJourParSemaine: number,
    nbHeureParSemaine: number,
    clauseConfidentialite: Boolean,
    statut: SheetStatus,
    personnelTechnique: Boolean,
    materielPrete: Boolean,
    idEntreprise: number,
    idTuteur: number,
    idUPPA: string,
    numeroConvention?: string,
    interruptionStage?: Boolean,
    dateDebutInterruption?: Date,
    dateFinInterruption?: Date
  ) {
    this.idFicheDescriptive = idFicheDescriptive;
    this.dateCreation = dateCreation;
    this.dateDerniereModification = dateDerniereModification;
    this.contenuStage = contenuStage;
    this.thematique = thematique;
    this.sujet = sujet;
    this.fonction = fonction;
    this.taches = taches;
    this.competences = competences;
    this.details = details;
    this.debutStage = debutStage;
    this.finStage = finStage;
    this.nbJourParSemaine = nbJourParSemaine;
    this.nbHeureParSemaine = nbHeureParSemaine;
    this.clauseConfidentialite = clauseConfidentialite;
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
  }
}

export type SheetStatus = 'BROUILLON' | 'EN_REVISION' | 'VALIDE' | 'REFUSE'; 