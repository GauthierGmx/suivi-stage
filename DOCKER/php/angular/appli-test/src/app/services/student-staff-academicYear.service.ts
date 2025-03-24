import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { teacherTutorDetails } from '../components/factsheets-details/factsheets-details.component';

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


    updateStudentTeacherAssignments(enterStudentTeacher: teacherTutorDetails): Observable<teacherTutorDetails> {
        const httpOptions = {
          headers: new HttpHeaders({'Content-type': 'application/json'})
        };
    
        return this.http.put<teacherTutorDetails>(`http://localhost:8000/api/affectation/update/${enterStudentTeacher.idPersonnel}-${enterStudentTeacher.idUPPA}-${enterStudentTeacher.idAnneeUniversitaire}`, enterStudentTeacher, httpOptions).pipe(
          tap(response => this.log(response)),
          catchError(error => this.handleError(error, undefined))
        );
    }

    addStudentTeacherAssignments(enterStudentTeacher: teacherTutorDetails): Observable<teacherTutorDetails> {
      const httpOptions = {
        headers: new HttpHeaders({'Content-type': 'application/json'})
      };
  
      return this.http.post<teacherTutorDetails>(`http://localhost:8000/api/affectation/create`, enterStudentTeacher, httpOptions).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, undefined))
      );
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