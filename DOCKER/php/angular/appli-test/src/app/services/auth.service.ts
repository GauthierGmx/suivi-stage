import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Student } from '../models/student.model';
import { Staff } from '../models/staff.model';
import { StudentService } from './student.service';
import { StaffService } from './staff.service';
import { BehaviorSubject, catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserSubject = new BehaviorSubject<Student | Staff | undefined>(undefined);
  currentUser$ = this.currentUserSubject.asObservable();
  currentUser: Student | Staff | undefined;
  students: Student[] = [];
  staffs: Staff[] = [];

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {}

  async initializeData() {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser && savedUser != "undefined") {
      this.currentUserSubject.next(JSON.parse(savedUser));
    } else {
      const [students, staffs] = await Promise.all([
        firstValueFrom(this.studentService.getStudents(['idUPPA', 'adresseMail'])),
        firstValueFrom(this.staffService.getStaffs())
      ]);

      this.students = students || [];
      this.staffs = staffs || [];
    }
  }
  
  async login(email: string): Promise<boolean> {
    let user: Student | Staff | undefined = this.students.find(s => s.adresseMail === email) || this.staffs.find(s => s.adresseMail === email);

    if (!user) {
      return false;
    }

    try {
      if (this.isStudent(user)) {
        this.currentUser = await firstValueFrom(this.studentService.getStudentById(user.idUPPA));
      }
      else if (this.isStaff(user)) {
        this.currentUser = await firstValueFrom(this.staffService.getStaffById(user.idPersonnel));
      }
      
      this.currentUserSubject.next(this.currentUser);
      sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  
      this.router.navigate(['/dashboard']);
      return true;
    }
    catch (error) {
      return false;
    }
  }    

  logout(): void {
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean }>('http://localhost:8000/api/check-auth').pipe(
      map(response => response.authenticated),
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null)),
      catchError(() => of(false))
    );
  }

  getCurrentUser(): Student | Staff | undefined {
    return this.currentUserSubject.value;
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