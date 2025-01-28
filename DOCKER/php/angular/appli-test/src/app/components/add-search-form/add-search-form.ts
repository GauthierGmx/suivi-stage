import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { InternshipSearch } from '../../models/internship-search.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { NavigationService } from '../../services/navigation.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
    selector: 'app-add-search-searchForm',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-search-form.html',
    styleUrls: ['./add-search-form.css']
})
export class AddSearchFormComponent implements OnInit {
    @Output() save = new EventEmitter<Partial<InternshipSearch>>();
    @Output() cancel = new EventEmitter<void>();
    searchForm: FormGroup;
    companies: Company[] = [];
    selectedCompany?: Company;
    showCompanyModal = false;
    companyForm: FormGroup;
    searchControl = new FormControl('');
    showDropdown = false;
    filteredCompanies: Company[] = [];

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly companyService: CompanyService,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly navigationService: NavigationService
    ) {
        //Construction du formulaire d'ajout d'une recherche de stage
        this.searchForm = this.formBuilder.group({
        idEntreprise: ['', Validators.required],
        nomPrenomContact: ['', Validators.required],
        fonctionContact: ['', Validators.required],
        telContact: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        mailContact: ['', [Validators.required, Validators.email]],
        date1erContact: ['', Validators.required],
        typeContact: ['Mail', Validators.required],
        statut: ['En attente', Validators.required],
        observations: ['']
        });

        // Observer les changements d'entreprise
        this.searchForm.get('idEntreprise')?.valueChanges.subscribe(id => {
        if (id) {
            this.selectedCompany = this.companies.find(e => e.idEntreprise === parseInt(id));
        }
        });

        //Construction du formulaire d'ajout d'une entreprise
        this.companyForm = this.formBuilder.group({
        raisonSociale: ['', Validators.required],
        adresse: ['', Validators.required],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', Validators.required]
        });

        // Configurer le filtrage des entreprises
        this.searchControl.valueChanges.pipe(
        debounceTime(800),
        distinctUntilChanged(),
        ).subscribe(searchTerm => {
        if (searchTerm) {
            this.filteredCompanies = this.companies
            .filter(company => 
                company.raisonSociale.toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .slice(0, 10);
            this.showDropdown = true;
        } else {
            this.filteredCompanies = [];
            this.showDropdown = false;
        }
        });
    }

    ngOnInit() {
        //Récupération des entreprises
        this.companyService.getCompanies()
        .subscribe(companies => {
                this.companies = companies;
        })

        //Récupération du nom de l'entreprise quand elle est sélectionner dans le formulaire
        if (this.selectedCompany) {
            this.searchControl.setValue(this.selectedCompany.raisonSociale, { emitEvent: false });
        }
    }

    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement) {
        if (this.showDropdown) {
            const clickedOutsideDropdown = targetElement.closest('.dropdown');
            if (!clickedOutsideDropdown) {
                this.showDropdown = false;
            }
        }
    }

    //Validation du formulaire de création d'une recherche de stage
    onSubmit() {
        if (this.searchForm.valid) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
            
            const searchData: Omit<InternshipSearch, 'idRecherche'> = {
                ...this.searchForm.value,
                dateCreation: new Date(),
                dateModification: new Date(),
                idEtudiant: currentUser.id,
                date1erContact: new Date(this.searchForm.value.date1erContact),
                dateRelance: this.searchForm.value.dateRelance ? new Date(this.searchForm.value.dateRelance) : undefined
            };

            try {
                this.internshipSearchService.addSearch(searchData).toPromise();
                this.navigationService.goBack();
            } catch (error) {
                console.error('Erreur lors de la sauvegarde:', error);
            }
        }
    }

    //Annulation du formulaire de création d'une recherche de stage
    onCancel() {
        this.navigationService.goBack();
    }

    //Récupère le classe du bouton sélectionner
    getStatusButtonClass(status: string, position: 'first' | 'middle' | 'last'): string {
        const isSelected = this.searchForm.get('statut')?.value === status;
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

    //Attribue un statut à la recherche
    setStatus(statut: string) {
        this.searchForm.patchValue({ statut: statut });
    }

    //Ouvre le formulaire de création d'une entreprise
    openCompanyForm() {
        this.showCompanyModal = true;
    }

    //Crée une entreprise
    async createCompany() {
        if (this.companyForm.valid) {
        try {
            const newCompany = await this.companyService.addCompany(this.companyForm.value).toPromise();
            if (newCompany) {
            this.searchForm.patchValue({ idEntreprise: newCompany.idEntreprise });
            this.selectedCompany = newCompany;
            this.searchControl.setValue(newCompany.raisonSociale, { emitEvent: false });
            this.showCompanyModal = false;
            this.companyForm.reset();
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'entreprise:', error);
        }
        }
    }

    //Sélectionne une entreprise
    selectCompany(company: Company) {
        this.selectedCompany = company;
        this.searchForm.patchValue({ idEntreprise: company.idEntreprise });
        this.searchControl.setValue(company.raisonSociale, { emitEvent: false });
        this.showDropdown = false;
    }
}