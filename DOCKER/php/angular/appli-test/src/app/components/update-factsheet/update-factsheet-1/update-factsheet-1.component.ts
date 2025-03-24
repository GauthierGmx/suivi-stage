import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';
import { Student } from '../../../models/student.model';
import { BackConfirmationModalComponent } from '../../back-confirmation-modal/back-confirmation-modal.component';

@Component({
  selector: 'app-update-factsheets-1',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent, BackConfirmationModalComponent],
  templateUrl: './update-factsheet-1.component.html',
  styleUrl: './update-factsheet-1.component.css'
})
export class UpdateFactsheet1Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  currentStep: number;
  @Input() student!: Student;
  showBackModal = false;

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
   * Initializes the form fields with the student's data
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
   * Updates the current factsheet step in the navigation service
   * @param step The step number to change to
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the current form data to the parent component
   */
  onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Opens the back confirmation modal when canceling
   */
  onCancel() {
    this.openBackModal();
  }

  /**
   * Shows the back confirmation modal
   */
  openBackModal() {
    this.showBackModal = true;
  }

  /**
   * Handles the confirmation of going back:
   * - Resets the form data
   * - Navigates back
   * - Closes the modal
   */
  onConfirmBack() {
    this.formDataService.resetFormData();
    this.navigationService.goBack();
    this.showBackModal = false;
  }

  /**
   * Closes the back confirmation modal without taking any action
   */
  onCancelBack() {
    this.showBackModal = false;
  }
}
