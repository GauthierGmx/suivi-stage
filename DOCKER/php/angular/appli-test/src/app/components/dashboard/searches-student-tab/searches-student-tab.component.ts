
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
    searchesWithCompany: { search: InternshipSearch; company: Company }[] = [];
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
        this.getFilteredSearchesWithCompanies(this.currentUserId);
    }

    private loadUserData(userId: string) {
        this.studentData = this.studentService.getStudentById(userId);
        if (this.studentData) {
            this.searches = this.internshipSearchService.getSearchesByStudentId(userId);
        }
    }

    getFilteredSearchesWithCompanies(studentId: string) {
        const searches = this.searches;
        let filteredSearches: InternshipSearch[] = [];
        let searchCompanies: Company[] = [];
    
        if (searches && this.searchTerm.trim()) {
            const searchTermLower = this.searchTerm.toLowerCase().trim();
    
            searchCompanies = this.companyService.getCompanies().filter(
                c => (
                    c.raisonSociale.toLowerCase().includes(searchTermLower) ||
                    c.ville.toLowerCase().includes(searchTermLower)
                ) && 
                searches.some(
                    s => c.idEntreprise === s.idEntreprise
                )
            );
    
            if (searchCompanies) {
                filteredSearches = searches.filter(
                    search => (
                        this.getStatusLabel(search.statut).toLowerCase().includes(searchTermLower)
                    ) &&
                    searchCompanies.some(
                        c => search.idEntreprise === c.idEntreprise &&
                        search.idUPPA === studentId
                    )
                );
            }
        } else if (searches) {
            filteredSearches = searches.filter(
                s => s.idUPPA === studentId
            );
    
            searchCompanies = this.companyService.getCompanies().filter(
                c => filteredSearches.some(
                    s => c.idEntreprise === s.idEntreprise
                )
            );
        }
    
        if (filteredSearches) {
            switch (this.currentFilter) {
                case 'all':
                    break;
                case 'waiting':
                    filteredSearches = filteredSearches.filter(s => s.statut === 'En attente');
                    break;
                case 'validated':
                    filteredSearches = filteredSearches.filter(s => s.statut === 'Validé');
                    break;
                case 'date_asc':
                    filteredSearches.sort((a, b) => a.dateCreation.getTime() - b.dateCreation.getTime());
                    break;
                case 'date_desc':
                    filteredSearches.sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime());
                    break;
            }
        }
    
        this.searchesWithCompany = filteredSearches.map(search => {
                const company = searchCompanies.find(c => c.idEntreprise === search.idEntreprise);
                if (company) {
                    return { search, company };
                }
                return null;
        }).filter((result): result is { search: InternshipSearch; company: Company } => result !== null);
    }
    

    setFilter(filter: 'all' | 'waiting' | 'validated') {
        this.currentFilter = filter;
        this.getFilteredSearchesWithCompanies(this.currentUserId);
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
        this.getFilteredSearchesWithCompanies(this.currentUserId);
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
} 
