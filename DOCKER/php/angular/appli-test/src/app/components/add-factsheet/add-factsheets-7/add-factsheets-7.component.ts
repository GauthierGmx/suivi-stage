import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-7',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-7.component.html',
  styleUrl: './add-factsheets-7.component.css'
})
export class AddFactsheets7Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  /**
   * Gets the current form data from the FormDataService
   * @returns The form data object containing all field values
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
   * Checks if all required form fields are filled
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return this.formData.nomTuteurEntreprise.value !== '' &&
      this.formData.prenomTuteurEntreprise.value !== '' &&
      this.formData.telephoneTuteurEntreprise.value !== '' &&
      this.formData.adresseMailTuteurEntreprise.value !== '' &&
      this.formData.fonctionTuteurEntreprise.value !== '';
  }

  /**
   * Initializes all form fields with empty values
   * Sets up the initial state of the form data
   */
  private initializeFormFields() {
    const fields = {
      nomTuteurEntreprise: { value: '', type: 'tuteurEntreprise' },
      prenomTuteurEntreprise: { value: '', type: 'tuteurEntreprise' },
      telephoneTuteurEntreprise: { value: '', type: 'tuteurEntreprise' },
      adresseMailTuteurEntreprise: { value: '', type: 'tuteurEntreprise' },
      fonctionTuteurEntreprise: { value: '', type: 'tuteurEntreprise' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  /**
   * Updates the current step in the navigation service
   * @param step The step number to change to
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the current form data when moving to next step
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits event to navigate to previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
