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

    constructor(
        private readonly navigationService: NavigationService,
    ) {}

    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();
    }

    onConfirm() {
        this.confirmBack.emit();
    }

    onCancel() {
        this.cancelBack.emit();
    }
}