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
      pendingContacts: this.searches.filter(s => s.statut === 'En attente').length,
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

  getFilteredSearches(): InternshipSearch[] {
    const filtered = this.searchTerm.trim() 
      ? this.searches.filter(search => {
          const matches = (
            search.entreprise?.raisonSociale.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            search.entreprise?.villeEntreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            search.dateCreation.toLocaleDateString().includes(this.searchTerm.toLowerCase()) ||
            search.dateModification.toLocaleDateString().includes(this.searchTerm.toLowerCase()) ||
            this.getStatusLabel(search.statut).toLowerCase().includes(this.searchTerm.toLowerCase())
          );
          return matches;
        })
      : this.searches;
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