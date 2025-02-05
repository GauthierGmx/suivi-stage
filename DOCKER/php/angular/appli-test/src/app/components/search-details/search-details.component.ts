import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { InternshipSearch } from '../../models/internship-search.model';
import { Company } from '../../models/company.model';
import { InternshipSearchService } from '../../services/internship-search.service';
import { CompanyService } from '../../services/company.service';
import { NavigationService } from '../../services/navigation.service';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'app-search-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './search-details.component.html',
    styleUrl: './search-details.component.css'
})
export class SearchDetailsComponent implements OnInit {
    search?: InternshipSearch;
    company?: Company;
    dataLoaded: boolean = false;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService
    ) {}

    ngOnInit() {
        const searchId = Number(this.route.snapshot.paramMap.get('id'));
        
        if (searchId) {
            this.internshipSearchService.getSearchById(searchId).subscribe(
                search => {
                    if (search) {
                        this.search = search;
                        console.log(this.search);
                        this.loadCompanyDetails(search.idEntreprise);
                    }
                }
            );
        }
    }

    private loadCompanyDetails(companyId: number) {
        this.companyService.getCompanyById(companyId).subscribe(
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

    goBack() {
        this.navigationService.goBack();
    }
}
