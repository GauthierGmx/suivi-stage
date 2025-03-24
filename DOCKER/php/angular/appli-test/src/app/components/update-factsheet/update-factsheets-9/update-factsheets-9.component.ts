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

  /**
   * Getter to access the form data from the FormDataService
   * @returns The current form data
   */
  get formData() {
    return this.formDataService.getFormData();
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  /**
   * Initializes the form fields when the component is created
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required form fields are filled
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return !!(this.formData.debutStageFicheDescriptive.value &&
      this.formData.finStageFicheDescriptive.value &&
      this.formData.nbJourSemaineFicheDescriptive.value &&
      this.formData.nbHeureSemaineFicheDescriptive.value &&
      this.formData.materielPreteFicheDescriptive.value);
  }

  /**
   * Initializes all form fields with default values
   * Sets up the initial state for dates, workdays, hours, and other descriptive fields
   */
  private initializeFormFields() {
    const fields = {
      debutStageFicheDescriptive: { value: new Date(), type: 'ficheDescriptive' },
      finStageFicheDescriptive: { value: new Date(), type: 'ficheDescriptive' },
      nbJourSemaineFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      nbHeureSemaineFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      personnelTechniqueDisponibleFicheDescriptive: { value: false, type: 'ficheDescriptive' },
      materielPreteFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      clauseConfidentialiteFicheDescriptive: { value: false, type: 'ficheDescriptive' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  /**
   * Updates the current step in the navigation service
   * @param step The new step number to set
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the form data when moving to the next step
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits an event to move to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}

