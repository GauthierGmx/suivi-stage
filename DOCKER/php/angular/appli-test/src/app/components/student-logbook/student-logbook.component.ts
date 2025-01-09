import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipSearchService } from '../../services/internship-search.service';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-logbook',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="container mx-auto py-8 px-4">
      <app-breadcrumb [items]="breadcrumbs"/>
      
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Journal de bord - {{ student?.nomEtudiant }} {{ student?.prenomEtudiant }}</h1>
        <p class="text-gray-600">Suivi des recherches de stage</p>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-semibold text-sm text-gray-600">Total des recherches</h3>
              <p class="text-2xl font-bold">{{ searches.length }}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-semibold text-sm text-gray-600">Réponses positives</h3>
              <p class="text-2xl font-bold">{{ getSearchCountByStatus('Validé') }}</p>
            </div>
            <div class="bg-purple-50 p-4 rounded-lg">
              <h3 class="font-semibold text-sm text-gray-600">En attente de réponse</h3>
              <p class="text-2xl font-bold">{{ getSearchCountByStatus('En cours') }}</p>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (search of sortedSearches; track search.idRecherche) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">{{ search.dateCreation | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">{{ search.entreprise?.raisonSociale }}</td>
                  <td class="px-6 py-4">{{ search.entreprise?.villeEntreprise }}</td>
                  <td class="px-6 py-4">{{ search.nomPrenomContact }}</td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(search.statut)">
                      {{ getStatusLabel(search.statut) }}
                    </span>
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
export class StudentLogbookComponent implements OnInit {
  student?: Student;
  searches: InternshipSearch[] = [];
  breadcrumbs: { label: string; path?: string; }[] = [];

  get sortedSearches() {
    return [...this.searches].sort((a, b) => 
      b.dateModification.getTime() - a.dateModification.getTime()
    );
  }

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

  private loadStudentData(studentId: string) {
    // Charger les données de l'étudiant
    this.studentService.getStudentById(parseInt(studentId)).subscribe(student => {
      if (student) {
        this.student = student;
        this.breadcrumbs = this.navigationService.getBreadcrumbs(
          `Journal de bord - ${student.nomEtudiant} ${student.prenomEtudiant}`
        );
      }
    });

    // Charger les recherches avec les données entreprises
    this.internshipSearchService.getSearchesByStudentId(studentId).subscribe(searches => {
      this.searches = searches;
    });
  }

  getSearchCountByStatus(status: SearchStatus): number {
    return this.searches.filter(s => s.statut === status).length;
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

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const statusClasses: Record<string, string> = {
      'RELANCE': `${baseClasses} bg-purple-100 text-purple-800`,
      'ACCEPTE': `${baseClasses} bg-green-100 text-green-800`,
      'EN_ATTENTE': `${baseClasses} bg-blue-100 text-blue-800`,
      'REFUSE': `${baseClasses} bg-red-100 text-red-800`
    };
    return statusClasses[status] || baseClasses;
  }
} 