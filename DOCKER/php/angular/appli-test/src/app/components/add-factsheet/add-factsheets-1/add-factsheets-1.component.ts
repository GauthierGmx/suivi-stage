import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { Student } from '../../../models/student.model';

@Component({
  selector: 'app-add-factsheets-1',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-1.component.html',
  styleUrl: './add-factsheets-1.component.css'
})
export class AddFactsheets1Component {
  @Output() next = new EventEmitter<any>();
  currentStep: number;
  @Input() student!: Student;

  formData = {
    nomEtudiant: {
      value: '',
      type: 'etudiant'
    },
    prenomEtudiant: {
      value: '',
      type: 'etudiant'
    },
    telephoneEtudiant: {
      value: '',
      type: 'etudiant'
    },
    adresseMailEtudiant: {
      value: '',
      type: 'etudiant'
    },
    adresseEtudiant: {
      value: '',
      type: 'etudiant'
    },
    codePostalEtudiant: {
      value: '',
      type: 'etudiant'
    },
    villeEtudiant: {
      value: '',
      type: 'etudiant'
    }
  };

  ngOnInit(): void {
    // Initialization code here
    if (this.student) {
      this.formData.nomEtudiant.value = this.student.nom ?? '';
      this.formData.prenomEtudiant.value = this.student.prenom ?? '';
      this.formData.telephoneEtudiant.value = this.student.telephone ?? '';
      this.formData.adresseMailEtudiant.value = this.student.adresseMail ?? '';
      this.formData.adresseEtudiant.value = this.student.adresse ?? '';
      this.formData.codePostalEtudiant.value = this.student.codePostal ?? '';
      this.formData.villeEtudiant.value = this.student.ville ?? '';
    }

  }

  constructor(private readonly navigationService: NavigationService) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }


  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  onNext() {
    this.next.emit(this.formData);
  }
}
