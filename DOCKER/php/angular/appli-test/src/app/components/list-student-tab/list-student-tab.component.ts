import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InternshipSearch } from '../../models/internship-search.model';
import { Student } from '../../models/student.model';
import { TD } from '../../models/td.model';
import { TrainingYear } from '../../models/training-year.model';
import { AcademicYear } from '../../models/academic-year.model';
import { Student_TD_AcademicYear } from '../../models/student-td-academicYear.model';
import { Student_TrainingYear_AcademicYear } from '../../models/student-trainingYear-academicYear.model';
import { NavigationService } from '../../services/navigation.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { StudentService } from '../../services/student.service';
import { TDService } from '../../services/td.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { TrainingYearService } from '../../services/training-year.service';
import { StudentTdAcademicYearService } from '../../services/student-td-academicYear.service';
import { StudentTrainingYearAcademicYearService } from '../../services/student-trainingYear-academicYear.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { Factsheets } from '../../models/description-sheet.model';
import { Subject, debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-list-student-tab',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './list-student-tab.component.html',
    styleUrl: './list-student-tab.component.css'
})
export class ListStudentTabComponent implements OnInit{
    @Output() dataLoaded = new EventEmitter<void>();
    studentsData?: Student[];
    searches?: InternshipSearch[];
    tds?: TD[];
    trainingYears?: TrainingYear[];
    academicYear?: AcademicYear;
    datasStudentTrainingYearAcademicYear?: Student_TrainingYear_AcademicYear[];
    datasStudentTdAcademicYear?: Student_TD_AcademicYear[];
    searchTerm: string = '';
    searchTermSubject = new Subject<string>();
    filteredStudentsDatas: { student: Student; countSearches: number; lastSearchDate: Date | null; studyYear: string | null | undefined; TdGroup: string | null | undefined}[] = [];
    originalStudentsDatas: { student: Student; countSearches: number; lastSearchDate: Date | null; studyYear: string | null | undefined; TdGroup: string | null | undefined}[] = [];
    currentStudyYearFilter: 'all' | 'BUT 1' | 'BUT 2' | 'BUT 3' = 'all';
    currentTdGroupFilter: 'all' | 'TD 1' | 'TD 2' | 'TD 3' = 'all';
    currentDateFilter: 'default' | 'date_asc' | 'date_desc' = 'default';
    currentNbSearchesFilter: 'default' | 'nb_asc' | 'nb_desc' = 'default';
    isFactsheetView = false;
    factsheetsDatas?: Factsheets[];
    filteredFactsheetsDatas: Factsheets[] = [];
    currentStatusFilter: 'all' | 'En cours' | 'Validée' | 'Rejetée' = 'all';

    constructor(
        private readonly studentService: StudentService,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly tdService: TDService,
        private readonly trainingYearService: TrainingYearService,
        private readonly academicYearService: AcademicYearService,
        private readonly studentTdAcademicYearService: StudentTdAcademicYearService,
        private readonly studentTrainingYearAcademicYearService: StudentTrainingYearAcademicYearService,
        private readonly navigationService: NavigationService,
        private readonly factsheetsService: FactsheetsService,
        private readonly router: Router
    ) {
        this.isFactsheetView = this.router.url.includes('factsheets');
        this.searchTermSubject.pipe(
            debounceTime(800),
            distinctUntilChanged()
        ).subscribe(() => {
            this.applyFilters();
        });
    }

    ngOnInit() {
        this.loadData();
    }

