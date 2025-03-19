import { Injectable } from '@angular/core';
import { Student_TrainingYear_AcademicYear } from '../models/student-trainingYear-academicYear.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentTrainingYearAcademicYearService {
    private readonly mockStudentTdAcademicYear: Student_TrainingYear_AcademicYear[] = [
        {
            idUPPA: '610000',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610001',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610459',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610123',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '611082',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '613453',
            idTrainingYear: 2,
            idAcademicYear: 1
        },
        {
            idUPPA: '610000',
            idTrainingYear: 3,
            idAcademicYear: 2
        },
        {
            idUPPA: '610001',
            idTrainingYear: 3,
            idAcademicYear: 2
        },
        {
            idUPPA: '610459',
            idTrainingYear: 3,
            idAcademicYear: 2
        },
        {
            idUPPA: '610123',
            idTrainingYear: 3,
            idAcademicYear: 2
        },
        {
            idUPPA: '611082',
            idTrainingYear: 3,
            idAcademicYear: 2
        },
        {
            idUPPA: '613453',
            idTrainingYear: 3,
            idAcademicYear: 2
        }
    ];

    constructor(private http: HttpClient) {}

    getStudentsTrainingYearsAcademicYears(fields?: string[]): Observable<Student_TrainingYear_AcademicYear[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<Student_TrainingYear_AcademicYear[]>('http://localhost:8000/api/', {params}).pipe(
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