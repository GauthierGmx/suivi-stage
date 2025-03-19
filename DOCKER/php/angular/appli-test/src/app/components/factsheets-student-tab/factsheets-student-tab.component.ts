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


@Component({
    selector: 'app-factsheets-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule, DeleteConfirmationModalComponent],
    templateUrl: './factsheets-student-tab.component.html',
    styleUrls: ['./factsheets-student-tab.component.css'],
})
export class FactsheetsStudentTabComponent implements OnInit {
    @Input() currentUser!: Student
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

    constructor(
        private readonly navigationService: NavigationService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.searchTermSubject.pipe(debounceTime(800), distinctUntilChanged()).subscribe(() => {
            this.applyFilters()
        })

        this.loadData()
    }

    //Chargement des données de l'étudiant, de ses recherches de stages et des entreprises liées
    loadData() {
        return firstValueFrom(
            forkJoin({
                companies: this.companyService.getCompanies(['idEntreprise', 'raisonSociale', 'ville']),
                sheet: this.factsheetsService.getSheetsByStudentId(this.currentUser.idUPPA),
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

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            Validee: 'status-badge valide',
            'En cours': 'status-badge en-attente',
            Refusée: 'status-badge refuse',
        }
        return statusMap[status] || 'status-badge'
    }

    setStatutFilter(filter: 'all' | 'Refusée' | 'Validee' | 'En cours', selectElement: HTMLSelectElement) {
        this.currentStatutFilter = filter
        this.applyFilters()
        selectElement.blur()
    }

    //Récupération du label lié à un statut
    getStatusLabel(status: SheetStatus): string {
        const labels: Record<SheetStatus, string> = {
            'En cours': 'En cours',
            Validee: 'Validée',
            Refusée: 'Refusée',
        }
        return labels[status]
    }

    //Application des filtres et de la barre de recherche
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

    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement
        if (target) {
            this.searchTerm = target.value
            this.searchTermSubject.next(this.searchTerm)
            this.applyFilters()
        }
    }

    clearSearchTerm() {
        this.searchTerm = ''
        this.searchTermSubject.next(this.searchTerm)
        this.applyFilters()
    }

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

    viewSearchDetails(searchId: number) {
        this.navigationService.navigateToSearchView(searchId)
    }

    goToAddFactSheetForm() {
        this.navigationService.navigateToAddFactSheetForm()
    }

    goToUpdateSearchFormView(idFicheDescriptive: number) {
        this.navigationService.navigateToDescriptiveSheetEditForm(idFicheDescriptive);
    }

    //Affiche la fenêtre modale de confirmation de la supression d'une recherche de stage
    openDeleteModal(sheet: Factsheets) {
        this.sheetToDelete = sheet
        this.showDeleteModal = true
    }





    //Suppression de la fiche descriptive
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

    //Annulation de la suppression d'une fiche descriptive
    onCancelDelete() {
        this.showDeleteModal = false
        this.sheetToDelete = undefined
    }


    //Redirection vers la vue de consultation d'une recherche de stage
    goToSheetDetails(sheetId: number) {
        this.navigationService.navigateToSheetView(sheetId);
    }
}
