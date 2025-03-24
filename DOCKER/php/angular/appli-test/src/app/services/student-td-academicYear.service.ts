import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Student_TD_AcademicYear } from '../models/student-td-academicYear.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentTdAcademicYearService {
    apiUrl = environment.apiUrl;
    private readonly mockStudentTdAcademicYear: Student_TD_AcademicYear[] = [
        {
            idUPPA: '610123',
            idTD: 1,
            idAcademicYear: 1
        },
        {
            idUPPA: '610123',
            idTD: 1,
            idAcademicYear: 2
        },
        {
            idUPPA: '610000',
            idTD: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610000',
            idTD: 2,
            idAcademicYear: 2
        },
        {
            idUPPA: '610001',
            idTD: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610001',
            idTD: 2,
            idAcademicYear: 2
        },
        {
            idUPPA: '610459',
            idTD: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610459',
            idTD: 2,
            idAcademicYear: 2
        },
        {
            idUPPA: '611082',
            idTD: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '611082',
            idTD: 2,
            idAcademicYear: 2
        },
        {
            idUPPA: '613453',
            idTD: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '613453',
            idTD: 2,
            idAcademicYear: 2
        }
    ];

    constructor(private http: HttpClient) {}

    getStudentsTDsAcademicYears(fields?: string[]): Observable<Student_TD_AcademicYear[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<Student_TD_AcademicYear[]>(`${this.apiUrl}/api/`, {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockStudentTdAcademicYear);
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