export class Student_TD_AcademicYear {
    idUPPA: string;
    idTD: number;
    idAcademicYear: number;
  
    constructor(
        idUPPA: string,
        idTD: number,
        idAcademicYear: number
    ) {
        this.idUPPA = idUPPA;
        this.idTD = idTD;
        this.idAcademicYear = idAcademicYear;
    }
}