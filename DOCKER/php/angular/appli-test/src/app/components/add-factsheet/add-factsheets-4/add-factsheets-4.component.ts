import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-4',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-4.component.html',
  styleUrl: './add-factsheets-4.component.css'
})
export class AddFactsheets4Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  /**
   * Returns form data from the FormDataService
   * @returns {any} The form data
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

  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Checks if the form is valid by verifying all required fields
   * @returns {boolean} True if the form is valid, false otherwise
   */
  isFormValid(): boolean {
    const apeNafRegex = /^\d{2}\.\d{2}[A-Z]$/;
    return !!(
      this.formData.serviceEntreprise?.value?.trim() &&
      this.formData.numSIRETEntreprise?.value?.trim() &&
      this.formData.codeAPE_NAFEntreprise?.value?.match(apeNafRegex) &&
      this.formData.statutJuridiqueEntreprise?.value?.trim() &&
      this.formData.effectifEntreprise?.value?.toString().trim()
    );
  }

  /**
   * Initializes form fields with their default values
   * @returns {void}
   */
  private initializeFormFields() {
    const fields = {
      serviceEntreprise: { value: '', type: 'ficheDescriptive' },
      typeEtablissementEntreprise: { value: 'Administration', type: 'entreprise' },
      numSIRETEntreprise: { value: '', type: 'entreprise' },
      codeAPE_NAFEntreprise: { value: '', type: 'entreprise' },
      statutJuridiqueEntreprise: { value: 'SA', type: 'entreprise' },
      effectifEntreprise: { value: '', type: 'entreprise' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  /**
   * Validates the APE/NAF code format
   * @param {string} code - The APE/NAF code to validate
   * @returns {boolean} True if the format is valid, false otherwise
   */
  validateAPE_NAF(code: string): boolean {
    const apeNafRegex = /^\d{2}\.\d{2}[A-Z]$/;
    return apeNafRegex.test(code);
  }

  /**
   * Emits an event to proceed to the next step with form data
   * @returns {void}
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Updates the current step in the navigation service
   * @param {number} step - The step number to set
   * @returns {void}
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits an event to return to the previous step
   * @returns {void}
   */
  onPrevious() {
    this.previous.emit();
  }
}
