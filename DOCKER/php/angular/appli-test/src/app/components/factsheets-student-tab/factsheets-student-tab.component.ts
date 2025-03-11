import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { Staff } from '../../models/staff.model';
import { Company } from '../../models/company.model';
import { Factsheets, SheetStatus } from '../../models/description-sheet.model';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { CompanyService } from '../../services/company.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, firstValueFrom } from 'rxjs';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';


@Component({
  selector: 'app-factsheets-student-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
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
  currentStatutFilter: 'all' | 'BROUILLON' | 'VALIDE' | 'EN_REVISION' | 'REFUSE' = 'all';
  allDataLoaded: Boolean = false;
  sheetToDelete?: Factsheets;
  showDeleteModal = false;
  isDeleting = false;

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
                this.applyFilters();
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
            this.filteredSheetsWithCompanies = this.sheets.map(sheet => {
                const company = this.companies!.find(c => c.idEntreprise === sheet.idEntreprise);
                return { sheet, company: company! };
            });
            this.applyFilters();
            this.dataLoaded.emit();
        });
    }


    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'BROUILLON': 'status-badge relance',
            'VALIDE': 'status-badge valide',
            'EN_REVISION': 'status-badge en-attente',
            'REFUSE': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    setStatutFilter(filter: 'all' | 'BROUILLON' | 'VALIDE' | 'EN_REVISION' | 'REFUSE', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter;
        this.resetFilters();
        this.applyFilters();
        selectElement.blur();
    }

    // Nouvelle méthode pour réinitialiser les filtres
    resetFilters() {
        if(this.sheets){
            this.filteredSheetsWithCompanies = this.sheets.map(sheet => {
                const company = this.companies!.find(c => c.idEntreprise === sheet.idEntreprise);
                return { sheet, company: company! };
            });
        }
    }

    //Récupération du label lié à un statut
    getStatusLabel(status: SheetStatus): string {
        const labels: Record<SheetStatus, string> = {
            'BROUILLON': 'BROUILLON',
            'EN_REVISION': 'En révision',
            'VALIDE': 'Validé',
            'REFUSE': 'Refusé'
        };
        return labels[status];
    }


    


    //Application des filtres et de la barre de recherche
    applyFilters() {
        
    
        let filteredSearches = [...this.filteredSheetsWithCompanies];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
    
        // Convertir les dates de création en objets Date si nécessaire
        filteredSearches.forEach(s => {
            if (!(s.sheet.dateCreation instanceof Date)) {
                s.sheet.dateCreation = new Date(s.sheet.dateCreation!);
            }
        });
    
        // Appliquer le filtre de recherche textuelle
        if (searchTermLower) {
            filteredSearches = filteredSearches.filter(s =>
                s.company.raisonSociale!.toLowerCase().includes(searchTermLower) ||
                s.company.ville!.toLowerCase().includes(searchTermLower) ||
                this.getStatusLabel(s.sheet.statut!).toLowerCase().includes(searchTermLower)
            );
        }
    
        // Appliquer le filtre de statut
        if (this.currentStatutFilter !== 'all') {
            filteredSearches = filteredSearches.filter(s => s.sheet.statut === this.currentStatutFilter);
        }

        console.log("ALOOOO",this.currentStatutFilter);
    
        // Appliquer les filtres de tri par date
        if (this.currentDateFilter === 'date_asc') {
            filteredSearches.sort((a, b) => a.sheet.dateCreation!.getTime() - b.sheet.dateCreation!.getTime());
        } else if (this.currentDateFilter === 'date_desc') {
            filteredSearches.sort((a, b) => b.sheet.dateCreation!.getTime() - a.sheet.dateCreation!.getTime());
        }
    
        // Mettre à jour les résultats filtrés
        this.filteredSheetsWithCompanies = filteredSearches;
    }

    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.searchTerm = target.value;
            this.searchTermSubject.next(this.searchTerm);
            this.applyFilters();
        }
    }

    clearSearchTerm() {
        this.searchTerm = '';
        this.searchTermSubject.next(this.searchTerm);
        this.applyFilters();
    }


    toggleDateSort() {
        if (this.currentDateFilter === 'date_asc') {
            this.currentDateFilter = 'date_desc';
        } else if (this.currentDateFilter === 'date_desc') {
            this.currentDateFilter = 'all';
        } else {
            this.currentDateFilter = 'date_asc';
        }
        this.applyFilters();
    }

    viewSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId);
    }

    goToAddSearchFormView() {
        this.navigationService.navigateToSearchForm();
    }

    
    //Affiche la fenêtre modale de confirmation de la supression d'une recherche de stage
    openDeleteModal(sheet: Factsheets) {
        this.sheetToDelete = sheet;
        this.showDeleteModal = true;
    }



    


    //Suppression de la fiche descriptive
    async onConfirmDelete() {
        if (this.sheetToDelete) {
            try {
                this.isDeleting = true;
                await firstValueFrom(this.factsheetsService.deleteSheet(this.sheetToDelete.idFicheDescriptive));
                await this.loadData(this.currentUserId);
            }
            catch (error) {
                console.error('Erreur lors de la suppression de la recherche:', error);
            }
            finally {
                this.isDeleting = false;
                this.showDeleteModal = false;
                this.sheetToDelete = undefined;
            }
        }
    }

    //Annulation de la suppression d'une fiche descriptive
    onCancelDelete() {
        this.showDeleteModal = false;
        this.sheetToDelete = undefined;
    }


}