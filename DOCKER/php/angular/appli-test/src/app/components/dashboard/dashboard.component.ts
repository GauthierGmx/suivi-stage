import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Staff } from '../../models/staff.model';
import { Student } from '../../models/student.model';
import { AppComponent } from '../../app.component';
import { WelcomeComponent } from "./welcome-card/welcome-card.component";
import { StatsCardsComponent } from "./stats-cards/stats-cards.component";
import { SearchesStudentTabComponent } from './searches-student-tab/searches-student-tab.component';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, WelcomeComponent, StatsCardsComponent, SearchesStudentTabComponent, BreadcrumbComponent,LoadingComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser?: Staff | Student;
  currentUserRole?: string;
  allDataLoaded: Boolean = false;
  loadedChildrenCount: number = 0;
  totalChildren: number = 2;

  constructor(
    private readonly authService: AuthService,
    private readonly appComponent: AppComponent,
    private readonly cdRef: ChangeDetectorRef
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

    //Force la vérification des changements de valeurs des variables après ngOnInit
    this.cdRef.detectChanges();
  }

  onChildDataLoaded() {
    this.loadedChildrenCount++;
    
    if (this.loadedChildrenCount === this.totalChildren) {
      this.allDataLoaded = true;
    }
  }
}