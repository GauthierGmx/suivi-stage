import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { InternshipSearchService } from '../../services/internship-search.service';
import { NavigationService } from '../../services/navigation.service';
import { CompanyService } from '../../services/company.service';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, firstValueFrom, tap } from 'rxjs';

const NB_MILLIIEMES_PAR_JOUR = 24 * 60 * 60 * 1000;

@Component({
    selector: 'app-searches-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
    templateUrl: './searches-student-tab.component.html',
    styleUrls: ['./searches-student-tab.component.css']
})
export class SearchesStudentTabComponent implements OnInit {
    @Input() student!: Student;
    @Input() currentUserRole?: string;
    @Output() dataLoaded = new EventEmitter<void>();
    companies?: Company[];
    searches?: InternshipSearch[];
    searchTerm: string = '';
    searchTermSubject = new Subject<string>();
    filteredSearchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
    originalSearchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
    currentStatutFilter: 'all' | 'Refusé' | 'En cours' | 'Relancé' | 'Validé' = 'all';
    currentDateFilter: 'default' | 'date_asc' | 'date_desc' = 'default';
    currentCityFilter: string = 'all';
    maxDaysFilter: number = 0;
    availableCities: string[] = [];
    showDeleteModal = false;
    isDeleting = false;
    searchToDelete?: InternshipSearch;

