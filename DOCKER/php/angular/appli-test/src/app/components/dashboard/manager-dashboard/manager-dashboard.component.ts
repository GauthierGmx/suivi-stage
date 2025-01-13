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
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
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
      this.students = students.map(student => {
        const stats = searchStats.find(s => s.id === student.idEtudiant);
        return {
          id: student.idEtudiant,
          studentName: `${student.prenomEtudiant} ${student.nomEtudiant}`,
          searchCount: stats?.searchCount ?? 0,
          lastUpdate: stats?.lastUpdate || new Date(),
          bestStatus: stats?.bestStatus ?? 'En attente'
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

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'RELANCE': 'Relancé',
      'ACCEPTE': 'Validé',
      'EN_ATTENTE': 'En attente',
      'REFUSE': 'Refusé',
      'EN_COURS': 'En cours'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'RELANCE': 'status-badge relance',
      'ACCEPTE': 'status-badge valide',
      'EN_ATTENTE': 'status-badge en-attente',
      'REFUSE': 'status-badge refuse',
      'EN_COURS': 'status-badge en-attente'
    };
    return statusMap[status] || 'status-badge';
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