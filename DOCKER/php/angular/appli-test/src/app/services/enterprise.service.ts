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
    },
    {
      idEntreprise: 6,
      numSIRET: '67890123456789',
      raisonSociale: 'DataSphere',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '78 avenue des Sciences',
      villeEntreprise: 'Montpellier',
      codePostalEntreprise: '34000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0467891234',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 85,
      representantLegal: 'Emma Bernard',
      longGPS: '43.6108',
      latGPS: '3.8767'
    },
    {
      idEntreprise: 7,
      numSIRET: '78901234567890',
      raisonSociale: 'CloudNet Solutions',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '34 rue de la République',
      villeEntreprise: 'Lille',
      codePostalEntreprise: '59000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0320234567',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SARL',
      effectif: 45,
      representantLegal: 'Thomas Petit',
      longGPS: '50.6292',
      latGPS: '3.0573'
    },
    {
      idEntreprise: 8,
      numSIRET: '89012345678901',
      raisonSociale: 'SmartCode',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '12 boulevard Digital',
      villeEntreprise: 'Rennes',
      codePostalEntreprise: '35000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0299345678',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 60,
      representantLegal: 'Julie Moreau',
      longGPS: '48.1173',
      latGPS: '-1.6778'
    },
    {
      idEntreprise: 9,
      numSIRET: '90123456789012',
      raisonSociale: 'InnovTech',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '45 rue de l\'Innovation',
      villeEntreprise: 'Grenoble',
      codePostalEntreprise: '38000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0476123456',
      codeAPE_NAF: '7112B',
      statutJuridique: 'SAS',
      effectif: 120,
      representantLegal: 'Alexandre Blanc',
      longGPS: '45.1885',
      latGPS: '5.7245'
    },
    {
      idEntreprise: 10,
      numSIRET: '01234567890123',
      raisonSociale: 'CyberSec Solutions',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '23 avenue de la Sécurité',
      villeEntreprise: 'Nice',
      codePostalEntreprise: '06000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0493234567',
      codeAPE_NAF: '6203Z',
      statutJuridique: 'SAS',
      effectif: 65,
      representantLegal: 'Sarah Cohen',
      longGPS: '43.7102',
      latGPS: '7.2620'
    },
    {
      idEntreprise: 11,
      numSIRET: '12345678901234',
      raisonSociale: 'AITech Research',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '89 boulevard des Sciences',
      villeEntreprise: 'Sophia Antipolis',
      codePostalEntreprise: '06560',
      paysEntreprise: 'France',
      telephoneEntreprise: '0489345678',
      codeAPE_NAF: '7219Z',
      statutJuridique: 'SA',
      effectif: 200,
      representantLegal: 'Paul Durand',
      longGPS: '43.6167',
      latGPS: '7.0667'
    },
    {
      idEntreprise: 12,
      numSIRET: '23456789012345',
      raisonSociale: 'DevStream',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '156 avenue du Code',
      villeEntreprise: 'Strasbourg',
      codePostalEntreprise: '67000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0388456789',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 95,
      representantLegal: 'Marc Weber',
      longGPS: '48.5734',
      latGPS: '7.7521'
    },
    {
      idEntreprise: 13,
      numSIRET: '34567890123456',
      raisonSociale: 'BlockTech',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '27 rue de la Blockchain',
      villeEntreprise: 'Marseille',
      codePostalEntreprise: '13000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0491567890',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SAS',
      effectif: 70,
      representantLegal: 'Sophie Lambert',
      longGPS: '43.2965',
      latGPS: '5.3698'
    },
    {
      idEntreprise: 14,
      numSIRET: '45678901234567',
      raisonSociale: 'EcoSoft',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '89 rue Verte',
      villeEntreprise: 'Angers',
      codePostalEntreprise: '49000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0241678901',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SARL',
      effectif: 40,
      representantLegal: 'Pierre Rousseau',
      longGPS: '47.4784',
      latGPS: '-0.5632'
    },
    {
      idEntreprise: 15,
      numSIRET: '56789012345678',
      raisonSociale: 'QuantumTech',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '42 avenue Quantique',
      villeEntreprise: 'Metz',
      codePostalEntreprise: '57000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0387789012',
      codeAPE_NAF: '7219Z',
      statutJuridique: 'SAS',
      effectif: 150,
      representantLegal: 'Claire Martin',
      longGPS: '49.1193',
      latGPS: '6.1757'
    },
    {
      idEntreprise: 16,
      numSIRET: '67890123456789',
      raisonSociale: 'RoboSystems',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '15 rue de la Robotique',
      villeEntreprise: 'Clermont-Ferrand',
      codePostalEntreprise: '63000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0473890123',
      codeAPE_NAF: '7112B',
      statutJuridique: 'SAS',
      effectif: 80,
      representantLegal: 'Antoine Dubois',
      longGPS: '45.7772',
      latGPS: '3.0870'
    },
    {
      idEntreprise: 17,
      numSIRET: '78901234567890',
      raisonSociale: 'BioTech Solutions',
      typeEtablissement: 'Siège social',
      adresseEntreprise: '67 boulevard Pasteur',
      villeEntreprise: 'Dijon',
      codePostalEntreprise: '21000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0380901234',
      codeAPE_NAF: '7211Z',
      statutJuridique: 'SA',
      effectif: 110,
      representantLegal: 'Marie Lefevre',
      longGPS: '47.3220',
      latGPS: '5.0415'
    },
    {
      idEntreprise: 18,
      numSIRET: '89012345678901',
      raisonSociale: 'VRTech',
      typeEtablissement: 'Filiale',
      adresseEntreprise: '31 rue Virtuelle',
      villeEntreprise: 'Caen',
      codePostalEntreprise: '14000',
      paysEntreprise: 'France',
      telephoneEntreprise: '0231012345',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 55,
      representantLegal: 'Lucas Girard',
      longGPS: '49.1829',
      latGPS: '-0.3707'
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