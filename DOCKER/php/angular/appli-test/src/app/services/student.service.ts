import { Injectable } from '@angular/core';
import { Student } from '../models/student.model';

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

  getStudents(): Student[] {
    return this.mockStudents;
  }

  getStudentById(id: string) {
    return this.mockStudents.find(s => s.idUPPA === id);
  }
}