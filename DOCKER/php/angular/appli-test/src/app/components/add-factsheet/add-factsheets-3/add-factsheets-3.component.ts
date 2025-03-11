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
    raisonSocialeEntreprise: {
      value: 'Thalès',
      type: 'entreprise'
    },
    adresseEntreprise: {
      value: '5 Esplanade de la Gare',
      type: 'entreprise'
    },
    codePostalEntreprise: {
      value: '33110',
      type: 'entreprise'
    },
    villeEntreprise: {
      value: 'Le Bouscat',
      type: 'entreprise'
    },
    paysEntreprise: {
      value: 'France',
      type: 'entreprise'
    },
    telephoneEntreprise: {
      value: '0606060606',
      type: 'entreprise'
    }
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