    constructor(
        private readonly internshipSearchService: InternshipSearchService,
        private readonly navigationService: NavigationService,
        private readonly companyService: CompanyService,
        private readonly cdr: ChangeDetectorRef
    ) {
        this.searchTermSubject.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilters();
        });
    }

    ngOnInit() {
        this.loadData();
    }

    /**
     * Loads student data, their internship searches and related companies
     */
    loadData() {
        const searchFields = ['idRecherche', 'dateCreation', 'statut', 'idEntreprise'];
    
        if (this.currentUserRole === 'INTERNSHIP_MANAGER') {
            searchFields.push('dateModification');
        }
    
        return firstValueFrom(forkJoin({
            companies: this.companyService.getCompanies(['idEntreprise', 'raisonSociale', 'ville']),
            searches: this.internshipSearchService.getSearchesByStudentId(this.student.idUPPA, searchFields)
        }).pipe(
            tap(({ companies, searches }) => {
                this.companies = companies;
                this.searches = searches;
                this.getFilteredSearchesWithCompanies();
                this.dataLoaded.emit();
            })
        ));
    }
    

    /**
     * Retrieves filtered searches with associated companies for a student
     */
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
            
            this.availableCities = searchesWithCompany ? [...new Set(searchesWithCompany.map(item => item.company.ville).filter(ville => ville !== null))].sort() : [];
            
            this.applyFilters();
        }
        else {
            this.filteredSearchesWithCompany = [];
        }
    }

    /**
     * Applies all active filters and search terms to the list of searches
     */
    applyFilters() {
        if (!this.originalSearchesWithCompany) return;

        let filteredSearches = [...this.originalSearchesWithCompany];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
        const now = new Date();
    
        filteredSearches.forEach(s => {
            if (!(s.search.dateCreation instanceof Date)) {
                s.search.dateCreation = new Date(s.search.dateCreation!);
            }
        });
    
        if (searchTermLower) {
            filteredSearches = filteredSearches.filter(s =>
                s.company.raisonSociale!.toLowerCase().includes(searchTermLower) ||
                s.company.ville!.toLowerCase().includes(searchTermLower) ||
                this.getStatusLabel(s.search.statut!).toLowerCase().includes(searchTermLower)
            );
        }
    
        if (this.currentStatutFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.search.statut === this.currentStatutFilter);
        }

        if (this.currentCityFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.company.ville === this.currentCityFilter);
        }
    
        if (this.currentUserRole === 'STUDENT') {
            if (this.currentDateFilter === 'date_asc') {
                filteredSearches.sort((a, b) => a.search.dateCreation!.getTime() - b.search.dateCreation!.getTime());
            }
            else if (this.currentDateFilter === 'date_desc') {
                filteredSearches.sort((a, b) => b.search.dateCreation!.getTime() - a.search.dateCreation!.getTime());
            }
        }
        else if (this.currentUserRole === 'INTERNSHIP_MANAGER') {
            if (this.currentDateFilter === 'date_asc') {
                filteredSearches.sort((a, b) => new Date(a.search.dateModification!).getTime() - new Date(b.search.dateModification!).getTime());
            }
            else if (this.currentDateFilter === 'date_desc') {
                filteredSearches.sort((a, b) => new Date(b.search.dateModification!).getTime() - new Date(a.search.dateModification!).getTime());
            }
    
            //Application du filtre de récupération des recherches des X derniers jours
            if (this.maxDaysFilter > 0) {
                filteredSearches = filteredSearches.filter(s => {
                    const creationDate = new Date(s.search.dateCreation!);
                    return (now.getTime() - creationDate.getTime()) <= this.maxDaysFilter * NB_MILLIIEMES_PAR_JOUR;
                });
            }
        }
    
        this.filteredSearchesWithCompany = filteredSearches;
    }

    /**
     * Sets the maximum days filter for retrieving student searches
     * @param days Number of days to filter by
     */
    setMaxDaysFilter(days: number) {
        this.maxDaysFilter = days;
        this.applyFilters();
    }

    /**
     * Handles search term changes from the search input
     * @param event Input event containing the new search value
     */
    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.searchTerm = target.value;
            this.searchTermSubject.next(this.searchTerm);
        }
    }

    /**
     * Clears the search term and triggers a new filter
     */
    clearSearchTerm() {
        this.searchTerm = '';
        this.searchTermSubject.next(this.searchTerm);
    }

    /**
     * Updates the status filter and applies it
     * @param filter The new status filter to apply
     * @param selectElement The select element that triggered the change
     */
    setStatutFilter(filter: 'all' | 'Refusé' | 'En cours' | 'Relancé' | 'Validé', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter;
        this.applyFilters();
        selectElement.blur();
    }
    
    /**
     * Updates the city filter and applies it
     * @param city The new city to filter by
     * @param selectElement The select element that triggered the change
     */
    setCityFilter(city: string, selectElement: HTMLSelectElement) {
        this.currentCityFilter = city;
        this.applyFilters();
        selectElement.blur();
    }

    /**
     * Toggles the date sort order cycling through default, ascending, and descending
     */
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

    /**
     * Returns the display label for a given search status
     * @param status The search status to get the label for
     */
    getStatusLabel(status: SearchStatus): string {
        const labels: Record<SearchStatus, string> = {
            'Relancé': 'Relancé',
            'Validé': 'Validé',
            'En cours': 'En attente',
            'Refusé': 'Refusé'
        };
        return labels[status];
    }

    /**
     * Returns the CSS class for a given status
     * @param status The status to get the class for
     */
    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'Relancé': 'status-badge relance',
            'Validé': 'status-badge valide',
            'En cours': 'status-badge en-attente',
            'Refusé': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    /**
     * Navigates to the search details view
     * @param searchId The ID of the search to view
     */
    goToSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    /**
     * Navigates to the add search form view
     */
    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }

    /**
     * Navigates to the search update form view
     * @param searchId The ID of the search to edit
     */
    goToUpdateSearchFormView(searchId: number) {
        this.navigationService.navigateToSearchEditForm(searchId);
    }

    /**
     * Opens the delete confirmation modal for a search
     * @param search The search to be deleted
     */
    openDeleteModal(search: InternshipSearch) {
        this.searchToDelete = search;
        this.showDeleteModal = true;
    }

    /**
     * Handles the confirmation of search deletion
     */
    async onConfirmDelete() {
        if (this.searchToDelete) {
            try {
                this.isDeleting = true;
                await firstValueFrom(this.internshipSearchService.deleteSearch(this.searchToDelete));
                await this.loadData();
                this.cdr.detectChanges();
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

    /**
     * Cancels the search deletion operation
     */
    onCancelDelete() {
        this.showDeleteModal = false;
        this.searchToDelete = undefined;
    }
}