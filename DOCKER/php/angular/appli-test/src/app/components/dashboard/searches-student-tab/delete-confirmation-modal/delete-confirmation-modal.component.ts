import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../../../loading/loading.component';

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

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}