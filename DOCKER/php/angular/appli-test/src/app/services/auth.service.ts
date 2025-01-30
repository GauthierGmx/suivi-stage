import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { StudentService } from './student.service';
import { StaffService } from './staff.service';
import { Student } from '../models/student.model';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser?: Student | Staff;
  private students: Student[] = [];
  private staffs: Staff[] = [];
  private isInitialized = false;

  constructor(
    private readonly router: Router,
    private readonly studentService: StudentService,
    private readonly staffService: StaffService
  ) {
    // Initialiser les données au démarrage du service
    this.initializeData();
  }

  private async initializeData() {
    // Charger les données de manière synchrone
    const [students, staffs] = await Promise.all([
      firstValueFrom(this.studentService.getStudents()),
      firstValueFrom(this.staffService.getStaffs())
    ]);

    this.students = students || [];
    this.staffs = staffs || [];
    this.isInitialized = true;
  }

  async login(email: string, password: string): Promise<boolean> {
    // Attendre que les données soient chargées
    if (!this.isInitialized) {
      await this.initializeData();
    }

    // Rechercher d'abord dans le personnel
    this.currentUser = this.staffs.find(s => s.adresseMail === email);

    // Si non trouvé, rechercher dans les étudiants
    if (!this.currentUser) {
      this.currentUser = this.students.find(s => s.adresseMailEtudiant === email);
    }
    
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      await this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = undefined;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getCurrentUser(): Student | Staff | undefined {
    return this.currentUser;
  }
}