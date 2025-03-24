import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';
import { Student } from '../../../models/student.model';
import { BackConfirmationModalComponent } from '../../back-confirmation-modal/back-confirmation-modal.component';

@Component({
  selector: 'app-add-factsheets-1',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent, BackConfirmationModalComponent],
  templateUrl: './add-factsheets-1.component.html',
  styleUrl: './add-factsheets-1.component.css'
})
export class AddFactsheets1Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  currentStep: number;
  @Input() student!: Student;
  showBackModal = false;

  /**
   * Getter that returns the form data stored in the FormDataService
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

  /**
   * Initializes form fields with student data
   * Automatically called during component initialization
   */
  ngOnInit(): void {
    const fieldMappings = {
      'nomEtudiant': this.student?.nom,
      'prenomEtudiant': this.student?.prenom,
      'telephoneEtudiant': this.student?.telephone,
      'adresseMailEtudiant': this.student?.adresseMail,
      'adresseEtudiant': this.student?.adresse,
      'codePostalEtudiant': this.student?.codePostal,
      'villeEtudiant': this.student?.ville
    };

    Object.entries(fieldMappings).forEach(([field, value]) => {
      this.formDataService.initializeField(field, value ?? '', 'etudiant');
    });
  }

  /**
   * Updates the current step in the navigation service
   * @param step - The step number to set
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits form data to the parent component when moving to the next step
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Handles the cancel action by opening the confirmation modal
   */
  onCancel() {
    this.openBackModal();
  }

  /**
   * Displays the back confirmation modal
   */
  openBackModal() {
    this.showBackModal = true;
  }

  /**
   * Confirms going back by resetting the form data and navigating to the previous page
   */
  onConfirmBack() {
    this.formDataService.resetFormData();
    this.navigationService.goBack();
    this.showBackModal = false;
  }

  /**
   * Closes the back confirmation modal without any action
   */
  onCancelBack() {
    this.showBackModal = false;
  }
}
