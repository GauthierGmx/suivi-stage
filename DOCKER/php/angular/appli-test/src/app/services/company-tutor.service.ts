import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CompanyTutor } from '../models/company-tutor.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyTutorService {
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getCompanyTutors(fields?: string[]): Observable<CompanyTutor[]> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
    }

    return this.http.get<CompanyTutor[]>(`${this.apiUrl}/api/tuteur-entreprise`, {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, []))
    );
    }

    getCompanyTutorById(idCompanyTutor: number, fields?: string[]): Observable<CompanyTutor | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
    }

    return this.http.get<CompanyTutor>(`${this.apiUrl}/api/tuteur-entreprise/${idCompanyTutor}`, {params}).pipe(
        tap(response => this.log(response)),
        catchError((error) => this.handleError(error, undefined))
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