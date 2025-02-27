export class Student_TrainingYear_AcademicYear {
    idUPPA: string;
    idTrainingYear: number;
    idAcademicYear: number;
  
    constructor(
        idUPPA: string,
        idTrainingYear: number,
        idAcademicYear: number
    ) {
        this.idUPPA = idUPPA;
        this.idTrainingYear = idTrainingYear;
        this.idAcademicYear = idAcademicYear;
    }
}