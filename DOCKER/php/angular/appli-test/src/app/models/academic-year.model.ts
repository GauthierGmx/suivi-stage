export class AcademicYear {
    idAnneeUniversitaire: number = 0;
    libelle: string | null;
  
    constructor(
        libelle: string
    ) {
        this.libelle = libelle;
    }
}