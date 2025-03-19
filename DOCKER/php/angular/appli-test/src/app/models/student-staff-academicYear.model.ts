export class Student_Staff_AcademicYear {
    idUPPA: string;
    idPersonnel: number;
    idAcademicYear: number;
  
    constructor(
        idUPPA: string,
        idPersonnel: number,
        idAcademicYear: number
    ) {
        this.idUPPA = idUPPA;
        this.idPersonnel = idPersonnel;
        this.idAcademicYear = idAcademicYear;
    }
}