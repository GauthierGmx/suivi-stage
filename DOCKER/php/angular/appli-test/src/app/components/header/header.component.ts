import { Component, OnInit, HostListener, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { Staff } from '../../models/staff.model'
import { Student } from '../../models/student.model'
import { AuthService } from '../../services/auth.service'
import { AppComponent } from '../../app.component'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    currentUser?: Student | Staff;
    nomCurrentUser?: string;
    prenomCurrentUser?: string;
    currentUserRole?: string;
    showProfileMenu = false;
    isMobileMenuOpen = false;

    constructor(
        private readonly authService: AuthService,
        private readonly appComponent: AppComponent,
        private readonly elementRef: ElementRef
    ) {}

    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();

        if (this.appComponent.isStudent(this.currentUser)) {
            this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
            this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
            this.currentUserRole = 'STUDENT';
        }
        else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
            this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
            this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        
        // Check if click is outside profile menu
        if (!this.elementRef.nativeElement.querySelector('.profile-menu')?.contains(target)) {
            this.showProfileMenu = false;
        }

        // Check if click is outside mobile menu and not on the toggle button
        if (!this.elementRef.nativeElement.querySelector('.main-nav')?.contains(target) &&
            !this.elementRef.nativeElement.querySelector('.mobile-menu-button')?.contains(target)) {
            this.isMobileMenuOpen = false;
        }
    }

    getInitials(): string {
        return `${this.prenomCurrentUser?.slice(0,1)}${this.nomCurrentUser?.slice(0,1)}`
    }

    toggleProfileMenu() {
        this.showProfileMenu = !this.showProfileMenu;
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
    }

    logout(): void {
        this.showProfileMenu = false;
        this.isMobileMenuOpen = false;
        this.authService.logout();
    }
}