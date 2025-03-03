export class Company {
    idEntreprise: number;
    numSiret?: string | null;
    raisonSociale: string | null;
    typeEtablissement?: EtablissementType | null;
    adresse: string | null;
    ville: string | null;
    codePostal: string | null;
    pays: string | null;
    telephone?: string | null;
    codeAPE_NAF?: string | null;
    statutJuridique?: string | null;
    effectif?: number | null;
    representantLegal?: string | null;
    longitudeAdresse?: string | null;
    latitudeAdresse?: string | null;

    constructor (
        idEntreprise: number = 0,
        raisonSociale: string = '',
        adresse: string = '',
        ville: string = '',
        codePostal: string = '',
        pays: string = '',
        numSiret?: string,
        typeEtablissement?: EtablissementType,
        telephone?: string,
        codeAPE_NAF?: string,
        statutJuridique?: string,
        effectif?: number,
        representantLegal?: string,
        longitudeAdresse?: string,
        latitudeAdresse?: string
    ) {
        this.idEntreprise = idEntreprise;
        this.raisonSociale = raisonSociale;
        this.adresse = adresse;
        this.ville = ville;
        this.codePostal = codePostal;
        this.pays = pays;
        this.numSiret = numSiret;
        this.typeEtablissement = typeEtablissement;
        this.telephone = telephone;
        this.codeAPE_NAF = codeAPE_NAF;
        this.statutJuridique = statutJuridique;
        this.effectif = effectif;
        this.representantLegal = representantLegal;
        this.longitudeAdresse = longitudeAdresse;
        this.latitudeAdresse = latitudeAdresse;
    }
}

export type EtablissementType = 'Siège social' | 'Filiale' | 'Succursale' | 'Agence' | 'Établissement secondaire';