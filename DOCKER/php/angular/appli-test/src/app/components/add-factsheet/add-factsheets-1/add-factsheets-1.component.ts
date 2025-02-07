import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { Staff } from '../../../models/staff.model';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-add-factsheets-1',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-1.component.html',
  styleUrl: './add-factsheets-1.component.css'
})
export class AddFactsheets1Component {
  @Output() next = new EventEmitter<any>();
  currentStep: number;
  @Input() currentUser!: Staff | Student;

  formData = {
    nomEtudiant: 'HERRMANN',
    prenomEtudiant: 'Anthony',
    telephoneEtudiant: '0606060606',
    emailEtudiant: 'mail@gmail.com',
    numeroEtRueEtudiant: '17 Rue de la paix',
    codePostalEtudiant: '33000',
    villeEtudiant: 'Bordeaux'
  };

  constructor(private readonly navigationService: NavigationService) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  onNext() {
    this.next.emit(this.formData);
  }
}
