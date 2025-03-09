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

    private loadCompanyDetails(companyId: number) {
        this.companyService.getCompanyById(companyId, ['idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville']).subscribe(
            company => {
                console.log(company);
                this.company = company;
                this.dataLoaded = true;
            }
        );
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

    goToDashboard() {
        this.navigationService.navigateToDashboard();
    }

    goToEdit() {
        if (this.search) {
            this.navigationService.navigateToSearchEditForm(this.search.idRecherche);
        }
    }
}
