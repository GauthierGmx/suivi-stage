import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-6',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-6.component.html',
  styleUrl: './add-factsheets-6.component.css'
})
export class AddFactsheets6Component implements OnInit {
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
    return !!(this.formData.adresseMailStageFicheDescriptive.value &&
      this.formData.telephoneStageFicheDescriptive.value &&
      this.formData.adresseStageFicheDescriptive.value &&
      this.formData.codePostalStageFicheDescriptive.value &&
      this.formData.villeStageFicheDescriptive.value &&
      this.formData.paysStageFicheDescriptive.value);
  }

  private initializeFormFields() {
    const fields = {
      adresseMailStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      telephoneStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      adresseStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      codePostalStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      villeStageFicheDescriptive: { value: '', type: 'ficheDescriptive' },
      paysStageFicheDescriptive: { value: '', type: 'ficheDescriptive' }
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
