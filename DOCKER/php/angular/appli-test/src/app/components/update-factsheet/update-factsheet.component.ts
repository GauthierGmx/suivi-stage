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

  get formData() {
    return this.formDataService.getFormData();
  }

  @Output() dataSended = new EventEmitter<any>();

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
  ngOnInit(): void {
    // Forcer le step à 1 au chargement
    this.navigationService.setFactsheetStep(1);
    this.currentStep = 1;
    
    this.idFicheDescriptive = Number(this.route.snapshot.paramMap.get('id'));
    
    this.factsheetsService.getSheetById(this.idFicheDescriptive).subscribe({
    // this.factsheetsService.getSheetById(idFicheDescriptive).subscribe({
      next: (response) => {
        this.factsheet = response;
        this.dataLoaded = true;
        
        // Initialisation des champs avec les données reçues
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

  ngOnDestroy(): void {
    // Réinitialiser le step quand on quitte le composant
    this.navigationService.setFactsheetStep(1);
  }

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  private validateAllFields(): boolean {
    const requiredFields = {
      // Étape 1 - Informations Étudiant
      nomEtudiant: 'string',
      prenomEtudiant: 'string',
      
      // Étape 3-4 - Entreprise
      raisonSocialeEntreprise: 'string',
      adresseEntreprise: 'string',
      codePostalEntreprise: 'string',
      villeEntreprise: 'string',
      paysEntreprise: 'string',
      telephoneEntreprise: 'string',
      serviceEntrepriseFicheDescriptive: 'string',
      numSIRETEntreprise: 'string',
      codeAPE_NAFEntreprise: 'string',
      
      // Étape 5 - Représentant entreprise
      nomRepresentantEntreprise: 'string',
      prenomRepresentantEntreprise: 'string',
      telephoneRepresentantEntreprise: 'string',
      adresseMailRepresentantEntreprise: 'string',
      fonctionRepresentantEntreprise: 'string',
      
      // Étape 6 - Lieu de stage
      adresseStageFicheDescriptive: 'string',
      codePostalStageFicheDescriptive: 'string',
      villeStageFicheDescriptive: 'string',
      paysStageFicheDescriptive: 'string',
      
      // Étape 7 - Tuteur entreprise
      nomTuteurEntreprise: 'string',
      prenomTuteurEntreprise: 'string',
      telephoneTuteurEntreprise: 'string',
      adresseMailTuteurEntreprise: 'string',
      fonctionTuteurEntreprise: 'string',
      
      // Étape 8 - Sujet stage
      thematiqueFicheDescriptive: 'string',
      sujetFicheDescriptive: 'string',
      tachesFicheDescriptive: 'string',
      
      // Étape 9 - Modalités stage
      debutStageFicheDescriptive: 'string',
      finStageFicheDescriptive: 'string',
      nbJourSemaineFicheDescriptive: 'number',
      nbHeureSemaineFicheDescriptive: 'number'
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
        sheets: this.factsheetsService.getSheets()
      }).subscribe({
        next: () => {
          this.factsheetsService.updateSheet(this.idFicheDescriptive, this.formData).subscribe({
            next: (response) => {
              this.dataSended.emit(response);
              this.formDataService.resetFormData();
              this.isSubmitting = false; // Désactiver le loading
              this.router.navigateByUrl('/factsheets');
            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour de la fiche:', error);
              alert('Une erreur est survenue lors de la mise à jour de la fiche.');
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

  onPrevious() {
    if (this.currentStep > 1) {
      this.navigationService.setFactsheetStep(this.currentStep - 1);
    }
  }
}
