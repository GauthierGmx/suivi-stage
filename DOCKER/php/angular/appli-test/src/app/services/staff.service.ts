import { Injectable } from '@angular/core';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  currentUser?: Staff;

  private staffs: Staff[] = [
    {
      idPersonnel: 1,
      role: 'SUPERADMIN',
      nom: 'Admin',
      prenom: 'Super',
      adresse: 'Rue ...',
      ville: 'Ville',
      codePostal: '64000',
      telephone: '0606060606',
      adresseMail: 'superadmin@test.com',
      longitudeAdresse: '',
      latitudeAdresse: '',
      quotaEtudiant: 16
    },
    {
      idPersonnel: 2,
      role: 'ADMIN',
      nom: 'User',
      prenom: 'Admin',
      adresse: 'Rue ...',
      ville: 'Ville',
      codePostal: '64000',
      telephone: '0606060606',
      adresseMail: 'admin@test.com',
      longitudeAdresse: '',
      latitudeAdresse: '',
      quotaEtudiant: 16
    },
    {
      idPersonnel: 6,
      role: 'INTERNSHIP_MANAGER',
      prenom: 'Responsable',
      nom: 'Stages',
      adresse: 'Rue ...',
      ville: 'Ville',
      codePostal: '64000',
      telephone: '0606060606',
      adresseMail: 'responsable@test.com',
      longitudeAdresse: '',
      latitudeAdresse: '',
      quotaEtudiant: 16
      
    },
    {
      idPersonnel: 7,
      role: 'TEACHER',
      prenom: 'Enseignant',
      nom: 'Référent',
      adresse: 'Rue ...',
      ville: 'Ville',
      codePostal: '64000',
      telephone: '0606060606',
      adresseMail: 'enseignant@test.com',
      longitudeAdresse: '',
      latitudeAdresse: '',
      quotaEtudiant: 16
    }
  ];

  getStaffs() {
    return this.staffs;
  }

  getStaffById(id: number) {
    return this.staffs.find(s => s.idPersonnel === id);
  }
}