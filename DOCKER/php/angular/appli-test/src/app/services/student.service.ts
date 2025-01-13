import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly mockStudents: Student[] = [
    {
      idEtudiant: 3,
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
      idEtudiant: 4,
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
      idEtudiant: 5,
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
      idEtudiant: 6,
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

  getStudents(): Observable<Student[]> {
    return of(this.mockStudents);
  }

  getStudentById(id: number): Observable<Student | undefined> {
    return of(this.mockStudents.find(student => student.idEtudiant === id));
  }
}