import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { InternshipSearchService } from '../../services/internship-search.service';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { AppComponent } from '../../app.component';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, firstValueFrom, tap } from 'rxjs';

@Component({
    selector: 'app-searches-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
    templateUrl: './searches-student-tab.component.html',
    styleUrls: ['./searches-student-tab.component.css']
})
export class SearchesStudentTabComponent implements OnInit {
    @Input() currentUser!: Student | Staff;
    @Output() dataLoaded = new EventEmitter<void>();
    currentUserId!: string;
    currentUserRole!: string;
    currentPageUrl!: string;
    studentData?: Student;
    companies?: Company[];
    searches?: InternshipSearch[];
    searchTerm: string = '';
    searchTermSubject = new Subject<string>();
    filteredSearchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
    originalSearchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
    currentStatutFilter: 'all' | 'Refusé' | 'En cours' | 'Relancé' | 'Validé' = 'all';
    currentDateFilter: 'default' | 'date_asc' | 'date_desc' = 'default';
    currentCityFilter: string = 'all';
    availableCities: string[] = [];
    showDeleteModal = false;
    isDeleting = false;
    searchToDelete?: InternshipSearch;

    constructor(
        private readonly internshipSearchService: InternshipSearchService,
        private readonly studentService: StudentService,
        private readonly navigationService: NavigationService,
        private readonly companyService: CompanyService,
        private readonly appComponent: AppComponent
    ) {
        this.searchTermSubject.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilters();
        });
    }

    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();

        if (this.appComponent.isStudent(this.currentUser)) {
            this.currentUserId = this.currentUser.idUPPA;
            this.currentUserRole = 'STUDENT';
        }
        else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
            this.currentUserId = `${this.currentUser.idPersonnel}`;
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }

        this.loadData(this.currentUserId);
    }

    //Chargement des données de l'étudiant, de ses recherches de stages et des entreprises liées
    loadData(studentId: string) {
        return firstValueFrom(forkJoin({
            student: this.studentService.getStudentById(studentId),
            companies: this.companyService.getCompanies(),
            searches: this.internshipSearchService.getSearchesByStudentId(studentId)
        }).pipe(
            tap(({ student, companies, searches }) => {
                this.studentData = student;
                this.companies = companies;
                this.searches = searches;
                this.getFilteredSearchesWithCompanies();
                this.dataLoaded.emit();
            })
        ));
    }

    //Récupération des recherches, et des entreprises associées, d'un étudiant avec l'application des filtres
    getFilteredSearchesWithCompanies() {
        if (this.companies && this.searches) {
            let searchCompanies: Company[] = this.companies.filter(
                c => this.searches!.some(
                    s => c.idEntreprise === s.idEntreprise
                )
            );
    
            let searchesWithCompany = this.searches.map(search => {
                const company = searchCompanies.find(c => c.idEntreprise === search.idEntreprise);
                return company ? { search, company } : null;
            }).filter((result): result is { search: InternshipSearch; company: Company } => result !== null);
    
            this.originalSearchesWithCompany = [...searchesWithCompany];
            this.filteredSearchesWithCompany = [...searchesWithCompany];
            
            this.availableCities = [...new Set(searchesWithCompany.map(item => item.company.ville))].sort();
            
            this.applyFilters();
        }
    }

    //Application des filtres et de la barre de recherche
    applyFilters() {
        if (!this.originalSearchesWithCompany) return;

        let filteredSearches = [...this.originalSearchesWithCompany];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
    
        filteredSearches.forEach(s => {
            if (!(s.search.dateCreation instanceof Date)) {
                s.search.dateCreation = new Date(s.search.dateCreation);
            }
        });
    
        if (searchTermLower) {
            filteredSearches = filteredSearches.filter(s =>
                s.company.raisonSociale.toLowerCase().includes(searchTermLower) ||
                s.company.ville.toLowerCase().includes(searchTermLower) ||
                this.getStatusLabel(s.search.statut).toLowerCase().includes(searchTermLower)
            );
        }
    
        if (this.currentStatutFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.search.statut === this.currentStatutFilter);
        }

        if (this.currentCityFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.company.ville === this.currentCityFilter);
        }
    
        if (this.currentDateFilter === 'date_asc') {
            filteredSearches.sort((a, b) => a.search.dateCreation.getTime() - b.search.dateCreation.getTime());
        }
        else if (this.currentDateFilter === 'date_desc') {
            filteredSearches.sort((a, b) => b.search.dateCreation.getTime() - a.search.dateCreation.getTime());
        }
    
        this.filteredSearchesWithCompany = filteredSearches;
    }

    //Récupération de la valeur de la barre de recherche à rechercher
    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.searchTerm = target.value;
            this.searchTermSubject.next(this.searchTerm);
        }
    }

    //Réinitialisation à vide du contenu de la barre de recherche
    clearSearchTerm() {
        this.searchTerm = '';
        this.searchTermSubject.next(this.searchTerm);
    }

    //Mise à jour de la valeur du filtre de statut d'une recherche de stage
    setStatutFilter(filter: 'all' | 'Refusé' | 'En cours' | 'Relancé' | 'Validé', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter;
        this.applyFilters();
        selectElement.blur();
    }
    
    //Mise à jour de la valeur du filtre lié à la ville d'une recherche de stage
    setCityFilter(city: string, selectElement: HTMLSelectElement) {
        this.currentCityFilter = city;
        this.applyFilters();
        selectElement.blur();
    }

    //Changement de l'ordre de filtrage des recherches
    toggleDateSort() {
        switch (this.currentDateFilter) {
            case 'default':
                this.currentDateFilter = 'date_asc';
                break;
            case 'date_asc':
                this.currentDateFilter = 'date_desc';
                break;
            case 'date_desc':
                this.currentDateFilter = 'default';
                break;
        }
        this.applyFilters();
    }

    //Récupération du label lié à un statut
    getStatusLabel(status: SearchStatus): string {
        const labels: Record<SearchStatus, string> = {
            'Relancé': 'Relancé',
            'Validé': 'Validé',
            'En cours': 'En attente',
            'Refusé': 'Refusé'
        };
        return labels[status];
    }

    //Récupération de la classe lié à un statut
    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'Relancé': 'status-badge relance',
            'Validé': 'status-badge valide',
            'En cours': 'status-badge en-attente',
            'Refusé': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    //Redirection vers la vue de consultation d'une recherche de stage
    goToSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    //Redirection vers la vu d'ajout d'une recherche de stage
    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }

    //Redirection vers la vue de mise à jour d'une recherche de stage
    goToUpdateSearchFormView(searchId: number) {
        this.navigationService.navigateToSearchEditForm(searchId);
    }

    //Affiche la fenêtre modale de confirmation de la supression d'une recherche de stage
    openDeleteModal(search: InternshipSearch) {
        this.searchToDelete = search;
        this.showDeleteModal = true;
    }

    //Suppression de la recherche de stage sélectionnée
    async onConfirmDelete() {
        if (this.searchToDelete) {
            try {
                this.isDeleting = true;
                await firstValueFrom(this.internshipSearchService.deleteSearch(this.searchToDelete));
                await this.loadData(this.currentUserId);
            }
            catch (error) {
                console.error('Erreur lors de la suppression de la recherche:', error);
            }
            finally {
                this.isDeleting = false;
                this.showDeleteModal = false;
                this.searchToDelete = undefined;
            }
        }
    }

    //Annulation de la suppression d'une recherche de stage
    onCancelDelete() {
        this.showDeleteModal = false;
        this.searchToDelete = undefined;
    }
}