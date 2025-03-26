import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Student_Staff_AcademicYear } from '../models/student-staff-academicYear.model';
import { catchError, Observable, of, tap } from 'rxjs';

interface ExcelResponse {
    message: string;
    fileName: string;
    fileContent: string;
    mimeType: string;
}

@Injectable({
    providedIn: 'root'
})
export class StudentStaffAcademicYearService {
  apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getTutorByUppaAndYear(studentId: string, idAnneeUniversitaire: number, fields?: string[]): Observable<Student_Staff_AcademicYear | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Student_Staff_AcademicYear>(`${this.apiUrl}/api/affectation/${studentId}-${idAnneeUniversitaire}`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  addStudentTeacherAssignments(affectation: Student_Staff_AcademicYear): Observable<Student_Staff_AcademicYear> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.post<Student_Staff_AcademicYear>(`http://localhost:8000/api/affectation/create`, affectation, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  updateStudentTeacherAssignments(affectation: Student_Staff_AcademicYear): Observable<Student_Staff_AcademicYear> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    return this.http.put<Student_Staff_AcademicYear>(`http://localhost:8000/api/affectation/update/${affectation.idPersonnel}-${affectation.idUPPA}-${affectation.idAnneeUniversitaire}`, affectation, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  runAlgorithm(idUPPA: string, idFicheDescriptive: number): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/run-algo/${idUPPA}-${idFicheDescriptive}`);
  }

  extractStudentTeacherAssignments(): Observable<ExcelResponse> {
      return this.http.get<ExcelResponse>(`${this.apiUrl}/api/affectation/extraction-affectations-etudiants-enseignants`).pipe(
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