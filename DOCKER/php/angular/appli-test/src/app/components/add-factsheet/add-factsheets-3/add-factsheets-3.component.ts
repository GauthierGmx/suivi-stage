import { Component, EventEmitter, HostListener, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationTabsComponent } from '../../navigation-tabs/navigation-tabs.component';
import { NavigationService } from '../../../services/navigation.service';
import { CompanyService } from '../../../services/company.service';
import { FormDataService } from '../../../services/form-data.service';
import { Company } from '../../../models/company.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-add-factsheets-3',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './add-factsheets-3.component.html',
  styleUrl: './add-factsheets-3.component.css'
})
export class AddFactsheets3Component implements OnInit {
  @Output() next = new EventEmitter<any>();
  @Output() previous = new EventEmitter<void>();
  currentStep: number;
  companies: Company[] = [];
  dataLoaded: boolean = false;
  searchTermChanged = new Subject<string>();
  filteredCompanies: Company[] = [];
  showDropdown = false;
  searchTerm = '';
  selectedCompany?: Company;

  /**
   * Getter that returns form data from the FormDataService
   * @returns {any} The form data
   */
  get formData() {
    return this.formDataService.getFormData();
  }

  constructor(
    private readonly navigationService: NavigationService,
    private readonly companyService: CompanyService,
    private readonly formDataService: FormDataService
  ) {
    this.currentStep = this.navigationService.getCurrentFactsheetStep();
    this.setupSearchFilter();
  }

  /**
   * Configures the search filter with debounce and distinctUntilChanged
   * Updates filteredCompanies and showDropdown based on search terms
   */
  private setupSearchFilter() {
    this.searchTermChanged.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(term => {
      if (term) {
        this.filteredCompanies = this.companies
          .filter(company => 
            company.raisonSociale!.toLowerCase()
            .includes(term.toLowerCase())
          )
          .slice(0, 10);
        this.showDropdown = true;
      } else {
        this.filteredCompanies = [];
        this.showDropdown = false;
      }
    });
  }

  /**
   * Initializes the component by loading company fields and data
   */
  ngOnInit() {
    this.initializeCompanyFields();
    this.loadCompanies();
    // Récupérer la raison sociale depuis formData si elle existe
    const raisonSociale = this.formData?.raisonSocialeEntreprise?.value;
    if (raisonSociale) {
      this.searchTerm = raisonSociale;
    }
  }

  /**
   * Checks if the form is valid by verifying all required fields
   * @returns {boolean} True if the form is valid, false otherwise
   */
  isFormValid(): boolean {
    const data = this.formData;
    return !!(
      data.raisonSocialeEntreprise?.value?.trim() &&
      data.adresseEntreprise?.value?.trim() &&
      data.codePostalEntreprise?.value?.trim() &&
      data.villeEntreprise?.value?.trim() &&
      data.paysEntreprise?.value?.trim() &&
      data.telephoneEntreprise?.value?.match(/^(\+33|0)\d{9}$/)
    );
  }

  /**
   * Initializes company-related form fields with default values
   */
  private initializeCompanyFields() {
    const companyFields = {
      'raisonSocialeEntreprise': '',
      'adresseEntreprise': '',
      'codePostalEntreprise': '',
      'villeEntreprise': '',
      'paysEntreprise': '',
      'telephoneEntreprise': '',
      'serviceEntreprise': '',
      'typeEtablissementEntreprise': '',
      'numSIRETEntreprise': '',
      'codeAPE_NAFEntreprise': '',
      'statutJuridiqueEntreprise': '',
      'effectifEntreprise': ''
    };

    Object.entries(companyFields).forEach(([field, value]) => {
      const type = field === 'serviceEntreprise' ? 'ficheDescriptive' : 'entreprise';
      this.formDataService.initializeField(field, value, type);
    });
  }

  /**
   * Loads the list of companies from the service
   */
  private loadCompanies() {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies;
        this.dataLoaded = true;
      });
  }

  /**
   * Handles clicks outside the dropdown to close it
   * @param targetElement HTML element that was clicked
   */
  @HostListener('document:click', ['$event.target'])
      onClick(targetElement: HTMLElement) {
          if (this.showDropdown) {
              const clickedOutsideDropdown = targetElement.closest('.dropdown');
              if (!clickedOutsideDropdown) {
                  this.showDropdown = false;
              }
          }
      }

  /**
   * Selects a company and fills form fields with its data
   * @param company The selected company
   */
  selectCompany(company: Company) {
    this.selectedCompany = company;
    this.searchTerm = company.raisonSociale ?? '';  // Cette ligne reste inchangée
    this.showDropdown = false;

    const companyData = {
      'raisonSocialeEntreprise': company.raisonSociale,
      'adresseEntreprise': company.adresse,
      'codePostalEntreprise': company.codePostal,
      'villeEntreprise': company.ville,
      'paysEntreprise': company.pays,
      'telephoneEntreprise': company.telephone,
      'typeEtablissementEntreprise': company.typeEtablissement,
      'numSIRETEntreprise': company.numSiret,
      'codeAPE_NAFEntreprise': company.codeAPE_NAF,
      'statutJuridiqueEntreprise': company.statutJuridique,
      'effectifEntreprise': company.effectif?.toString()
    };

    Object.entries(companyData).forEach(([field, value]) => {
      this.formDataService.updateField(field, value ?? '');
    });
  }

  /**
   * Triggers the search when the search term changes
   * @param term The search term
   */
  onSearchChange(term: string) {
    this.searchTermChanged.next(term);
}

  /**
   * Updates the current step in the navigation service
   * @param step The step number
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the next event with form data
   */
  async onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits the previous event to return to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
