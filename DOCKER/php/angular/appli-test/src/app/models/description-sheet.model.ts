export class Factsheets {
  idFicheDescriptive: number;
  dateCreation: Date | null;
  dateDerniereModification: Date | null;
  contenuStage: string | null;
  thematique: string | null;
  sujet: string | null;
  fonction: string | null;
  taches: string | null;
  competences: string | null;
  details: string | null;
  debutStage: Date | null;
  finStage: Date | null;
  nbJourParSemaine: number | null;
  nbHeureParSemaine: number | null;
  clauseConfidentialite: Boolean | null;
  statut: SheetStatus | null;
  personnelTechnique: Boolean | null;
  materielPrete: Boolean | null;
  idEntreprise: number | null;
  idTuteur: number | null;
  idUPPA: string | null;
  numeroConvention?: string | null;
  interruptionStage?: Boolean | null;
  dateDebutInterruption?: Date | null;
  dateFinInterruption?: Date | null;
  serviceEntreprise:String | null;
  adresseMailStage:String | null;
  telephoneStage:String | null;
  adresseStage: String | null;
  codePostalStage: String | null;
  villeStage: String | null;
  paysStage: String | null;

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
    adresseMailStage:String,
    adresseStage:String,
    telephoneStage:String,
    serviceEntreprise: String,
    codePostalStage: String,
    villeStage:String,
    paysStage:String,
    numeroConvention?: string,
    interruptionStage?: Boolean,
    dateDebutInterruption?: Date,
    dateFinInterruption?: Date,

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
    this.serviceEntreprise = serviceEntreprise;
    this.adresseMailStage = adresseMailStage;
    this.telephoneStage = telephoneStage;
    this.adresseStage = adresseStage;
    this.codePostalStage = codePostalStage;
    this.villeStage = villeStage;
    this.paysStage = paysStage;
  }
}

export type SheetStatus = 'En cours' | 'Validee' | 'Refusée' ; 