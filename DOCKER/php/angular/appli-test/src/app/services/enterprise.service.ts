import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type EtablissementType = 'Siège social' | 'Filiale' | 'Succursale' | 'Agence' | 'Établissement secondaire';

export interface Enterprise {
  idEntreprise: number;
  numSIRET: string;
  raisonSociale: string;
  typeEtablissement: EtablissementType;
  adresseEntreprise: string;
  villeEntreprise: string;
  codePostalEntreprise: string;
  paysEntreprise: string;
  telephoneEntreprise: string;
  codeAPE_NAF: string;
  statutJuridique: string;
  effectif: number;
  representantLegal: string;
  longGPS: string;
  latGPS: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnterpriseService {
  private readonly mockEnterprises: Enterprise[] = [
    {
      idEntreprise: 1,
      numSIRET: '12345678901234',
      raisonSociale: 'ByeWind',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '12 rue de l\'Innovation',
      villeEntreprise: 'Pau',
      codePostalEntreprise: '64000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0559123456',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 50,
      representantLegal: 'Jean Dupont',
      longGPS: '43.2951',
      latGPS: '-0.3708'
    },
    {
      idEntreprise: 2,
      numSIRET: '23456789012345',
      raisonSociale: 'Natali Tech',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '45 avenue des Lilas',
      villeEntreprise: 'Bordeaux',
      codePostalEntreprise: '33000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0556234567',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SARL',
      effectif: 25,
      representantLegal: 'Marie Martin',
      longGPS: '44.8378',
      latGPS: '-0.5792'
    },
    {
      idEntreprise: 3,
      numSIRET: '34567890123456',
      raisonSociale: 'Digital Wave',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '8 rue du Commerce',
      villeEntreprise: 'Toulouse',
      codePostalEntreprise: '31000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0561345678',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 75,
      representantLegal: 'Pierre Dubois',
      longGPS: '43.6047',
      latGPS: '1.4442'
    },
    {
      idEntreprise: 4,
      numSIRET: '45678901234567',
      raisonSociale: 'WebSoft Solutions',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '23 boulevard Tech',
      villeEntreprise: 'Lyon',
      codePostalEntreprise: '69000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0472456789',
      codeAPE_NAF: '6202B',
      statutJuridique: 'SA',
      effectif: 150,
      representantLegal: 'Sophie Leclerc',
      longGPS: '45.7640',
      latGPS: '4.8357'
    },
    {
      idEntreprise: 5,
      numSIRET: '56789012345678',
      raisonSociale: 'InfoTech Services',
      typeEtablissement: 'Agence',
      adresseEntreprise: '56 rue de la Paix',
      villeEntreprise: 'Nantes',
      codePostalEntreprise: '44000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0240567890',
      codeAPE_NAF: '6203Z',
      statutJuridique: 'EURL',
      effectif: 15,
      representantLegal: 'Lucas Martin',
      longGPS: '47.2184',
      latGPS: '-1.5536'
    }
  ];

  getEnterprises(): Observable<Enterprise[]> {
    return of(this.mockEnterprises);
  }

  getEnterpriseById(id: number): Observable<Enterprise | undefined> {
    return of(this.mockEnterprises.find(enterprise => enterprise.idEntreprise === id));
  }

  addEnterprise(enterprise: Partial<Enterprise>): Observable<Enterprise> {
    const newEnterprise: Enterprise = {
      idEntreprise: this.mockEnterprises.length + 1,
      numSIRET: '00000000000000',
      raisonSociale: '',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '',
      villeEntreprise: '',
      codePostalEntreprise: '',
      paysEntreprise: '',
      telephoneEntreprise: '',
      codeAPE_NAF: '',
      statutJuridique: '',
      effectif: 0,
      representantLegal: '',
      longGPS: '',
      latGPS: '',
      ...enterprise
    };
    
    this.mockEnterprises.push(newEnterprise);
    return of(newEnterprise);
  }
} 