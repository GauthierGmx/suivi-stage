import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'app-back-confirmation-modal',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './back-confirmation-modal.component.html',
    styleUrl: './back-confirmation-modal.component.css'
})
export class BackConfirmationModalComponent {
    @Input() show = false;
    @Output() confirmBack = new EventEmitter<void>();
    @Output() cancelBack = new EventEmitter<void>();
    isDeleting = false;
    currentPageUrl!: string;

    /**
     * Creates an instance of BackConfirmationModalComponent
     * @param navigationService Service for handling navigation operations
     */
    constructor(
        private readonly navigationService: NavigationService,
    ) {}

    /**
     * Lifecycle hook that gets the current page URL on component initialization
     */
    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();
    }

    /**
     * Emits the confirmBack event when user confirms going back
     */
    onConfirm() {
        this.confirmBack.emit();
    }

    /**
     * Emits the cancelBack event when user cancels going back
     */
    onCancel() {
        this.cancelBack.emit();
    }
}