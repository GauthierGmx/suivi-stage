import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Student } from '../../models/student.model';
import { Company } from '../../models/company.model';
import { AuthService } from '../../services/auth.service';
import { FactsheetsService } from '../../services/description-sheet.service';
import { CompanyService } from '../../services/company.service';
import { NavigationService } from '../../services/navigation.service';
import { LoadingComponent } from '../loading/loading.component';
import { BreadcrumbComponent } from "../breadcrumb/breadcrumb.component";
import { Factsheets } from '../../models/description-sheet.model';
import { StudentService } from '../../services/student.service';
import { TutorAttributionModalComponent } from '../tutor-attribution-modal/tutor-attribution-modal.component';
import { Staff } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';
import { StudentStaffAcademicYearService } from '../../services/student-staff-academicYear.service';
import { AcademicYearService } from '../../services/academic-year.service';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

export class teacherTutorDetails {
    idUPPA?: number;
    idPersonnel?: number;
    idAnneeUniversitaire?: number;
    nomPersonnel?: string;
}

export class tutorAlgorithm {
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
export class SheetDetailsComponent implements OnInit, OnDestroy {
    selectedStudent?: Student;
    currentUserRole?: string;
    sheet?: Factsheets;
    company?: Company;
    dataLoaded: boolean = false;
    detailsSheet?: any;
    showAttributionModal: Boolean = false;
    teachers?: tutorAlgorithm[];
    choicedTutor?: tutorAlgorithm;
    teacherTutorDetails: teacherTutorDetails = {};
    tutor?: teacherTutorDetails;
    currentAcademicYear?: any;
    
    private subscriptions: Subscription[] = [];

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService,
        private readonly studentService: StudentService,
        private readonly staffService: StaffService,
        private readonly studentStaffService: StudentStaffAcademicYearService,
        private readonly academicYearService: AcademicYearService
    ) {}

    ngOnInit() {
        let currentUser;
        const user = sessionStorage.getItem('currentUser');
        if (user) {
            currentUser = JSON.parse(user);
        }

        if (this.authService.isStudent(currentUser)) {
            this.currentUserRole = 'STUDENT';
        } else if (this.authService.isStaff(currentUser)) {
            this.currentUserRole = 'INTERNSHIP_MANAGER';
        }
        
        const selectedStudent = sessionStorage.getItem('selectedStudent');
        if (selectedStudent) {
            this.selectedStudent = JSON.parse(selectedStudent);
        }

        const sheetId = Number(this.route.snapshot.paramMap.get('idSheet'));

        if (sheetId) {
            const yearSub = this.academicYearService.getCurrentAcademicYear().pipe(
                tap(year => {
                    if (year) {
                        this.currentAcademicYear = year;
                        this.teacherTutorDetails.idAnneeUniversitaire = year.idAnneeUniversitaire;
                    }
                }),
                switchMap(year => {
                    return this.factsheetsService.getSheetById(sheetId).pipe(
                        tap(sheet => {
                            if (sheet) {
                                this.detailsSheet = sheet;
                                this.sheet = sheet;
                                
                                if (sheet.idUPPA && sheet.idUPPA.value) {
                                    this.teacherTutorDetails.idUPPA = Number(sheet.idUPPA.value);
                                }
                                
                                if (sheet.idEntreprise && sheet.idEntreprise.value) {
                                    this.loadCompanyDetails(sheet.idEntreprise.value);
                                }
                                
                                if (sheet.idUPPA && sheet.idUPPA.value) {
                                    this.loadStudentDetails(sheet.idUPPA.value);
                                }
                            }
                        }),
                        switchMap(sheet => {
                            if (sheet?.idUPPA?.value && this.teacherTutorDetails.idAnneeUniversitaire) {
                                return this.studentStaffService.getTutorByUppaYear(this.teacherTutorDetails).pipe(
                                    tap(tutorResponse => {
                                        this.tutor = tutorResponse;
                                    }),
                                    catchError(err => {
                                        return of(null);
                                    })
                                );
                            }
                            return of(null);
                        })
                    );
                })
            ).subscribe();
            
            this.subscriptions.push(yearSub);
        }
    }
    
    private loadCompanyDetails(companyId: number) {
        const companySub = this.companyService
            .getCompanyById(companyId, [
                'idEntreprise',
                'raisonSociale',
                'adresse',
                'codePostal',
                'ville',
                'pays',
                'telephone',
                'typeEtablissement',
                'numSiret',
                'codeAPE_NAF',
                'statutJuridique',
                'effectif',
            ])
            .subscribe((company) => {
                this.company = company;
            });
        this.subscriptions.push(companySub);
    }

