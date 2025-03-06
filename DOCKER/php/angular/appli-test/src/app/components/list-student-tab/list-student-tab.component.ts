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
import { Subject, debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, tap } from 'rxjs';

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
    filteredStudentsDatas: { student: Student; countSearches: number; lastSearchDate: Date; studyYear: string; TdGroup: string}[] = [];
    originalStudentsDatas: { student: Student; countSearches: number; lastSearchDate: Date; studyYear: string; TdGroup: string}[] = [];
    currentStudyYearFilter: 'all' | 'BUT 1' | 'BUT 2' | 'BUT 3' = 'all';
    currentTdGroupFilter: 'all' | 'TD 1' | 'TD 2' | 'TD 3' = 'all';
    currentDateFilter: 'default' | 'date_asc' | 'date_desc' = 'default';
    currentNbSearchesFilter: 'default' | 'nb_asc' | 'nb_desc' = 'default';

    constructor(
        private readonly studentService: StudentService,
        private readonly internshipSearchService: InternshipSearchService,
        private readonly tdService: TDService,
        private readonly trainingYearService: TrainingYearService,
        private readonly academicYearService: AcademicYearService,
        private readonly studentTdAcademicYearService: StudentTdAcademicYearService,
        private readonly studentTrainingYearAcademicYearService: StudentTrainingYearAcademicYearService,
        private readonly navigationService: NavigationService
    ) {
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
        return firstValueFrom(forkJoin({
                    students: this.studentService.getStudents(['idUPPA','nom', 'prenom']),
                    searches: this.internshipSearchService.getSearches(['idRecherche', 'dateCreation', 'idUPPA']),
                    tds: this.tdService.getTDs(),
                    trainingYears: this.trainingYearService.getTrainingYears(),
                    academicYear: this.academicYearService.getCurrentAcademicYear(),
                    datasStudentTrainingYearAcademicYear: this.studentTrainingYearAcademicYearService.getStudentsTDsAcademicYears(),
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

    //Récupération des informations des étudiants
    getFilteredStudentsWithTdAndStudyYear() {
        if (this.studentsData && this.searches && this.tds && this.trainingYears && this.academicYear && this.datasStudentTrainingYearAcademicYear && this.datasStudentTdAcademicYear) {
            this.originalStudentsDatas = this.studentsData.map(student => {
                const studentSearches = this.searches!.filter(search => search.idUPPA === student.idUPPA);
                const studentTD = this.tds!.find(td =>
                    this.datasStudentTdAcademicYear!.some(data =>
                        data.idUPPA === student.idUPPA &&
                        data.idAcademicYear === this.academicYear?.idAnneeUniversitaire &&
                        data.idTD === td.idTD
                    )
                )
                const studentTrainingYear = this.trainingYears!.find(trainingYear =>
                    this.datasStudentTrainingYearAcademicYear!.some(data =>
                        data.idUPPA === student.idUPPA &&
                        data.idAcademicYear === this.academicYear?.idAnneeUniversitaire &&
                        data.idTrainingYear === trainingYear.idAnneeFormation
                    )
                )
                
                return {
                    student,
                    countSearches: studentSearches.length,
                    lastSearchDate: studentSearches.length > 0 ? new Date(Math.max(...studentSearches.map(s => new Date(s.dateCreation!).getTime()))) : null,
                    studyYear: studentTrainingYear?.libelle,
                    TdGroup: studentTD?.libelle
                };
            }).filter((result): result is { student: Student; countSearches: number; lastSearchDate: Date; studyYear: string; TdGroup: string } => result !== null);
    
            this.applyFilters();
        }
    }

    //Application des filtres et de la barre de recherche
    applyFilters() {
        if (!this.originalStudentsDatas) return;

        let filteredDatas = [...this.originalStudentsDatas];
        const searchTermLower = this.searchTerm.toLowerCase().trim();
    
        if (searchTermLower) {
            filteredDatas = filteredDatas.filter(data =>
                data.student.nom!.toLowerCase().includes(searchTermLower) ||
                data.student.prenom!.toLowerCase().includes(searchTermLower) ||
                data.studyYear.toLowerCase().includes(searchTermLower) ||
                data.TdGroup.toLowerCase().includes(searchTermLower)
            );
        }
    
        if (this.currentStudyYearFilter !== 'all') {
            filteredDatas = filteredDatas.filter(data => data.studyYear === this.currentStudyYearFilter);
        }

        if (this.currentTdGroupFilter !== 'all') {
            filteredDatas = filteredDatas.filter(data => data.TdGroup === this.currentTdGroupFilter);
        }
    
        if (this.currentDateFilter === 'date_asc') {
            filteredDatas.sort((a, b) => {
                if (!a.lastSearchDate) return 1; // Place les lignes avec la valeur null au champ "Date dernière recherche" à la fin
                if (!b.lastSearchDate) return -1; // Place les lignes avec la valeur null au champ "Date dernière recherche" à la fin
                return a.lastSearchDate.getTime() - b.lastSearchDate.getTime();
            });
        } 
        else if (this.currentDateFilter === 'date_desc') {
            filteredDatas.sort((a, b) => {
                if (!a.lastSearchDate) return 1; // Place les lignes avec la valeur null au champ "Date dernière recherche" à la fin
                if (!b.lastSearchDate) return -1; // Place les lignes avec la valeur null au champ "Date dernière recherche" à la fin
                return b.lastSearchDate.getTime() - a.lastSearchDate.getTime();
            });
        }

        if (this.currentNbSearchesFilter === 'nb_asc') {
            filteredDatas.sort((a, b) => a.countSearches - b.countSearches);
        }
        else if (this.currentNbSearchesFilter === 'nb_desc') {
            filteredDatas.sort((a, b) => b.countSearches - a.countSearches);
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
}
