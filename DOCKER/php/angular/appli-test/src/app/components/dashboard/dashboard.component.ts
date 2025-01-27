import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { AppComponent } from '../../app.component';
import { StatsCardsComponent } from "./stast-cards/stats-cards.component";
import { WelcomeComponent } from "./welcome-card/welcome-card.component";
import { SearchesStudentTabComponent } from './searches-student-tab/searches-student-tab.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsCardsComponent, WelcomeComponent, SearchesStudentTabComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser?: Staff | Student;
  currentUserRole?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly appComponent: AppComponent
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.appComponent.isStudent(this.currentUser)) {
      this.currentUserRole = 'STUDENT';
    }
    else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
        this.currentUserRole = 'INTERNSHIP_MANAGER';
    }
  }
}