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
  selector: 'app-update-factsheets-3',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationTabsComponent],
  templateUrl: './update-factsheets-3.component.html',
  styleUrl: './update-factsheets-3.component.css'
})
export class UpdateFactsheets3Component implements OnInit {
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
   * Getter for the form data from FormDataService
   * @returns The current form data
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
   * Sets up the search filter with debounce time and filtering logic
   * Filters companies based on search term and limits results to 10 entries
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
   * Initializes component by setting up company fields and loading companies
   * Also retrieves and sets company name from form data if it exists
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
   * Validates the form by checking if all required fields are filled
   * @returns boolean indicating if the form is valid
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
   * Initializes all company-related form fields with empty values
   * Sets up the field type as either 'ficheDescriptive' or 'entreprise'
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
   * Fetches companies from the CompanyService and stores them in the component
   */
  private loadCompanies() {
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies;
        this.dataLoaded = true;
      });
  }

  /**
   * Handles document click events to close the dropdown when clicking outside
   * @param targetElement The HTML element that was clicked
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
   * Handles company selection from the dropdown
   * Updates form fields with selected company data
   * @param company The selected Company object
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
   * Triggers search term change event when user types in search field
   * @param term The search term entered by user
   */
  onSearchChange(term: string) {
    this.searchTermChanged.next(term);
}

  /**
   * Updates the current step in the navigation service
   * @param step The new step number
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Emits the form data to the parent component when proceeding to next step
   */
  async onNext() {
    this.next.emit(this.formData);
  }

  /**
   * Emits an event to return to the previous step
   */
  onPrevious() {
    this.previous.emit();
  }
}
