import { Factsheets } from "./description-sheet.model";
import { Company } from "./company.model";
import { Student } from "./student.model";
import { CompanyTutor } from "./companyTutor";


export interface DetailsSheet{
    ficheDescriptive: Factsheets;
    entreprise: Company;
    etudiant: Student;  
    companyTutor: CompanyTutor;  
}