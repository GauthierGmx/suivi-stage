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

  /**
   * Initializes the component, sets up user information and starts data loading
   */
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

    this.internshipSearchService.searchDeleted$.subscribe(() => {
      this.loadData();
    });
  }

  /**
   * Loads students, internship searches and factsheets data using forkJoin
   */
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

  /**
   * Returns the total number of students
   */
  countStudents() {
    if (!this.students) {
      return 0;
    }
    return this.students.length;
  }

  /**
   * Returns the number of students with a validated internship search
   */
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

  /**
   * Returns the number of students without any internship search
   */
  countStudentWithoutSearch() {
    if (!this.students || !this.searches) {
      return 0;
    }
    return this.students.filter(student =>
      !this.searches.some(
        search => search.idUPPA === student.idUPPA
      )).length;
  }

  /**
   * Returns the number of students without any description sheet
   */
  countStudentWithoutSheet() {
    if (!this.students) {
      return 0;
    }
    return this.students.filter(student =>
      !this.factsheets.some(
        sheet => sheet.idUPPA === student.idUPPA
      )).length;
  }

  /**
   * Returns the number of students with a specific sheet status
   * @param statut The sheet status to filter by
   */
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

  /**
   * Returns the number of internship searches for a specific student
   * @param studentId The student's ID
   */
  countSearchesByStudentId(studentId: string | undefined) {
    if (!studentId || !this.searches) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId
    ).length;
  }

  /**
   * Returns the number of description sheets for a specific student
   * @param studentId The student's ID
   */
  countSheetByStudentId(studentId: string | undefined) {
    if (!studentId || !this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId
    ).length;
  }

  /**
   * Returns the number of internship searches made by a student in the last week
   * @param studentId The student's ID
   */
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

  /**
   * Returns the number of internship searches with a specific status for a student
   * @param studentId The student's ID
   * @param statut The search status to filter by
   */
  countSearchesByStudentIdAndStatut(studentId: string | undefined, statut: SearchStatus) {
    if (!studentId || !this.searches) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId &&
      search.statut === statut
    ).length;
  }

  /**
   * Returns the number of description sheets with a specific status for a student
   * @param studentId The student's ID
   * @param statut The sheet status to filter by
   */
  countSheetByStudentIdByStatus(studentId: string | undefined, statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId &&
      sheet.statut === statut
    ).length;
  }

  /**
   * Returns the total number of description sheets with a specific status
   * @param statut The sheet status to filter by
   */
  contSheetByStatut(statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(
      s => s.statut === statut
    ).length;
  }

  /**
   * Returns the number of description sheets with a specific status for a student
   * @param studentId The student's ID
   * @param statut The sheet status to filter by
   */
  countSheetByStudentIdAndStatut(studentId: string, statut: SheetStatus) {
    if (!this.factsheets) {
      return 0;
    }
    return this.factsheets.filter(sheet =>
      sheet.idUPPA === studentId &&
      sheet.statut === statut
    ).length;
  }

  /**
   * Returns the current date
   */
  getCurrentDate() {
    return new Date();
  }

  /**
   * Returns the date from one week ago
   */
  getLastWeekDate(): Date {
    const today = new Date();
    let lastWeekDate = today;
    lastWeekDate.setDate(today.getDate() - 7);
    return today;
  }
}