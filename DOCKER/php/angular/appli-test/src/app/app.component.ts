import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Staff } from './models/staff.model';
import { Student } from './models/student.model';
import { HeaderComponent } from './components/layout/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser?: Staff | Student;

  constructor(private readonly authService: AuthService) {}

  getIsAuthenticated(): boolean {
    const elements = document.querySelectorAll('.main-content');
  
    if (this.authService.isAuthenticated()) {
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.marginTop = '65px';
        }
      });
      return true;
    }
    else {
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.style.marginTop = '';
        }
      });
      return false;
    }
  }

  isStudent(user: Student | Staff | undefined): user is Student {
    return !!user && 'idUPPA' in user && 'nomEtudiant' in user && 'prenomEtudiant' in user;
  }
      
  isStaff(user: Student | Staff | undefined): user is Staff {
    return !!user && 'idPersonnel' in user && 'nom' in user && 'prenom' in user && 'role' in user;
  }
}