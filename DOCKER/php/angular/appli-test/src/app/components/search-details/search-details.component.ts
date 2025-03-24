import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student.model';
import { InternshipSearch } from '../../models/internship-search.model';
import { Company } from '../../models/company.model';
import { AuthService } from '../../services/auth.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { CompanyService } from '../../services/company.service';
import { NavigationService } from '../../services/navigation.service';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";

@Component({
    selector: 'app-search-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent, BreadcrumbComponent],
    templateUrl: './search-details.component.html',
    styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent implements OnInit {
    selectedStudent?: Student;
    currentUserRole?: string;
    search?: InternshipSearch;
    company?: Company;
    dataLoaded: boolean = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService
    ) {}

    /**
     * Initializes the component by:
     * 1. Setting up the current user role
     * 2. Loading the selected student from session storage
     * 3. Retrieving search details based on the URL parameter
     */
    ngOnInit() {
        let currentUser;
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
        }

        if (this.authService.isStudent(currentUser)) {
            this.currentUserRole = 'STUDENT';
        }
        else if (this.authService.isStaff(currentUser)) {
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }

        const selectedStudent = sessionStorage.getItem('selectedStudent');
        if (selectedStudent) {
            this.selectedStudent = JSON.parse(selectedStudent);
        }

        const searchId = Number(this.route.snapshot.paramMap.get('idSearch'));
        
        if (searchId) {
            this.internshipSearchService.getSearchById(searchId).subscribe(
                search => {
                    if (search) {
                        this.search = search;
                        this.loadCompanyDetails(search.idEntreprise!);
                    }
                }
            );
        }
    }

    /**
     * Loads company details based on the provided company ID
     * @param companyId - The ID of the company to load
     */
    private loadCompanyDetails(companyId: number) {
        this.companyService.getCompanyById(companyId, ['idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville']).subscribe(
            company => {
                this.company = company;
                this.dataLoaded = true;
            }
        );
    }

    /**
     * Returns the CSS class for the search status badge
     * @param status - The status string to map to a CSS class
     * @returns The corresponding CSS class for the status
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
     * Navigates to the dashboard page
     */
    goToDashboard() {
        this.navigationService.navigateToDashboard();
    }

    /**
     * Navigates to the edit form for the current search
     */
    goToEdit() {
        if (this.search) {
            this.navigationService.navigateToSearchEditForm(this.search.idRecherche);
        }
    }

    /**
     * Navigates back to the previous page
     */
    goBack() {
        this.navigationService.goBack();
    }
}
