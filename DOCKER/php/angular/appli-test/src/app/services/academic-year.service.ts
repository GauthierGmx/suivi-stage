import { Injectable } from '@angular/core';
import { AcademicYear } from '../models/academic-year.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
    private readonly mockAcademicYear: AcademicYear[] = [
        {
            idAnneeUniversitaire: 1,
            libelle: '2023-2024'
        },
        {
            idAnneeUniversitaire: 2,
            libelle: '2024-2025'
        }
    ];

    constructor(private http: HttpClient) {}

    getAcademicYears(fields?: string[]): Observable<AcademicYear[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<AcademicYear[]>('http://localhost:8000/api/', {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockAcademicYear);
    }

    getCurrentAcademicYear(fields?: string[]): Observable<AcademicYear | undefined> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let currentAcademicYear;

        if (currentDate.getMonth() < 8) {
            currentAcademicYear = `${currentYear - 1}-${currentYear}`;
        }
        else {
            currentAcademicYear = `${currentYear}-${currentYear + 1}`
        }

        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<AcademicYear>('http://localhost:8000/api/', {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */

        return of(this.mockAcademicYear.find(year => year.libelle === currentAcademicYear));
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