    //Chargement des données du tableau de listing des étudiants
    async loadData() {
        if (this.isFactsheetView) {
            return firstValueFrom(forkJoin({
                students: this.studentService.getStudents(['idUPPA','nom', 'prenom']),
                factsheets: this.factsheetsService.getSheets(),
                tds: this.tdService.getTDs(),
                trainingYears: this.trainingYearService.getTrainingYears(),
                academicYear: this.academicYearService.getCurrentAcademicYear(),
                datasStudentTrainingYearAcademicYear: this.studentTrainingYearAcademicYearService.getStudentsTrainingYearsAcademicYears(),
                datasStudentTdAcademicYear: this.studentTdAcademicYearService.getStudentsTDsAcademicYears()
            }).pipe(
                tap(({ students, factsheets, tds, trainingYears, academicYear, datasStudentTrainingYearAcademicYear, datasStudentTdAcademicYear }) => {
                    this.studentsData = students;
                    this.factsheetsDatas = factsheets;
                    this.tds = tds;
                    this.trainingYears = trainingYears;
                    this.academicYear = academicYear;
                    this.datasStudentTrainingYearAcademicYear = datasStudentTrainingYearAcademicYear;
                    this.datasStudentTdAcademicYear = datasStudentTdAcademicYear;
                    this.getFilteredStudentsWithTdAndStudyYear();
                    this.dataLoaded.emit();
                    this.filteredFactsheetsDatas = [...factsheets];
                })
            ));
        } else {
            return firstValueFrom(forkJoin({
                students: this.studentService.getStudents(['idUPPA','nom', 'prenom']),
                searches: this.internshipSearchService.getSearches(['idRecherche', 'dateCreation', 'idUPPA']),
                tds: this.tdService.getTDs(),
                trainingYears: this.trainingYearService.getTrainingYears(),
                academicYear: this.academicYearService.getCurrentAcademicYear(),
                datasStudentTrainingYearAcademicYear: this.studentTrainingYearAcademicYearService.getStudentsTrainingYearsAcademicYears(),
                datasStudentTdAcademicYear: this.studentTdAcademicYearService.getStudentsTDsAcademicYears()
            }).pipe(
                tap(({ students, searches, tds, trainingYears, academicYear, datasStudentTrainingYearAcademicYear, datasStudentTdAcademicYear }) => {
                    this.studentsData = students;
                    this.searches = searches;
                    this.tds = tds;
                    this.trainingYears = trainingYears;
                    this.academicYear = academicYear;
                    this.datasStudentTrainingYearAcademicYear = datasStudentTrainingYearAcademicYear;
                    this.datasStudentTdAcademicYear = datasStudentTdAcademicYear;
                    this.getFilteredStudentsWithTdAndStudyYear();
                    this.dataLoaded.emit();
                })
            ));
        }
    }

    //Récupération des informations des étudiants
    getFilteredStudentsWithTdAndStudyYear() {
        if (this.studentsData && this.tds && this.trainingYears && this.academicYear && 
            this.datasStudentTrainingYearAcademicYear && this.datasStudentTdAcademicYear) {
            
            this.originalStudentsDatas = this.studentsData.map(student => {
                // Get student data based on view type
                const studentData = this.isFactsheetView ? 
                    this.factsheetsDatas?.filter(sheet => sheet.idUPPA === student.idUPPA) :
                    this.searches?.filter(search => search.idUPPA === student.idUPPA);

                // Get student TD and training year (same for both views)
                const studentTD = this.tds!.find(td =>
                    this.datasStudentTdAcademicYear!.some(data =>
                        data.idUPPA === student.idUPPA &&
                        data.idAcademicYear === this.academicYear!.idAnneeUniversitaire &&
                        data.idTD === td.idTD
                    )
                );
                const studentTrainingYear = this.trainingYears!.find(trainingYear =>
                    this.datasStudentTrainingYearAcademicYear!.some(data =>
                        data.idUPPA === student.idUPPA &&
                        data.idAcademicYear === this.academicYear?.idAnneeUniversitaire &&
                        data.idTrainingYear === trainingYear.idAnneeFormation
                    )
                );

                return {
                    student,
                    countSearches: studentData?.length ?? 0,
                    lastSearchDate: studentData?.length ? new Date(Math.max(...studentData.map(s => {
                        if (this.isFactsheetView) {
                            // Pour les fiches, on utilise dateModification
                            return new Date((s as Factsheets).dateDerniereModification!).getTime();
                        } else {
                            // Pour les recherches, on garde dateCreation
                            return new Date((s as InternshipSearch).dateCreation!).getTime();
                        }
                    }))) : null,
                    studyYear: studentTrainingYear?.libelle,
                    TdGroup: studentTD?.libelle
                };
            });
    
            this.applyFilters();
        }
    }

