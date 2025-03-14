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
import { CompanyTutor } from '../../models/companyTutor';
import { StudentService } from '../../services/student.service';
import { DetailsSheet } from '../../models/detailsSheet.model';


@Component({
    selector: 'app-sheet-details',
    standalone: true,
    imports: [CommonModule, LoadingComponent, BreadcrumbComponent],
    templateUrl: './factsheets-details.component.html',
    styleUrl: './factsheets-details.component.css'
})
export class SheetDetailsComponent implements OnInit {
    selectedStudent?: Student;
    currentUserRole?: string;
    sheet?: Factsheets;
    company?: Company;
    CompagnyTutor?:CompanyTutor;
    dataLoaded: boolean = false;
    detailsSheet:any;


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


        /*
        if (sheetId) {
            this.factsheetsService.getSheetById(sheetId).subscribe(
                sheet => {
                    if (sheet) {
                        this.sheet = sheet;
                        
                        this.loadCompanyDetails(sheet.idEntreprise!);
                        this.loadStudentDetails(sheet.idUPPA);
                        
                    }
                }
            );
        }
        */


        this.detailsSheet=this.factsheetsService.getSheetById(sheetId);
        console.log("alooooo",this.detailsSheet);
    }

    /*

    private loadCompanyDetails(companyId: number) {
        this.companyService.getCompanyById(companyId, ['idEntreprise', 'raisonSociale', 'adresse', 'codePostal',
             'ville','pays','telephone','typeEtablissement','numSiret','codeAPE_NAF',
             'statutJuridique','effectif']).subscribe(
            company => {
                console.log(company);
                this.company = company;
                this.dataLoaded = true;
            }
        );
    }

    private loadStudentDetails(studentId:string | null){
        this.studentService.getStudentById(studentId,['idUPPA','nom','prenom',
            'adresse','ville','codePostal', 'telephone','adresseMail']).subscribe(
                student =>{
                    this.selectedStudent = student;
                }
            )
    }

    */

    



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
}
