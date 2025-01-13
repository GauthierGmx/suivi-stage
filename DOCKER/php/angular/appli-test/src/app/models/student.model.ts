export interface Student {
  idEtudiant: number;
  idUPPA: string;
  nomEtudiant: string;
  prenomEtudiant: string;
  adresseEtudiant: string;
  villeEtudiant: string;
  codePostalEtudiant: string;
  telephoneEtudiant: string;
  adresseMailEtudiant: string;
  idParcours: number;
  idDepartement: number;
  idEntreprise: number | null;
  idTuteur: number | null;
}

// Types supplémentaires liés aux étudiants si nécessaire
export interface StudentStats {
  id: number;
  studentName: string;
  searchCount: number;
  lastUpdate: Date;
  bestStatus: string;
}

export interface StudentDashboardStats {
  searchCount: number;
  pendingContacts: number;
  rejectedInternships: number;
} 