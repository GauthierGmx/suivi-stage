import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Staff } from '../models/staff.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  apiUrl = environment.apiUrl;
  currentUser?: Staff;

  constructor(private http: HttpClient) {}

  getStaffs(fields?: string[]): Observable<Staff[]> {
    let params = new HttpParams();
    
    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Staff[]>(`${this.apiUrl}/api/personnel`, {params}).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
  }

  getStaffById(idStaff: number, fields?: string[]): Observable<Staff | undefined> {
    let params = new HttpParams();

    if (fields && fields.length > 0) {
      params = params.set('fields', fields.join(','));
    }

    return this.http.get<Staff>(`${this.apiUrl}/api/personnel/${idStaff}`, {params}).pipe(
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