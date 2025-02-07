import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Staff } from '../../../models/staff.model';
import { Student } from '../../../models/student.model';
import { InternshipSearch, SearchStatus } from '../../../models/internship-search.model';
import { DescriptiveSheet, SheetStatus } from '../../../models/description-sheet.model';
import { NavigationService } from '../../../services/navigation.service';
import { StudentService } from '../../../services/student.service';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { DescriptionSheetService } from '../../../services/description-sheet.service';
import { AppComponent } from '../../../app.component';
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
  descriptiveSheets!: DescriptiveSheet[];

  constructor(
    private navigationService: NavigationService,
    private studentService: StudentService,
    private internshipSearchService: InternshipSearchService,
    private descriptiveSheetService: DescriptionSheetService,
    private appComponent: AppComponent
  ) {}

  ngOnInit(): void {
    this.currentPageUrl = this.navigationService.getCurrentPageUrl();

    if (this.appComponent.isStudent(this.currentUser)) {
      this.currentUserId = this.currentUser.idUPPA;
      this.currentUserRole = 'STUDENT';
    }
    else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
      this.currentUserId = `${this.currentUser.idPersonnel}`;
      this.currentUserRole = 'INTERNSHIP_MANAGER';
    }

    // Utiliser forkJoin pour attendre que toutes les données soient chargées
    forkJoin({
      students: this.studentService.getStudents(),
      searches: this.internshipSearchService.getSearches(),
      sheets: this.descriptiveSheetService.getSheets()
    }).subscribe(({students, searches, sheets}) => {
        this.students = students;
        this.searches = searches;
        this.descriptiveSheets = sheets;
        this.dataLoaded.emit();
      }
    );
  }

  countStudents() {
    return this.students.length;
  }

  countStudentsWithValidedSearch() {
    return this.students.filter(student =>
      this.searches.some(
        search =>
          search.idUPPA === student.idUPPA &&
          search.statut === VALIDED_INTERNSHIP_SEARCH_STATUT
      )).length;
  }

  countStudentWithoutSearch() {
    return this.students.filter(student =>
      !this.searches.some(
        search => search.idUPPA === student.idUPPA
      )).length;
  }

  countStudentWithoutSheet() {
    return this.students.filter(student =>
      !this.descriptiveSheets.some(
        sheet => sheet.idUPPA === student.idUPPA
      )).length;
  }

  countStudentBySheetStatut(statut: SheetStatus) {
    return this.students.filter(student =>
      this.descriptiveSheets.some(sheet =>
        sheet.idUPPA === student.idUPPA &&
        sheet.statut === statut
      )).length;
  }

  countSearchesByStudentId(studentId: string | undefined) {
    if (!studentId) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId
    ).length;
  }

  countSearchesByStudentIdThisWeek(studentId: string | undefined) {
    if (!studentId) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId &&
      search.dateCreation > this.getLastWeekDate() &&
      search.dateCreation <= this.getCurrentDate()
    ).length
  }

  countSearchesByStudentIdAndStatut(studentId: string | undefined, statut: SearchStatus) {
    if (!studentId) {
      return 0;
    }
    return this.searches.filter(search =>
      search.idUPPA === studentId &&
      search.statut === statut
    ).length;
  }

  contSheetByStatut(statut: SheetStatus) {
    return this.descriptiveSheets.filter(
      s => s.statut === statut
    ).length;
  }

  countSheetByStudentIdAndStatut(studentId: string, statut: SheetStatus) {
    return this.descriptiveSheets.filter(sheet =>
      sheet.idUPPA === studentId &&
      sheet.statut === statut
    ).length;
  }

  getCurrentDate() {
    return new Date();
  }

  getLastWeekDate() {
    const today = new Date();
    return new Date(today.getDate() - 7);
  }
}