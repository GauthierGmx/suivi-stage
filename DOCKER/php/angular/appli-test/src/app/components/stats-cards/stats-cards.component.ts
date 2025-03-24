import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../models/internship-search.model';
import { Factsheets, SheetStatus } from '../../models/description-sheet.model';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { AuthService } from '../../services/auth.service';
import { forkJoin } from 'rxjs';

const VALIDED_INTERNSHIP_SEARCH_STATUT = 'Validé';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  @Input() currentUser!: Staff | Student;
  @Input() selectedStudent?: Student;
  @Output() dataLoaded = new EventEmitter<void>();
  currentUserId!: string;
  currentUserRole!: string;
  currentPageUrl!: string;
  students!: Student[];
  searches!: InternshipSearch[];
  factsheets!: Factsheets[];

  constructor(
    private navigationService: NavigationService,
    private studentService: StudentService,
    private internshipSearchService: InternshipSearchService,
    private factsheetsService: FactsheetsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentPageUrl = this.navigationService.getCurrentPageUrl();

    if (this.authService.isStudent(this.currentUser)) {
      this.currentUserId = this.currentUser.idUPPA;
      this.currentUserRole = 'STUDENT';
    }
    else if (this.authService.isStaff(this.currentUser)) {
      this.currentUserId = `${this.currentUser.idPersonnel}`;
      this.currentUserRole = 'INTERNSHIP_MANAGER';
    }

    this.loadData();

    // Recharge les données après une suppression
    this.internshipSearchService.searchDeleted$.subscribe(() => {
      this.loadData();
    });
  }

  loadData() {
    forkJoin({
      students: this.studentService.getStudents(['idUPPA']),
      searches: this.internshipSearchService.getSearches(['idRecherche', 'statut', 'idUPPA']),
      sheets: this.factsheetsService.getSheets(['idFicheDescriptive', 'statut', 'idUPPA'])
    }).subscribe(({students, searches, sheets}) => {
        this.students = students;
        this.searches = searches;
        this.factsheets = sheets;
        this.dataLoaded.emit();
      }
    );
  }

  countStudents() {
    if (!this.students) {
      return 0;
    }
    return this.students.length;
  }

  countStudentsWithValidedSearch() {
    if (!this.students || !this.searches) {
      return 0;
    }
    return this.students.filter(student =>
      this.searches.some(
        search =>
          search.idUPPA === student.idUPPA &&
          search.statut === VALIDED_INTERNSHIP_SEARCH_STATUT
      )).length;
  }

  countStudentWithoutSearch() {
    if (!this.students || !this.searches) {
      return 0;
    }
    return this.students.filter(student =>
      !this.searches.some(
        search => search.idUPPA === student.idUPPA
      )).length;
  }

  countStudentWithoutSheet() {
    if (!this.students) {
      return 0;
    }
    return this.students.filter(student =>
      !this.factsheets.some(
        sheet => sheet.idUPPA === student.idUPPA
      )).length;
  }

  countStudentBySheetStatut(statut: SheetStatus) {
    if (!this.students || !this.factsheets) {
      return 0;
    }
    return this.students.filter(student =>
      this.factsheets.some(sheet =>
        sheet.idUPPA === student.idUPPA &&
        sheet.statut === statut
      )).length;
  }

  countSearchesByStudentId(studentId: string | undefined) {
    if (!studentId || !this.searches) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId
    ).length;
  }

  // Compte le nombre de fiches descriptives pour un étudiant donné
  countSheetByStudentId(studentId: string | undefined) {
    if (!studentId || !this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId
    ).length;
  }

  countSearchesByStudentIdThisWeek(studentId: string | undefined) {
    if (!studentId || !this.searches) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId &&
      search.dateCreation! > this.getLastWeekDate() &&
      search.dateCreation! <= this.getCurrentDate()
    ).length
  }

  countSearchesByStudentIdAndStatut(studentId: string | undefined, statut: SearchStatus) {
    if (!studentId || !this.searches) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId &&
      search.statut === statut
    ).length;
  }

  // Compte le nombre de fiches descriptives par statut pour un étudiant donné
  countSheetByStudentIdByStatus(studentId: string | undefined, statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId &&
      sheet.statut === statut
    ).length;
  }

  contSheetByStatut(statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(
      s => s.statut === statut
    ).length;
  }

  countSheetByStudentIdAndStatut(studentId: string, statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId &&
      sheet.statut === statut
    ).length;
  }

  getCurrentDate() {
    return new Date();
  }

  getLastWeekDate(): Date {
    const today = new Date();
    let lastWeekDate = today;
    lastWeekDate.setDate(today.getDate() - 7);
    return today;
  }
}