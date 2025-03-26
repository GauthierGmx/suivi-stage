import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { SearchesStudentTabComponent } from '../searches-student-tab/searches-student-tab.component';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { AuthService } from '../../services/auth.service';
import { StudentService } from '../../services/student.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-student-dashboard-manager',
  standalone: true,
  imports: [CommonModule, LoadingComponent, BreadcrumbComponent, StatsCardsComponent, SearchesStudentTabComponent],
  templateUrl: './student-dashboard-manager.component.html',
  styleUrl: './student-dashboard-manager.component.css'
})
export class StudentDashboardManagerComponent implements OnInit {
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

  /**
   * Initializes the component by setting the current user and loading student data
   * if a student ID is present in the route parameters
   */
  async ngOnInit() {
    let user;
    this.authService.getAuthenticatedUser().subscribe(currentUser =>
      user = currentUser
    );

    const studentId = this.route.snapshot.paramMap.get('id');
    if (studentId) {
      this.loadStudentData(studentId);
    }
  }

  /**
   * Loads student data based on the provided student ID
   * and stores it in the session storage
   * @param studentId - The ID of the student to load
   */
  private async loadStudentData(studentId: string) {
    const student = await firstValueFrom(this.studentService.getStudentById(studentId));
    if (student) {
      this.selectedStudent = student;
      sessionStorage.setItem('selectedStudent', JSON.stringify(this.selectedStudent)) 
    }
  }

  /**
   * Tracks the loading progress of child components
   * Sets allDataLoaded to true when all children are loaded
   */
  onChildDataLoaded() {
    this.loadedChildrenCount++;
    
    if (this.loadedChildrenCount === this.totalChildren) {
      this.allDataLoaded = true;
    }
  }
}
