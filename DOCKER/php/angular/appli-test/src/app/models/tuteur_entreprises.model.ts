export class tuteur_entreprises
 {
    idTuteur: number;
    nom: string | null;
    prenom: string | null;
    telephone: string | null;
    adresseMail: string | null;
    fonction: string | null;
    idEntreprise: number | null;
  
    constructor(
        idTuteur: number,
        nom: string | null,
        prenom: string | null,
        telephone: string | null,
        adresseMail: string | null,
        fonction: string | null,
        idEntreprise: number | null,
    ) {
        this.idTuteur=idTuteur;
        this.nom=nom;
        this.prenom=prenom;
        this.telephone=telephone;
        this.adresseMail=adresseMail;
        this.fonction=fonction;
        this.idEntreprise=idEntreprise;
    }
}
