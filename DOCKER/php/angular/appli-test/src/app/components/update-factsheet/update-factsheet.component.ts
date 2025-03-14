import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateFactsheet1Component } from './update-factsheet-1/update-factsheet-1.component';
import { UpdateFactsheets2Component } from './update-factsheet-2/update-factsheet-2.component';
import { UpdateFactsheets3Component } from './update-factsheets-3/update-factsheets-3.component';
import { UpdateFactsheets4Component } from './update-factsheets-4/update-factsheets-4.component';
import { UpdateFactsheets5Component } from './update-factsheets-5/update-factsheets-5.component';
import { UpdateFactsheets6Component } from './update-factsheets-6/update-factsheets-6.component';
import { UpdateFactsheets7Component } from './update-factsheets-7/update-factsheets-7.component';
import { UpdateFactsheets8Component } from './update-factsheets-8/update-factsheets-8.component';
import { UpdateFactsheets9Component } from './update-factsheets-9/update-factsheets-9.component';
import { NavigationService } from '../../services/navigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, forkJoin } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { AuthService } from '../../services/auth.service';
import { FormDataService } from '../../services/form-data.service';

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
    UpdateFactsheets9Component
  ],
  templateUrl: './update-factsheet.component.html',
  styleUrl: './update-factsheet.component.css'
})
export class UpdateFactsheetComponent implements OnInit {
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

  ngOnInit() {
    const idFicheDescriptive = Number(this.route.snapshot.paramMap.get('id'));
    console.log(idFicheDescriptive)

    this.factsheetsService.getSheetById(idFicheDescriptive).subscribe(factsheet => {
      if (factsheet) {
        //this.updatedSearch = search
        console.log(idFicheDescriptive)
      }
    });

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

      forkJoin({
        students: this.studentService.getStudents(),
        sheets: this.factsheetsService.getSheets()
      }).subscribe({
        next: () => {
          this.formDataService.updateField('statut', 'En cours');
          this.factsheetsService.updateSheet(this.formData);
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
