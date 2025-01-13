import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { StudentFactsheetsComponent } from './student-factsheets/student-factsheets.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, StudentFactsheetsComponent],
  templateUrl: './factsheets.component.html',
  styleUrls: ['./factsheets.component.css']
})
export class FactsheetsComponent implements OnInit {
  currentUser: User | null = null;
  breadcrumbs = this.navigationService.getBreadcrumbs('Fiches');

  constructor(
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }
}