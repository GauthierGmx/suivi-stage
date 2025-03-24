import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-9',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-9.component.html',
  styleUrl: './add-factsheets-9.component.css'
})
export class AddFactsheets9Component implements OnInit {
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
   * Initializes the form fields when the component is created
   */
  ngOnInit() {
    this.initializeFormFields();
  }

  /**
   * Validates if all required fields are filled and the start date is valid
   * @returns boolean indicating if the form is valid
   */
  isFormValid(): boolean {
    return !!(this.formData.debutStageFicheDescriptive.value &&
      this.formData.finStageFicheDescriptive.value &&
      this.formData.nbJourSemaineFicheDescriptive.value &&
      this.formData.nbHeuresSemaineFicheDescriptive.value &&
      this.formData.materielPreteFicheDescriptive.value) &&
      this.isDateDebutValid();
  }

  /**
   * Checks if the start date is before or equal to the end date
   * @returns boolean indicating if the date range is valid
   */
  isDateDebutValid(): boolean {
    if (!this.formData.debutStageFicheDescriptive.value || !this.formData.finStageFicheDescriptive.value) {
      return true; // Retourne true si l'une des dates est vide
    }
    const dateDebut = new Date(this.formData.debutStageFicheDescriptive.value);
    const dateFin = new Date(this.formData.finStageFicheDescriptive.value);
    return dateDebut <= dateFin;
  }

  /**
   * Initializes all form fields with their default values
   */
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
   * Emits an event when moving to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}

