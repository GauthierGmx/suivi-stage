import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Staff } from '../models/staff.model';
import { Student } from '../models/student.model';
import { StudentService } from './student.service';
import { StaffService } from './staff.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: Student | Staff;;

  constructor(
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  login(email: string, password: string) {
    // Pour le test, on accepte n'importe quel mot de passe
    this.currentUser = this.staffService.getStaffs().find(s =>
      s.adresseMail === email
    );

    if (!this.currentUser) {
      this.currentUser = this.studentService.getStudents().find(s =>
        s.adresseMailEtudiant === email
      );
    }
    
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (this.currentUser) {
      return true;
    }
    return false;
  }

  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }
    return undefined;
  }
}