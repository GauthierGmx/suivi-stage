import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { InternshipSearch } from '../../../../models/internship-search.model';
import { Enterprise, EnterpriseService } from '../../../../services/enterprise.service';
import { InternshipSearchService } from '../../../../services/internship-search.service';
import { NavigationService } from '../../../../services/navigation.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto py-8 px-6">
      <div class="max-w-6xl mx-auto">
        <h1 class="text-xl font-normal text-gray-600 mb-8">
          Étudiant - {{ isEditMode ? 'Modifier' : 'Ajouter' }} une recherche
        </h1>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8 bg-white rounded-lg p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <!-- Type de contact et Date 1er contact -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Type de contact</label>
                <select 
                  formControlName="typeContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
                  <option value="Courrier">Courrier</option>
                  <option value="Mail">Mail</option>
                  <option value="Présentiel">Présentiel</option>
                  <option value="Téléphone">Téléphone</option>
                  <option value="Site de recrutement">Site de recrutement</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Date 1er contact</label>
                <input 
                  type="date" 
                  formControlName="date1erContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
              </div>
            </div>

            <!-- Nom de l'entreprise -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-base font-medium text-gray-900">Nom de l'entreprise</label>
                  @if (!isEditMode) {
                    <button 
                      type="button"
                      (click)="openEnterpriseForm()"
                      class="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      <span class="text-xl mr-1">+</span> Nouvelle entreprise
                    </button>
                  }
                </div>
                <div class="relative">
                  <input
                    type="text"
                    [formControl]="searchControl"
                    class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                    placeholder="Rechercher une entreprise..."
                    (focus)="showDropdown = true"
                  >
                  @if (showDropdown && filteredEnterprises.length > 0) {
                    <div class="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      @for (enterprise of filteredEnterprises; track enterprise.idEntreprise) {
                        <div
                          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          (click)="selectEnterprise(enterprise)"
                        >
                          {{ enterprise.raisonSociale }}
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Adresse -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Adresse - Numéro et Rue</label>
                <input 
                  type="text" 
                  [value]="selectedEnterprise?.adresseEntreprise || ''"
                  disabled
                  class="w-full h-11 rounded-md border-2 border-gray-200 bg-gray-50 px-3"
                >
              </div>
            </div>

            <!-- Code Postal et Ville -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Adresse - Code Postal</label>
                <input 
                  type="text" 
                  [value]="selectedEnterprise?.codePostalEntreprise || ''"
                  disabled
                  class="w-full h-11 rounded-md border-2 border-gray-200 bg-gray-50 px-3"
                >
              </div>
            </div>

            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Adresse - Ville</label>
                <input 
                  type="text" 
                  [value]="selectedEnterprise?.villeEntreprise || ''"
                  disabled
                  class="w-full h-11 rounded-md border-2 border-gray-200 bg-gray-50 px-3"
                >
              </div>
            </div>

            <!-- Contact -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Nom du contact</label>
                <input 
                  type="text" 
                  formControlName="nomPrenomContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
              </div>
            </div>

            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Fonction du contact</label>
                <input 
                  type="text" 
                  formControlName="fonctionContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
              </div>
            </div>

            <!-- Téléphone et Mail -->
            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  formControlName="telContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
              </div>
            </div>

            <div class="flex flex-col w-full items-center">
              <div class="w-3/4">
                <label class="block text-base font-medium text-gray-900 mb-2">Email</label>
                <input 
                  type="email" 
                  formControlName="mailContact"
                  class="w-full h-11 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                >
              </div>
            </div>
          </div>

          <!-- Statut -->
          <div class="mt-8">
            <label class="block text-base font-medium text-gray-900 mb-3">Statut recherche</label>
            <div class="inline-flex rounded-full overflow-hidden border-2 border-gray-200">
              <button 
                type="button"
                [class]="getStatusButtonClass('Refusé')"
                (click)="setStatus('Refusé')"
              >
                Refusé
              </button>
              <button 
                type="button"
                [class]="getStatusButtonClass('En cours')"
                (click)="setStatus('En cours')"
              >
                En attente
              </button>
              <button 
                type="button"
                [class]="getStatusButtonClass('Relancé')"
                (click)="setStatus('Relancé')"
              >
                Relancé
              </button>
              <button 
                type="button"
                [class]="getStatusButtonClass('Validé')"
                (click)="setStatus('Validé')"
              >
                Accepté
              </button>
            </div>
          </div>

          <!-- Observations -->
          <div class="mt-6">
            <label class="block text-base font-medium text-gray-900 mb-2">Observations</label>
            <textarea 
              formControlName="observations"
              rows="4"
              class="w-full rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
              placeholder="Ajoutez vos observations ici..."
            ></textarea>
          </div>

          <!-- Boutons d'action -->
          <div class="flex justify-end space-x-4 pt-8">
            <button 
              type="button"
              class="px-8 h-11 border-2 border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-200"
              (click)="onCancel()"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-8 h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              [disabled]="!form.valid"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modale de création d'entreprise -->
    @if (showEnterpriseModal) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Nouvelle entreprise</h3>
          
          <form [formGroup]="enterpriseForm" (ngSubmit)="createEnterprise()" class="space-y-4">
            <!-- Raison sociale -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Raison sociale</label>
              <input 
                type="text"
                formControlName="raisonSociale"
                class="w-full h-10 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                placeholder="Nom de l'entreprise"
              >
            </div>

            <!-- Adresse -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Numéro et rue</label>
              <input 
                type="text"
                formControlName="adresseEntreprise"
                class="w-full h-10 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                placeholder="12 rue de l'exemple"
              >
            </div>

            <!-- Code postal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
              <input 
                type="text"
                formControlName="codePostalEntreprise"
                class="w-full h-10 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                placeholder="64000"
              >
            </div>

            <!-- Ville -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input 
                type="text"
                formControlName="villeEntreprise"
                class="w-full h-10 rounded-md border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 px-3"
                placeholder="Pau"
              >
            </div>

            <!-- Boutons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                (click)="showEnterpriseModal = false"
                class="px-4 py-2 border-2 border-gray-200 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                [disabled]="!enterpriseForm.valid"
              >
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class SearchFormComponent implements OnInit {
  form: FormGroup;
  enterprises: Enterprise[] = [];
  isEditMode = false;
  searchId: string | null = null;
  @Input() search: InternshipSearch | null = null;
  @Output() save = new EventEmitter<Partial<InternshipSearch>>();
  @Output() cancel = new EventEmitter<void>();
  selectedEnterprise?: Enterprise;
  showEnterpriseModal = false;
  enterpriseForm: FormGroup;
  searchControl = new FormControl('');
  showDropdown = false;
  filteredEnterprises: Enterprise[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly enterpriseService: EnterpriseService,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly navigationService: NavigationService,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      idEntreprise: ['', Validators.required],
      nomPrenomContact: ['', Validators.required],
      fonctionContact: [''],
      telContact: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      mailContact: ['', [Validators.email]],
      date1erContact: ['', Validators.required],
      typeContact: ['Mail', Validators.required],
      statut: ['En cours', Validators.required],
      observations: ['']
    });

    // Observer les changements d'entreprise
    this.form.get('idEntreprise')?.valueChanges.subscribe(id => {
      if (id) {
        this.selectedEnterprise = this.enterprises.find(e => e.idEntreprise === parseInt(id));
      }
    });

    this.enterpriseForm = this.fb.group({
      raisonSociale: ['', Validators.required],
      adresseEntreprise: ['', Validators.required],
      codePostalEntreprise: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      villeEntreprise: ['', Validators.required]
    });

    // Configurer le filtrage des entreprises
    this.searchControl.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged(),
      map(value => value?.toLowerCase() ?? '')
    ).subscribe(searchTerm => {
      this.filteredEnterprises = this.enterprises
        .filter(enterprise =>
          enterprise.raisonSociale.toLowerCase().includes(searchTerm)
        )
        .slice(0, 10); // Limite à 10 résultats
    });

    // Gérer le clic en dehors du dropdown
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.showDropdown = false;
      }
    });
  }

  ngOnInit() {
    this.loadEnterprises();
    
    this.searchId = this.route.snapshot.paramMap.get('id');
    if (this.searchId) {
      this.isEditMode = true;
      this.loadSearchData(this.searchId);
    }

    if (this.selectedEnterprise) {
      this.searchControl.setValue(this.selectedEnterprise.raisonSociale, { emitEvent: false });
    }
  }

  private loadSearchData(searchId: string) {
    this.internshipSearchService.getSearchById(parseInt(searchId)).subscribe(search => {
      if (search) {
        this.form.patchValue({
          ...search,
          date1erContact: this.formatDate(search.date1erContact),
          dateRelance: search.dateRelance ? this.formatDate(search.dateRelance) : '',
          idEntreprise: search.idEntreprise
        });
      }
    });
  }

  private loadEnterprises() {
    this.enterpriseService.getEnterprises().subscribe(
      enterprises => {
        this.enterprises = enterprises;
      }
    );
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  async onSubmit() {
    if (this.form.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
      const searchData = {
        ...this.form.value,
        dateCreation: new Date(),
        dateModification: new Date(),
        idEtudiant: currentUser.id
      };

      try {
        if (this.isEditMode) {
          await this.internshipSearchService.updateSearch(parseInt(this.searchId!), searchData).toPromise();
        } else {
          await this.internshipSearchService.addSearch(searchData).toPromise();
        }
        this.navigationService.goBack();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  }

  onCancel() {
    this.navigationService.goBack();
  }

  getStatusButtonClass(status: string): string {
    const isSelected = this.form.get('statut')?.value === status;
    const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200';
    
    if (isSelected) {
      switch (status) {
        case 'Refusé': return `${baseClasses} bg-red-100 text-red-800`;
        case 'En cours': return `${baseClasses} bg-blue-100 text-blue-800`;
        case 'Relancé': return `${baseClasses} bg-purple-100 text-purple-800`;
        case 'Validé': return `${baseClasses} bg-green-100 text-green-800`;
        default: return baseClasses;
      }
    }
    
    return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`;
  }

  setStatus(status: string) {
    this.form.patchValue({ statut: status });
  }

  openEnterpriseForm() {
    this.showEnterpriseModal = true;
  }

  async createEnterprise() {
    if (this.enterpriseForm.valid) {
      try {
        const newEnterprise = await this.enterpriseService.addEnterprise(this.enterpriseForm.value).toPromise();
        if (newEnterprise) {
          this.loadEnterprises();
          this.form.patchValue({ idEntreprise: newEnterprise.idEntreprise });
          this.selectedEnterprise = newEnterprise;
          this.searchControl.setValue(newEnterprise.raisonSociale, { emitEvent: false });
          this.showEnterpriseModal = false;
          this.enterpriseForm.reset();
        }
      } catch (error) {
        console.error('Erreur lors de la création de l\'entreprise:', error);
      }
    }
  }

  selectEnterprise(enterprise: Enterprise) {
    this.form.patchValue({ idEntreprise: enterprise.idEntreprise });
    this.searchControl.setValue(enterprise.raisonSociale, { emitEvent: false });
    this.showDropdown = false;
    this.selectedEnterprise = enterprise;
  }
} 