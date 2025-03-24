import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Student } from '../models/student.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStudents(fields?: string[]): Observable<Student[]> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Student[]>(`${this.apiUrl}/api/etudiants`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  getStudentById(studentId: string , fields?: string[]): Observable<Student | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Student>(`${this.apiUrl}/api/etudiants/${studentId}`, {params}).pipe(
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