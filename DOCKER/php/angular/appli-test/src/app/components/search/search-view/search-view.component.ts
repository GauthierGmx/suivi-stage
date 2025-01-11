import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { InternshipSearch } from '../../../models/internship-search.model';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../../services/navigation.service';
import { EnterpriseService } from '../../../services/enterprise.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search-view',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  template: `
    <div class="container mx-auto py-8 px-4">
      <app-breadcrumb [items]="breadcrumbs"/>
      
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">Détails de la recherche</h1>
        <p class="text-gray-600">Consultation des informations</p>
      </div>

      @if (search) {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 space-y-6">
            <div class="border-b pb-6">
              <h2 class="text-lg font-semibold mb-4">Informations de l'entreprise</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Raison sociale</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.entreprise?.raisonSociale }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.entreprise?.villeEntreprise }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-b pb-6">
              <h2 class="text-lg font-semibold mb-4">Contact</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nom et prénom</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.nomPrenomContact }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.mailContact }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.telContact }}
                  </div>
                </div>
              </div>
            </div>

            <div class="border-b pb-6">
              <h2 class="text-lg font-semibold mb-4">Suivi</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    <span [class]="getStatusClass(search!.statut)">
                      {{ getStatusLabel(search!.statut) }}
                    </span>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Date de création</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.dateCreation | date:'dd MMM yyyy' }}
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dernière modification</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200">
                    {{ search!.dateModification | date:'dd MMM yyyy' }}
                  </div>
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Observations</label>
                  <div class="p-2 bg-gray-50 rounded-md border border-gray-200 min-h-[100px] whitespace-pre-line">
                    {{ search!.observations }}
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button 
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                (click)="goBack()"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SearchViewComponent implements OnInit {
  search?: InternshipSearch;
  breadcrumbs = this.navigationService.getBreadcrumbs('Détails de la recherche');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly navigationService: NavigationService,
    private readonly enterpriseService: EnterpriseService
  ) {}

  ngOnInit() {
    const searchId = this.route.snapshot.paramMap.get('id');
    if (searchId) {
      this.loadSearch(parseInt(searchId));
    }
  }

  private loadSearch(searchId: number) {
    this.internshipSearchService.getSearchById(searchId).pipe(
      switchMap(search => {
        if (search?.idEntreprise) {
          return forkJoin({
            search: Promise.resolve(search),
            entreprise: this.enterpriseService.getEnterpriseById(search.idEntreprise)
          });
        }
        return forkJoin({
          search: Promise.resolve(search),
          entreprise: Promise.resolve(undefined)
        });
      })
    ).subscribe(({ search, entreprise }) => {
      if (search) {
        this.search = {
          ...search,
          entreprise: entreprise
        } as InternshipSearch;
      }
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'Relancé': 'Relancé',
      'Validé': 'Validé',
      'En attente': 'En attente',
      'Refusé': 'Refusé'
    };
    return labels[status] || status;
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

  goBack() {
    this.navigationService.goBack();
  }
} 