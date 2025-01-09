import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <!-- Logo et liens de navigation au centre -->
          <div class="flex-1 flex justify-center">
            <div class="flex space-x-8">
              @if (currentUser) {
                <a 
                  routerLink="/dashboard" 
                  class="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Tableau de bord
                </a>
                <a 
                  routerLink="/internships" 
                  class="text-gray-700 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Stages
                </a>
              }
            </div>
          </div>

          <!-- Avatar et menu de profil -->
          @if (currentUser) {
            <div class="flex items-center">
              <div class="relative">
                <button 
                  (click)="toggleProfileMenu()"
                  class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ getInitials(currentUser) }}
                </button>

                @if (showProfileMenu) {
                  <div 
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1"
                    role="menu"
                  >
                    <div class="px-4 py-2 text-sm text-gray-700 border-b">
                      {{ currentUser.firstName }} {{ currentUser.lastName }}
                    </div>
                    <button
                      (click)="logout()"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Se déconnecter
                    </button>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showProfileMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  getInitials(user: User): string {
    return `${user.firstName[0]}${user.lastName[0]}`;
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  logout() {
    this.showProfileMenu = false;
    this.authService.logout();
  }
} 