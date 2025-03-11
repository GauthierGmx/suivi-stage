import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-6',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-6.component.html',
  styleUrl: './add-factsheets-6.component.css'
})
export class AddFactsheets6Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    adresseMailStageFicheDescriptive: {
      value: 'mail@gmail.com',
      type: 'ficheDescriptive'
    },
    telephoneStageFicheDescriptive: {
      value: '0606060606',
      type: 'ficheDescriptive'
    },
    adresseStageFicheDescriptive: {
      value: '1 Avenue des pins',
      type: 'ficheDescriptive'
    },
    codePostalStageFicheDescriptive: {
      value: '47000',
      type: 'ficheDescriptive'
    },
    villeStageFicheDescriptive: {
      value: 'Agen',
      type: 'ficheDescriptive'
    },
    paysStageFicheDescriptive: {
      value: 'France',
      type: 'ficheDescriptive'
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
