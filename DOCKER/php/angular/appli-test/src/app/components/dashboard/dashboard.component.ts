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
  template: `
    <div class="container mx-auto py-8">
      <div class="">
        <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
        @if (currentUser) {
          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h2 class="text-xl mb-2">Bienvenue, {{ currentUser.firstName }} {{ currentUser.lastName }}</h2>
              <p class="text-gray-600">Vous êtes connecté en {{ getRoleName(currentUser.role) }}</p>
            </div>
            
            @if (currentUser.role === 'STUDENT') {
              <app-student-dashboard [currentUser]="currentUser" />
            }
            
            @if (currentUser.role === 'INTERNSHIP_MANAGER') {
              <app-manager-dashboard [currentUser]="currentUser" />
            }
          </div>
        }
      </div>
    </div>
  `
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