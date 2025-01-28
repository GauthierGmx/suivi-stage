import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Staff } from '../../../models/staff.model';
import { Student } from '../../../models/student.model';
import { SearchStatus } from '../../../models/internship-search.model';
import { SheetStatus } from '../../../models/description-sheet.model';
import { NavigationService } from '../../../services/navigation.service';
import { StudentService } from '../../../services/student.service';
import { InternshipSearchService } from '../../../services/internship-search.service';
import { DescriptionSheetService } from '../../../services/description-sheet.service';
import { AppComponent } from '../../../app.component';

export type StatCardType = 'primary' | 'secondary' | 'tertiary';

const VALIDED_INTERNSHIP_SEARCH_STATUT = 'Validé';

@Component({
  selector: 'app-stats-cards',
  imports: [CommonModule],
  templateUrl: './stats-cards.component.html',
  styleUrls: ['./stats-cards.component.css']
})
export class StatsCardsComponent implements OnInit {
  @Input() currentUser!: Staff | Student;
  @Input() selectedStudent?: Student;
  currentUserId!: string;
  currentUserRole!: string;
  currentPageUrl!: string;

  constructor(
    private navigationService: NavigationService,
    private studentService: StudentService,
    private internshipSearchService: InternshipSearchService,
    private descriptiveSheetService: DescriptionSheetService,
    private appComponent: AppComponent
  )
  {}

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
  }

  countStudents() {
    return this.studentService.getStudents().length;
  }

  countStudentsWithValidedSearch() {
    return this.studentService.getStudents().filter(student =>
      this.internshipSearchService.getSearches().some(
        search =>
          search.idUPPA === student.idUPPA &&
          search.statut === VALIDED_INTERNSHIP_SEARCH_STATUT
      )).length;
  }

  countStudentWithoutSearch() {
    return this.studentService.getStudents().filter(student =>
      !this.internshipSearchService.getSearches().some(
        search => search.idUPPA === student.idUPPA
      )).length;
  }

  countStudentWithoutSheet() {
    return this.studentService.getStudents().filter(student =>
      !this.descriptiveSheetService.getSheets().some(
        sheet => sheet.idUPPA === student.idUPPA
      )).length;
  }

  countStudentBySheetStatut(statut: SheetStatus) {
    return this.studentService.getStudents().filter(student =>
      this.descriptiveSheetService.getSheets().some(sheet =>
        sheet.idUPPA === student.idUPPA &&
        sheet.statut === statut
      )).length;
  }

  countSearchesByStudentId(studentId: string | undefined) {
    if (!studentId) {
      return 0;
    }
    return this.internshipSearchService.getSearchesByStudentId(studentId).length;
  }

  countSearchesByStudentIdThisWeek(studentId: string | undefined) {
    if (!studentId) {
      return 0;
    }
    return this.internshipSearchService.getSearchesByStudentId(studentId).filter(s =>
      s.dateCreation > this.getLastWeekDate() &&
      s.dateCreation <= this.getCurrentDate()
    ).length
  }

  countSearchesByStudentIdAndStatut(studentId: string | undefined, statut: SearchStatus) {
    if (!studentId) {
      return 0;
    }
    return this.internshipSearchService.getSearchesByStudentIdAndStatut(studentId, statut).length;
  }

  contSheetByStatut(statut: SheetStatus) {
    return this.descriptiveSheetService.getSheets().filter(
      s => s.statut === statut
    ).length;
  }

  countSheetByStudentIdAndStatut(studentId: string, statut: SheetStatus) {
    return this.descriptiveSheetService.getSheetByStudentIdAndStatus(studentId, statut).length;
  }

  getCurrentDate() {
    return new Date();
  }

  getLastWeekDate() {
    const today = new Date();
    return new Date(today.getDate() - 7);
  }
}