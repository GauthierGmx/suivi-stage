import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { Factsheets, SheetStatus } from '../../models/description-sheet.model';
import { NavigationService } from '../../services/navigation.service';
import { CompanyService } from '../../services/company.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, firstValueFrom, tap } from 'rxjs';
import { DeleteConfirmationModalComponent } from '../delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthService } from '../../services/auth.service';


@Component({
    selector: 'app-factsheets-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
    templateUrl: './factsheets-student-tab.component.html',
    styleUrls: ['./factsheets-student-tab.component.css'],
})
export class FactsheetsStudentTabComponent implements OnInit {
    @Input() student!: Student;
    @Input() currentUserRole?: string
    @Output() dataLoaded = new EventEmitter<void>()
    currentUserId!: string
    studentData?: Student
    companies?: Company[]
    sheets?: Factsheets[]
    searchTerm: string = ''
    searchTermSubject = new Subject<string>()
    filteredSheetsWithCompanies: { sheet: Factsheets; company: Company }[] = []
    originalSheetsWithCompanies: { sheet: Factsheets; company: Company }[] = []
    currentDateFilter: 'all' | 'date_asc' | 'date_desc' = 'all'
    currentStatutFilter: 'all' | 'Refusée' | 'Validee' | 'En cours' = 'all'
    allDataLoaded: boolean = false
    sheetToDelete?: Factsheets
    showDeleteModal = false
    isDeleting = false
    isStudent: boolean = false;

    constructor(
        private readonly navigationService: NavigationService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly cdr: ChangeDetectorRef,
        private readonly authService: AuthService,
    ) {
        const currentUser = this.authService.getCurrentUser();
        this.isStudent = this.authService.isStudent(currentUser);
    }

    /**
     * Initialize the search configuration with debounce and loads initial data
     */
    ngOnInit() {
        // Configuration de la recherche avec debounce
        this.searchTermSubject.pipe(
            debounceTime(800), 
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilters();
        });

