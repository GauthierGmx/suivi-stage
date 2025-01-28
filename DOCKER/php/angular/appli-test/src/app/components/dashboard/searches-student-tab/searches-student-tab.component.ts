import { Component, OnInit, Input } from '@angular/core';
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
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-searches-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './searches-student-tab.component.html',
    styleUrls: ['./searches-student-tab.component.css']
})
export class SearchesStudentTabComponent implements OnInit {
    @Input() currentUser!: Student | Staff;
    currentUserId!: string;
    currentUserRole!: string;
    currentPageUrl!: string;
    studentData?: Student;
    searches?: InternshipSearch[];
    searchTerm: string = '';
    searchTermSubject = new Subject<string>();
    filteredSearchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
    currentFilter: 'all' | 'waiting' | 'validated' | 'date_asc' | 'date_desc' = 'all';

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

        this.loadUserData(this.currentUserId);
        this.getFilteredSearchesWithCompanies();

        this.searchTermSubject.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(() => {
            this.getFilteredSearchesWithCompanies();
        });
    }

    private loadUserData(userId: string) {
        this.studentData = this.studentService.getStudentById(userId);
        if (this.studentData) {
            this.searches = this.internshipSearchService.getSearchesByStudentId(userId);
        }
    }

    getFilteredSearchesWithCompanies() {
        if (!this.searches) return;

        const searchCompanies = this.companyService.getCompanies().filter(
            c => this.searches!.some(s => c.idEntreprise === s.idEntreprise)
        );

        let searchesWithCompany = this.searches.map(search => {
            const company = searchCompanies.find(c => c.idEntreprise === search.idEntreprise);
            return company ? { search, company } : null;
        }).filter((result): result is { search: InternshipSearch; company: Company } => result !== null);

        // Appliquer les filtres
        searchesWithCompany = this.applyFilters(searchesWithCompany);
        
        // Mettre à jour la propriété qui déclenche la mise à jour du template
        this.filteredSearchesWithCompany = searchesWithCompany;
    }

    private applyFilters(searches: { search: InternshipSearch; company: Company }[]) {
        let filtered = [...searches];
        const searchTermLower = this.searchTerm.toLowerCase().trim();

        // Appliquer le filtre de recherche textuelle
        if (searchTermLower) {
            filtered = filtered.filter(s =>
                s.company.raisonSociale.toLowerCase().includes(searchTermLower) ||
                s.company.ville.toLowerCase().includes(searchTermLower) ||
                this.getStatusLabel(s.search.statut).toLowerCase().includes(searchTermLower)
            );
        }

        // Appliquer les filtres de statut et de tri
        switch (this.currentFilter) {
            case 'waiting':
                filtered = filtered.filter(s => s.search.statut === 'En attente');
                break;
            case 'validated':
                filtered = filtered.filter(s => s.search.statut === 'Validé');
                break;
            case 'date_asc':
                filtered.sort((a, b) => a.search.dateCreation.getTime() - b.search.dateCreation.getTime());
                break;
            case 'date_desc':
                filtered.sort((a, b) => b.search.dateCreation.getTime() - a.search.dateCreation.getTime());
                break;
        }

        return filtered;
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

    setFilter(filter: 'all' | 'waiting' | 'validated') {
        this.currentFilter = filter;
        this.getFilteredSearchesWithCompanies();
    }

    toggleDateSort() {
        if (this.currentFilter === 'date_asc') {
            this.currentFilter = 'date_desc';
        }
        else if (this.currentFilter === 'date_desc') {
            this.currentFilter = 'all';
        }
        else {
            this.currentFilter = 'date_asc';
        }
        this.getFilteredSearchesWithCompanies();
    }

    getStatusLabel(status: SearchStatus): string {
        const labels: Record<SearchStatus, string> = {
            'Relancé': 'Relancé',
            'Validé': 'Validé',
            'En attente': 'En attente',
            'Refusé': 'Refusé'
        };
        return labels[status];
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'Relancé': 'status-badge relance',
            'Validé': 'status-badge valide',
            'En attente': 'status-badge en-attente',
            'Refusé': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    viewSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }
}