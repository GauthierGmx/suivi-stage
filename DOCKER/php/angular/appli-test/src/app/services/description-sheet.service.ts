import { Injectable } from '@angular/core';
import { Factsheets, SheetStatus } from '../models/description-sheet.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactsheetsService {
  // Données de test
  private mockSheets: Factsheets[] = [
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
      statut: 'En cours',
      personnelTechnique: true,
      materielPrete: true,
      idEntreprise: 1,
      idTuteur: 1,
      idUPPA: '610123',
      numeroConvention: 'CONV2024-001',
      interruptionStage: false,
      dateDebutInterruption: null,
      dateFinInterruption: null,
      serviceEntreprise: "Département IT",
      adresseMailStage: "contact@entreprise.com",
      telephoneStage: "+33 1 23 45 67 89",
      adresseStage: "12 Rue des InnoTech",
      codePostalStage: "75001",
      villeStage: "Paris",
      paysStage: "France",
    },
  ];

  constructor(private http: HttpClient) {}

  getSheets(fields?: string[]): Observable<Factsheets[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }



    
    return this.http.get<Factsheets[]>('http://localhost:8000/api/fiche-descriptive', {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    
    /*
    return of(this.mockSheets).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */
  }


  //Sélection de la fiche descriptive correspondant à celle dont l'id est passé en paramètre
  getSheetById(idSheet: number, fields?: string[]): Observable<Factsheets | undefined> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Factsheets>(`http://localhost:8000/api/fiche-descriptive/${idSheet}`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  getSheetsByStudentId(studentId: string, fields?: string[]): Observable<Factsheets[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    
    return this.http.get<Factsheets[]>(`http://localhost:8000/api/etudiants/${studentId}/fiches-descriptives`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    
    /*
    return of(this.mockSheets.filter(sheet => sheet.idUPPA === studentId)).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */
    
  }

  getSheetsByStudentIdAndStatus(studentId: string, statut: SheetStatus, fields?: string[]): Observable<Factsheets[]> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    /*
    return this.http.get<Factsheets[]>(`http://localhost:8000/api/`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
    */

    return of(this.mockSheets.filter(s => s.idUPPA === studentId && s.statut === statut)).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  addSheet(sheet: Omit<Factsheets, 'idFicheDescriptive'>): Observable<Factsheets> {
    const newSheet: Factsheets = {
      ...sheet,
      idFicheDescriptive: Math.max(...this.mockSheets.map(s => s.idFicheDescriptive)) + 1,
      dateCreation: new Date()
    };
    this.mockSheets.push(newSheet);
    return of(newSheet);
  }

  updateSheet(id: number, sheetData: Partial<Factsheets>): Observable<Factsheets> {
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

  deleteSheet(sheet: Factsheets): Observable<void> {
    return this.http.delete(`http://localhost:8000/api/fiche-descriptive/delete/${sheet.idFicheDescriptive}`).pipe(
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