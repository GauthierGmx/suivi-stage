import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-update-factsheets-9',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-9.component.html',
  styleUrl: './update-factsheets-9.component.css'
})
export class UpdateFactsheets9Component implements OnInit {
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

  ngOnInit() {
    this.initializeFormFields();
  }

  isFormValid(): boolean {
    return !!(this.formData.debutStageFicheDescriptive.value &&
      this.formData.finStageFicheDescriptive.value &&
      this.formData.nbJourSemaineFicheDescriptive.value &&
      this.formData.nbHeuresSemaineFicheDescriptive.value &&
      this.formData.materielPreteFicheDescriptive.value);
  }

  private initializeFormFields() {
    const fields = {
      debutStageFicheDescriptive: { value: new Date(), type: 'ficheDescriptive' },
      finStageFicheDescriptive: { value: new Date(), type: 'ficheDescriptive' },
      nbJourSemaineFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      nbHeuresSemaineFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      personnelTechniqueDisponibleFicheDescriptive: { value: false, type: 'ficheDescriptive' },
      materielPreteFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      clauseConfidentialiteFicheDescriptive: { value: false, type: 'ficheDescriptive' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
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

