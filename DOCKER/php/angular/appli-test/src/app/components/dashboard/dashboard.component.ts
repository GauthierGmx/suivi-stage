import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../models/user.model';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StudentDashboardComponent, ManagerDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  getRoleName(role: UserRole): string {
    const roles: { [key in UserRole]: string } = {
      'SUPERADMIN': 'Super Administrateur',
      'ADMIN': 'Administrateur',
      'STUDENT': 'Étudiant',
      'TEACHER': 'Enseignant',
      'INTERNSHIP_MANAGER': 'Responsable des stages'
    };
    return roles[role] || role;
  }
}