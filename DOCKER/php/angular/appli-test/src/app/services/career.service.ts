import { Injectable } from '@angular/core'
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable, catchError, tap, of } from 'rxjs'
import { Career } from '../models/career.model'

@Injectable({
    providedIn: 'root',
})
export class CareerService {
    apiUrl = environment.apiUrl
    constructor(private readonly http: HttpClient) {}

    getCareers(fields?: string[]): Observable<Career[]> {
        let params = new HttpParams()

        if (fields && fields.length > 0) {
            params = params.set('fields', fields.join(','))
        }

        return this.http.get<Career[]>(`${this.apiUrl}/api/parcours`, { params }).pipe(
            tap((response) => this.log(response)),
            catchError((error) => this.handleError(error, null))
        )
    }

    //Log la réponse de l'API
    private log(response: any) {
        console.table(response)
    }

    //Retourne l'erreur en cas de problème avec l'API
    private handleError(error: Error, errorValue: any) {
        console.error(error)
        return of(errorValue)
    }
}
