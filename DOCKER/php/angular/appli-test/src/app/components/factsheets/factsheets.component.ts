import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { AppComponent } from '../../app.component';
import { WelcomeComponent } from '../dashboard/welcome-card/welcome-card.component';
import { StatsCardsComponent } from '../dashboard/stats-cards/stats-cards.component';
import { SearchesStudentTabComponent } from '../dashboard/searches-student-tab/searches-student-tab.component';
import { LoadingComponent } from '../loading/loading.component';
import { FactsheetsListComponent } from './factsheets-list/factsheets-list.component';

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, WelcomeComponent, StatsCardsComponent, FactsheetsListComponent, LoadingComponent],
  templateUrl: './factsheets.component.html',
  styleUrls: ['./factsheets.component.css']
})
export class FactsheetsComponent implements OnInit {
  currentUser?: Staff | Student;
  currentUserRole?: string;
  allDataLoaded: Boolean = false;
  loadedChildrenCount: number = 0;
  totalChildren: number = 2;

  constructor(
    private readonly authService: AuthService,
    private readonly appComponent: AppComponent
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.appComponent.isStudent(this.currentUser)) {
      this.currentUserRole = 'STUDENT';
      this.totalChildren = 2;
    }
    else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
      this.currentUserRole = 'INTERNSHIP_MANAGER';
      this.totalChildren = 1;
    }

    this.loadedChildrenCount = 0;
  }

  onChildDataLoaded() {
    this.loadedChildrenCount++;
    
    if (this.loadedChildrenCount === this.totalChildren) {
      this.allDataLoaded = true;
    }
  }
}