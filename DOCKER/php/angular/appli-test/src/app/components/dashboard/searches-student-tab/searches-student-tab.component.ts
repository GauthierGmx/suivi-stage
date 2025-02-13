import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipSearch, SearchStatus } from '../../../models/internship-search.model';
import { Staff } from '../../../models/staff.model';
import { Student } from '../../../models/student.model';
import { Company } from '../../../models/company.model';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { NavigationService } from '../../../services/navigation.service';
import { StudentService } from '../../../services/student.service';
import { CompanyService } from '../../../services/company.service';
import { AppComponent } from '../../../app.component';
import { Subject, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

@Component({
    selector: 'app-searches-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

    constructor(
        private readonly internshipSearchService: InternshipSearchService,
        private readonly studentService: StudentService,
        private readonly navigationService: NavigationService,
        private readonly companyService: CompanyService,
        private readonly appComponent: AppComponent
    ) {}

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

        this.searchTermSubject.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilters();
        });
    }

    loadData(studentId: string) {
        forkJoin({
            student: this.studentService.getStudentById(studentId),
            companies: this.companyService.getCompanies(),
            searches: this.internshipSearchService.getSearchesByStudentId(studentId)
        }).subscribe(({student, companies, searches}) => {
                this.studentData = student;
                this.companies = companies;
                this.searches = searches;
                this.getFilteredSearchesWithCompanies();
                this.dataLoaded.emit();
            }
        );
    }

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
            
            // Extraire les villes uniques
            this.availableCities = [...new Set(searchesWithCompany.map(item => item.company.ville))].sort();
            
            this.applyFilters();
        }
    }

    applyFilters() {
        if (!this.originalSearchesWithCompany) return;

        let filteredSearches = [...this.originalSearchesWithCompany];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
    
        filteredSearches.forEach(s => {
            if (!(s.search.dateCreation instanceof Date)) {
                s.search.dateCreation = new Date(s.search.dateCreation);
            }
        });
    
        // Appliquer le filtre de recherche textuelle
        if (searchTermLower) {
            filteredSearches = filteredSearches.filter(s =>
                s.company.raisonSociale.toLowerCase().includes(searchTermLower) ||
                s.company.ville.toLowerCase().includes(searchTermLower) ||
                this.getStatusLabel(s.search.statut).toLowerCase().includes(searchTermLower)
            );
        }
    
        // Appliquer les filtres de statut
        if (this.currentStatutFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.search.statut === this.currentStatutFilter);
        }

        // Appliquer le filtre de ville
        if (this.currentCityFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.company.ville === this.currentCityFilter);
        }
    
        // Appliquer le tri par date
        if (this.currentDateFilter === 'date_asc') {
            filteredSearches.sort((a, b) => a.search.dateCreation.getTime() - b.search.dateCreation.getTime());
        }
        else if (this.currentDateFilter === 'date_desc') {
            filteredSearches.sort((a, b) => b.search.dateCreation.getTime() - a.search.dateCreation.getTime());
        }
    
        this.filteredSearchesWithCompany = filteredSearches;
    }

    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.searchTerm = target.value;
            this.searchTermSubject.next(this.searchTerm);
        }
    }

    clearSearchTerm() {
        this.searchTerm = '';
        this.searchTermSubject.next(this.searchTerm);
    }

    setStatutFilter(filter: 'all' | 'Refusé' | 'En cours' | 'Relancé' | 'Validé', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter;
        this.applyFilters();
        selectElement.blur(); // Retirer le focus après sélection
    }
    
    setCityFilter(city: string, selectElement: HTMLSelectElement) {
        this.currentCityFilter = city;
        this.applyFilters();
        selectElement.blur(); // Retirer le focus après sélection
    }

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

    getStatusLabel(status: SearchStatus): string {
        const labels: Record<SearchStatus, string> = {
            'Relancé': 'Relancé',
            'Validé': 'Validé',
            'En cours': 'En attente',
            'Refusé': 'Refusé'
        };
        return labels[status];
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'Relancé': 'status-badge relance',
            'Validé': 'status-badge valide',
            'En cours': 'status-badge en-attente',
            'Refusé': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    goToSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }

    goToUpdateSearchFormView(searchId: number) {
        this.navigationService.navigateToSearchEditForm(searchId);
    }
}