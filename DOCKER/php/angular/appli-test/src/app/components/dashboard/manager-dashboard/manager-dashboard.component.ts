import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { NavigationService } from '../../../services/navigation.service';
import { SearchStatus } from '../../../models/internship-search.model';
import { StudentService } from '../../../services/student.service';
import { forkJoin } from 'rxjs';

interface StudentInternshipStatus {
  id: number;
  studentName: string;
  searchCount: number;
  lastUpdate: Date;
  bestStatus: SearchStatus;
}

interface ManagerDashboardStats {
  studentsWithValidInternship: number;
  totalStudents: number;
  studentsWithoutSearch: number;
}

interface DetailedManagerDashboardStats extends ManagerDashboardStats {
  studentsInProgress: number;
  totalSearches: number;
  averageSearchesPerStudent: number;
}

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Étudiants avec stage validé</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.studentsWithValidInternship }}</p>
        </div>
        
        <div class="p-4 bg-[#E6F1FD] rounded-lg">
          <h3 class="font-semibold mb-2">Nombre d'étudiants</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.totalStudents }}</p>
        </div>
        
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Étudiants sans recherche</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.studentsWithoutSearch }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b space-y-4">
          <div class="flex gap-4 items-center">
            <div class="relative flex-1">
              <input 
                type="text" 
                [(ngModel)]="searchTerm"
                placeholder="Recherche..." 
                class="w-full px-4 py-2 pr-10 border rounded-lg"
              >
              @if (searchTerm) {
                <button 
                  (click)="searchTerm = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              }
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button 
              class="px-4 py-2 rounded-full border text-sm font-medium transition-colors"
              [class.bg-gray-100]="currentStatusFilter === 'all'"
              (click)="setStatusFilter('all')"
            >
              Tous les statuts
            </button>
            <button 
              class="px-4 py-2 rounded-full border text-sm font-medium transition-colors flex items-center gap-1"
              [class.bg-gray-100]="currentStatusFilter.startsWith('most_recent')"
              (click)="toggleDateSort()"
            >
              Plus récemment modifié
              @if (currentStatusFilter === 'most_recent_asc') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              } @else if (currentStatusFilter === 'most_recent_desc') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              }
            </button>
            <button 
              class="px-4 py-2 rounded-full border text-sm font-medium transition-colors flex items-center gap-1"
              [class.bg-gray-100]="currentStatusFilter.startsWith('least_searches')"
              (click)="toggleSearchesSort()"
            >
              Nombre de recherches
              @if (currentStatusFilter === 'least_searches_asc') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
              } @else if (currentStatusFilter === 'least_searches_desc') {
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              }
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre de recherches</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière modification</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut le plus avancé</th>
                <th class="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase w-[180px]">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (student of getFilteredStudents(); track student.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">{{ student.studentName }}</td>
                  <td class="px-6 py-4">{{ student.searchCount }}</td>
                  <td class="px-6 py-4">{{ student.lastUpdate | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(student.bestStatus)">
                      {{ getStatusLabel(student.bestStatus) }}
                    </span>
                  </td>
                  <td class="px-2 py-4 w-[180px]">
                    <div class="flex gap-2">
                      <button 
                        class="bg-blue-100 text-blue-600 hover:bg-blue-200 p-1.5 rounded-lg flex items-center"
                        (click)="viewStudentDetails(student.id)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span class="ml-1">Détails</span>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ManagerDashboardComponent implements OnInit {
  @Input() currentUser!: User;
  
  stats: DetailedManagerDashboardStats = {
    studentsWithValidInternship: 0,
    totalStudents: 0,
    studentsWithoutSearch: 0,
    studentsInProgress: 0,
    totalSearches: 0,
    averageSearchesPerStudent: 0
  };

  searchTerm: string = '';
  students: StudentInternshipStatus[] = [];
  breadcrumbs = this.navigationService.getBreadcrumbs('Responsable des stages');

  currentStatusFilter: 'all' | 'most_recent_asc' | 'most_recent_desc' | 'least_searches_asc' | 'least_searches_desc' = 'all';

  constructor(
    private readonly internshipSearchService: InternshipSearchService,
    private readonly navigationService: NavigationService,
    private readonly studentService: StudentService
  ) {}

  ngOnInit() {
    this.loadStudentStats();
  }

  private loadStudentStats() {
    forkJoin({
      searchStats: this.internshipSearchService.getStudentSearchStats(),
      students: this.studentService.getStudents()
    }).subscribe(({ searchStats, students }) => {
      this.students = searchStats.map(stat => {
        const student = students.find(s => s.idEtudiant === stat.id);
        return {
          ...stat,
          studentName: student ? `${student.prenomEtudiant} ${student.nomEtudiant}` : 'Inconnu'
        };
      });
      this.updateStats();
    });
  }

  private updateStats() {
    const validatedStudents = this.students.filter(s => s.bestStatus === 'Validé');
    const studentsWithoutSearch = this.students.filter(s => s.searchCount === 0);

    this.stats = {
      ...this.stats,
      studentsWithValidInternship: validatedStudents.length,
      totalStudents: this.students.length,
      studentsWithoutSearch: studentsWithoutSearch.length,
      averageSearchesPerStudent: this.calculateAverageSearches()
    };
  }

  private calculateAverageSearches(): number {
    if (this.students.length === 0) return 0;
    const totalSearches = this.students.reduce((sum, student) => sum + student.searchCount, 0);
    return totalSearches / this.students.length;
  }

  getFilteredStudents() {
    let filtered = [...this.students];

    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(student => {
        return (
          student.studentName.toLowerCase().includes(searchTermLower) ||
          student.searchCount.toString().includes(searchTermLower) ||
          student.lastUpdate.toLocaleDateString().includes(searchTermLower) ||
          this.getStatusLabel(student.bestStatus).toLowerCase().includes(searchTermLower)
        );
      });
    }

    switch (this.currentStatusFilter) {
      case 'most_recent_desc':
        filtered.sort((a, b) => b.lastUpdate.getTime() - a.lastUpdate.getTime());
        break;
      case 'most_recent_asc':
        filtered.sort((a, b) => a.lastUpdate.getTime() - b.lastUpdate.getTime());
        break;
      case 'least_searches_desc':
        filtered.sort((a, b) => b.searchCount - a.searchCount);
        break;
      case 'least_searches_asc':
        filtered.sort((a, b) => a.searchCount - b.searchCount);
        break;
    }

    return filtered;
  }

  getStatusLabel(status: SearchStatus): string {
    const labels: Record<SearchStatus, string> = {
      'Relancé': 'Relancé',
      'Validé': 'Validé',
      'En attente': 'En attente',
      'Refusé': 'Refusé',

    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const statusClasses: Record<string, string> = {
      'RELANCE': `${baseClasses} bg-purple-100 text-purple-800`,
      'ACCEPTE': `${baseClasses} bg-green-100 text-green-800`,
      'EN_ATTENTE': `${baseClasses} bg-blue-100 text-blue-800`,
      'REFUSE': `${baseClasses} bg-red-100 text-red-800`,
      'EN_COURS': `${baseClasses} bg-yellow-100 text-yellow-800`
    };
    return statusClasses[status] || baseClasses;
  }

  viewStudentDetails(id: number) {
    this.navigationService.navigateToStudentLogbook(id.toString());
  }

  setStatusFilter(filter: 'all' | 'most_recent_asc' | 'most_recent_desc' | 'least_searches_asc' | 'least_searches_desc') {
    this.currentStatusFilter = filter;
  }

  toggleDateSort() {
    switch (this.currentStatusFilter) {
      case 'all':
      case 'least_searches_asc':
      case 'least_searches_desc':
        this.currentStatusFilter = 'most_recent_desc';
        break;
      case 'most_recent_desc':
        this.currentStatusFilter = 'most_recent_asc';
        break;
      case 'most_recent_asc':
        this.currentStatusFilter = 'all';
        break;
    }
  }

  toggleSearchesSort() {
    switch (this.currentStatusFilter) {
      case 'all':
      case 'most_recent_asc':
      case 'most_recent_desc':
        this.currentStatusFilter = 'least_searches_desc';
        break;
      case 'least_searches_desc':
        this.currentStatusFilter = 'least_searches_asc';
        break;
      case 'least_searches_asc':
        this.currentStatusFilter = 'all';
        break;
    }
  }
} 