        // Charger les données
        this.loadData().then(() => {
            this.allDataLoaded = true
        });
    }

    /**
     * Loads student data, their internship searches and related companies
     * @returns Promise that resolves when all data is loaded
     */
    loadData() {
        return firstValueFrom(
            forkJoin({
                companies: this.companyService.getCompanies(['idEntreprise', 'raisonSociale', 'ville']),
                sheet: this.factsheetsService.getSheetsByStudentId(this.student.idUPPA),
            }).pipe(
                tap(({ companies, sheet }) => {
                    this.companies = companies
                    this.sheets = sheet
                    if (this.sheets && this.sheets.length > 0) {
                        const sheetsWithCompanies = this.sheets.map((sheet) => {
                            const company = this.companies!.find((c) => c.idEntreprise === sheet.idEntreprise);
                            return { sheet, company: company! };
                        });
                        this.originalSheetsWithCompanies = [...sheetsWithCompanies];
                        this.filteredSheetsWithCompanies = [...sheetsWithCompanies];
                        this.applyFilters();
                    } else {
                        this.filteredSheetsWithCompanies = []
                    }
                    this.dataLoaded.emit()
                })
            )
        )
    }

    /**
     * Returns the CSS class for a given status
     * @param status The status to get the class for
     */
    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            Validee: 'status-badge valide',
            'En cours': 'status-badge en-attente',
            Refusée: 'status-badge refuse',
        }
        return statusMap[status] || 'status-badge'
    }

    /**
     * Sets the status filter and applies filters
     * @param filter The filter to apply
     * @param selectElement The select element to blur
     */
    setStatutFilter(filter: 'all' | 'Refusée' | 'Validee' | 'En cours', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter
        this.applyFilters()
        selectElement.blur()
    }

    /**
     * Gets the display label for a given status
     * @param status The status to get the label for
     */
    getStatusLabel(status: SheetStatus): string {
        const labels: Record<SheetStatus, string> = {
            'En cours': 'En cours',
            Validee: 'Validée',
            Refusée: 'Refusée',
        }
        return labels[status]
    }

    /**
     * Applies all active filters and search terms to the factsheets list
     */
    applyFilters() {
        let filteredSearches = [...this.originalSheetsWithCompanies];
        const searchTermLower = this.searchTerm.toLowerCase().trim()

        // Convertir les dates de création en objets Date si nécessaire
        filteredSearches.forEach((s) => {
            if (!(s.sheet.dateCreation instanceof Date)) {
                s.sheet.dateCreation = new Date(s.sheet.dateCreation!)
            }
        })

        // Appliquer le filtre de recherche textuelle
        if (searchTermLower) {
            filteredSearches = filteredSearches.filter(
                (s) =>
                    s.company.raisonSociale!.toLowerCase().includes(searchTermLower) ||
                    s.company.ville!.toLowerCase().includes(searchTermLower) ||
                    this.getStatusLabel(s.sheet.statut!).toLowerCase().includes(searchTermLower)
            )
        }

        // Appliquer le filtre de statut
        if (this.currentStatutFilter !== 'all') {
            filteredSearches = filteredSearches.filter((s) => s.sheet.statut === this.currentStatutFilter)
        }

        // Appliquer les filtres de tri par date
        if (this.currentDateFilter === 'date_asc') {
            filteredSearches.sort((a, b) => a.sheet.dateCreation!.getTime() - b.sheet.dateCreation!.getTime())
        } else if (this.currentDateFilter === 'date_desc') {
            filteredSearches.sort((a, b) => b.sheet.dateCreation!.getTime() - a.sheet.dateCreation!.getTime())
        }

        // Mettre à jour les résultats filtrés
        this.filteredSheetsWithCompanies = filteredSearches
    }

    /**
     * Handles changes to the search term
     * @param event The input event
     */
    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement
        if (target) {
            this.searchTerm = target.value
            this.searchTermSubject.next(this.searchTerm)
            this.applyFilters()
        }
    }

    /**
     * Clears the current search term and reapplies filters
     */
    clearSearchTerm() {
        this.searchTerm = ''
        this.searchTermSubject.next(this.searchTerm)
        this.applyFilters()
    }

    /**
     * Toggles the date sort order between ascending, descending and none
     */
    toggleDateSort() {
        if (this.currentDateFilter === 'date_asc') {
            this.currentDateFilter = 'date_desc'
        } else if (this.currentDateFilter === 'date_desc') {
            this.currentDateFilter = 'all'
        } else {
            this.currentDateFilter = 'date_asc'
        }
        this.applyFilters()
    }

    /**
     * Navigates to the search details view
     * @param searchId The ID of the search to view
     */
    viewSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId)
    }

    /**
     * Navigates to the add factsheet form
     */
    goToAddFactSheetForm() {
        this.navigationService.navigateToAddFactSheetForm()
    }

    /**
     * Navigates to the update factsheet form view
     * @param idFicheDescriptive The ID of the factsheet to edit
     */
    goToUpdateFactsheetFormView(idFicheDescriptive: number) {
        this.navigationService.navigateToDescriptiveSheetEditForm(idFicheDescriptive);
    }

    /**
     * Opens the delete confirmation modal for a factsheet
     * @param sheet The factsheet to delete
     */
    openDeleteModal(sheet: Factsheets) {
        this.sheetToDelete = sheet
        this.showDeleteModal = true
    }

    /**
     * Handles the confirmation of factsheet deletion
     */
    async onConfirmDelete() {
        if (this.sheetToDelete) {
            try {
                this.isDeleting = true
                await firstValueFrom(this.factsheetsService.deleteSheet(this.sheetToDelete))
                await this.loadData()
                this.cdr.detectChanges()
            } catch (error) {
                console.error('Erreur lors de la suppression de la recherche:', error)
            } finally {
                this.isDeleting = false
                this.showDeleteModal = false
                this.sheetToDelete = undefined
            }
        }
    }

    /**
     * Cancels the deletion operation and closes the modal
     */
    onCancelDelete() {
        this.showDeleteModal = false
        this.sheetToDelete = undefined
    }

    /**
     * Navigates to the factsheet details view
     * @param sheetId The ID of the sheet to view
     */
    goToSheetDetails(sheetId: number) {
        this.navigationService.navigateToSheetView(sheetId);
    }
}
