import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFactsheets1Component } from './add-factsheets-1/add-factsheets-1.component';
import { AddFactsheets2Component } from './add-factsheets-2/add-factsheets-2.component';
import { AddFactsheets3Component } from './add-factsheets-3/add-factsheets-3.component';
import { AddFactsheets4Component } from './add-factsheets-4/add-factsheets-4.component';
import { AddFactsheets5Component } from './add-factsheets-5/add-factsheets-5.component';
import { AddFactsheets6Component } from './add-factsheets-6/add-factsheets-6.component';
import { AddFactsheets7Component } from './add-factsheets-7/add-factsheets-7.component';
import { AddFactsheets8Component } from './add-factsheets-8/add-factsheets-8.component';
import { AddFactsheets9Component } from './add-factsheets-9/add-factsheets-9.component';
import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { InternshipSearchService } from '../../services/internship-search.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { AuthService } from '../../services/auth.service';
import { FormDataService } from '../../services/form-data.service';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-add-factsheet',
  standalone: true,
  imports: [
    CommonModule,
    AddFactsheets1Component,
    AddFactsheets2Component,
    AddFactsheets3Component,
    AddFactsheets4Component,
    AddFactsheets5Component,
    AddFactsheets6Component,
    AddFactsheets7Component,
    AddFactsheets8Component,
    AddFactsheets9Component,
    LoadingComponent
],
  templateUrl: './add-factsheet.component.html',
  styleUrl: './add-factsheet.component.css'
})
export class AddFactsheetComponent implements OnInit {
  currentUser?: any;
  currentUserRole?: string;
  currentStep = 1;
  isSubmitting = false;

  /**
   * Returns the current form data from the FormDataService
   */
  get formData() {
    return this.formDataService.getFormData();
  }

  @Output() dataSended = new EventEmitter<any>();

  /**
   * Initializes the component with required services and subscribes to factsheet step changes
   */
  constructor(
    private readonly navigationService: NavigationService,
    private readonly studentService: StudentService,
    private readonly internshipSearchService: InternshipSearchService,
    private readonly factsheetsService: FactsheetsService,
    private readonly authService: AuthService,
    private readonly formDataService: FormDataService,
    private readonly router: Router
  ) {
    this.navigationService.factsheetStep$.subscribe(
      step => this.currentStep = step
    );
  }

  /**
   * Initializes the component by setting initial step, form fields and user role
   */
  ngOnInit() {
    this.navigationService.setFactsheetStep(1);
    this.currentStep = 1;

    this.initializeFormFields();
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.authService.isStudent(this.currentUser)) {
      this.currentUserRole = 'STUDENT';
    }
    else if (this.authService.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
      this.currentUserRole = 'INTERNSHIP_MANAGER';
    }
  }

  /**
   * Resets the factsheet step when component is destroyed
   */
  ngOnDestroy(): void {
    this.navigationService.setFactsheetStep(1);
  }

  /**
   * Initializes the base form fields with default values
   */
  private initializeFormFields() {
    const fields = {
      idUPPA: { value: '', type: 'ficheDescriptive' },
      statut: { value: '', type: 'ficheDescriptive' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  /**
   * Updates the current factsheet step
   * @param step - The step number to navigate to
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Validates all required fields in the form
   * @returns boolean indicating if all fields are valid
   */
  private validateAllFields(): boolean {
    const requiredFields = {
      nomEtudiant: 'string',
      prenomEtudiant: 'string',

      raisonSocialeEntreprise: 'string',
      adresseEntreprise: 'string',
      codePostalEntreprise: 'string',
      villeEntreprise: 'string',
      paysEntreprise: 'string',
      telephoneEntreprise: 'string',
      serviceEntreprise: 'string',
      numSIRETEntreprise: 'string',
      codeAPE_NAFEntreprise: 'string',

      nomRepresentantEntreprise: 'string',
      prenomRepresentantEntreprise: 'string',
      telephoneRepresentantEntreprise: 'string',
      adresseMailRepresentantEntreprise: 'string',
      fonctionRepresentantEntreprise: 'string',

      adresseStageFicheDescriptive: 'string',
      codePostalStageFicheDescriptive: 'string',
      villeStageFicheDescriptive: 'string',
      paysStageFicheDescriptive: 'string',

      nomTuteurEntreprise: 'string',
      prenomTuteurEntreprise: 'string',
      telephoneTuteurEntreprise: 'string',
      adresseMailTuteurEntreprise: 'string',
      fonctionTuteurEntreprise: 'string',

      typeStageFicheDescriptive: 'string',
      thematiqueFicheDescriptive: 'string',
      sujetFicheDescriptive: 'string',
      tachesFicheDescriptive: 'string',
      
      debutStageFicheDescriptive: 'string',
      finStageFicheDescriptive: 'string',
      nbJourSemaineFicheDescriptive: 'number',
      nbHeuresSemaineFicheDescriptive: 'number'
    };

    for (const [field, type] of Object.entries(requiredFields)) {
      const fieldData = this.formData[field];
      if (!fieldData?.value) {
        console.error(`Champ manquant: ${field}`);
        return false;
      }

      if (type === 'date' && !(fieldData.value instanceof Date)) {
        console.error(`Type invalide pour ${field}: attendu Date`);
        return false;
      }

      if (type === 'number' && isNaN(Number(fieldData.value))) {
        console.error(`Type invalide pour ${field}: attendu Number`);
        return false;
      }
    }

    return true;
  }

  /**
   * Handles progression to next step or form submission on final step
   * @param stepData - The data from the current step
   */
  onNext(stepData: any) {
    Object.entries(stepData).forEach(([field, data]: [string, any]) => {
      this.formDataService.updateField(field, data.value);
    });
    
    if (this.currentStep === 9) {
      if (!this.validateAllFields()) {
        alert('Certains champs requis ne sont pas correctement remplis. Veuillez vérifier tous les onglets.');
        return;
      }

      if (this.currentUser && this.authService.isStudent(this.currentUser)) {
        this.formDataService.updateField('idUPPA', this.currentUser.idUPPA);
      }

      this.isSubmitting = true; // Activer le loading

      forkJoin({
        students: this.studentService.getStudents(),
        searches: this.internshipSearchService.getSearches(),
        sheets: this.factsheetsService.getSheets()
      }).subscribe({
        next: () => {
          this.formDataService.updateField('statut', 'En cours');
          
          this.factsheetsService.addSheet(this.formData).subscribe({
            next: (response) => {
              this.dataSended.emit(response);
              this.formDataService.resetFormData();
              this.isSubmitting = false; // Désactiver le loading
              this.router.navigateByUrl('/factsheets');
            },
            error: (error) => {
              console.error('Erreur lors de l\'ajout de la fiche:', error);
              alert('Une erreur est survenue lors de l\'enregistrement de la fiche.');
              this.isSubmitting = false; // Désactiver le loading en cas d'erreur
            }
          });
        },
        error: (error) => {
          console.error('Erreur lors de la vérification des données:', error);
          alert('Une erreur est survenue lors de la vérification des données.');
          this.isSubmitting = false; // Désactiver le loading en cas d'erreur
        }
      });
      return;
    }
    
    this.navigationService.setFactsheetStep(this.currentStep + 1);
  }

  /**
   * Navigates to the previous step if not on the first step
   */
  onPrevious() {
    if (this.currentStep > 1) {
      this.navigationService.setFactsheetStep(this.currentStep - 1);
    }
  }
}
