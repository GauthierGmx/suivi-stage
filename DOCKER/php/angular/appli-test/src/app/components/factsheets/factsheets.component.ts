import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { StatsCardsComponent } from '../stats-cards/stats-cards.component';
import { LoadingComponent } from '../loading/loading.component';
import { FactsheetsStudentTabComponent } from '../factsheets-student-tab/factsheets-student-tab.component';
import { ListStudentTabComponent } from "../list-student-tab/list-student-tab.component";

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, StatsCardsComponent, FactsheetsStudentTabComponent, LoadingComponent, ListStudentTabComponent],
  templateUrl: './factsheets.component.html',
  styleUrls: ['./factsheets.component.css']
})
export class FactsheetsComponent implements OnInit {
  currentUser?: any;
  currentUserRole?: string;
  allDataLoaded: boolean = false;
  loadedChildrenCount: number = 0;
  totalChildren: number = 2;

  constructor(
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getAuthenticatedUser().subscribe(user =>
      this.currentUser = user
    );
    
    if (this.authService.isStudent(this.currentUser)) {
      this.currentUserRole = 'STUDENT';
    }
    else if (this.authService.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
      this.currentUserRole = 'INTERNSHIP_MANAGER';
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