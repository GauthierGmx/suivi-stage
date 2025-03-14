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
    AddFactsheets9Component
  ],
  templateUrl: './add-factsheet.component.html',
  styleUrl: './add-factsheet.component.css'
})
export class AddFactsheetComponent implements OnInit {
  currentUser?: any;
  currentUserRole?: string;
  currentStep = 1;

  get formData() {
    return this.formDataService.getFormData();
  }

  @Output() dataSended = new EventEmitter<any>();

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

  ngOnInit() {
    this.initializeFormFields();
    this.currentUser = this.authService.getCurrentUser();
    
    if (this.authService.isStudent(this.currentUser)) {
      this.currentUserRole = 'STUDENT';
    }
    else if (this.authService.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
      this.currentUserRole = 'INTERNSHIP_MANAGER';
    }
  }

  private initializeFormFields() {
    const fields = {
      idUPPA: { value: '', type: 'ficheDescriptive' },
      statut: { value: '', type: 'ficheDescriptive' }
    };

    Object.entries(fields).forEach(([field, config]) => {
      this.formDataService.initializeField(field, config.value, config.type);
    });
  }

  onStepChange(step: number) {
    this.navigationService.setFactsheetStep(step);
  }

  private validateAllFields(): boolean {
    const requiredFields = {
      // Étape 1 - Informations Étudiant
      nomEtudiant: 'string',
      prenomEtudiant: 'string',
      
      // Étape 2 - Formation
      formationEtudiant: 'string',
      anneeFormationEtudiant: 'string',
      
      // Étape 3-4 - Entreprise
      raisonSocialeEntreprise: 'string',
      adresseEntreprise: 'string',
      codePostalEntreprise: 'string',
      villeEntreprise: 'string',
      paysEntreprise: 'string',
      telephoneEntreprise: 'string',
      serviceEntreprise: 'string',
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
      typeStageFicheDescriptive: 'string',
      thematiqueFicheDescriptive: 'string',
      sujetFicheDescriptive: 'string',
      tachesFicheDescriptive: 'string',
      
      // Étape 9 - Modalités stage
      debutStageFicheDescriptive: 'date',
      finStageFicheDescriptive: 'date',
      nbJourSemaineFicheDescriptive: 'number',
      nbHeuresSemaineFicheDescriptive: 'number'
    };

    for (const [field, type] of Object.entries(requiredFields)) {
      const fieldData = this.formData[field];
      if (!fieldData || !fieldData.value) {
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

      forkJoin({
        students: this.studentService.getStudents(),
        searches: this.internshipSearchService.getSearches(),
        sheets: this.factsheetsService.getSheets()
      }).subscribe({
        next: () => {
          this.formDataService.updateField('statut', 'En cours');
          this.factsheetsService.addSheet(this.formData);
          console.log('Formulaire envoyé:', this.formData);
          this.dataSended.emit(this.formData);
          this.formDataService.resetFormData();
          this.router.navigateByUrl('/factsheets');
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi:', error);
          alert('Une erreur est survenue lors de l\'envoi du formulaire.');
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
