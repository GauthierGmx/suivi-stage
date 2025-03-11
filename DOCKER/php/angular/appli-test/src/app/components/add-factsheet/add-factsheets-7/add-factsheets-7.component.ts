import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-7',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-7.component.html',
  styleUrl: './add-factsheets-7.component.css'
})
export class AddFactsheets7Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    nomTuteurEntreprise: {
      value: 'Dupont',
      type: 'tuteurEntreprise'
    },
    prenomTuteurEntreprise: {
      value: 'Théo',
      type: 'tuteurEntreprise'
    },
    telephoneTuteurEntreprise: {
      value: '0606060606',
      type: 'tuteurEntreprise'
    },
    adresseMailTuteurEntreprise: {
      value: 'mailTuteur@gmail.com',
      type: 'tuteurEntreprise'
    },
    fonctionTuteurEntreprise: {
      value: 'Développeur',
      type: 'tuteurEntreprise'
    }
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

  onPrevious() {
    this.previous.emit();
  }
}
