import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-8',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-8.component.html',
  styleUrl: './add-factsheets-8.component.css'
})
export class AddFactsheets8Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    typeStageFicheDescriptive: {
      value: 'Obligatoire',
      type: 'ficheDescriptive'
    },
    thematiqueFicheDescriptive: {
      value: 'Développement',
      type: 'ficheDescriptive'
    },
    sujetFicheDescriptive: {
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      type: 'ficheDescriptive'
    },
    tachesFicheDescriptive: {
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      type: 'ficheDescriptive'
    },
    competencesFicheDescriptive: {
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
      type: 'ficheDescriptive'
    },
    detailsFicheDescriptive: {
      value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
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
