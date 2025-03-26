import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Factsheets } from '../models/description-sheet.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FactsheetsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSheets(fields?: string[]): Observable<Factsheets[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Factsheets[]>(`${this.apiUrl}/api/fiche-descriptive`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  //Sélection de la fiche descriptive correspondant à celle dont l'id est passé en paramètre
  getSheetById(idFicheDescriptive: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.get<any>(
      `${this.apiUrl}/api/fiche-descriptive/${idFicheDescriptive}`,
      httpOptions
    ).pipe(
      tap(response => this.log(response)),
      catchError(error => {
        console.error('Erreur lors de la récupération de la fiche:', error);
        throw error;
      })
    );
  }

  getSheetsByStudentId(studentId: string, fields?: string[]): Observable<Factsheets[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    
    return this.http.get<Factsheets[]>(`${this.apiUrl}/api/etudiants/${studentId}/fiches-descriptives`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  addSheet(data: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.post<any>(`${this.apiUrl}/api/fiche-descriptive/create`, data, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  updateSheet(idFicheDescriptive: number, sheet: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.put<any>(`${this.apiUrl}/api/fiche-descriptive/update/${idFicheDescriptive}`, sheet, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  deleteSheet(sheet: Factsheets): Observable<void> {
    return this.http.delete(`${this.apiUrl}/api/fiche-descriptive/delete/${sheet.idFicheDescriptive}`).pipe(
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