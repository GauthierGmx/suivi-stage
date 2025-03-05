export class AcademicYear {
    idAnneeUniversitaire: number;
    libelle: string | null;
  
    constructor(
        idAnneeUniversitaire: number,
        libelle: string
    ) {
        this.idAnneeUniversitaire = idAnneeUniversitaire;
        this.libelle = libelle;
    }
}