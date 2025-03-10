import { Injectable } from '@angular/core';
import { TD } from '../models/td.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TDService {
    private readonly mockTD: TD[] = [
        {
            idTD: 1,
            libelle: 'TD 1'
        },
        {
            idTD: 2,
            libelle: 'TD 2'
        },
        {
            idTD: 3,
            libelle: 'TD 3'
        }
    ];

    constructor(private http: HttpClient) {}

    getTDs(fields?: string[]): Observable<TD[]> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<TD[]>('http://localhost:8000/api/tds', {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockTD);
    }

    getTDById(TDId: number, fields?: string[]): Observable<TD | undefined> {
        let params = new HttpParams();

        if (fields && fields.length > 0) {
        params = params.set('fields', fields.join(','));
        }

        /*
        return this.http.get<TD>(`http://localhost:8000/api/tds/${TDId}`, {params}).pipe(
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, null))
        );
        */
        return of(this.mockTD.find(td => td.idTD === TDId));
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