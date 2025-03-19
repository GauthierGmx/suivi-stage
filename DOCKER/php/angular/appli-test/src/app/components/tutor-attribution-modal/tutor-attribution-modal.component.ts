import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { NavigationService } from '../../services/navigation.service';

@Component({
    selector: 'app-tutor-attribution-modal',
    standalone: true,
    imports: [CommonModule, LoadingComponent],
    templateUrl: './tutor-attribution-modal.component.html',
    styleUrl: './tutor-attribution-modal.component.css'
})
export class TutorAttributionModalComponent {
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    currentPageUrl!: string;

    constructor(
        private navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();
    }

    onConfirm() {
        this.confirm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }
}