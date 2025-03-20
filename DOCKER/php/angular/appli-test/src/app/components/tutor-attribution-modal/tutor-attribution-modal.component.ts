import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { Staff } from '../../models/staff.model';

@Component({
    selector: 'app-tutor-attribution-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tutor-attribution-modal.component.html',
    styleUrls: ['./tutor-attribution-modal.component.css'] 
})
export class TutorAttributionModalComponent {
    @Input() teachers: Staff[] = [];
    @Output() confirm = new EventEmitter<number>();
    @Output() cancel = new EventEmitter<void>();
    @Output() generateTeachers = new EventEmitter<void>();
    
    selectedTeacherId: number | null = null;
    currentPageUrl!: string;

    constructor(private navigationService: NavigationService) {}

    ngOnInit() {
        this.currentPageUrl = this.navigationService.getCurrentPageUrl();
    }

    onGenerateTeachers() {
        this.generateTeachers.emit();
    }

    onConfirm() {
        if (this.selectedTeacherId) {
            this.confirm.emit(this.selectedTeacherId);
        }
    }

    onCancel() {
        this.cancel.emit(); 
    }
}
