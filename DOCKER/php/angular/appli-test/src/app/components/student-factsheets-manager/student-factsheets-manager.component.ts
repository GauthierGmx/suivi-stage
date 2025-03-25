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

  /**
   * Initializes the component by injecting required services
   * @param authService Service for authentication operations
   * @param studentService Service for student-related operations
   * @param route Service to access route parameters
   */
  constructor(
    private readonly authService: AuthService,
    private readonly studentService: StudentService,
    private readonly route: ActivatedRoute
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   * Gets the current user and loads student data if a student ID is present in the URL
   */
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

  /**
   * Loads student data based on the provided student ID
   * Stores the selected student in the session storage
   * @param studentId The ID of the student to load
   */
  private async loadStudentData(studentId: string) {
    const student = await firstValueFrom(this.studentService.getStudentById(studentId));
    if (student) {
      this.selectedStudent = student;
      sessionStorage.setItem('selectedStudent', JSON.stringify(this.selectedStudent)) 
    }
  }

  /**
   * Tracks the loading status of child components
   * Sets allDataLoaded to true when all children have finished loading
   */
  onChildDataLoaded() {
    this.loadedChildrenCount++;
    
    if (this.loadedChildrenCount === this.totalChildren) {
      this.allDataLoaded = true;
    }
  }
}
