import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject} from 'rxjs';
import { InternshipSearch, SearchStatus } from '../models/internship-search.model';
import { CompanyService } from './company.service';
import { StudentService } from './student.service';

@Injectable({
  providedIn: 'root'
})
export class InternshipSearchService {
  private mockSearches: InternshipSearch[] = [
    {
      idRecherche: 1,
      idEntreprise: 1,
      idUPPA: 'ETU12345',
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomContact: 'Dupont',
      prenomContact: 'Jean',
      fonctionContact: 'Responsable RH',
      telContact: '0612345678',
      mailContact: 'jean.dupont@byewind.fr',
      statut: 'En attente',
      observations: 'Premier contact très positif, en attente de réponse',
      dateRelance: new Date('2024-02-20')
    },
    {
      idRecherche: 2,
      idEntreprise: 2,
      idUPPA: 'ETU12345',
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Marie',
      fonctionContact: 'Directrice technique',
      telContact: '0623456789',
      mailContact: 'marie.martin@natali.fr',
      statut: 'Validé',
      observations: 'Entretien prévu la semaine prochaine',
      dateRelance: new Date('2024-02-15')
    },
    {
      idRecherche: 3,
      idEntreprise: 3,
      idUPPA: 'ETU12345',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomContact: 'Dubois',
      prenomContact: 'Pierre',
      fonctionContact: 'Responsable RH',
      telContact: '0634567890',
      mailContact: 'pierre.dubois@drewcano.fr',
      statut: 'En attente',
      observations: 'Dossier en cours d\'étude par le service RH',
      dateRelance: new Date('2024-02-10')
    },
    {
      idRecherche: 4,
      idEntreprise: 4,
      idUPPA: 'ETU12345',
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Sophie',
      fonctionContact: 'Directrice technique',
      telContact: '0645678901',
      mailContact: 'sophie.leclerc@techsolutions.fr',
      statut: 'Refusé',
      observations: 'Profil ne correspond pas aux attentes',
      dateRelance: new Date('2024-02-05')
    },
    {
      idRecherche: 5,
      idEntreprise: 5,
      idUPPA: 'ETU12345',
      dateCreation: new Date('2024-02-20'),
      dateModification: new Date('2024-02-25'),
      date1erContact: new Date('2024-02-20'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Lucas',
      fonctionContact: 'Responsable RH',
      telContact: '0656789012',
      mailContact: 'lucas.martin@digitalwave.fr',
      statut: 'En attente',
      observations: 'En attente de validation budgétaire',
      dateRelance: new Date('2024-02-25')
    },
    {
      idRecherche: 6,
      idEntreprise: 6,
      idUPPA: 'ETU12346',
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Anne',
      fonctionContact: 'Directrice technique',
      telContact: '0667890123',
      mailContact: 'anne.leclerc@websoft.fr',
      statut: 'Relancé',
      observations: 'Second entretien à prévoir',
      dateRelance: new Date('2024-02-20')
    },
    {
      idRecherche: 7,
      idEntreprise: 7,
      idUPPA: 'ETU12346',
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomContact: 'Dubois',
      prenomContact: 'Pierre',
      fonctionContact: 'Responsable RH',
      telContact: '0678901234',
      mailContact: 'pierre.dubois@infotech.fr',
      statut: 'Validé',
      observations: 'Besoin de plus d\'informations sur le projet',
      dateRelance: new Date('2024-02-15')
    },
    {
      idRecherche: 8,
      idEntreprise: 8,
      idUPPA: 'ETU12346',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Sophie',
      fonctionContact: 'Directrice technique',
      telContact: '0689012345',
      mailContact: 'sophie.leclerc@datacorps.fr',
      statut: 'Refusé',
      observations: 'Pas de stage disponible pour le moment',
      dateRelance: new Date('2024-02-10')
    },
    {
      idRecherche: 9,
      idEntreprise: 9,
      idUPPA: 'ETU12347',
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Lucas',
      fonctionContact: 'Responsable RH',
      telContact: '0690123456',
      mailContact: 'lucas.martin@softwareplus.fr',
      statut: 'Refusé',
      observations: 'À recontacter dans 2 semaines',
      dateRelance: new Date('2024-02-05')
    },
    {
      idRecherche: 10,
      idEntreprise: 10,
      idUPPA: 'ETU12347',
      dateCreation: new Date('2024-01-25'),
      dateModification: new Date('2024-02-01'),
      date1erContact: new Date('2024-01-25'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Anne',
      fonctionContact: 'Directrice technique',
      telContact: '0601234567',
      mailContact: 'anne.leclerc@techinnovate.fr',
      statut: 'Refusé',
      observations: 'CV transmis au responsable technique',
      dateRelance: new Date('2024-02-01')
    },
    {
      idRecherche: 11,
      idEntreprise: 11,
      idUPPA: 'ETU12347',
      dateCreation: new Date('2024-02-25'),
      dateModification: new Date('2024-03-01'),
      date1erContact: new Date('2024-02-25'),
      typeContact: 'Téléphone',
      nomContact: 'Bernard',
      prenomContact: 'Emma',
      fonctionContact: 'Responsable RH',
      telContact: '0612345678',
      mailContact: 'emma.bernard@futuretech.fr',
      statut: 'En attente',
      observations: 'En attente de retour suite à l\'entretien',
      dateRelance: new Date('2024-03-01')
    },
    {
      idRecherche: 12,
      idEntreprise: 12,
      idUPPA: 'ETU12347',
      dateCreation: new Date('2024-02-20'),
      dateModification: new Date('2024-02-25'),
      date1erContact: new Date('2024-02-20'),
      typeContact: 'Téléphone',
      nomContact: 'Dubois',
      prenomContact: 'Pierre',
      fonctionContact: 'Directrice technique',
      telContact: '0623456789',
      mailContact: 'pierre.dubois@smartsolutions.fr',
      statut: 'Relancé',
      observations: 'Possibilité de stage sur un autre site',
      dateRelance: new Date('2024-02-25')
    },
    {
      idRecherche: 13,
      idEntreprise: 13,
      idUPPA: 'ETU12347',
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Sophie',
      fonctionContact: 'Responsable RH',
      telContact: '0634567890',
      mailContact: 'sophie.leclerc@datasystems.fr',
      statut: 'Validé',
      observations: 'Stage déjà pourvu',
      dateRelance: new Date('2024-02-20')
    },
    {
      idRecherche: 14,
      idEntreprise: 14,
      idUPPA: 'ETU12348',
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Lucas',
      fonctionContact: 'Directrice technique',
      telContact: '0645678901',
      mailContact: 'lucas.martin@webfactory.fr',
      statut: 'Refusé',
      observations: 'Demande de lettre de motivation complémentaire',
      dateRelance: new Date('2024-02-15')
    },
    {
      idRecherche: 15,
      idEntreprise: 15,
      idUPPA: 'ETU12348',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomContact: 'Dubois',
      prenomContact: 'Pierre',
      fonctionContact: 'Responsable RH',
      telContact: '0656789012',
      mailContact: 'pierre.dubois@cloudnine.fr',
      statut: 'Refusé',
      observations: 'Contact à reprendre en septembre',
      dateRelance: new Date('2024-02-10')
    },
    {
      idRecherche: 16,
      idEntreprise: 16,
      idUPPA: 'ETU12348',
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Sophie',
      fonctionContact: 'Directrice technique',
      telContact: '0667890123',
      mailContact: 'sophie.leclerc@devstudio.fr',
      statut: 'Refusé',
      observations: 'Entreprise intéressée par le profil',
      dateRelance: new Date('2024-02-05')
    }
  ];

  private searchesSubject = new BehaviorSubject<InternshipSearch[]>(this.mockSearches);

  constructor(
    private readonly enterpriseService: CompanyService,
    private readonly studentService: StudentService
  ) {}

  //Sélection de recherches
  getSearches() {
    return this.mockSearches;
  }

  getSearchById(id: number) {
    return this.mockSearches.filter(s => s.idRecherche === id);
  }

  getSearchesByStudentId(studentId: string) {
    return this.mockSearches.filter(s => s.idUPPA === studentId);
  }

  getSearchesByStudentIdAndStatut(studentId: string, statut: SearchStatus) {
    return this.mockSearches.filter(s => s.idUPPA === studentId && s.statut === statut);
  }

  getStudentSearchStats() {
    const students = ['3', '4', '5'].map(id => {
      const studentSearches = this.mockSearches.filter(s => s.idUPPA === id);
      return {
        id,
        studentName: id === '3' ? 'Marie Lambert' : id === '4' ? 'Lucas Martin' : 'Emma Bernard',
        searchCount: studentSearches.length,
        lastUpdate: this.getLastUpdateDate(studentSearches),
        bestStatus: this.getBestStatus(studentSearches)
      };
    });
    return of(students);
  }

  //Ajout d'une recherche
  addSearch(search: Omit<InternshipSearch, 'idRecherche'>): Observable<InternshipSearch> {
    const newSearch: InternshipSearch = {
      idRecherche: Math.max(...this.mockSearches.map(s => s.idRecherche), 0) + 1,
      idEntreprise: search.idEntreprise,
      idUPPA: search.idUPPA,
      dateCreation: new Date(),
      dateModification: new Date(),
      date1erContact: search.date1erContact,
      typeContact: search.typeContact,
      nomContact: search.nomContact,
      prenomContact: search.prenomContact,
      fonctionContact: search.fonctionContact,
      telContact: search.telContact,
      mailContact: search.mailContact,
      statut: search.statut,
      observations: search.observations ?? '',
      dateRelance: search.dateRelance
    };

    this.mockSearches.push(newSearch);
    this.searchesSubject.next([...this.mockSearches]);
    
    return of(newSearch);
  }

  //Mise à jour d'une recherche
  updateSearch(id: number, search: Partial<InternshipSearch>): Observable<InternshipSearch> {
    const index = this.mockSearches.findIndex(s => s.idRecherche === id);
    if (index === -1) throw new Error('Recherche non trouvée');

    // Conversion des IDs en nombres si présents dans l'update
    const updatedSearch = {
      ...this.mockSearches[index],
      ...search,
      dateModification: new Date(),
    };

    this.mockSearches[index] = updatedSearch;
    this.searchesSubject.next([...this.mockSearches]);

    return of(updatedSearch);
  }

  //Supression d'une recherche
  deleteSearch(id: number): Observable<void> {
    this.mockSearches = this.mockSearches.filter(s => s.idRecherche !== id);
    this.searchesSubject.next([...this.mockSearches]);
    return of(void 0);
  }

  //Sélection autres
  private getLastUpdateDate(searches: InternshipSearch[]): Date {
    if (!searches.length) return new Date();
    return new Date(Math.max(...searches.map(s => s.dateModification.getTime())));
  }

  private getBestStatus(searches: InternshipSearch[]): SearchStatus {
    if (!searches.length) return 'En attente';
    const statusPriority = {
      'Validé': 4,
      'En attente': 3,
      'Relancé': 2,
      'Refusé': 1
    };
    return searches.reduce((best, current) => 
      statusPriority[current.statut] > statusPriority[best.statut] ? current : best
    ).statut;
  }
} 