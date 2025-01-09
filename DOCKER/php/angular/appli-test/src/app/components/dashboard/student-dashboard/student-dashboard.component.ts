import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { Student, StudentDashboardStats } from '../../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../../models/internship-search.model';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { StudentService } from '../../../services/student.service';
import { EnterpriseService } from '../../../services/enterprise.service';
import { SearchFormComponent } from './search-form/search-form.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFormComponent, ConfirmationModalComponent, BreadcrumbComponent],
  template: `
    <div class="space-y-6">
      <app-breadcrumb 
        [items]="breadcrumbs"
        [showBack]="false"
      />
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Recherches saisies</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.searchCount }}</p>
        </div>
        
        <div class="p-4 bg-[#E6F1FD] rounded-lg">
          <h3 class="font-semibold mb-2">Contacts en attente</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.pendingContacts }}</p>
        </div>
        
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Stages refusés</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.rejectedInternships }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex gap-2 items-center">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Recherche..." 
              class="px-3 py-2 border rounded-lg"
            >
          </div>
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg"
            (click)="navigateToSearchForm()"
          >
            Ajouter une recherche
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de recherche</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dernière modification</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (search of getFilteredSearches(); track search.idRecherche) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">{{ search.entreprise?.raisonSociale }}</td>
                  <td class="px-6 py-4">{{ search.entreprise?.villeEntreprise }}</td>
                  <td class="px-6 py-4">{{ search.dateCreation | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">{{ search.dateModification | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(search.statut)">
                      {{ getStatusLabel(search.statut) }}
                    </span>
                  </td>
                  <td class="px-2 py-4 w-[180px]">
                    <div class="flex gap-2">
                      <button 
                        class="bg-blue-100 text-blue-600 hover:bg-blue-200 p-1.5 rounded-lg flex items-center"
                        (click)="showEditForm(search)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span class="ml-1">Modifier</span>
                      </button>
                      <button 
                        class="bg-red-100 text-red-600 hover:bg-red-200 p-1.5 rounded-lg flex items-center"
                        (click)="confirmDelete(search.idRecherche)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span class="ml-1">Supprimer</span>
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

    @if (showForm) {
      <app-search-form
        [search]="selectedSearch"
        (save)="saveSearch($event)"
        (cancel)="hideForm()"
      />
    }

    @if (showDeleteConfirmation) {
      <app-confirmation-modal
        (confirm)="onDeleteConfirmed()"
        (cancel)="hideDeleteConfirmation()"
      />
    }
  `
})
export class StudentDashboardComponent implements OnInit {
  @Input() currentUser!: User;
  
  stats: StudentDashboardStats = {
    searchCount: 0,
    pendingContacts: 0,
    rejectedInternships: 0
  };

  student?: Student;
  searches: InternshipSearch[] = [];
  searchTerm: string = '';
  showForm = false;
  selectedSearch: InternshipSearch | null = null;
  showDeleteConfirmation = false;
  searchToDelete: number | null = null;
  breadcrumbs = this.navigationService.getBreadcrumbs('Mes recherches de stage');

  constructor(
    private readonly internshipSearchService: InternshipSearchService,
    private readonly studentService: StudentService,
    private readonly enterpriseService: EnterpriseService,
    private readonly navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.loadStudentData();
  }

  private loadStudentData() {
    // Charger les données de l'étudiant
    this.studentService.getStudentById(parseInt(this.currentUser.id))
      .subscribe(student => {
        if (student) {
          this.student = student;
        }
      });

    // Charger les recherches avec les données entreprises
    this.internshipSearchService.getSearchesByStudentId(this.currentUser.id)
      .subscribe(searches => {
        this.searches = searches;
        this.updateStats();
      });
  }

  private updateStats() {
    this.stats = {
      searchCount: this.searches.length,
      pendingContacts: this.searches.filter(s => s.statut === 'En cours').length,
      rejectedInternships: this.searches.filter(s => s.statut === 'Refusé').length
    };
  }

  showAddForm() {
    this.selectedSearch = null;
    this.showForm = true;
  }

  showEditForm(search: InternshipSearch) {
    this.navigationService.navigateToSearchForm(search.idRecherche);
  }

  hideForm() {
    this.showForm = false;
    this.selectedSearch = null;
  }

  saveSearch(searchData: Partial<InternshipSearch>) {
    if (this.selectedSearch) {
      this.internshipSearchService.updateSearch(this.selectedSearch.idRecherche, searchData)
        .subscribe(() => {
          this.loadStudentData();
          this.hideForm();
        });
    } else {
      this.internshipSearchService.addSearch(searchData as Omit<InternshipSearch, 'id' | 'lastUpdate'>)
        .subscribe(() => {
          this.loadStudentData();
          this.hideForm();
        });
    }
  }

  confirmDelete(id: number) {
    this.searchToDelete = id;
    this.showDeleteConfirmation = true;
  }

  hideDeleteConfirmation() {
    this.showDeleteConfirmation = false;
    this.searchToDelete = null;
  }

  onDeleteConfirmed() {
    if (this.searchToDelete) {
      this.internshipSearchService.deleteSearch(this.searchToDelete)
        .subscribe(() => {
          this.loadStudentData();
          this.hideDeleteConfirmation();
        });
    }
  }

  getStatusLabel(status: SearchStatus): string {
    const labels: Record<SearchStatus, string> = {
      'Relancé': 'Relancé',
      'Validé': 'Validé',
      'En cours': 'En cours',
      'Refusé': 'Refusé'
    };
    return labels[status];
  }

  getStatusClass(status: SearchStatus): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const statusClasses: Record<SearchStatus, string> = {
      'Relancé': `${baseClasses} bg-purple-100 text-purple-800`,
      'Validé': `${baseClasses} bg-green-100 text-green-800`,
      'En cours': `${baseClasses} bg-blue-100 text-blue-800`,
      'Refusé': `${baseClasses} bg-red-100 text-red-800`
    };
    return statusClasses[status];
  }

  getFilteredSearches(): InternshipSearch[] {
    if (!this.searchTerm.trim()) {
      return this.searches;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    return this.searches.filter(search => {
      return (
        search.entreprise?.raisonSociale.toLowerCase().includes(searchTermLower) ||
        search.entreprise?.villeEntreprise.toLowerCase().includes(searchTermLower) ||
        search.dateCreation.toLocaleDateString().includes(searchTermLower) ||
        search.dateModification.toLocaleDateString().includes(searchTermLower) ||
        this.getStatusLabel(search.statut).toLowerCase().includes(searchTermLower)
      );
    });
  }

  navigateToSearchForm() {
    this.navigationService.navigateToSearchForm();
  }
} 