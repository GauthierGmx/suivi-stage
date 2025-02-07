import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-4',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-4.component.html',
  styleUrl: './add-factsheets-4.component.css'
})
export class AddFactsheets4Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    serviceEntreprise: 'Informatique',
    typeEtablissementEntreprise: 'Administration',
    activitePrincipaleEntreprise: 'Recherche et développement',
    numSiretEntreprise: '12345678901234',
    codeApeOrNafEntreprise: '45654',
    statutJuridiqueEntreprise: 'SA',
    effectifEntreprise: 'Moins de 10'
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
