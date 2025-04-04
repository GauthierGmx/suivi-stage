import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { InternshipSearch } from '../models/internship-search.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipSearchService {
  apiUrl = environment.apiUrl;
  private searchDeletedSubject = new Subject<void>();
  searchDeleted$ = this.searchDeletedSubject.asObservable();

  constructor(private http: HttpClient) {}

  //Sélection de toutes les recherches de stages
  getSearches(fields?: string[]): Observable<InternshipSearch[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<InternshipSearch[]>(`${this.apiUrl}/api/recherches-stages`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Sélection de la recherche de stage correspondant à l'identifiant passé en paramètre
  getSearchById(idSearch: number, fields?: string[]): Observable<InternshipSearch | undefined> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<InternshipSearch>(`${this.apiUrl}/api/recherches-stages/${idSearch}`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Sélection des recherches de stages d'un étudiant dont l'identifiant est passé en paramètre
  getSearchesByStudentId(studentId: string, fields?: string[]): Observable<InternshipSearch[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<InternshipSearch[]>(`${this.apiUrl}/api/etudiants/${studentId}/recherches-stages`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Ajout d'une recherche de stage
  addSearch(search: InternshipSearch): Observable<InternshipSearch> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };


    return this.http.post<InternshipSearch>(`${this.apiUrl}/api/recherches-stages/create`, search, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  //Mise à jour d'une recherche de stage
  updateSearch(search: InternshipSearch): Observable<null> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.put(`${this.apiUrl}/api/recherches-stages/update/${search.idRecherche}`, search, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  //Supression d'une recherche de stage
  deleteSearch(search: InternshipSearch): Observable<null> {
    return this.http.delete(`${this.apiUrl}/api/recherches-stages/delete/${search.idRecherche}`).pipe(
      tap(() => this.searchDeletedSubject.next()),
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