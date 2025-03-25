import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateFactsheet1Component } from './update-factsheet-1/update-factsheet-1.component';
import { UpdateFactsheets2Component } from './update-factsheet-2/update-factsheet-2.component';
import { UpdateFactsheets3Component } from './update-factsheets-3/update-factsheets-3.component';
import { UpdateFactsheets4Component } from './update-factsheets-4/update-factsheets-4.component';
import { UpdateFactsheets5Component } from './update-factsheets-5/update-factsheets-5.component';
import { UpdateFactsheets6Component } from './update-factsheets-6/update-factsheets-6.component';
import { UpdateFactsheets7Component } from './update-factsheets-7/update-factsheets-7.component';
import { UpdateFactsheets8Component } from './update-factsheets-8/update-factsheets-8.component';
import { UpdateFactsheets9Component } from './update-factsheets-9/update-factsheets-9.component';
import { LoadingComponent } from "../loading/loading.component";
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { AuthService } from '../../services/auth.service';
import { FormDataService } from '../../services/form-data.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-update-factsheet',
  standalone: true,
  imports: [
    CommonModule,
    UpdateFactsheet1Component,
    UpdateFactsheets2Component,
    UpdateFactsheets3Component,
    UpdateFactsheets4Component,
    UpdateFactsheets5Component,
    UpdateFactsheets6Component,
    UpdateFactsheets7Component,
    UpdateFactsheets8Component,
    UpdateFactsheets9Component,
    LoadingComponent
],
  templateUrl: './update-factsheet.component.html',
  styleUrl: './update-factsheet.component.css'
})
export class UpdateFactsheetComponent implements OnInit, OnDestroy {
  currentUser?: any;
  currentUserRole?: string;
  currentStep = 1;
  factsheet?: any;
  dataLoaded: boolean = false;
  private idFicheDescriptive: number = 0;
  isSubmitting: boolean = false;

  /**
   * Getter for the form data from the FormDataService
   * @returns The current form data
   */
  get formData() {
    return this.formDataService.getFormData();
  }

  @Output() dataSended = new EventEmitter<any>();

  /**
   * Constructor - Initializes services and subscribes to factsheet step changes
   */
  constructor(
    private readonly navigationService: NavigationService,
    private readonly studentService: StudentService,
    private readonly factsheetsService: FactsheetsService,
    private readonly authService: AuthService,
    private readonly formDataService: FormDataService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.navigationService.factsheetStep$.subscribe(
      step => this.currentStep = step
    );
  }

  /**
   * Lifecycle hook that initializes the component
   * - Forces step to 1 on load
   * - Loads factsheet data by ID
   * - Sets up user role based on authentication
   */
  ngOnInit(): void {
    this.navigationService.setFactsheetStep(1);
    this.currentStep = 1;
    
    this.idFicheDescriptive = Number(this.route.snapshot.paramMap.get('id'));
    
    this.factsheetsService.getSheetById(this.idFicheDescriptive).subscribe({
      next: (response) => {
        this.factsheet = response;
        this.dataLoaded = true;

        Object.entries(this.factsheet).forEach(([field, value]: [string, any]) => {
            this.formDataService.initializeField(field, value.value, value.type);
        });
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la fiche:', error);
        this.router.navigateByUrl('/factsheets');
      }
    });

    this.authService.getAuthenticatedUser().subscribe(user => {
      if (this.authService.isStudent(user)) {
        this.currentUser = user;
        this.currentUserRole = 'STUDENT';
      }
    });
  }

  /**
   * Lifecycle hook that cleans up the component
   * Resets the factsheet step to 1 when leaving the component
   */
  ngOnDestroy(): void {
    this.navigationService.setFactsheetStep(1);
  }

  /**
   * Handles step changes in the navigation
   * @param step The step number to navigate to
   */
  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  /**
   * Validates all required fields in the form
   * Checks for presence and correct type of all mandatory fields
   * @returns boolean indicating whether all fields are valid
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
      serviceEntrepriseFicheDescriptive: 'string',
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
      
      thematiqueFicheDescriptive: 'string',
      sujetFicheDescriptive: 'string',
      tachesFicheDescriptive: 'string',
      
      debutStageFicheDescriptive: 'string',
      finStageFicheDescriptive: 'string',
      nbJourSemaineFicheDescriptive: 'number',
      nbHeureSemaineFicheDescriptive: 'number'
    };

    for (const [field, type] of Object.entries(requiredFields)) {
      const fieldData = this.formData[field];
      if (!fieldData?.value) {
        console.error(`Missing field: ${field}`);
        return false;
      }

      if (type === 'date' && !(fieldData.value instanceof Date)) {
        console.error(`Invalid type for ${field}: expected Date`);
        return false;
      }

      if (type === 'number' && isNaN(Number(fieldData.value))) {
        console.error(`Invalid type for ${field}: expected Number`);
        return false;
      }
    }

    return true;
  }

  /**
   * Handles the next step action
   * - Updates form data with step data
   * - Validates all fields if on last step
   * - Submits the form if on last step and validation passes
   * @param stepData Data from the current step
   */
  onNext(stepData: any) {
    Object.entries(stepData).forEach(([field, data]: [string, any]) => {
      this.formDataService.updateField(field, data.value);
    });
    
    if (this.currentStep === 9) {
      if (!this.validateAllFields()) {
        alert('Some required fields are not properly filled. Please check all tabs.');
        return;
      }

      if (this.currentUser && this.authService.isStudent(this.currentUser)) {
        this.formDataService.updateField('idUPPA', this.currentUser.idUPPA);
      }

      this.isSubmitting = true;

      forkJoin({
        students: this.studentService.getStudents(),
        sheets: this.factsheetsService.getSheets()
      }).subscribe({
        next: () => {
          this.factsheetsService.updateSheet(this.idFicheDescriptive, this.formData).subscribe({
            next: (response) => {
              this.dataSended.emit(response);
              this.formDataService.resetFormData();
              this.isSubmitting = false;
              this.router.navigateByUrl('/factsheets');
            },
            error: (error) => {
              console.error('Error updating the factsheet:', error);
              alert('An error occurred while updating the factsheet.');
              this.isSubmitting = false;
            }
          });
        },
        error: (error) => {
          console.error('Error verifying data:', error);
          alert('An error occurred while verifying the data.');
          this.isSubmitting = false;
        }
      });
      return;
    }
    
    this.navigationService.setFactsheetStep(this.currentStep + 1);
  }

  /**
   * Handles the previous step action
   * Navigates to the previous step if not on first step
   */
  onPrevious() {
    if (this.currentStep > 1) {
      this.navigationService.setFactsheetStep(this.currentStep - 1);
    }
  }
}
