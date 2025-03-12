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
