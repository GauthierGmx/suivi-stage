import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { FormDataService } from '../../../services/form-data.service';

@Component({
  selector: 'app-add-factsheets-4',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-4.component.html',
  styleUrl: './add-factsheets-4.component.css'
})
export class AddFactsheets4Component implements OnInit {
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
      serviceEntreprise: { value: '', type: 'ficheDescriptive' },
      typeEtablissementEntreprise: { value: 'Administration', type: 'entreprise' },
      numSIRETEntreprise: { value: '', type: 'entreprise' },
      codeAPE_NAFEntreprise: { value: '', type: 'entreprise' },
      statutJuridiqueEntreprise: { value: 'SA', type: 'entreprise' },
      effectifEntreprise: { value: '', type: 'entreprise' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  validateAPE_NAF(code: string): boolean {
    const apeNafRegex = /^\d{2}\.\d{2}[A-Z]$/;
    return apeNafRegex.test(code);
  }

  onNext() {
    const apeNafValue = this.formData.codeAPE_NAFEntreprise?.value;
    if (apeNafValue && !this.validateAPE_NAF(apeNafValue)) {
      alert('Le code APE/NAF est invalide. Format attendu: XX.XXA (ex: 01.23A)');
      return;
    }
    this.next.emit(this.formData);
  }

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  onPrevious() {
    this.previous.emit();
  }
}
