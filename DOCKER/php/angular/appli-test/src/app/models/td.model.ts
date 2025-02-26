export class TD {
    idTD: number;
    libelle: string | null;
  
    constructor(
      idTD: number,
      libelle: string
    ) {
      this.idTD = idTD;
      this.libelle = libelle;
    }
}