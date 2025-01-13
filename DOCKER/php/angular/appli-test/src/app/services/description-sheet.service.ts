import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DescriptionSheet } from '../models/description-sheet.model';

@Injectable({
  providedIn: 'root'
})
export class DescriptionSheetService {
  // Données de test
  private mockSheets: DescriptionSheet[] = [
    {
      idFicheDescriptive: 1,
      dateCreation: new Date('2024-03-15'),
      contenuDuStage: "Développement d'une application web moderne",
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
      numeroConvention: 'CONV2024-001',
      idTuteur: 1,
      idEtudiant: 101
    },
    {
      idFicheDescriptive: 2,
      dateCreation: new Date('2024-03-10'),
      contenuDuStage: "Analyse de données et intelligence artificielle",
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
      numeroConvention: 'CONV2024-002',
      idTuteur: 2,
      idEtudiant: 101
    },
    {
      idFicheDescriptive: 3,
      dateCreation: new Date('2024-03-01'),
      contenuDuStage: "Développement d'applications mobiles",
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
      numeroConvention: 'CONV2024-003',
      idTuteur: 3,
      idEtudiant: 101
    }
  ];

  constructor() {}

  getSheetsByStudentId(idEtudiant: number): Observable<DescriptionSheet[]> {
    return of(this.mockSheets.filter(sheet => sheet.idEtudiant === idEtudiant));
  }

  addSheet(sheet: Omit<DescriptionSheet, 'idFicheDescriptive'>): Observable<DescriptionSheet> {
    const newSheet: DescriptionSheet = {
      ...sheet,
      idFicheDescriptive: Math.max(...this.mockSheets.map(s => s.idFicheDescriptive)) + 1,
      dateCreation: new Date()
    };
    this.mockSheets.push(newSheet);
    return of(newSheet);
  }

  updateSheet(id: number, sheetData: Partial<DescriptionSheet>): Observable<DescriptionSheet> {
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
} 