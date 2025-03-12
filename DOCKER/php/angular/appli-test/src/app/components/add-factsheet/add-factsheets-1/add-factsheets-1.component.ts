import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-add-factsheets-1',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-1.component.html',
  styleUrl: './add-factsheets-1.component.css'
})
export class AddFactsheets1Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  currentStep: number;
  @Input() student!: Student;

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
}
