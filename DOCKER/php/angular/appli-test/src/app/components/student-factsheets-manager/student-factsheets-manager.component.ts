import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { firstValueFrom } from 'rxjs';
import { FactsheetsStudentTabComponent } from "../factsheets-student-tab/factsheets-student-tab.component";

@Component({
  selector: 'app-student-factsheets-manager',
  standalone: true,
  imports: [CommonModule, LoadingComponent, BreadcrumbComponent, StatsCardsComponent, FactsheetsStudentTabComponent],
  templateUrl: './student-factsheets-manager.component.html',
  styleUrl: './student-factsheets-manager.component.css'
})
export class StudentFactsheetsManagerComponent implements OnInit {
  currentUser?: Staff;
  currentUserRole: string = 'INTERNSHIP_MANAGER';
  selectedStudent!: Student;
  allDataLoaded: boolean = false;
  loadedChildrenCount: number = 0;
  totalChildren: number = 2

  constructor(
    private readonly authService: AuthService,
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.getAuthenticatedUser().subscribe(user => {
      if (this.authService.isStaff(user)) {
        this.currentUser = user
      }
    });

    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.loadStudentData(studentId);
    }
  }

  private async loadStudentData(studentId: string) {
    const student = await firstValueFrom(this.studentService.getStudentById(studentId));
    if (student) {
      this.selectedStudent = student;
      sessionStorage.setItem('selectedStudent', JSON.stringify(this.selectedStudent)) 
    }
  }

  onChildDataLoaded() {
    this.loadedChildrenCount++;
    
    if (this.loadedChildrenCount === this.totalChildren) {
      this.allDataLoaded = true;
    }
  }
}
