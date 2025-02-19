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
        //Configuration du filtrage des entreprises
        this.searchTermChanged.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(term => {
            if (term) {
                this.filteredCompanies = this.companies
                    .filter(company => 
                        company.raisonSociale.toLowerCase()
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

    async ngOnInit() {
        //Récupération de la recherche de stage et de son entreprise concernée
        const searchId = Number(this.router.snapshot.paramMap.get('id'));
        const search = await firstValueFrom(this.internshipSearchService.getSearchById(searchId));
        if (search) {
            this.updatedSearch = search
        };

        const company = await firstValueFrom(this.companyService.getCompanyById(this.updatedSearch.idEntreprise));
        if (company) {
            this.selectCompany(company)
        };

        //Récupération du currentUser
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }

        //Récupération de toutes les entreprises
        this.companyService.getCompanies()
        .subscribe(companies => {
            this.companies = companies;
            this.dataLoaded = true;
        });
    }

    //Fermeture de la liste des résultats de la recherche si l'utilisateur clique en dehors de cette dernière
    @HostListener('document:click', ['$event.target'])
    onClick(targetElement: HTMLElement) {
        if (this.showDropdown) {
            const clickedOutsideDropdown = targetElement.closest('.dropdown');
            if (!clickedOutsideDropdown) {
                this.showDropdown = false;
            }
        }
    }

    //Mise à jour du terme à rechercher
    onSearchChange(term: string) {
        this.searchTermChanged.next(term);
    }

    //Mise à jour de la recherche de stage lors de la validation du formulaire
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

    //Vérification si le formulaire de la recherche de stage est valide
    isFormValid(): boolean {
        return !!(
            this.updatedSearch.idEntreprise &&
            this.updatedSearch.nomContact.trim() &&
            this.updatedSearch.prenomContact.trim() &&
            this.updatedSearch.fonctionContact.trim() &&
            this.updatedSearch.telephoneContact?.match(/^[0-9]{10}$/) &&
            this.updatedSearch.adresseMailContact?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
            this.updatedSearch.date1erContact &&
            this.updatedSearch.typeContact.trim() &&
            this.updatedSearch.statut.trim()
        );
    }

    //Vérification si le formulaire de l'entreprise est valide
    isCompanyFormValid(): boolean {
        return !!(
            this.newCompany.raisonSociale.trim() &&
            this.newCompany.adresse.trim() &&
            this.newCompany.codePostal?.match(/^\d{5}$/) &&
            this.newCompany.ville.trim() &&
            this.newCompany.pays.trim()
        );
    }

    //Retour en arrière si la modification est annulée
    onCancel() {
        this.navigationService.goBack();
    }

    //Récupération de la classe du bouton de statut sélectionné
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

    //Mise à jour du statut de la recherche de stage
    setStatus(statut: SearchStatus) {
        this.updatedSearch.statut = statut;
    }

    //Ouverture du formulaire de création d'une entreprise
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

    //Association de l'entreprise à la recherche créée/sélectionnée
    selectCompany(company: Company) {
        this.selectedCompany = company;
        this.updatedSearch.idEntreprise = company.idEntreprise;
        this.searchTerm = company.raisonSociale;
        this.showDropdown = false;
    }
}