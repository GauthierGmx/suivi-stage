export class Student_Staff_AcademicYear {
    idUPPA: string;
    idPersonnel: number;
    idAnneeUniversitaire: number;
  
    constructor(
        idUPPA: string,
        idPersonnel: number,
        idAnneeUniversitaire: number
    ) {
        this.idUPPA = idUPPA;
        this.idPersonnel = idPersonnel;
        this.idAnneeUniversitaire = idAnneeUniversitaire;
    }
}