import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-update-factsheets-4',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-4.component.html',
  styleUrl: './update-factsheets-4.component.css'
})
export class UpdateFactsheets4Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  /**
   * Getter that returns the current form data from the FormDataService
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
   * Initializes form fields when component is created
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required form fields are filled correctly
   * Checks for non-empty values and valid APE/NAF code format
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    const apeNafRegex = /^\d{2}\.\d{2}[A-Z]$/;
    return !!(
      this.formData.serviceEntrepriseFicheDescriptive?.value?.trim() &&
      this.formData.numSIRETEntreprise?.value?.trim() &&
      this.formData.codeAPE_NAFEntreprise?.value?.match(apeNafRegex) &&
      this.formData.statutJuridiqueEntreprise?.value?.trim() &&
      this.formData.effectifEntreprise?.value?.toString().trim()
    );
  }

  /**
   * Initializes all form fields with default values
   * Sets up enterprise-related fields and descriptive sheet fields
   */
  private initializeFormFields() {
    const fields = {
      serviceEntrepriseFicheDescriptive: { value: '', type: 'ficheDescriptive' },
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
   * Validates if the provided APE/NAF code matches the required format (XX.XXA)
   * @param code The APE/NAF code to validate
   * @returns boolean indicating if the code is valid
   */
  validateAPE_NAF(code: string): boolean {
    const apeNafRegex = /^\d{2}\.\d{2}[A-Z]$/;
    return apeNafRegex.test(code);
  }

  /**
   * Handles the next button click event
   * Emits the current form data
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Updates the current step in the navigation service
   * @param step The new step number
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Handles the previous button click event
   * Emits an event to navigate to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
