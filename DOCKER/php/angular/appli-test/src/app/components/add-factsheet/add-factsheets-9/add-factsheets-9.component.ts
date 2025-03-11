import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-9',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-9.component.html',
  styleUrl: './add-factsheets-9.component.css'
})
export class AddFactsheets9Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    debutStageFicheDescriptive: {
      value: new Date(),
      type: 'ficheDescriptive'
    },
    finStageFicheDescriptive: {
      value: new Date(),
      type: 'ficheDescriptive'
    },
    nbJourSemaineFicheDescriptive: {
      value: '5',
      type: 'ficheDescriptive'
    },
    nbHeuresSemaineFicheDescriptive: {
      value: '35',
      type: 'ficheDescriptive'
    },
    personnelTechniqueDisponibleFicheDescriptive: {
      value: false,
      type: 'ficheDescriptive'
    },
    materielPreteFicheDescriptive: {
      value: 'pc / bloc-notes',
      type: 'ficheDescriptive'
    },
    clauseConfidentialiteFicheDescriptive: {
      value: false,
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

