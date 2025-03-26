import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { Factsheets } from '../../models/description-sheet.model';
import { AcademicYear } from '../../models/academic-year.model';
import { Staff } from '../../models/staff.model';
import { Student_Staff_AcademicYear } from '../../models/student-staff-academicYear.model';
import { CompanyTutor } from '../../models/company-tutor.model';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { TutorAttributionModalComponent } from '../tutor-attribution-modal/tutor-attribution-modal.component';
import { AuthService } from '../../services/auth.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { CompanyService } from '../../services/company.service';
import { NavigationService } from '../../services/navigation.service';
import { StudentService } from '../../services/student.service';
import { StudentStaffAcademicYearService } from '../../services/student-staff-academicYear.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { StaffService } from '../../services/staff.service';
import { CompanyTutorService } from '../../services/company-tutor.service';
import { of, Observable, forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface algorithmResponse {
    idPersonnel?: number;
    nom?: string;
    prenom?: string;
    compteurEtudiant?: number;
    distanceGpsProfEntreprise?: number;
    etudiantPresentVille?: boolean;
    etudiantPresentEntreprise?: boolean;
    equiteDeuxTroisAnnees?: boolean;
    somme?:number;
}

@Component({
    selector: 'app-sheet-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent, BreadcrumbComponent, TutorAttributionModalComponent],
    templateUrl: './factsheets-details.component.html',
    styleUrl: './factsheets-details.component.css',
})
export class SheetDetailsComponent implements OnInit {
    selectedStudent?: Student;
    currentUserRole?: string;
    detailsSheet?: Factsheets;
    company?: Company;
    companyTutor?: CompanyTutor;
    teacherTutor?: Staff;
    affectation?: Student_Staff_AcademicYear;
    dataLoaded: boolean = false;
    showAttributionModal: Boolean = false;
    teachers?: algorithmResponse[];
    currentAcademicYear?: AcademicYear;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService,
        private readonly studentService: StudentService,
        private readonly studentStaffAcademicYearService: StudentStaffAcademicYearService,
        private readonly academicYearService: AcademicYearService,
        private readonly companyTutorService: CompanyTutorService,
        private readonly staffService: StaffService
    ) {}

    ngOnInit() {
        let currentUser;
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
        }

        if (this.authService.isStudent(currentUser)) {
            this.currentUserRole = 'STUDENT';
        }
        else if (this.authService.isStaff(currentUser)) {
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }
        
        const selectedStudent = sessionStorage.getItem('selectedStudent');
        if (selectedStudent) {
            this.selectedStudent = JSON.parse(selectedStudent);
        }
        
        this.loadData().subscribe(() => {
            this.dataLoaded = true;
        });
    }

    private loadData() {
        const sheetId = Number(this.route.snapshot.paramMap.get('idSheet'));

        if (!sheetId) {
            return of(null);
        }

        return this.academicYearService.getCurrentAcademicYear().pipe(
            switchMap(year => {
                if (year) {
                    this.currentAcademicYear = year;
                }
                return this.factsheetsService.getSheetById(sheetId);
            }),
            switchMap(sheet => {
                if (sheet) {
                    const transformedSheet: any = {};
                    const fieldMappings: { [key: string]: string } = {
                        'adresseMailStageFicheDescriptive': 'adresseMailStage',
                        'adresseStageFicheDescriptive': 'adresseStage',
                        'clauseConfidentialiteFicheDescriptive': 'clauseConfidentialite',
                        'codePostalStageFicheDescriptive': 'codePostalStage',
                        'competencesFicheDescriptive': 'competences',
                        'contenuStageFicheDescriptive': 'contenuStage',
                        'dateCreationFicheDescriptive': 'dateCreation',
                        'dateDebutInterruptionFicheDescriptive': 'dateDebutInterruption',
                        'dateDerniereModificationFicheDescriptive': 'dateDerniereModification',
                        'dateFinInterruptionFicheDescriptive': 'dateFinInterruption',
                        'debutStageFicheDescriptive': 'debutStage',
                        'detailsFicheDescriptive': 'details',
                        'finStageFicheDescriptive': 'finStage',
                        'fonctionsFicheDescriptive': 'fonctions',
                        'idTuteurEntreprise': 'idTuteur',
                        'interruptionStageFicheDescriptive': 'interruptionStage',
                        'materielPreteFicheDescriptive': 'materielPrete',
                        'nbHeureSemaineFicheDescriptive': 'nbHeureParSemaine',
                        'nbJourSemaineFicheDescriptive': 'nbJourParSemaine',
                        'numeroConventionFicheDescriptive': 'numeroConvention',
                        'paysStageFicheDescriptive': 'paysStage',
                        'personnelTechniqueDisponibleFicheDescriptive': 'personnelTechniqueDisponible',
                        'serviceEntrepriseFicheDescriptive': 'serviceEntreprise',
                        'sujetFicheDescriptive': 'sujetFiche',
                        'tachesFicheDescriptive': 'tachesFiche',
                        'telephoneStageFicheDescriptive': 'telephoneStage',
                        'thematiqueFicheDescriptive': 'thematique',
                        'villeStageFicheDescriptive': 'villeStage'
                    };

                    for (const [key, value] of Object.entries(sheet)) {
                        const newKey = fieldMappings[key] || key;
                        if (typeof value === 'object' && value !== null) {
                            transformedSheet[newKey] = 'value' in value ? (value as { value: any }).value : value;
                        } else {
                            transformedSheet[newKey] = value;
                        }
                    }
                    this.detailsSheet = transformedSheet;

                    console.log(this.detailsSheet);

                    const observables: { [key: string]: Observable<any> } = {};
                    
                    if (this.detailsSheet?.idEntreprise) {
                        observables['company'] = this.companyService.getCompanyById(transformedSheet.idEntreprise, [
                            'idEntreprise', 'raisonSociale', 'adresse', 'codePostal', 'ville', 
                            'pays', 'telephone', 'typeEtablissement', 'numSiret', 
                            'codeAPE_NAF', 'statutJuridique', 'effectif'
                        ]);
                    }

                    if (this.detailsSheet?.idTuteur) {
                        observables['tutor'] = this.companyTutorService.getCompanyTutorById(transformedSheet.idTuteur);
                    }

                    return forkJoin(observables).pipe(
                        map(results => {
                            if (results['company']) this.company = results['company'];
                            if (results['tutor']) this.companyTutor = results['tutor'];
                            return results;
                        })
                    );
                }
                return of(null);
            })
        );
    }

    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            Validee: 'status-badge valide',
            'En cours': 'status-badge en-attente',
            Refusée: 'status-badge refuse',
        };
        return statusMap[status] || 'status-badge';
    }

    goToDashboard() {
        this.navigationService.navigateToDashboard();
    }

    goToEdit() {
        if (this.detailsSheet?.idFicheDescriptive) {
            this.navigationService.navigateToDescriptiveSheetEditForm(this.detailsSheet.idFicheDescriptive);
        }
    }

    goBack() {
        this.navigationService.goBack();
    }

    openAttributionModal() {
        this.showAttributionModal = true;
    }
    
    onCancelDelete() {
        this.showAttributionModal = false;
    }

    generateTeacher() {
        if (this.detailsSheet?.idUPPA && this.detailsSheet?.idFicheDescriptive) {
            const rawData = this.studentStaffAcademicYearService.runAlgorithm(this.detailsSheet.idUPPA, this.detailsSheet?.idFicheDescriptive).subscribe();
            const tutorList: algorithmResponse[] = Object.entries(rawData).map(([id, data]) => ({
                idPersonnel: Number(id),
                nom: data.NOM,
                prenom: data.PRENOM,
                compteurEtudiant: data.COMPTEUR_ETUDIANT,
                distanceGpsProfEntreprise: data.DISTANCE_GPS_PROF_ENTREPRISE,
                etudiantPresentVille: !!data.ETUDIANT_DEJA_PRESENT_VILLE,
                etudiantPresentEntreprise: !!data.ETUDIANT_DEJA_PRESENT_ENREPRISE,
                equiteDeuxTroisAnnees: !!data.EQUITE_DEUX_TROIS_ANNEE,
                somme: data.SOMME
            }));
            this.teachers = tutorList;
        }
        else {
            console.log("Erreur lors de la génération des tuteurs");
        }
    }

    handleConfirmAttribution(teacherId: number) {
        if (this.currentAcademicYear?.idAnneeUniversitaire && (this.detailsSheet?.idUPPA && this.detailsSheet?.idUPPA !== null)) {
            const selectedTeacher = this.teachers?.find(teacher => teacher.idPersonnel === teacherId);

            if (selectedTeacher) {
                this.showAttributionModal = false;

                this.affectation!.idAnneeUniversitaire = this.currentAcademicYear.idAnneeUniversitaire;
                this.affectation!.idUPPA = this.detailsSheet.idUPPA;
                this.affectation!.idPersonnel = selectedTeacher.idPersonnel!;

                this.studentStaffAcademicYearService.getTutorByUppaAndYear(this.detailsSheet!.idUPPA, this.currentAcademicYear?.idAnneeUniversitaire).subscribe(affectation => {
                    
                    if (affectation !== undefined) {
                        this.studentStaffAcademicYearService.updateStudentTeacherAssignments(this.affectation!).subscribe();
                    }
                    else {
                        this.studentStaffAcademicYearService.addStudentTeacherAssignments(this.affectation!).subscribe();
                    }

                    return this.staffService.getStaffById(this.affectation!.idPersonnel).subscribe(staff =>
                        this.teacherTutor = staff
                    );
                });
            }
        }
    }
    
    handleCancelAttribution() {
        this.showAttributionModal = false;
    }
}