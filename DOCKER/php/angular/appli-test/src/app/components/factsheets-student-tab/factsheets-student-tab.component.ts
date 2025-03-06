import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { Staff } from '../../models/staff.model';
import { Company } from '../../models/company.model';
import { Factsheets } from '../../models/description-sheet.model';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';

@Component({
  selector: 'app-factsheets-student-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factsheets-student-tab.component.html',
  styleUrls: ['./factsheets-student-tab.component.css'],
})
export class FactsheetsStudentTabComponent implements OnInit {
  @Input() currentUser!: Student | Staff;
  @Output() dataLoaded = new EventEmitter<void>();
  currentUserId!: string;
  currentUserRole!: string;
  studentData?: Student;
  companies?: Company[];
  sheets?: Factsheets[];
  searchTerm: string = '';
  searchTermSubject = new Subject<string>();
  filteredSheetsWithCompanies: { sheet: Factsheets; company: Company }[] = [];
  currentDateFilter: 'all' | 'date_asc' | 'date_desc' = 'all';
  allDataLoaded: Boolean = false;

  constructor(
    private readonly studentService: StudentService,
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
    private readonly companyService: CompanyService,
    private readonly factsheetsService: FactsheetsService
  ) {}

    ngOnInit() {
        if (this.currentUser) {          
            if (this.authService.isStudent(this.currentUser)) {
                this.currentUserRole = 'STUDENT';
                this.currentUserId = this.currentUser.idUPPA;
            }
            else if (this.authService.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
                this.currentUserRole = 'INTERNSHIP_MANAGER';
                this.currentUserId = `${this.currentUser.idPersonnel}`;
            }

            this.searchTermSubject.pipe(
                debounceTime(800),
                distinctUntilChanged()
            ).subscribe(() => {
                this.getFilteredSheetsWithCompanies();
            });
            
            this.loadData(this.currentUserId);
        }
    }
    
    loadData(studentId: string) {
        forkJoin({
            student: this.studentService.getStudentById(studentId),
            companies: this.companyService.getCompanies(),
            sheets: this.factsheetsService.getSheetsByStudentId(studentId)
        }).subscribe(({student, companies, sheets}) => {
                this.studentData = student;
                this.companies = companies;
                this.sheets = sheets;
                this.getFilteredSheetsWithCompanies();
                this.dataLoaded.emit();
            }
        );
    }

    getFilteredSheetsWithCompanies() {
        if (this.companies && this.sheets) {
            let searchCompanies: Company[] = this.companies.filter(
                c => this.sheets!.some(
                    s => c.idEntreprise === s.idEntreprise
                )
            );
    
            let searchesWithCompany = this.sheets.map(sheet => {
                const company = searchCompanies.find(c => c.idEntreprise === sheet.idEntreprise);
                return company ? { sheet, company } : null;
            }).filter((result): result is { sheet: Factsheets; company: Company } => result !== null);
            
            // Appliquer les filtres
            searchesWithCompany = this.applyFilters(searchesWithCompany);
    
            // Mettre à jour la propriété qui déclenche la mise à jour du template
            this.filteredSheetsWithCompanies = searchesWithCompany;
        }
    }
    
    applyFilters(sheets: { sheet: Factsheets; company: Company }[]) {
        let filtered = [...sheets];
        const searchTermLower = this.searchTerm.toLowerCase().trim();

        // Appliquer le filtre de recherche textuelle
        if (searchTermLower) {
            filtered = sheets.filter(s =>
                s.company.raisonSociale!.toLowerCase().includes(searchTermLower) ||
                s.company.ville!.toLowerCase().includes(searchTermLower)
            );
        }

        // Appliquer les filtres de statut et de tri
        switch (this.currentDateFilter) {
            case 'date_asc':
                filtered.sort((a, b) => a.sheet.dateCreation!.getTime() - b.sheet.dateCreation!.getTime());
                break;
            case 'date_desc':
                filtered.sort((a, b) => b.sheet.dateCreation!.getTime() - a.sheet.dateCreation!.getTime());
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


    toggleDateSort() {
        if (this.currentDateFilter === 'date_asc') {
            this.currentDateFilter = 'date_desc';
        }
        else if (this.currentDateFilter === 'date_desc') {
            this.currentDateFilter = 'all';
        }
        else {
            this.currentDateFilter = 'date_asc';
        }
        this.getFilteredSheetsWithCompanies();
    }

    viewSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }
}