import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user.model';
import { DescriptionSheet, SheetStatus } from '../../../models/description-sheet.model';
import { DescriptionSheetService } from '../../../services/description-sheet.service';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { NavigationService } from '../../../services/navigation.service';

interface SheetStats {
  totalSheets: number;
  drafts: number;
  validated: number;
}

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, FormsModule, BreadcrumbComponent],
  template: `
    <div class="space-y-6">
      <app-breadcrumb 
        [items]="breadcrumbs"
        [showBack]="false"
      />
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Fiches créées</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.totalSheets }}</p>
        </div>
        
        <div class="p-4 bg-[#E6F1FD] rounded-lg">
          <h3 class="font-semibold mb-2">Brouillons</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.drafts }}</p>
        </div>
        
        <div class="p-4 bg-[#EDEEFC] rounded-lg">
          <h3 class="font-semibold mb-2">Fiches validées</h3>
          <p class="text-3xl font-bold text-gray-600">{{ stats.validated }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex gap-2 items-center">
            <input 
              type="text" 
              [(ngModel)]="searchTerm"
              placeholder="Rechercher une fiche..." 
              class="px-3 py-2 border rounded-lg"
            >
          </div>
          <button 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg"
            (click)="showAddForm()"
          >
            Créer une fiche
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thématique</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sujet</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date de création</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Début de stage</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (sheet of getFilteredSheets(); track sheet.idFicheDescriptive) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">{{ sheet.thematique }}</td>
                  <td class="px-6 py-4">{{ sheet.sujet }}</td>
                  <td class="px-6 py-4">{{ sheet.dateCreation | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">{{ sheet.debutStage | date:'dd MMM yyyy' }}</td>
                  <td class="px-6 py-4">
                    <span [class]="getStatusClass(sheet.statut)">
                      {{ getStatusLabel(sheet.statut) }}
                    </span>
                  </td>
                  <td class="px-2 py-4 w-[180px]">
                    <div class="flex gap-2">
                      <button 
                        class="bg-blue-100 text-blue-600 hover:bg-blue-200 p-1.5 rounded-lg flex items-center"
                        (click)="showEditForm(sheet)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span class="ml-1">Modifier</span>
                      </button>
                      <button 
                        class="bg-red-100 text-red-600 hover:bg-red-200 p-1.5 rounded-lg flex items-center"
                        (click)="confirmDelete(sheet.idFicheDescriptive)"
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

    <!-- @if (showForm) {
      <app-sheet-form
        [sheet]="selectedSheet"
        (save)="saveSheet($event)"
        (cancel)="hideForm()"
      />
    }

    @if (showDeleteConfirmation) {
      <app-student-sheet-confirmation
        (confirm)="onDeleteConfirmed()"
        (cancel)="hideDeleteConfirmation()"
      />
    } -->
  `
})
export class StudentFactsheetsComponent implements OnInit {
  @Input() currentUser!: User;
  
  stats: SheetStats = {
    totalSheets: 0,
    drafts: 0,
    validated: 0
  };

  sheets: DescriptionSheet[] = [];
  searchTerm: string = '';
  showForm = false;
  selectedSheet: DescriptionSheet | null = null;
  showDeleteConfirmation = false;
  sheetToDelete: number | null = null;
  breadcrumbs = this.navigationService.getBreadcrumbs('Mes fiches descriptives');

  constructor(
    private readonly descriptionSheetService: DescriptionSheetService,
    private readonly navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.loadSheets();
  }

  private loadSheets() {
    this.descriptionSheetService.getSheetsByStudentId(parseInt(this.currentUser.id)).subscribe(sheets => {
      this.sheets = sheets;
      this.updateStats();
    });
  }

  private updateStats() {
    this.stats = {
      totalSheets: this.sheets.length,
      drafts: this.sheets.filter(s => s.statut === 'BROUILLON').length,
      validated: this.sheets.filter(s => s.statut === 'VALIDE').length
    };
  }

  showAddForm() {
    this.selectedSheet = null;
    this.showForm = true;
  }

  showEditForm(sheet: DescriptionSheet) {
    this.selectedSheet = sheet;
    this.showForm = true;
  }

  hideForm() {
    this.showForm = false;
    this.selectedSheet = null;
  }

  saveSheet(sheetData: Partial<DescriptionSheet>) {
    if (this.selectedSheet) {
      this.descriptionSheetService.updateSheet(this.selectedSheet.idFicheDescriptive, sheetData)
        .subscribe(() => {
          this.loadSheets();
          this.hideForm();
        });
    } else {
      const newSheet: Omit<DescriptionSheet, 'idFicheDescriptive'> = {
        contenuDuStage: '',
        thematique: '',
        sujet: '',
        fonction: '',
        taches: '',
        competences: '',
        details: '',
        debutStage: new Date(),
        finStage: new Date(),
        nbJourParSemaine: 5,
        nbHeureParSemaine: 35,
        clauseConfidentialite: false,
        idEtudiant: parseInt(this.currentUser.id),
        statut: 'BROUILLON',
        dateCreation: new Date(),
        ...sheetData
      };
      
      this.descriptionSheetService.addSheet(newSheet)
        .subscribe(() => {
          this.loadSheets();
          this.hideForm();
        });
    }
  }

  confirmDelete(id: number) {
    this.sheetToDelete = id;
    this.showDeleteConfirmation = true;
  }

  hideDeleteConfirmation() {
    this.showDeleteConfirmation = false;
    this.sheetToDelete = null;
  }

  onDeleteConfirmed() {
    if (this.sheetToDelete) {
      this.descriptionSheetService.deleteSheet(this.sheetToDelete)
        .subscribe(() => {
          this.loadSheets();
          this.hideDeleteConfirmation();
        });
    }
  }

  getStatusLabel(status: SheetStatus): string {
    const labels: Record<SheetStatus, string> = {
      'BROUILLON': 'Brouillon',
      'EN_REVISION': 'En révision',
      'VALIDE': 'Validé',
      'REFUSE': 'Refusé'
    };
    return labels[status];
  }

  getStatusClass(status: SheetStatus): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-semibold';
    const statusClasses: Record<SheetStatus, string> = {
      'BROUILLON': `${baseClasses} bg-gray-100 text-gray-800`,
      'EN_REVISION': `${baseClasses} bg-yellow-100 text-yellow-800`,
      'VALIDE': `${baseClasses} bg-green-100 text-green-800`,
      'REFUSE': `${baseClasses} bg-red-100 text-red-800`
    };
    return statusClasses[status];
  }

  getFilteredSheets(): DescriptionSheet[] {
    if (!this.searchTerm.trim()) {
      return this.sheets;
    }

    const searchTermLower = this.searchTerm.toLowerCase().trim();
    
    return this.sheets.filter(sheet => {
      return (
        sheet.thematique.toLowerCase().includes(searchTermLower) ||
        sheet.sujet.toLowerCase().includes(searchTermLower) ||
        sheet.fonction.toLowerCase().includes(searchTermLower) ||
        sheet.competences.toLowerCase().includes(searchTermLower) ||
        this.getStatusLabel(sheet.statut).toLowerCase().includes(searchTermLower)
      );
    });
  }
} 