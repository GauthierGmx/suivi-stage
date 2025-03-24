import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-6',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-6.component.html',
  styleUrl: './add-factsheets-6.component.css'
})
export class AddFactsheets6Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  /**
   * Getter that returns the current form data from the FormDataService
   * @returns The current state of the form data
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
   * Lifecycle hook that initializes the form fields when the component is created
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates the form by checking if all required fields have values
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return !!(this.formData.adresseMailStageFicheDescriptive.value &&
      this.formData.telephoneStageFicheDescriptive.value &&
      this.formData.adresseStageFicheDescriptive.value &&
      this.formData.codePostalStageFicheDescriptive.value &&
      this.formData.villeStageFicheDescriptive.value &&
      this.formData.paysStageFicheDescriptive.value);
  }

  /**
   * Initializes all form fields with empty values and their respective types
   * Sets up the structure for collecting internship location information
   * @private
   */
  private initializeFormFields() {
    const fields = {
      adresseMailStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      telephoneStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      adresseStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      codePostalStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      villeStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      paysStageFicheDescriptive: { value: '', type: 'ficheDescriptive' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  /**
   * Updates the current step in the navigation service
   * @param step The step number to navigate to
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the current form data when moving to the next step
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits an event to navigate to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
