import { Injectable } from '@angular/core';
import { Staff } from '../models/staff.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

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

  constructor(private http: HttpClient) {}

  getStaffs(): Observable<Staff[]> {
    return of(this.staffs);
  }

  getStaffById(idStaff: number): Observable<Staff | undefined> {
    return of(this.staffs.find(s => s.idPersonnel === idStaff));
  }

  //Log la réponse de l'API
  private log(response: any) {
    console.table(response);
  }

  //Retourne l'erreur en cas de problème avec l'API
  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
}