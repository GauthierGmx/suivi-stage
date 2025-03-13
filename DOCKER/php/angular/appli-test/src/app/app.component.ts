import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  hasCurrentUser: boolean = false;
  hasMarginTop = false;

  constructor(
    private readonly authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.hasCurrentUser = this.authService.isAuthenticated();
  }

  ngOnInit() {
    if (this.hasCurrentUser) {
      this.hasMarginTop = true;
      this.cdr.detectChanges();
    };
  }
}