import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { NavigationService } from '../../services/navigation.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, Subject } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

@Component({
    selector: 'app-update-search',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent, BreadcrumbComponent],
    templateUrl: './update-search.component.html',
    styleUrl: './update-search.component.css'
})
export class UpdateSearchComponent {
    currentUser!: Student;
    updatedSearch!: InternshipSearch;
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    selectedCompany?: Company;
    newCompany: Company = new Company();
    showCompanyModal = false;
    showDropdown = false;
    searchTerm = '';
    searchTermChanged = new Subject<string>();
    dataLoaded: boolean = false;
    isCreatingCompany: boolean = false;
    isSubmitting: boolean = false;

    constructor(
        private readonly companyService: CompanyService,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly navigationService: NavigationService,
        private readonly router: ActivatedRoute,
        private readonly route: Router
    ) {
        // Configure company filtering with debounce
        this.searchTermChanged.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(term => {
            if (term) {
                this.filteredCompanies = this.companies
                    .filter(company => 
                        company.raisonSociale!.toLowerCase()
                        .includes(term.toLowerCase())
                    )
                    .slice(0, 10);
                this.showDropdown = true;
            } else {
                this.filteredCompanies = [];
                this.showDropdown = false;
            }
        });
    }

    /**
     * Initializes component data by fetching internship search, company, and user information
     */
    async ngOnInit() {
        const searchId = Number(this.router.snapshot.paramMap.get('id'));
        const search = await firstValueFrom(this.internshipSearchService.getSearchById(searchId));
        if (search) {
            this.updatedSearch = search
        };

        const company = await firstValueFrom(this.companyService.getCompanyById(this.updatedSearch.idEntreprise!, ['idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville']));
        if (company) {
            this.selectCompany(company)
        };

        const user = sessionStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }

        this.companyService.getCompanies(['idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville'])
        .subscribe(companies => {
            this.companies = companies;
            this.dataLoaded = true;
        });
    }

    /**
     * Closes the company search results dropdown when clicking outside
     * @param targetElement - The clicked HTML element
     */
    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement) {
        if (this.showDropdown) {
            const clickedOutsideDropdown = targetElement.closest('.dropdown');
            if (!clickedOutsideDropdown) {
                this.showDropdown = false;
            }
        }
    }

    /**
     * Updates the search term and triggers filtering
     * @param term - The search term entered by the user
     */
    onSearchChange(term: string) {
        this.searchTermChanged.next(term);
    }

    /**
     * Handles the form submission to update the internship search
     */
    async onSubmit() {
        if (this.isFormValid()) {
            try {
                this.isSubmitting = true;
                this.updatedSearch.idUPPA = this.currentUser.idUPPA;
                
                await firstValueFrom(this.internshipSearchService.updateSearch(this.updatedSearch));
                this.route.navigateByUrl(`dashboard/search-details/${this.updatedSearch.idRecherche}`);
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la recherche:', error);
            } finally {
                this.isSubmitting = false;
            }
        }
    }

    /**
     * Validates if all required fields in the internship search form are filled correctly
     * @returns boolean indicating if the form is valid
     */
    isFormValid(): boolean {
        return !!(
            this.updatedSearch.idEntreprise &&
            this.updatedSearch.nomContact!.trim() &&
            this.updatedSearch.prenomContact!.trim() &&
            this.updatedSearch.fonctionContact!.trim() &&
            this.updatedSearch.telephoneContact!.match(/^[0-9]{10}$/) &&
            this.updatedSearch.adresseMailContact!.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
            this.updatedSearch.date1erContact! &&
            this.updatedSearch.typeContact!.trim() &&
            this.updatedSearch.statut!.trim()
        );
    }

    /**
     * Validates if all required fields in the company form are filled correctly
     * @returns boolean indicating if the form is valid
     */
    isCompanyFormValid(): boolean {
        return !!(
            this.newCompany.raisonSociale!.trim() &&
            this.newCompany.adresse!.trim() &&
            this.newCompany.codePostal!.match(/^\d{5}$/) &&
            this.newCompany.ville!.trim() &&
            this.newCompany.pays!.trim()
        );
    }

    /**
     * Navigates back to the previous page when canceling the update
     */
    onCancel() {
        this.navigationService.goBack();
    }

    /**
     * Returns the CSS classes for status buttons based on selection state and position
     * @param status - The status value
     * @param position - The button's position in the group
     * @returns string of CSS classes
     */
    getStatusButtonClass(status: string, position: 'first' | 'middle' | 'last'): string {
        const isSelected = this.updatedSearch.statut === status;
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
                case 'En cours': return `${baseClasses} bg-blue-100 text-blue-800`;
                case 'Relancé': return `${baseClasses} bg-purple-100 text-purple-800`;
                case 'Validé': return `${baseClasses} bg-green-100 text-green-800`;
                default: return baseClasses;
            }
        }
        
        return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    }

    /**
     * Updates the status of the internship search
     * @param statut - The new status to set
     */
    setStatus(statut: SearchStatus) {
        this.updatedSearch.statut = statut;
    }

    /**
     * Shows the company creation form modal
     */
    openCompanyForm() {
        this.showCompanyModal = true;
    }

    /**
     * Creates a new company and associates it with the internship search
     */
    async createCompany() {        
        if (this.isCompanyFormValid()) {
            try {
                this.isCreatingCompany = true;
                const newCompany = await firstValueFrom(this.companyService.addCompany(this.newCompany));

                if (newCompany) {
                    // Add to the list of companies
                    this.companies = [...this.companies, newCompany];
                    
                    // Use the selectCompany method to ensure consistent selection
                    this.selectCompany(newCompany);
                    
                    // Close the modal
                    this.showCompanyModal = false;
                }
            } catch (error) {
                console.error('Erreur lors de la création de l\'entreprise:', error);
            } finally {
                this.isCreatingCompany = false;
            }
        }
    }    

    /**
     * Associates a selected company with the internship search
     * @param company - The company to associate
     */
    selectCompany(company: Company) {
        this.selectedCompany = company;
        this.updatedSearch.idEntreprise = company.idEntreprise;
        this.searchTerm = company.raisonSociale ? company.raisonSociale : '';
        this.showDropdown = false;
    }
}