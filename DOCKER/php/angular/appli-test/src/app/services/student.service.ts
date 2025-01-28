import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly mockStudents: Student[] = [
    {
      idUPPA: 'ETU12345',
      nomEtudiant: 'Dupont',
      prenomEtudiant: 'Jean',
      adresseEtudiant: '12 rue des Lilas',
      villeEtudiant: 'Pau',
      codePostalEtudiant: '64000',
      telephoneEtudiant: '0612345678',
      adresseMailEtudiant: 'jean.dupont@etud.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: 'ETU12346',
      nomEtudiant: 'Martin',
      prenomEtudiant: 'Sophie',
      adresseEtudiant: '12 rue des Lilas',
      villeEtudiant: 'Pau',
      codePostalEtudiant: '64000',
      telephoneEtudiant: '0612345678',
      adresseMailEtudiant: 'sophie.martin@etud.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: 'ETU12347',
      nomEtudiant: 'Bernard',
      prenomEtudiant: 'Lucas',
      adresseEtudiant: '12 rue des Lilas',
      villeEtudiant: 'Pau',
      codePostalEtudiant: '64000',
      telephoneEtudiant: '0612345678',
      adresseMailEtudiant: 'lucas.bernard@etud.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    },
    {
      idUPPA: 'ETU12348',
      nomEtudiant: 'Espinasse',
      prenomEtudiant: 'Virgile',
      adresseEtudiant: '17 rue de la paix',
      villeEtudiant: 'Paris',
      codePostalEtudiant: '75000',
      telephoneEtudiant: '0612345678',
      adresseMailEtudiant: 'virgile.espinasse@etud.univ-pau.fr',
      idParcours: 1,
      idDepartement: 1,
      idEntreprise: null,
      idTuteur: null
    }
  ];

  constructor(private http: HttpClient) {}

  getStudents(): Observable<Student[]> {
    return of(this.mockStudents);
  }

  getStudentById(studentId: string): Observable<Student | undefined> {
    return of(this.mockStudents.find(s => s.idUPPA === studentId));
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