import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>('http://localhost:8000/api/entreprises').pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, []))
    );
  }

  getCompanyById(idCompany: number): Observable<Company | undefined> {
    return this.http.get<Company>(`http://localhost:8000/api/entreprises/${idCompany}`).pipe(
      tap(response => this.log(response)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  addCompany(enterprise: Company): Observable<Company> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.post<Company>('http://localhost:8000/api/entreprises/create', enterprise, httpOptions).pipe(
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