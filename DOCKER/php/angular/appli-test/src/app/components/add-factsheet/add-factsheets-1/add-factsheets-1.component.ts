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
    nomEtudiant: '',
    prenomEtudiant: '',
    telephoneEtudiant: '',
    emailEtudiant: '',
    numeroEtRueEtudiant: '',
    codePostalEtudiant: '',
    villeEtudiant: ''
  };

  ngOnInit(): void {
    // Initialization code here
    if (this.student) {
      this.formData.nomEtudiant = this.student.nomEtudiant || '';
      this.formData.prenomEtudiant = this.student.prenomEtudiant || '';
      this.formData.telephoneEtudiant = this.student.telephoneEtudiant || '';
      this.formData.emailEtudiant = this.student.adresseMailEtudiant || '';
      this.formData.numeroEtRueEtudiant = this.student.adresseEtudiant || '';
      this.formData.codePostalEtudiant = this.student.codePostalEtudiant || '';
      this.formData.villeEtudiant = this.student.villeEtudiant || '';
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
