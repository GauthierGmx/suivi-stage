import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Company } from '../models/company.model';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanies(fields?: string[]): Observable<Company[]> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Company[]>(`${this.apiUrl}/api/entreprises`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, []))
    );
  }

  getCompanyById(idCompany: number, fields?: string[]): Observable<Company | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Company>(`${this.apiUrl}/api/entreprises/${idCompany}`, {params}).pipe(
      tap(response => this.log(response)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  addCompany(enterprise: Company): Observable<Company> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.post<Company>(`${this.apiUrl}/api/entreprises/create`, enterprise, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
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