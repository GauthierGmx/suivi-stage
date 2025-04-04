import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'app-delete-confirmation-modal',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrl: './delete-confirmation-modal.component.css'
})
export class DeleteConfirmationModalComponent {
    @Input() isDeleting = false;
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    currentPageUrl!: string;

    constructor(
        private navigationService: NavigationService,
    ) {}

    /**
     * Initializes the component by getting the current page URL
     */
    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();
    }

    /**
     * Emits the confirm event when user confirms the deletion
     */
    onConfirm() {
        this.confirm.emit();
    }

    /**
     * Emits the cancel event when user cancels the deletion
     */
    onCancel() {
        this.cancel.emit();
    }
}