import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { Student } from './models/student.model';
import { Staff } from './models/staff.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUser$: Observable<Student | Staff | undefined>;
  hasMarginTop = false;

  constructor(
    private readonly authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.hasMarginTop = !!user;
      this.cdr.detectChanges();
    });
  }
}