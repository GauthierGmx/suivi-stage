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


@Component({
    selector: 'app-sheet-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent, BreadcrumbComponent,TutorAttributionModalComponent],
    templateUrl: './factsheets-details.component.html',
    styleUrl: './factsheets-details.component.css'
})
export class SheetDetailsComponent implements OnInit {
    selectedStudent?: Student;
    currentUserRole?: string;
    sheet?: Factsheets;
    company?: Company;
    dataLoaded: boolean = false;
    detailsSheet?:any;
    showAttributionModal: Boolean = false;


    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly factsheetsService: FactsheetsService,
        private readonly companyService: CompanyService,
        private readonly navigationService: NavigationService,
        private readonly studentService: StudentService
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

        const sheetId = Number(this.route.snapshot.paramMap.get('idSheet'));


        
        if (sheetId) {
            this.factsheetsService.getSheetById(sheetId).subscribe(
                sheet => {
                    if (sheet) {
                        this.sheet = sheet;
                        
                        this.loadCompanyDetails(sheet.idEntreprise.value);
                        this.loadStudentDetails(sheet.idUPPA.value);
                        
                    }
                }
            );
        }
        
        
        
        
        
        this.factsheetsService.getSheetById(sheetId).subscribe({
            next: (response) => {
                this.detailsSheet = response;
            },
            error: (err) => {
                console.error("Erreur lors de la récupération de la fiche :", err);
            }
        });
    }
    
    
    
    private loadCompanyDetails(companyId: number) {
        this.companyService.getCompanyById(companyId, ['idEntreprise', 'raisonSociale', 'adresse', 'codePostal',
             'ville','pays','telephone','typeEtablissement','numSiret','codeAPE_NAF',
             'statutJuridique','effectif']).subscribe(
            company => {
                this.company = company;
            }
        );
    }

    private loadStudentDetails(studentId:string){
        this.studentService.getStudentById(studentId,['idUPPA','nom','prenom',
            'adresse','ville','codePostal', 'telephone','adresseMail']).subscribe(
                student =>{
                    this.selectedStudent = student;
                    this.dataLoaded = true;  
                }
            )
    }

    

    
    


    getStatusClass(status: string): string {
        const statusMap: Record<string, string> = {
            'Validee': 'status-badge valide',
            'En cours': 'status-badge en-attente',
            'Refusée': 'status-badge refuse'
        };
        return statusMap[status] || 'status-badge';
    }

    goToDashboard() {
        this.navigationService.navigateToDashboard();
    }

    goToEdit() {
        if (this.sheet) {
            this.navigationService.navigateToSearchEditForm(this.sheet.idFicheDescriptive);
        }
    }

    goBack() {
        this.navigationService.goBack();
    }

    //Affiche la fenêtre modale de confirmation de la supression d'une recherche de stage
    openAttributionModal() {
        this.showAttributionModal = true;
    }
    //Annulation de la suppression d'une fiche descriptive
    onCancelDelete() {
        this.showAttributionModal = false;
    }
}
