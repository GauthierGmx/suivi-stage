import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-update-factsheets-6',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-6.component.html',
  styleUrl: './update-factsheets-6.component.css'
})
export class UpdateFactsheets6Component implements OnInit {
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
   * Lifecycle hook that initializes form fields on component initialization
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required form fields are filled
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
   * Initializes all form fields with empty values
   * Sets the type as 'ficheDescriptive' for each field
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
   * Updates the current factsheet step in the navigation service
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
   * Emits an event when moving to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
