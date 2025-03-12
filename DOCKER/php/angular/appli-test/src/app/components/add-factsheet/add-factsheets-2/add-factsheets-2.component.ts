import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-2',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-2.component.html',
  styleUrl: './add-factsheets-2.component.css'
})
export class AddFactsheets2Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  get formData() {
    return this.formDataService.getFormData();
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  ngOnInit(): void {
    // Initialisation des champs avec valeurs par défaut
    const defaultValues = {
      'composanteEtablissement': '181 - IUT de Bayonne et du Pays Basque (Anglet)',
      'parcoursEtablissement': 'BBWIA2 - BUT2 - INFO - Intégration d\'Applications et Management du SI',
      'adresseEtablissement': '2 allée du Parc Montaury, 64600 Anglet',
      'telephoneEtablissement': '05.59.57.43.02'
    };

    // Initialisation de chaque champ
    Object.entries(defaultValues).forEach(([field, value]) => {
      this.formDataService.initializeField(field, value, 'etablissement');
    });
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
