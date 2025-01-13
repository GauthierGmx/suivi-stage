export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'STUDENT' | 'TEACHER' | 'INTERNSHIP_MANAGER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

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

export interface Teacher extends User {
  department: string;
  specialization: string;
}