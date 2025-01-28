import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../services/navigation.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company.model';

@Component({
  selector: 'app-student-logbook',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, FormsModule],
  templateUrl: './student-logbook.component.html',
  styleUrls: ['./student-logbook.component.css']
})
export class StudentLogbookComponent implements OnInit {
  student?: Student;
  entreprise?: Company;
  searches: InternshipSearch[] = [];
  breadcrumbs: { label: string; path?: string; }[] = [];
  searchTerm: string = '';
  currentFilter: 'all' | 'waiting' | 'validated' | 'date_asc' | 'date_desc' = 'all';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly studentService: StudentService,
    private readonly navigationService: NavigationService,
    private readonly companyService: CompanyService
  ) {}

  ngOnInit() {
    const studentId = this.route.snapshot.paramMap.get('id') ?? '';
    this.loadStudentData(studentId);
  }

  get filteredSearches() {
    let filtered = [...this.searches];
  
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(search => {
        this.entreprise = this.companyService.getCompanyById(search.idEntreprise); // Récupérer l'entreprise par idEntreprise
        if (this.entreprise) {
          return (
          this.entreprise.raisonSociale?.toLowerCase().includes(searchTermLower) ||
          this.entreprise.ville?.toLowerCase().includes(searchTermLower) ||
          search.prenomContact?.toLowerCase().includes(searchTermLower) ||
          search.nomContact?.toLowerCase().includes(searchTermLower) ||
          (this.getStatusLabel(search.statut)?.toLowerCase().includes(searchTermLower) ?? false)
          );
        }
        return 0;
      });
    }
  
    switch (this.currentFilter) {
      case 'waiting':
        filtered = filtered.filter(s => s.statut === 'En attente');
        break;
      case 'validated':
        filtered = filtered.filter(s => s.statut === 'Validé');
        break;
      case 'date_asc':
        filtered.sort((a, b) => {
          const dateA = a.dateCreation instanceof Date ? a.dateCreation : new Date(a.dateCreation);
          const dateB = b.dateCreation instanceof Date ? b.dateCreation : new Date(b.dateCreation);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case 'date_desc':
        filtered.sort((a, b) => {
          const dateA = a.dateCreation instanceof Date ? a.dateCreation : new Date(a.dateCreation);
          const dateB = b.dateCreation instanceof Date ? b.dateCreation : new Date(b.dateCreation);
          return dateB.getTime() - dateA.getTime();
        });
        break;
    }
  
    return filtered;
  }
  

  private loadStudentData(studentId: string) {
    this.student = this.studentService.getStudentById(studentId);
    if (this.student) {
      this.breadcrumbs = this.navigationService.getBreadcrumbs(
        `Journal de bord - ${this.student.nomEtudiant} ${this.student.prenomEtudiant}`
      );
      this.searches = this.internshipSearchService.getSearchesByStudentId(studentId);
    };
  };

  setFilter(filter: 'all' | 'waiting' | 'validated' | 'date_asc' | 'date_desc') {
    this.currentFilter = filter;
  }

  toggleDateSort() {
    if (this.currentFilter === 'date_asc') {
      this.currentFilter = 'date_desc';
    } else if (this.currentFilter === 'date_desc') {
      this.currentFilter = 'all';
    } else {
      this.currentFilter = 'date_asc';
    }
  }

  getSearchCountByStatus(status: SearchStatus): number {
    return this.searches.filter(s => s.statut === status).length;
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

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'Relancé': 'status-badge relance',
      'Validé': 'status-badge valide',
      'En attente': 'status-badge en-attente',
      'Refusé': 'status-badge refuse'
    };
    return statusMap[status] || 'status-badge';
  }

  viewSearchDetails(searchId: number) {
    this.navigationService.navigateToSearchView(searchId);
  }

  getSearchesThisWeek(): number {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.searches.filter(search => new Date(search.dateCreation) >= lastWeek).length;
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getLastWeekDate(): Date {
    const today = new Date();
    return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
} 