import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly mockStudents: Student[] = [
    {
      idUPPA: '610000',
      nomEtudiant: 'Montouro',
      prenomEtudiant: 'Maxime',
      adresseEtudiant: null,
      villeEtudiant: null,
      codePostalEtudiant: null,
      telephoneEtudiant: null,
      adresseMailEtudiant: 'mmontour@iutbayonne.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: '610001',
      nomEtudiant: 'Conguisti',
      prenomEtudiant: 'Nicolas',
      adresseEtudiant: null,
      villeEtudiant: null,
      codePostalEtudiant: null,
      telephoneEtudiant: null,
      adresseMailEtudiant: 'nconguisti@iutbayonne.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: '610123',
      nomEtudiant: 'Crussière',
      prenomEtudiant: 'Lucas',
      adresseEtudiant: null,
      villeEtudiant: null,
      codePostalEtudiant: null,
      telephoneEtudiant: null,
      adresseMailEtudiant: 'lcrussiere@iutbayonne.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: '610459',
      nomEtudiant: 'Vernis',
      prenomEtudiant: 'Gabriel',
      adresseEtudiant: null,
      villeEtudiant: null,
      codePostalEtudiant: null,
      telephoneEtudiant: null,
      adresseMailEtudiant: 'gvernis@iutbayonne.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    }
  ];

  private selectedStudent = new BehaviorSubject<Student | null>(null);

  constructor(private http: HttpClient) {}

  getStudents(fields?: string[]): Observable<Student[]> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    /*
    return this.http.get<Student[]>('http://localhost:8000/api/etudiants', {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */
    return of(this.mockStudents);
  }

  getStudentById(studentId: string, fields?: string[]): Observable<Student | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    /*
    return this.http.get(`http://localhost:8000/api/etudiants/${studentId}`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */
    return of(this.mockStudents.find(s => s.idUPPA === studentId));
  }

  // Nouvelles méthodes pour gérer l'étudiant sélectionné
  setSelectedStudent(student: Student) {
    this.selectedStudent.next(student);
  }

  getSelectedStudent(): Observable<Student | null> {
    return this.selectedStudent.asObservable();
  }

  clearSelectedStudent() {
    this.selectedStudent.next(null);
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