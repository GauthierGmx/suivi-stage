import { Component, OnInit, HostListener, ElementRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { AuthService } from '../../../services/auth.service'
import { User } from '../../../models/user.model'

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    currentUser: User | null = null;
    showProfileMenu = false;

    constructor(
        private readonly authService: AuthService,
        private readonly elementRef: ElementRef
    ) {}

    ngOnInit() {
        this.authService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
        });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showProfileMenu = false;
        }
    }

    getInitials(user: User): string {
        return `${user.firstName[0]}${user.lastName[0]}`;
    }

    toggleProfileMenu() {
        this.showProfileMenu = !this.showProfileMenu;
    }

    logout(): void {
        this.showProfileMenu = false;
        this.authService.logout();
    }
}
