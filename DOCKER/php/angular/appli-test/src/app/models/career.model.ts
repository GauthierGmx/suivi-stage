export class Career {
    codeParcours: string;
    libelle: string | null;
    idDepartement: number;
  
    constructor(
        codeParcours: string,
        libelle: string,
        idDepartement: number
    ) {
        this.codeParcours = codeParcours;
        this.libelle = libelle;
        this.idDepartement = idDepartement;
    }
}