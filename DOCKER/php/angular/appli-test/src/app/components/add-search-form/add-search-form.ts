import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { Company } from '../../models/company.model';
import { CompanyService } from '../../services/company.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { NavigationService } from '../../services/navigation.service';
import { firstValueFrom, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { LoadingComponent } from "../loading/loading.component";
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

@Component({
    selector: 'app-add-search-form',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent, BreadcrumbComponent],
    templateUrl: './add-search-form.html',
    styleUrls: ['./add-search-form.css']
})
export class AddSearchFormComponent implements OnInit {
    currentUser!: Student;
    newSearch: InternshipSearch = new InternshipSearch();
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
        private readonly router: Router
    ) {
        // Configuration du filtrage des entreprises
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

    ngOnInit() {
        // Initialisation des valeurs par défaut
        this.newSearch.typeContact = 'Mail';
        this.newSearch.statut = 'En cours';

        // Récupération du currentUser
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }

        // Récupération des entreprises
        this.companyService.getCompanies(['idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville'])
            .subscribe(companies => {
                this.companies = companies;
                this.dataLoaded = true;
            });
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

    onSearchChange(term: string) {
        this.searchTermChanged.next(term);
    }

    async onSubmit() {
        if (this.isFormValid()) {
            try {
                this.isSubmitting = true;
                this.newSearch.idUPPA = this.currentUser.idUPPA;
                
                await firstValueFrom(this.internshipSearchService.addSearch(this.newSearch));
                this.router.navigateByUrl('/dashboard');
            } catch (error) {
                console.error('Erreur lors de l\'ajout de la recherche:', error);
            } finally {
                this.isSubmitting = false;
            }
        }
    }

    isFormValid(): boolean {
        return !!(
            this.newSearch.idEntreprise &&
            this.newSearch.nomContact!.trim() &&
            this.newSearch.prenomContact!.trim() &&
            this.newSearch.fonctionContact!.trim() &&
            this.newSearch.telephoneContact!.match(/^(\+33|0)\d{9}$/) &&
            this.newSearch.adresseMailContact!.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
            this.newSearch.date1erContact! &&
            this.newSearch.typeContact!.trim() &&
            this.newSearch.statut!.trim()
        );
    }

    isCompanyFormValid(): boolean {
        return !!(
            this.newCompany.raisonSociale!.trim() &&
            this.newCompany.adresse!.trim() &&
            this.newCompany.codePostal!.match(/^\d{5}$/) &&
            this.newCompany.ville!.trim() &&
            this.newCompany.pays!.trim()
        );
    }

    onCancel() {
        this.navigationService.goBack();
    }

    getStatusButtonClass(status: string, position: 'first' | 'middle' | 'last'): string {
        const isSelected = this.newSearch.statut === status;
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

    setStatus(statut: SearchStatus) {
        this.newSearch.statut = statut;
    }

    openCompanyForm() {
        this.showCompanyModal = true;
    }

    //Création de l'entreprise en BD
    async createCompany() {        
        if (this.isCompanyFormValid()) {
            try {
                this.isCreatingCompany = true;
                const newCompany = await firstValueFrom(this.companyService.addCompany(this.newCompany));

                if (newCompany) {
                    // Ajout à la liste des entreprises
                    this.companies = [...this.companies, newCompany];
                    
                    // Utiliser la méthode selectCompany pour assurer une sélection cohérente
                    this.selectCompany(newCompany);
                    
                    // Fermeture de la modale
                    this.showCompanyModal = false;
                }
            } catch (error) {
                console.error('Erreur lors de la création de l\'entreprise:', error);
            } finally {
                this.isCreatingCompany = false;
            }
        }
    }    

    selectCompany(company: Company) {
        this.selectedCompany = company;
        this.newSearch.idEntreprise = company.idEntreprise;
        this.searchTerm = company.raisonSociale ? company.raisonSociale : '';
        this.showDropdown = false;
    }
}