    private loadStudentDetails(studentId: string) {
        const studentSub = this.studentService
            .getStudentById(studentId, [
                'idUPPA',
                'nom',
                'prenom',
                'adresse',
                'ville',
                'codePostal',
                'telephone',
                'adresseMail',
            ])
            .subscribe((student) => {
                this.selectedStudent = student;
                this.dataLoaded = true;
            });
        this.subscriptions.push(studentSub);
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
        if (this.detailsSheet?.idFicheDescriptive?.value) {
            this.navigationService.navigateToDescriptiveSheetEditForm(this.detailsSheet.idFicheDescriptive.value);
        }
    }

    goBack() {
        this.navigationService.goBack();
    }

    openAttributionModal() {
        this.generateTeacher();
        this.showAttributionModal = true;
    }
    
    onCancelDelete() {
        this.showAttributionModal = false;
    }

    generateTeacher() {
        const rawData = {
            4: {
                NOM: 'VOISIN',
                PRENOM: 'Sophie',
                COMPTEUR_ETUDIANT: 1,
                DISTANCE_GPS_PROF_ENTREPRISE: 1,
                ETUDIANT_DEJA_PRESENT_VILLE: 0,
                ETUDIANT_DEJA_PRESENT_ENREPRISE: 0,
                EQUITE_DEUX_TROIS_ANNEE: 0,
                SOMME: 2
            },
            5: {
                NOM: 'BORTHWICK',
                PRENOM: 'Margaret',
                COMPTEUR_ETUDIANT: 1,
                DISTANCE_GPS_PROF_ENTREPRISE: 1,
                ETUDIANT_DEJA_PRESENT_VILLE: 0,
                ETUDIANT_DEJA_PRESENT_ENREPRISE: 0,
                EQUITE_DEUX_TROIS_ANNEE: 0,
                SOMME: 2
            },
            3: {
                NOM: 'CARPENTIER',
                PRENOM: 'Yann',
                COMPTEUR_ETUDIANT: 1,
                DISTANCE_GPS_PROF_ENTREPRISE: 1,
                ETUDIANT_DEJA_PRESENT_VILLE: 0,
                ETUDIANT_DEJA_PRESENT_ENREPRISE: 0,
                EQUITE_DEUX_TROIS_ANNEE: 0,
                SOMME: 2
            },
            1: {
                NOM: 'LOPISTEGUY',
                PRENOM: 'Philippe',
                COMPTEUR_ETUDIANT: 1,
                DISTANCE_GPS_PROF_ENTREPRISE: 1,
                ETUDIANT_DEJA_PRESENT_VILLE: 0,
                ETUDIANT_DEJA_PRESENT_ENREPRISE: 0,
                EQUITE_DEUX_TROIS_ANNEE: 0,
                SOMME: 2
            },
            2: {
                NOM: 'DOURISBOURE',
                PRENOM: 'Yon',
                COMPTEUR_ETUDIANT: 1,
                DISTANCE_GPS_PROF_ENTREPRISE: 1,
                ETUDIANT_DEJA_PRESENT_VILLE: 0,
                ETUDIANT_DEJA_PRESENT_ENREPRISE: 0,
                EQUITE_DEUX_TROIS_ANNEE: 0,
                SOMME: 2
            }
        };

        const tutorList: tutorAlgorithm[] = Object.entries(rawData).map(([id, data]) => ({
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

        console.log(tutorList); 
        this.teachers = tutorList;
    }

    handleConfirmAttribution(teacherId: number) {
        if (!this.currentAcademicYear || !this.teacherTutorDetails.idAnneeUniversitaire) {
            return;
        }
        
        const selectedTeacher = this.teachers?.find(teacher => teacher.idPersonnel === teacherId);
        
        if (!selectedTeacher) {
            return;
        }
        
        this.choicedTutor = selectedTeacher;
        this.showAttributionModal = false;
        
        if (!this.teacherTutorDetails.idUPPA) {
            return;
        }
        
        this.teacherTutorDetails.idPersonnel = selectedTeacher.idPersonnel;
        
        const tutorSub = this.studentStaffService.getTutorByUppaYear(this.teacherTutorDetails).pipe(
            switchMap(existingTutor => {
                if (existingTutor && existingTutor.idAnneeUniversitaire === this.teacherTutorDetails.idAnneeUniversitaire) {
                    return this.studentStaffService.updateStudentTeacherAssignments(this.teacherTutorDetails);
                } else {
                    return this.studentStaffService.addStudentTeacherAssignments(this.teacherTutorDetails);
                }
            }),
            tap(response => {
                this.studentStaffService.getTutorByUppaYear(this.teacherTutorDetails).pipe(
                    tap(tutorResponse => {
                        this.tutor = tutorResponse;
                    }),
                    catchError(err => {
                        return of(null);
                    })
                ).subscribe(); 
            }),
            catchError(err => {
                return of(null);
            })
        ).subscribe();
        
        this.subscriptions.push(tutorSub);
    }
    
    handleCancelAttribution() {
        this.showAttributionModal = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => {
            if (sub) {
                sub.unsubscribe();
            }
        });
    }
}