    //Application des filtres et de la barre de recherche
    applyFilters() {
        if (!this.originalStudentsDatas) return;

        let filteredDatas = [...this.originalStudentsDatas];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
    
        // Recherche commune pour les deux vues
        if (searchTermLower) {
            filteredDatas = filteredDatas.filter(data =>
                data.student.nom!.toLowerCase().includes(searchTermLower) ||
                data.student.prenom!.toLowerCase().includes(searchTermLower) ||
                data.studyYear?.toLowerCase().includes(searchTermLower) ||
                data.TdGroup?.toLowerCase().includes(searchTermLower)
            );
        }
    
        // Filtres communs
        if (this.currentStudyYearFilter !== 'all') {
            filteredDatas = filteredDatas.filter(data => data.studyYear === this.currentStudyYearFilter);
        }

        if (this.currentTdGroupFilter !== 'all') {
            filteredDatas = filteredDatas.filter(data => data.TdGroup === this.currentTdGroupFilter);
        }
    
        // Tri spécifique selon la vue
        if (this.isFactsheetView) {
            if (this.currentStatusFilter !== 'all') {
                filteredDatas = filteredDatas.filter(data => {
                    const studentFiche = this.factsheetsDatas?.find(
                        fiche => fiche.idUPPA === data.student.idUPPA && 
                        fiche.statut === this.currentStatusFilter
                    );
                    return studentFiche !== undefined;
                });
            }
        } else {
            // Tri existant pour les recherches
            if (this.currentDateFilter !== 'default') {
                // ...existing date sorting code...
            }
            if (this.currentNbSearchesFilter !== 'default') {
                // ...existing number sorting code...
            }
        }
    
        this.filteredStudentsDatas = filteredDatas;
    }

    //Récupération de la valeur de la barre de recherche à rechercher
    onSearchTermChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target) {
            this.searchTerm = target.value;
            this.searchTermSubject.next(this.searchTerm);
        }
    }

    //Réinitialisation à vide du contenu de la barre de recherche
    clearSearchTerm() {
        this.searchTerm = '';
        this.searchTermSubject.next(this.searchTerm);
    }

    //Mise à jour de la valeur du filtre sur l'année de formation
    setStudyYearFilter(filter: 'all' | 'BUT 1' | 'BUT 2' | 'BUT 3', selectElement: HTMLSelectElement) {
        this.currentStudyYearFilter = filter;
        this.applyFilters();
        selectElement.blur();
    }

    //Mise à jour de la valeur du filtre sur le groupe de TD
    setTdGroupFilter(filter: 'all' | 'TD 1' | 'TD 2' | 'TD 3', selectElement: HTMLSelectElement) {
        this.currentTdGroupFilter = filter;
        this.applyFilters();
        selectElement.blur();
    }

    setStatusFilter(filter: 'all' | 'En cours' | 'Validée' | 'Rejetée') {
        this.currentStatusFilter = filter;
        //this.applyFactsheetsFilters();
    }

    //Changement de l'ordre de filtrage des informations par date de création
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

    //Changement de l'ordre de filtrage des informations par nombre de recherche par étudiant
    toggleNbSearchesSort() {
        switch (this.currentNbSearchesFilter) {
            case 'default':
                this.currentNbSearchesFilter = 'nb_asc';
                break;
            case 'nb_asc':
                this.currentNbSearchesFilter = 'nb_desc';
                break;
            case 'nb_desc':
                this.currentNbSearchesFilter = 'default';
                break;
        }
        this.applyFilters();
    }

    //Redirection vers la vue de consultation d'une recherche de stage
    goToStudentDashboardManagerView(studentId: string) {
        this.navigationService.navigateToStudentDashboardManagerView(studentId);
    }

    goToStudentFactsheetsManagerView(factsheetId: string) {
        this.navigationService.navigateToStudentFactsheetsManagerView(factsheetId);
    }
}
