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

  get formData() {
    return this.formDataService.getFormData();
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  ngOnInit(): void {
    // Initialisation des champs avec les valeurs de l'étudiant
    const fieldMappings = {
      'nomEtudiant': this.student?.nom,
      'prenomEtudiant': this.student?.prenom,
      'telephoneEtudiant': this.student?.telephone,
      'adresseMailEtudiant': this.student?.adresseMail,
      'adresseEtudiant': this.student?.adresse,
      'codePostalEtudiant': this.student?.codePostal,
      'villeEtudiant': this.student?.ville
    };

    // Initialisation de chaque champ
    Object.entries(fieldMappings).forEach(([field, value]) => {
      this.formDataService.initializeField(field, value ?? '', 'etudiant');
    });
  }

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  onNext() {
    this.next.emit(this.formData);
  }

  onCancel() {
    this.openBackModal();
  }

  openBackModal() {
    this.showBackModal = true;
  }

  onConfirmBack() { // Renommé de confirmBack à onConfirmBack
    this.formDataService.resetFormData();
    this.navigationService.goBack();
    this.showBackModal = false;
  }

  onCancelBack() { // Renommé de closeBackModal à onCancelBack
    this.showBackModal = false;
  }
}
