import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-5',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-5.component.html',
  styleUrl: './add-factsheets-5.component.css'
})
export class AddFactsheets5Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    nomRepresentantEntreprise: {
      value: 'RYTER',
      type: 'entreprise'
    },
    prenomRepresentantEntreprise: {
      value: 'Pascal',
      type: 'entreprise'
    },
    telephoneRepresentantEntreprise: {
      value: '0707070707',
      type: 'entreprise'
    },
    adresseMailRepresentantEntreprise: {
      value: 'mail@gmail.com',
      type: 'entreprise'
    },
    fonctionRepresentantEntreprise: {
      value: 'Responsable',
      type: 'entreprise'
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
