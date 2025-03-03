export class TrainingYear {
    idAnneeFormation: number;
    libelle: string | null;
  
    constructor(
        idAnneeFormation: number,
        libelle: string
    ) {
      this.idAnneeFormation = idAnneeFormation;
      this.libelle = libelle;
    }
}