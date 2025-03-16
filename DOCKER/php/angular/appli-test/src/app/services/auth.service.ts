import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Student } from '../models/student.model';
import { Staff } from '../models/staff.model';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: Student | Staff;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  getAuthenticatedUser(): Observable<Student | Staff | undefined> {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser && savedUser != "undefined") {
      this.currentUser = JSON.parse(savedUser);
      return of(this.currentUser);
    }
    else {
      return this.http.get<Student | Staff>('http://localhost:8000/api/authenticated-user', { withCredentials: true }).pipe(
        tap(response => sessionStorage.setItem('currentUser', JSON.stringify(response))),
        tap(response => this.log(response)),
        catchError(error => this.handleError(error, []))
      );
    }
  }  

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser && savedUser != "undefined") {
      return true;
    }
    return false;
  }

  isStudent(user: Student | Staff | undefined): user is Student {
    return !!user && 'idUPPA' in user;
  }

  isStaff(user: Student | Staff | undefined): user is Staff {
    return !!user && 'idPersonnel' in user;
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