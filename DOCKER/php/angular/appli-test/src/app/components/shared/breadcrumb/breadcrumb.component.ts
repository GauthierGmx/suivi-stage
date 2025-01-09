import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../services/navigation.service';

interface Breadcrumb {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      @for (item of items; track item.label; let last = $last) {
        @if (!last) {
          <a 
            [routerLink]="item.path" 
            class="hover:text-gray-700 cursor-pointer"
          >
            {{ item.label }}
          </a>
          <span class="text-gray-400">/</span>
        } @else {
          <span class="text-gray-700">{{ item.label }}</span>
        }
      }
      @if (showBack) {
        <button 
          (click)="goBack()"
          class="ml-auto text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour
        </button>
      }
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() items: Breadcrumb[] = [];
  @Input() showBack: boolean = true;

  constructor(private navigationService: NavigationService) {}

  goBack() {
    this.navigationService.goBack();
  }
} 