import { Component, Input, OnInit, HostListener } from '@angular/core';
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
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchFormComponent, ConfirmationModalComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
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
  selectedCity: string = '';
  selectedStatus: string = '';
  selectedDateFilter: string = '';
  cities: string[] = [];
  selectedCities: Set<string> = new Set();
  selectedStatuses: Set<string> = new Set();
  dateSort: 'none' | 'asc' | 'desc' = 'none';
  showCityFilter = false;
  showStatusFilter = false;
  readonly statusOptions = ['En attente', 'Relancé', 'Validé', 'Refusé'];

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
        this.updateCitiesList();
      });
  }

  private updateStats() {
    this.stats = {
      searchCount: this.searches.length,
      pendingContacts: this.searches.filter(s => s.statut === 'En attente').length,
      rejectedInternships: this.searches.filter(s => s.statut === 'Refusé').length
    };
  }

  private updateCitiesList() {
    this.cities = [...new Set(this.searches
      .map(s => s.entreprise?.villeEntreprise)
      .filter((city): city is string => city !== undefined)
    )];
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
      'En attente': 'En attente',
      'Refusé': 'Refusé'
    };
    return labels[status];
  }

  getStatusClass(status: SearchStatus): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const statusClasses: Record<SearchStatus, string> = {
      'Relancé': `${baseClasses} bg-purple-100 text-purple-800`,
      'Validé': `${baseClasses} bg-green-100 text-green-800`,
      'En attente': `${baseClasses} bg-blue-100 text-blue-800`,
      'Refusé': `${baseClasses} bg-red-100 text-red-800`
    };
    return statusClasses[status];
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Vérifie si le clic est en dehors des menus déroulants
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown')) {
      this.showCityFilter = false;
      this.showStatusFilter = false;
    }
  }

  toggleCityFilter(event: Event) {
    event.stopPropagation(); // Empêche la propagation du clic
    this.showCityFilter = !this.showCityFilter;
    this.showStatusFilter = false;
  }

  toggleStatusFilter(event: Event) {
    event.stopPropagation(); // Empêche la propagation du clic
    this.showStatusFilter = !this.showStatusFilter;
    this.showCityFilter = false;
  }

  toggleCitySelection(city: string) {
    if (this.selectedCities.has(city)) {
      this.selectedCities.delete(city);
    } else {
      this.selectedCities.add(city);
    }
  }

  toggleStatusSelection(status: string) {
    if (this.selectedStatuses.has(status)) {
      this.selectedStatuses.delete(status);
    } else {
      this.selectedStatuses.add(status);
    }
  }

  getCityFilterLabel(): string {
    return this.selectedCities.size > 0 
      ? `${this.selectedCities.size} ville${this.selectedCities.size > 1 ? 's' : ''} sélectionnée${this.selectedCities.size > 1 ? 's' : ''}`
      : 'Toutes les villes';
  }

  getStatusFilterLabel(): string {
    return this.selectedStatuses.size > 0
      ? `${this.selectedStatuses.size} statut${this.selectedStatuses.size > 1 ? 's' : ''} sélectionné${this.selectedStatuses.size > 1 ? 's' : ''}`
      : 'Tous les statuts';
  }

  toggleDateSort() {
    switch (this.dateSort) {
      case 'none':
        this.dateSort = 'desc';
        break;
      case 'desc':
        this.dateSort = 'asc';
        break;
      case 'asc':
        this.dateSort = 'none';
        break;
    }
  }

  getDateSortLabel(): string {
    switch (this.dateSort) {
      case 'desc':
        return 'Plus récent d\'abord';
      case 'asc':
        return 'Plus ancien d\'abord';
      default:
        return 'Trier par date';
    }
  }

  getFilteredSearches() {
    let filtered = this.searches.filter(search => {
      const matchesSearch = (
        search.entreprise?.raisonSociale.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        search.entreprise?.villeEntreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        search.dateCreation.toLocaleDateString().includes(this.searchTerm.toLowerCase()) ||
        search.dateModification.toLocaleDateString().includes(this.searchTerm.toLowerCase()) ||
        this.getStatusLabel(search.statut).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      const matchesCities = this.selectedCities.size === 0 || 
        (search.entreprise?.villeEntreprise && this.selectedCities.has(search.entreprise.villeEntreprise));
      const matchesStatuses = this.selectedStatuses.size === 0 || 
        this.selectedStatuses.has(search.statut);

      return matchesSearch && matchesCities && matchesStatuses;
    });

    // Tri par date
    if (this.dateSort !== 'none') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.dateCreation).getTime();
        const dateB = new Date(b.dateCreation).getTime();
        return this.dateSort === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }

    return filtered;
  }

  navigateToSearchForm() {
    this.navigationService.navigateToSearchForm();
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
} 