import { Component, OnInit } from '@angular/core';
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
import { catchError } from 'rxjs/operators';


export class teacherTutorDetails{
    idUPPA?:number;
    idPersonnel?:number;
    idAnneeUniversitaire?:number;
}

@Component({
    selector: 'app-sheet-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent, BreadcrumbComponent,TutorAttributionModalComponent],
    templateUrl: './factsheets-details.component.html',
    styleUrl: './factsheets-details.component.css',
})
export class SheetDetailsComponent implements OnInit {
    selectedStudent?: Student;
    currentUserRole?: string;
    sheet?: Factsheets;
    company?: Company;
    dataLoaded: boolean = false;
    detailsSheet?:any;
    showAttributionModal: Boolean = false;
    teachers?: Staff[];
    choicedTutor?:Staff;
    teacherTutorDetails?:teacherTutorDetails;


    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService,
        private readonly studentService: StudentService,
        private readonly staffService: StaffService,
        private readonly studentStaffService:StudentStaffAcademicYearService,
        private readonly academicYearService:AcademicYearService
    ) {}

    /**
     * Initializes the component and loads the sheet details.
     * Determines user role, gets selected student from session storage,
     * and fetches sheet data using the sheet ID from route parameters.
     */
    ngOnInit() {
        let currentUser
        const user = sessionStorage.getItem('currentUser')
        if (user) {
            currentUser = JSON.parse(user)
        }

        if (this.authService.isStudent(currentUser)) {
            this.currentUserRole = 'STUDENT'
        } else if (this.authService.isStaff(currentUser)) {
            this.currentUserRole = 'INTERNSHIP_MANAGER'
        }

        
        const selectedStudent = sessionStorage.getItem('selectedStudent');
        if (selectedStudent) {
            this.selectedStudent = JSON.parse(selectedStudent)
        }

        const sheetId = Number(this.route.snapshot.paramMap.get('idSheet'))

        if (sheetId) {
            this.factsheetsService.getSheetById(sheetId).subscribe((sheet) => {
                if (sheet) {
                    this.sheet = sheet
                    this.loadCompanyDetails(sheet.idEntreprise.value)
                    this.loadStudentDetails(sheet.idUPPA.value)
                }
            })
        }

        this.factsheetsService.getSheetById(sheetId).subscribe({
            next: (response) => {
                this.detailsSheet = response;
            },
            error: (err) => {
                console.error('Erreur lors de la récupération de la fiche :', err)
            },
        })


        
    
    }

    /**
     * Loads company details using the provided company ID.
     * Fetches specific fields of company information.
     * @param companyId - The ID of the company to load
     */
    private loadCompanyDetails(companyId: number) {
        this.companyService
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
                this.company = company
            })
    }

    /**
     * Loads student details using the provided student ID.
     * Fetches specific fields of student information and updates the component state.
     * @param studentId - The ID of the student to load
     */
    private loadStudentDetails(studentId: string) {
        this.studentService
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
                this.selectedStudent = student
                this.dataLoaded = true
            })
    }

    /**
     * Returns the appropriate CSS class for a given status.
     * Maps status strings to their corresponding CSS classes.
     * @param status - The status string to map
     * @returns The corresponding CSS class name
     */
    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            Validee: 'status-badge valide',
            'En cours': 'status-badge en-attente',
            Refusée: 'status-badge refuse',
        }
        return statusMap[status] || 'status-badge'
    }

    /**
     * Navigates to the dashboard page.
     */
    goToDashboard() {
        this.navigationService.navigateToDashboard()
    }

    /**
     * Navigates to the edit form for the current sheet.
     */
    goToEdit() {
        this.navigationService.navigateToDescriptiveSheetEditForm(this.detailsSheet.idFicheDescriptive.value);
    }

    /**
     * Navigates back to the previous page.
     */
    goBack() {
        this.navigationService.goBack()
    }

    //Affiche la fenêtre modale de confirmation de la supression d'une recherche de stage
    openAttributionModal() {
        this.showAttributionModal = true;
    }
    //Annulation de la suppression d'une fiche descriptive
    onCancelDelete() {
        this.showAttributionModal = false;
    }

    generateTeacher() {
        const teachers: Staff[] = [
            {
                idPersonnel: 1,
                role: 'Enseignant',
                nom: 'Dupont',
                prenom: 'Jean',
                adresse: '12 rue des Lilas',
                ville: 'Paris',
                codePostal: '75001',
                telephone: '0123456789',
                adresseMail: 'jean.dupont@universite.fr',
                longitudeAdresse: '2.3522',
                latitudeAdresse: '48.8566',
                quotaEtudiant: 5
            },
            {
                idPersonnel: 2,
                role: 'Enseignant',
                nom: 'Martin',
                prenom: 'Marie',
                adresse: '45 avenue des Roses',
                ville: 'Lyon',
                codePostal: '69001',
                telephone: '0234567890',
                adresseMail: 'marie.martin@universite.fr',
                longitudeAdresse: '4.8357',
                latitudeAdresse: '45.7640',
                quotaEtudiant: 4
            },
            {
                idPersonnel: 3,
                role: 'Enseignant',
                nom: 'Leroy',
                prenom: 'Pierre',
                adresse: '8 boulevard des Chênes',
                ville: 'Bordeaux',
                codePostal: '33000',
                telephone: '0345678901',
                adresseMail: 'pierre.leroy@universite.fr',
                longitudeAdresse: '-0.5792',
                latitudeAdresse: '44.8378',
                quotaEtudiant: 6
            },
            {
                idPersonnel: 4,
                role: 'Enseignant',
                nom: 'Petit',
                prenom: 'Sophie',
                adresse: '23 rue des Peupliers',
                ville: 'Toulouse',
                codePostal: '31000',
                telephone: '0456789012',
                adresseMail: 'sophie.petit@universite.fr',
                longitudeAdresse: '1.4442',
                latitudeAdresse: '43.6047',
                quotaEtudiant: 3
            }
        ];
        
        this.teachers = teachers;
    }

    handleConfirmAttribution(teacherId: number) {
        const selectedTeacher = this.teachers?.find(teacher => teacher.idPersonnel === teacherId);
        
        if (selectedTeacher) {
            this.choicedTutor = selectedTeacher;
        } else {
            console.warn("Aucun enseignant trouvé avec cet ID :", teacherId);
        }
    
        this.showAttributionModal = false;
    
        if (!this.teacherTutorDetails) {
            this.teacherTutorDetails = {};
        }
    
        if (this.detailsSheet?.idUPPA) {
            this.teacherTutorDetails.idUPPA = Number(this.detailsSheet.idUPPA.value);
        }
    
        this.academicYearService.getCurrentAcademicYear().subscribe({
            next: (year) => {
                if (year) {
                    this.teacherTutorDetails!.idAnneeUniversitaire = year.idAnneeUniversitaire; 
                    this.teacherTutorDetails!.idPersonnel = this.choicedTutor?.idPersonnel;
    
                    this.studentStaffService.updateStudentTeacherAssignments(this.teacherTutorDetails!)
                        .pipe(
                            catchError((error) => {
                                // Capture explicitement toutes les erreurs, y compris 404
                                console.log("Échec de la mise à jour, tentative d'ajout");
                                return this.studentStaffService.addStudentTeacherAssignments(this.teacherTutorDetails!);
                            })
                        )
                        .subscribe({
                            next: (response) => {
                                // Traitement réussi (soit update, soit add)
                            },
                            error: (err) => {
                                console.error("Erreur lors de l'affectation");
                            }
                        });
                }
            },
            error: (err) => {
                console.error("Erreur lors de la récupération de l'année académique");
            }
        });
    }
    
    handleCancelAttribution() {
        this.showAttributionModal = false;
    }


    

   
}
