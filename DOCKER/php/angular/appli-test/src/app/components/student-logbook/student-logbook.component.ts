import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InternshipSearchService } from '../../services/internship-search.service';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-logbook',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, FormsModule],
  templateUrl: './student-logbook.component.html',
  styleUrls: ['./student-logbook.component.css']
})
export class StudentLogbookComponent implements OnInit {
  student?: Student;
  searches: InternshipSearch[] = [];
  breadcrumbs: { label: string; path?: string; }[] = [];
  searchTerm: string = '';
  currentFilter: 'all' | 'waiting' | 'validated' | 'date_asc' | 'date_desc' = 'all';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly studentService: StudentService,
    private readonly navigationService: NavigationService
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
        return (
          search.entreprise?.raisonSociale?.toLowerCase().includes(searchTermLower) ||
          search.entreprise?.villeEntreprise?.toLowerCase().includes(searchTermLower) ||
          search.nomPrenomContact?.toLowerCase().includes(searchTermLower) ||
          this.getStatusLabel(search.statut).toLowerCase().includes(searchTermLower)
        );
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
        filtered.sort((a, b) => a.dateCreation.getTime() - b.dateCreation.getTime());
        break;
      case 'date_desc':
        filtered.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
        break;
    }

    return filtered;
  }

  private loadStudentData(studentId: string) {
    this.studentService.getStudentById(parseInt(studentId)).subscribe(student => {
      if (student) {
        this.student = student;
        this.breadcrumbs = this.navigationService.getBreadcrumbs(
          `Journal de bord - ${student.nomEtudiant} ${student.prenomEtudiant}`
        );
      }
    });

    this.internshipSearchService.getSearchesByStudentId(studentId).subscribe(searches => {
      this.searches = searches;
    });
  }

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