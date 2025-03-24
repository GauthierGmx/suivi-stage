import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-update-factsheets-7',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-7.component.html',
  styleUrl: './update-factsheets-7.component.css'
})
export class UpdateFactsheets7Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;

  /**
   * Getter that returns the form data from the FormDataService
   */
  get formData() {
    return this.formDataService.getFormData();
  }

  /**
   * Component constructor that initializes navigation and form data services
   * Sets the current step from navigation service
   */
  constructor(
    private readonly navigationService: NavigationService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  /**
   * Lifecycle hook that initializes form fields when component starts
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required form fields are filled
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
   * Initializes all form fields with empty values and their respective types
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
   * Updates the current factsheet step in the navigation service
   * @param step The step number to set
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
   * Emits an event when moving to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
