import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { CompanyService } from '../../../services/company.service';
import { Company } from '../../../models/company.model';

@Component({
  selector: 'app-add-factsheets-3',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-3.component.html',
  styleUrl: './add-factsheets-3.component.css'
})
export class AddFactsheets3Component {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;
  companies: Company[] = [];
  dataLoaded: boolean = false;

  formData = {
    raisonSocialeEntreprise: 'Thalès',
    numRueEntreprise: '5 Esplanade de la Gare',
    codePostalEntreprise: '33110',
    villeEntreprise: 'Le Bouscat',
    paysEntreprise: 'France',
    telephoneEntreprise: '0606060606',
  };

  constructor(
    private readonly navigationService: NavigationService,
    private readonly companyService: CompanyService,
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
  }

  ngOnInit() {
    // Récupération des entreprises
    this.companyService.getCompanies()
        .subscribe(companies => {
            this.companies = companies;
            this.dataLoaded = true;
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
