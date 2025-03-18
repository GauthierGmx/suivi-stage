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

  get formData() {
    return this.formDataService.getFormData();
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  ngOnInit() {
    this.initializeFormFields();
  }

  isFormValid(): boolean {
    return this.formData.nomTuteurEntreprise.value !== '' &&
      this.formData.prenomTuteurEntreprise.value !== '' &&
      this.formData.telephoneTuteurEntreprise.value !== '' &&
      this.formData.adresseMailTuteurEntreprise.value !== '' &&
      this.formData.fonctionTuteurEntreprise.value !== '';
  }

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

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  onNext() {
    this.next.emit(this.formData);
  }

  onPrevious() {
    this.previous.emit();
  }
}
