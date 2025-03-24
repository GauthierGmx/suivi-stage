import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-update-factsheets-5',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-5.component.html',
  styleUrl: './update-factsheets-5.component.css'
})
export class UpdateFactsheets5Component implements OnInit {
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
   * Initializes form fields when component is initialized
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Checks if all required form fields are filled
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return this.formData.nomRepresentantEntreprise.value !== '' &&
      this.formData.prenomRepresentantEntreprise.value !== '' &&
      this.formData.telephoneRepresentantEntreprise.value !== '' &&
      this.formData.adresseMailRepresentantEntreprise.value !== '' &&
      this.formData.fonctionRepresentantEntreprise.value !== '';
  }

  /**
   * Initializes all form fields with empty values and 'entreprise' type
   */
  private initializeFormFields() {
    const fields = {
      nomRepresentantEntreprise: { value: '', type: 'entreprise' },
      prenomRepresentantEntreprise: { value: '', type: 'entreprise' },
      telephoneRepresentantEntreprise: { value: '', type: 'entreprise' },
      adresseMailRepresentantEntreprise: { value: '', type: 'entreprise' },
      fonctionRepresentantEntreprise: { value: '', type: 'entreprise' }
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
