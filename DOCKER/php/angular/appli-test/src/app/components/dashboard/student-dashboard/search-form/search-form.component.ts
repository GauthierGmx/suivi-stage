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
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
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
    private readonly route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      idEntreprise: ['', Validators.required],
      nomPrenomContact: ['', Validators.required],
      fonctionContact: [''],
      telContact: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      mailContact: ['', [Validators.email]],
      date1erContact: ['', Validators.required],
      typeContact: ['Mail', Validators.required],
      statut: ['En attente', Validators.required],
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
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(searchTerm => {
      if (searchTerm) {
        this.filteredEnterprises = this.enterprises
          .filter(enterprise => 
            enterprise.raisonSociale.toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .slice(0, 10);
        this.showDropdown = true;
      } else {
        this.filteredEnterprises = [];
        this.showDropdown = false;
      }
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
        this.enterpriseService.getEnterpriseById(search.idEntreprise).subscribe(enterprise => {
          this.selectedEnterprise = enterprise;
          this.searchControl.setValue(enterprise?.raisonSociale ?? null);
        });

        this.form.patchValue({
          ...search,
          date1erContact: this.formatDateForInput(search.date1erContact),
          dateRelance: search.dateRelance ? this.formatDateForInput(search.dateRelance) : '',
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
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private formatDateForInput(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  async onSubmit() {
    if (this.form.valid) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
      
      const searchData: Omit<InternshipSearch, 'idRecherche'> = {
        ...this.form.value,
        dateCreation: new Date(),
        dateModification: new Date(),
        idEtudiant: currentUser.id,
        date1erContact: new Date(this.form.value.date1erContact),
        dateRelance: this.form.value.dateRelance ? new Date(this.form.value.dateRelance) : undefined
      };

      try {
        if (this.isEditMode && this.searchId) {
          await this.internshipSearchService.updateSearch(parseInt(this.searchId), searchData).toPromise();
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

  getStatusButtonClass(status: string, position: 'first' | 'middle' | 'last'): string {
    const isSelected = this.form.get('statut')?.value === status;
    let roundedClasses = '';
    
    switch (position) {
      case 'first':
        roundedClasses = 'rounded-l-full';
        break;
      case 'last':
        roundedClasses = 'rounded-r-full';
        break;
      default:
        roundedClasses = '';
    }

    const baseClasses = `w-36 px-4 py-2 text-sm font-medium transition-colors duration-200 ${roundedClasses}`;
    
    if (isSelected) {
      switch (status) {
        case 'Refusé': return `${baseClasses} bg-red-100 text-red-800`;
        case 'En attente': return `${baseClasses} bg-blue-100 text-blue-800`;
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
    this.selectedEnterprise = enterprise;
    this.form.patchValue({ idEntreprise: enterprise.idEntreprise });
    this.searchControl.setValue(enterprise.raisonSociale, { emitEvent: false });
    this.showDropdown = false;
  }
} 