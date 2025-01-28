import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Staff } from '../models/staff.model';
import { Student } from '../models/student.model';
import { StudentService } from './student.service';
import { StaffService } from './staff.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  currentUser?: Student | Staff;
  students!: Student[];
  staffs!: Staff[];

  constructor(
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {}

  ngOnInit(): void {
    
    this.studentService.getStudents()
    .subscribe(students => {
      this.students = students
    });

    this.staffService.getStaffs()
    .subscribe(staffs => {
      this.staffs = staffs
    });
  }

  login(email: string, password: string) {
    // Pour le test, on accepte n'importe quel mot de passe
    this.currentUser = this.staffs.find(s =>
      s.adresseMail === email
    );

    if (!this.currentUser) {
      this.currentUser = this.students.find(s =>
        s.adresseMailEtudiant === email
      );
    }
    
    if (this.currentUser) {
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
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