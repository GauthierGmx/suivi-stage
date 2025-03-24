import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AcademicYear } from '../models/academic-year.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
    apiUrl = environment.apiUrl;
    currentAcademicYear: AcademicYear = new AcademicYear('');

    constructor(private http: HttpClient) {}

    getAcademicYears(fields?: string[]): Observable<AcademicYear[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        return this.http.get<AcademicYear[]>(`${this.apiUrl}/api/annee-universitaire`, {params}).pipe(
            tap(response => this.log(response)),
            catchError(error => this.handleError(error, null))
        );
    }

    getCurrentAcademicYear(fields?: string[]): Observable<AcademicYear | undefined> {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        if (currentDate.getMonth() < 8) {
            this.currentAcademicYear.libelle = `${currentYear - 1}-${currentYear}`;
        }
        else {
            this.currentAcademicYear.libelle = `${currentYear}-${currentYear + 1}`
        }

        let params = new HttpParams()
            .set('search', this.currentAcademicYear.libelle);

        if (fields && fields.length > 0) {
            params = params.set('fields', fields.join(','));
        }

        return this.http.get<AcademicYear[]>(`${this.apiUrl}/api/annee-universitaire`, {params}).pipe(
            tap(response => this.log(response)),
            switchMap(years => {
                if (years.length === 0) {
                    return this.addAcademicYear(this.currentAcademicYear);
                }
                return of(years[0]);
            }),
            catchError(error => this.handleError(error, undefined))
        );
    }

    addAcademicYear(academicYear: AcademicYear): Observable<AcademicYear> {
        const httpOptions = {
              headers: new HttpHeaders({'Content-type': 'application/json'})
        };
            
        return this.http.post<AcademicYear>(`${this.apiUrl}/api/annee-universitaire/create`, academicYear, httpOptions).pipe(
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