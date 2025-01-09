export interface DescriptionSheet {
  idFicheDescriptive: number;
  dateCreation: Date;
  contenuDuStage: string;
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
  clauseConfidentialite: boolean;
  statut: SheetStatus;
  numeroConvention?: string;
  idTuteur?: number;
  idEtudiant: number;
}

export type SheetStatus = 'BROUILLON' | 'EN_REVISION' | 'VALIDE' | 'REFUSE'; 