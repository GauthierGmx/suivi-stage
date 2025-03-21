import { Injectable } from '@angular/core';
import { Staff } from '../models/staff.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      role: 'Enseignant',
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

  getStaffs(fields?: string[]): Observable<Staff[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    /*
    return this.http.get<Student[]>('http://localhost:8000/api/', {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */

    return of(this.staffs);
  }

  getStaffById(idStaff: number, fields?: string[]): Observable<Staff | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    
    return this.http.get<Staff>(`http://localhost:8000/api/personnel/{id}/`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    

    return of(this.staffs.find(s => s.idPersonnel === idStaff));
  }

  getStaff(fields?:Staff[]):Observable<Staff>{
    let params = new HttpParams();
    
        if (fields && fields.length > 0) {
          params = params.set('fields', fields.join(','));
        }
    
        return this.http.get<Staff[]>('http://localhost:8000/api/personnel', {params}).pipe(
          tap(response => this.log(response)),
          catchError(error => this.handleError(error, null))
        );
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