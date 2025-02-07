import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-add-factsheets-2',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-2.component.html',
  styleUrl: './add-factsheets-2.component.css'
})
export class AddFactsheets2Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  formData = {
    composanteEtabEnseign: '181 - IUT de Bayonne et du Pays Basque (Anglet)',
    parcoursEtabEnseign: 'BBWIA2 - BUT2 - INFO - Intégration d\'Applications et Management du SI',
    adresseEtabEnseign: '2 allée du Parc Montaury, 64600 Anglet',
    telephoneEtabEnseign: '05.59.57.43.02',
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
