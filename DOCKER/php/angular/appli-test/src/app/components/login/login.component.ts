import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from '../loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { Student } from '../../models/student.model';
import { Staff } from '../../models/staff.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingComponent],
    templateUrl: '../login/login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dataLoaded: boolean = false;
  email: string = '';
  password: string = '';
  currentUser?: Student | Staff;
  isLogining: Boolean = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  /**
   * Initializes the component by loading authentication data and setting up user subscription
   * Redirects to dashboard if user is already authenticated
   */
  async ngOnInit() {
    await this.authService.initializeData();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.router.navigate(['/dashboard']);
      }
    });
    this.dataLoaded = true;
  }

  /**
   * Handles the login form submission
   * Attempts to log in the user with the provided email
   * Shows an alert if login fails
   */
  async onSubmit(): Promise<void> {
    if (this.email) {
      this.isLogining = true;
      const success = await this.authService.login(this.email);
      if (!success) {
        this.isLogining = false;
        alert('Identifiants incorrects');
      }
    }
  }
}