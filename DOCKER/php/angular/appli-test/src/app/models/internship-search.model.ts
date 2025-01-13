import { Enterprise } from '../services/enterprise.service';

export type ContactType = 'Courrier' | 'Mail' | 'Présentiel' | 'Téléphone' | 'Site de recrutement';
export type SearchStatus = 'Refusé' | 'En attente' | 'Relancé' | 'Validé';

export interface InternshipSearch {
  idRecherche: number;
  dateCreation: Date;
  dateModification: Date;
  date1erContact: Date;
  typeContact: ContactType;
  nomPrenomContact: string;
  fonctionContact: string;
  telContact: string;
  mailContact: string;
  dateRelance?: Date;
  statut: SearchStatus;
  idEtudiant: number;
  idEntreprise: number;
  entreprise?: Enterprise;
  observations?: string;
}

// Pour les formulaires et les mises à jour partielles
export type InternshipSearchFormData = Omit<InternshipSearch, 
  'idRecherche' | 
  'dateCreation' | 
  'dateModification' | 
  'idEntreprise' | 
  'idEtudiant'
>; 