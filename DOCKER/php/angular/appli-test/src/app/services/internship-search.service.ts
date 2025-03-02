import { Injectable } from '@angular/core';
import { InternshipSearch } from '../models/internship-search.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipSearchService {

  constructor(private http: HttpClient) {}

  //Sélection de toutes les recherches de stages
  getSearches(): Observable<InternshipSearch[]> {
    return this.http.get<InternshipSearch[]>('http://localhost:8000/api/recherches-stages').pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Sélection de la recherche de stage correspondant à l'identifiant passé en paramètre
  getSearchById(idSearch: number): Observable<InternshipSearch | undefined> {
    return this.http.get<InternshipSearch>(`http://localhost:8000/api/recherches-stages/${idSearch}`).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Sélection des recherches de stages d'un étudiant dont l'identifiant est passé en paramètre
  getSearchesByStudentId(studentId: string): Observable<InternshipSearch[]> {
    return this.http.get<InternshipSearch[]>(`http://localhost:8000/api/etudiants/${studentId}/recherches-stages`).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  //Ajout d'une recherche de stage
  addSearch(search: InternshipSearch): Observable<InternshipSearch> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    console.log(search);

    return this.http.post<InternshipSearch>('http://localhost:8000/api/recherches-stages/create', search, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  //Mise à jour d'une recherche de stage
  updateSearch(search: InternshipSearch): Observable<null> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.put(`http://localhost:8000/api/recherches-stages/update/${search.idRecherche}`, search, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  //Supression d'une recherche de stage
  deleteSearch(search: InternshipSearch): Observable<null> {
    return this.http.delete(`http://localhost:8000/api/recherches-stages/delete/${search.idRecherche}`).pipe(
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


