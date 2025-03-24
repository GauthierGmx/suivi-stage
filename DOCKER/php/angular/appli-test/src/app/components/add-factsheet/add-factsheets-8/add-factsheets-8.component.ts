import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-8',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-8.component.html',
  styleUrl: './add-factsheets-8.component.css'
})
export class AddFactsheets8Component implements OnInit {
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
   * Lifecycle hook that initializes form fields when component starts
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required fields in the form are filled
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return !!(this.formData.typeStageFicheDescriptive.value &&
      this.formData.thematiqueFicheDescriptive.value &&
      this.formData.sujetFicheDescriptive.value &&
      this.formData.tachesFicheDescriptive.value &&
      this.formData.competencesFicheDescriptive.value);
  }

  /**
   * Initializes all form fields with default values
   * Sets up the structure for descriptive sheet fields
   */
  private initializeFormFields() {
    const fields = {
      typeStageFicheDescriptive: { value: 'Obligatoire', type: 'ficheDescriptive' },
      thematiqueFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      sujetFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      tachesFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      competencesFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      detailsFicheDescriptive: { value: '', type: 'ficheDescriptive' }
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
   * Emits the current form data to the parent component
   * when moving to the next step
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits an event to the parent component to move
   * to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
