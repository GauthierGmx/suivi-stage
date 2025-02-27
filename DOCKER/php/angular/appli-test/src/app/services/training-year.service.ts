import { Injectable } from '@angular/core';
import { TrainingYear } from '../models/training-year.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingYearService {
    private readonly mockTrainingYear: TrainingYear[] = [
        {
            idAnneeFormation: 1,
            libelle: 'BUT 1'
        },
        {
            idAnneeFormation: 2,
            libelle: 'BUT 2'
        },
        {
            idAnneeFormation: 3,
            libelle: 'BUT 3'
        }
    ];

    constructor(private http: HttpClient) {}

    getTrainingYears(fields?: string[]): Observable<TrainingYear[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<TrainingYear[]>('http://localhost:8000/api/', {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockTrainingYear);
    }

    getTrainingYearById(TrainingYearId: number, fields?: string[]): Observable<TrainingYear | undefined> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<TrainingYear>(`http://localhost:8000/api/tds/${TDId}`, {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockTrainingYear.find(td => td.idAnneeFormation === TrainingYearId));
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