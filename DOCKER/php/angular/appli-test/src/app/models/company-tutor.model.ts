export class CompanyTutor {
    idTuteur: number;
    nom: string;
    prenom: string;
    telephone: string;
    adresseMail: string;
    fonction: string;
    idEntreprise: number;
  
    constructor(
        idTuteur: number,
        nom: string,
        prenom: string,
        telephone: string,
        adresseMail: string,
        fonction: string,
        idEntreprise: number
    ) {
        this.idTuteur = idTuteur;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.adresseMail = adresseMail;
        this.fonction = fonction;
        this.idEntreprise = idEntreprise;
    }
}