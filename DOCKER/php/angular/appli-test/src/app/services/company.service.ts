import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly mockEnterprises: Company[] = [
    {
      idEntreprise: 1,
      numSiret: '12345678901234',
      raisonSociale: 'ByeWind',
      typeEtablissement: 'Siège social',
      adresse: '12 rue de l\'Innovation',
      ville: 'Pau',
      codePostal: '64000',
      pays: 'France',
      telephone: '0559123456',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 50,
      representantLegal: 'Jean Dupont',
      longitudeAdresse: '43.2951',
      latitudeAdresse: '-0.3708'
    },
    {
      idEntreprise: 2,
      numSiret: '23456789012345',
      raisonSociale: 'Natali Tech',
      typeEtablissement: 'Siège social',
      adresse: '45 avenue des Lilas',
      ville: 'Bordeaux',
      codePostal: '33000',
      pays: 'France',
      telephone: '0556234567',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SARL',
      effectif: 25,
      representantLegal: 'Marie Martin',
      longitudeAdresse: '44.8378',
      latitudeAdresse: '-0.5792'
    },
    {
      idEntreprise: 3,
      numSiret: '34567890123456',
      raisonSociale: 'Digital Wave',
      typeEtablissement: 'Filiale',
      adresse: '8 rue du Commerce',
      ville: 'Toulouse',
      codePostal: '31000',
      pays: 'France',
      telephone: '0561345678',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 75,
      representantLegal: 'Pierre Dubois',
      longitudeAdresse: '43.6047',
      latitudeAdresse: '1.4442'
    },
    {
      idEntreprise: 4,
      numSiret: '45678901234567',
      raisonSociale: 'WebSoft Solutions',
      typeEtablissement: 'Siège social',
      adresse: '23 boulevard Tech',
      ville: 'Lyon',
      codePostal: '69000',
      pays: 'France',
      telephone: '0472456789',
      codeAPE_NAF: '6202B',
      statutJuridique: 'SA',
      effectif: 150,
      representantLegal: 'Sophie Leclerc',
      longitudeAdresse: '45.7640',
      latitudeAdresse: '4.8357'
    },
    {
      idEntreprise: 5,
      numSiret: '56789012345678',
      raisonSociale: 'InfoTech Services',
      typeEtablissement: 'Agence',
      adresse: '56 rue de la Paix',
      ville: 'Nantes',
      codePostal: '44000',
      pays: 'France',
      telephone: '0240567890',
      codeAPE_NAF: '6203Z',
      statutJuridique: 'EURL',
      effectif: 15,
      representantLegal: 'Lucas Martin',
      longitudeAdresse: '47.2184',
      latitudeAdresse: '-1.5536'
    },
    {
      idEntreprise: 6,
      numSiret: '67890123456789',
      raisonSociale: 'DataSphere',
      typeEtablissement: 'Siège social',
      adresse: '78 avenue des Sciences',
      ville: 'Montpellier',
      codePostal: '34000',
      pays: 'France',
      telephone: '0467891234',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 85,
      representantLegal: 'Emma Bernard',
      longitudeAdresse: '43.6108',
      latitudeAdresse: '3.8767'
    },
    {
      idEntreprise: 7,
      numSiret: '78901234567890',
      raisonSociale: 'CloudNet Solutions',
      typeEtablissement: 'Filiale',
      adresse: '34 rue de la République',
      ville: 'Lille',
      codePostal: '59000',
      pays: 'France',
      telephone: '0320234567',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SARL',
      effectif: 45,
      representantLegal: 'Thomas Petit',
      longitudeAdresse: '50.6292',
      latitudeAdresse: '3.0573'
    },
    {
      idEntreprise: 8,
      numSiret: '89012345678901',
      raisonSociale: 'SmartCode',
      typeEtablissement: 'Siège social',
      adresse: '12 boulevard Digital',
      ville: 'Rennes',
      codePostal: '35000',
      pays: 'France',
      telephone: '0299345678',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 60,
      representantLegal: 'Julie Moreau',
      longitudeAdresse: '48.1173',
      latitudeAdresse: '-1.6778'
    },
    {
      idEntreprise: 9,
      numSiret: '90123456789012',
      raisonSociale: 'InnovTech',
      typeEtablissement: 'Siège social',
      adresse: '45 rue de l\'Innovation',
      ville: 'Grenoble',
      codePostal: '38000',
      pays: 'France',
      telephone: '0476123456',
      codeAPE_NAF: '7112B',
      statutJuridique: 'SAS',
      effectif: 120,
      representantLegal: 'Alexandre Blanc',
      longitudeAdresse: '45.1885',
      latitudeAdresse: '5.7245'
    },
    {
      idEntreprise: 10,
      numSiret: '01234567890123',
      raisonSociale: 'CyberSec Solutions',
      typeEtablissement: 'Filiale',
      adresse: '23 avenue de la Sécurité',
      ville: 'Nice',
      codePostal: '06000',
      pays: 'France',
      telephone: '0493234567',
      codeAPE_NAF: '6203Z',
      statutJuridique: 'SAS',
      effectif: 65,
      representantLegal: 'Sarah Cohen',
      longitudeAdresse: '43.7102',
      latitudeAdresse: '7.2620'
    },
    {
      idEntreprise: 11,
      numSiret: '12345678901234',
      raisonSociale: 'AITech Research',
      typeEtablissement: 'Siège social',
      adresse: '89 boulevard des Sciences',
      ville: 'Sophia Antipolis',
      codePostal: '06560',
      pays: 'France',
      telephone: '0489345678',
      codeAPE_NAF: '7219Z',
      statutJuridique: 'SA',
      effectif: 200,
      representantLegal: 'Paul Durand',
      longitudeAdresse: '43.6167',
      latitudeAdresse: '7.0667'
    },
    {
      idEntreprise: 12,
      numSiret: '23456789012345',
      raisonSociale: 'DevStream',
      typeEtablissement: 'Siège social',
      adresse: '156 avenue du Code',
      ville: 'Strasbourg',
      codePostal: '67000',
      pays: 'France',
      telephone: '0388456789',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 95,
      representantLegal: 'Marc Weber',
      longitudeAdresse: '48.5734',
      latitudeAdresse: '7.7521'
    },
    {
      idEntreprise: 13,
      numSiret: '34567890123456',
      raisonSociale: 'BlockTech',
      typeEtablissement: 'Filiale',
      adresse: '27 rue de la Blockchain',
      ville: 'Marseille',
      codePostal: '13000',
      pays: 'France',
      telephone: '0491567890',
      codeAPE_NAF: '6202A',
      statutJuridique: 'SAS',
      effectif: 70,
      representantLegal: 'Sophie Lambert',
      longitudeAdresse: '43.2965',
      latitudeAdresse: '5.3698'
    },
    {
      idEntreprise: 14,
      numSiret: '45678901234567',
      raisonSociale: 'EcoSoft',
      typeEtablissement: 'Siège social',
      adresse: '89 rue Verte',
      ville: 'Angers',
      codePostal: '49000',
      pays: 'France',
      telephone: '0241678901',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SARL',
      effectif: 40,
      representantLegal: 'Pierre Rousseau',
      longitudeAdresse: '47.4784',
      latitudeAdresse: '-0.5632'
    },
    {
      idEntreprise: 15,
      numSiret: '56789012345678',
      raisonSociale: 'QuantumTech',
      typeEtablissement: 'Siège social',
      adresse: '42 avenue Quantique',
      ville: 'Metz',
      codePostal: '57000',
      pays: 'France',
      telephone: '0387789012',
      codeAPE_NAF: '7219Z',
      statutJuridique: 'SAS',
      effectif: 150,
      representantLegal: 'Claire Martin',
      longitudeAdresse: '49.1193',
      latitudeAdresse: '6.1757'
    },
    {
      idEntreprise: 16,
      numSiret: '67890123456789',
      raisonSociale: 'RoboSystems',
      typeEtablissement: 'Filiale',
      adresse: '15 rue de la Robotique',
      ville: 'Clermont-Ferrand',
      codePostal: '63000',
      pays: 'France',
      telephone: '0473890123',
      codeAPE_NAF: '7112B',
      statutJuridique: 'SAS',
      effectif: 80,
      representantLegal: 'Antoine Dubois',
      longitudeAdresse: '45.7772',
      latitudeAdresse: '3.0870'
    },
    {
      idEntreprise: 17,
      numSiret: '78901234567890',
      raisonSociale: 'BioTech Solutions',
      typeEtablissement: 'Siège social',
      adresse: '67 boulevard Pasteur',
      ville: 'Dijon',
      codePostal: '21000',
      pays: 'France',
      telephone: '0380901234',
      codeAPE_NAF: '7211Z',
      statutJuridique: 'SA',
      effectif: 110,
      representantLegal: 'Marie Lefevre',
      longitudeAdresse: '47.3220',
      latitudeAdresse: '5.0415'
    },
    {
      idEntreprise: 18,
      numSiret: '89012345678901',
      raisonSociale: 'VRTech',
      typeEtablissement: 'Filiale',
      adresse: '31 rue Virtuelle',
      ville: 'Caen',
      codePostal: '14000',
      pays: 'France',
      telephone: '0231012345',
      codeAPE_NAF: '6201Z',
      statutJuridique: 'SAS',
      effectif: 55,
      representantLegal: 'Lucas Girard',
      longitudeAdresse: '49.1829',
      latitudeAdresse: '-0.3707'
    }
  ];

  getCompanies() {
    return this.mockEnterprises;
  }

  getCompanyById(id: number) {
    return this.mockEnterprises.find(enterprise => enterprise.idEntreprise === id);
  }

  addCompany(enterprise: Partial<Company>): Observable<Company> {
    const newEnterprise: Company = {
      idEntreprise: this.mockEnterprises.length + 1,
      numSiret: '00000000000000',
      raisonSociale: '',
      typeEtablissement: 'Siège social',
      adresse: '',
      ville: '',
      codePostal: '',
      pays: '',
      telephone: '',
      codeAPE_NAF: '',
      statutJuridique: '',
      effectif: 0,
      representantLegal: '',
      longitudeAdresse: '',
      latitudeAdresse: '',
      ...enterprise
    };
    
    this.mockEnterprises.push(newEnterprise);
    return of(newEnterprise);
  }
} 