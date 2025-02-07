import { Injectable } from '@angular/core';
import { DescriptiveSheet, SheetStatus } from '../models/description-sheet.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DescriptionSheetService {
  // Données de test
  private mockSheets: DescriptiveSheet[] = [
    {
      idFicheDescriptive: 1,
      dateCreation: new Date('2024-03-15'),
      dateDerniereModification: new Date('2024-03-15'),
      contenuStage: "Développement d'une application web moderne",
      thematique: "Développement Web",
      sujet: "Refonte du système de gestion des stages",
      fonction: "Développeur Full Stack",
      taches: "Développement frontend et backend",
      competences: "Angular, Node.js, TypeScript, MongoDB",
      details: "Participation à toutes les phases du projet, de la conception à la mise en production",
      debutStage: new Date('2024-04-01'),
      finStage: new Date('2024-09-30'),
      nbJourParSemaine: 5,
      nbHeureParSemaine: 35,
      clauseConfidentialite: true,
      statut: 'BROUILLON',
      personnelTechnique: true,
      materielPrete: true,
      idEntreprise: 1,
      idTuteur: 1,
      idUPPA: '101',
      numeroConvention: 'CONV2024-001'
    },
    {
      idFicheDescriptive: 2,
      dateCreation: new Date('2024-03-10'),
      dateDerniereModification: new Date('2024-03-10'),
      contenuStage: "Analyse de données et intelligence artificielle",
      thematique: "Data Science",
      sujet: "Optimisation des processus par IA",
      fonction: "Data Scientist Junior",
      taches: "Analyse de données, développement de modèles ML",
      competences: "Python, TensorFlow, SQL, Data Analysis",
      details: "Mise en place d'algorithmes de machine learning pour l'optimisation des processus",
      debutStage: new Date('2024-05-01'),
      finStage: new Date('2024-10-31'),
      nbJourParSemaine: 4,
      nbHeureParSemaine: 32,
      clauseConfidentialite: true,
      statut: 'VALIDE',
      personnelTechnique: true,
      materielPrete: true,
      idEntreprise: 2,
      idTuteur: 2,
      idUPPA: '101',
      numeroConvention: 'CONV2024-002'
    },
    {
      idFicheDescriptive: 3,
      dateCreation: new Date('2024-03-01'),
      dateDerniereModification: new Date('2024-03-01'),
      contenuStage: "Développement d'applications mobiles",
      thematique: "Mobile Development",
      sujet: "Application mobile de gestion de projet",
      fonction: "Développeur Mobile",
      taches: "Développement iOS et Android",
      competences: "React Native, Swift, Kotlin",
      details: "Création d'une application mobile cross-platform pour la gestion de projet",
      debutStage: new Date('2024-06-01'),
      finStage: new Date('2024-11-30'),
      nbJourParSemaine: 5,
      nbHeureParSemaine: 35,
      clauseConfidentialite: false,
      statut: 'EN_REVISION',
      personnelTechnique: true,
      materielPrete: true,
      idEntreprise: 3,
      idTuteur: 3,
      idUPPA: '101',
      numeroConvention: 'CONV2024-003'
    }
  ];

  constructor(private http: HttpClient) {}

  getSheets(): Observable<DescriptiveSheet[]> {
    return of(this.mockSheets);
  }

  getSheetsByStudentId(studentId: string): Observable<DescriptiveSheet[]> {
    return of(this.mockSheets.filter(sheet => sheet.idUPPA === studentId));
  }

  getSheetsByStudentIdAndStatus(studentId: string, statut: SheetStatus): Observable<DescriptiveSheet[]> {
    return of(this.mockSheets.filter(s => s.idUPPA === studentId && s.statut === statut));
  }

  addSheet(sheet: Omit<DescriptiveSheet, 'idFicheDescriptive'>): Observable<DescriptiveSheet> {
    const newSheet: DescriptiveSheet = {
      ...sheet,
      idFicheDescriptive: Math.max(...this.mockSheets.map(s => s.idFicheDescriptive)) + 1,
      dateCreation: new Date()
    };
    this.mockSheets.push(newSheet);
    return of(newSheet);
  }

  updateSheet(id: number, sheetData: Partial<DescriptiveSheet>): Observable<DescriptiveSheet> {
    const index = this.mockSheets.findIndex(s => s.idFicheDescriptive === id);
    if (index !== -1) {
      this.mockSheets[index] = {
        ...this.mockSheets[index],
        ...sheetData
      };
      return of(this.mockSheets[index]);
    }
    throw new Error('Fiche non trouvée');
  }

  deleteSheet(id: number): Observable<void> {
    const index = this.mockSheets.findIndex(s => s.idFicheDescriptive === id);
    if (index !== -1) {
      this.mockSheets.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Fiche non trouvée');
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