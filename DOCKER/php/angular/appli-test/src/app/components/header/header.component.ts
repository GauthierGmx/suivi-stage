import { Component, OnInit, HostListener, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { LoadingComponent } from '../loading/loading.component'
import { Staff } from '../../models/staff.model'
import { Student } from '../../models/student.model'
import { AuthService } from '../../services/auth.service'
import { InitService } from '../../services/init.service'
import { StudentStaffAcademicYearService } from '../../services/student-staff-academicYear.service'
import { firstValueFrom } from 'rxjs'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule, LoadingComponent],
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
    isDisconnecting = false;
    isExtracting = false;

    constructor(
        private readonly authService: AuthService,
        private readonly initService: InitService,
        private readonly studentStaffAcademicYearService: StudentStaffAcademicYearService,
        private readonly elementRef: ElementRef
    ) {}

    /**
     * Initializes component by fetching current user and setting user-related properties
     */
    ngOnInit() {
        // Attendre la fin du chargement du Dashboard avant d'initialiser le Header
        this.initService.init$.subscribe(isInitialized => {
            if (isInitialized) {
                this.initializeHeader();
            }
        });
    }

    initializeHeader() {
        let savedUser = sessionStorage.getItem('currentUser');
        if (savedUser && savedUser !== "undefined") {
            this.currentUser = JSON.parse(savedUser);
        }

        if (this.authService.isStudent(this.currentUser)) {
            this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
            this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
            this.currentUserRole = 'STUDENT';
        }
        else if (this.authService.isStaff(this.currentUser)) {
            this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
            this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }
    }

    /**
     * Handles document click events to close menus when clicking outside
     * @param event Mouse click event
     */
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        
        if (!this.elementRef.nativeElement.querySelector('.profile-menu')?.contains(target)) {
            this.showProfileMenu = false;
        }

        if (!this.elementRef.nativeElement.querySelector('.main-nav')?.contains(target) &&
            !this.elementRef.nativeElement.querySelector('.mobile-menu-button')?.contains(target)) {
            this.isMobileMenuOpen = false;
        }
    }

    /**
     * Returns user initials based on first letter of first and last name
     * @returns String containing user initials
     */
    getInitials(): string {
        return `${this.prenomCurrentUser?.slice(0,1)}${this.nomCurrentUser?.slice(0,1)}`
    }

    /**
     * Toggles the visibility of the profile menu
     */
    toggleProfileMenu() {
        this.showProfileMenu = !this.showProfileMenu;
    }

    /**
     * Toggles the visibility of the mobile menu
     */
    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    /**
     * Closes the mobile menu
     */
    closeMobileMenu() {
        this.isMobileMenuOpen = false;
    }

    /**
     * Handles user logout by closing menus and calling auth service
     */
    logout(): void {
        this.isDisconnecting = true;
        this.showProfileMenu = false;
        this.isMobileMenuOpen = false;
        this.authService.logout();
    }

    /**
     * Extracts and downloads student-teacher assignments as a file
     * Creates a blob from the base64 response and triggers download
     */
    async extractAffectations() {
        this.isExtracting = true;
        try {
            const response = await firstValueFrom(this.studentStaffAcademicYearService.extractStudentTeacherAssignments());
            
            const byteCharacters = atob(response.fileContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: response.mimeType });

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = response.fileName;
            link.click();

            window.URL.revokeObjectURL(link.href);
        }
        catch (error) {
            console.error('Erreur lors du téléchargement:', error);
        }
        finally {
            this.isExtracting = false;
        }
    }
}