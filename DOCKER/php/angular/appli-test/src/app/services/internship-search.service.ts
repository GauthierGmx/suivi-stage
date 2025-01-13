import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, BehaviorSubject, switchMap, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { InternshipSearch, SearchStatus } from '../models/internship-search.model';
import { EnterpriseService } from './enterprise.service';
import { StudentService } from './student.service';

@Injectable({
  providedIn: 'root'
})
export class InternshipSearchService {
  private mockSearches: InternshipSearch[] = [
    {
      idRecherche: 1,
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Jean Dupont',
      fonctionContact: 'Responsable RH',
      telContact: '0612345678',
      mailContact: 'jean.dupont@byewind.fr',
      dateRelance: new Date('2024-02-20'),
      statut: 'En attente',
      idEntreprise: 1,
      idEtudiant: 3,
      observations: 'Premier contact très positif, en attente de réponse'
    },
    {
      idRecherche: 2,
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Marie Martin',
      fonctionContact: 'Directrice technique',
      telContact: '0623456789',
      mailContact: 'marie.martin@natali.fr',
      dateRelance: new Date('2024-02-15'),
      statut: 'Validé',
      idEntreprise: 2,
      idEtudiant: 3,
      observations: 'Entretien prévu la semaine prochaine'
    },
    {
      idRecherche: 3,
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Pierre Dubois',
      fonctionContact: 'Responsable RH',
      telContact: '0634567890',
      mailContact: 'pierre.dubois@drewcano.fr',
      dateRelance: new Date('2024-02-10'),
      statut: 'En attente',
      idEntreprise: 3,
      idEtudiant: 3,
      observations: 'Dossier en cours d\'étude par le service RH'
    },
    {
      idRecherche: 4,
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Sophie Leclerc',
      fonctionContact: 'Directrice technique',
      telContact: '0645678901',
      mailContact: 'sophie.leclerc@techsolutions.fr',
      dateRelance: new Date('2024-02-05'),
      statut: 'Refusé',
      idEntreprise: 4,
      idEtudiant: 3,
      observations: 'Profil ne correspond pas aux attentes'
    },
    {
      idRecherche: 5,
      dateCreation: new Date('2024-02-20'),
      dateModification: new Date('2024-02-25'),
      date1erContact: new Date('2024-02-20'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Lucas Martin',
      fonctionContact: 'Responsable RH',
      telContact: '0656789012',
      mailContact: 'lucas.martin@digitalwave.fr',
      dateRelance: new Date('2024-02-25'),
      statut: 'En attente',
      idEntreprise: 5,
      idEtudiant: 4,
      observations: 'En attente de validation budgétaire'
    },
    {
      idRecherche: 6,
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Anne Leclerc',
      fonctionContact: 'Directrice technique',
      telContact: '0667890123',
      mailContact: 'anne.leclerc@websoft.fr',
      dateRelance: new Date('2024-02-20'),
      statut: 'Relancé',
      idEntreprise: 6,
      idEtudiant: 4,
      observations: 'Second entretien à prévoir'
    },
    {
      idRecherche: 7,
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Pierre Dubois',
      fonctionContact: 'Responsable RH',
      telContact: '0678901234',
      mailContact: 'pierre.dubois@infotech.fr',
      dateRelance: new Date('2024-02-15'),
      statut: 'Validé',
      idEntreprise: 7,
      idEtudiant: 4,
      observations: 'Besoin de plus d\'informations sur le projet'
    },
    {
      idRecherche: 8,
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Sophie Leclerc',
      fonctionContact: 'Directrice technique',
      telContact: '0689012345',
      mailContact: 'sophie.leclerc@datacorps.fr',
      dateRelance: new Date('2024-02-10'),
      statut: 'Refusé',
      idEntreprise: 8,
      idEtudiant: 4,
      observations: 'Pas de stage disponible pour le moment'
    },
    {
      idRecherche: 9,
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Lucas Martin',
      fonctionContact: 'Responsable RH',
      telContact: '0690123456',
      mailContact: 'lucas.martin@softwareplus.fr',
      dateRelance: new Date('2024-02-05'),
      statut: 'Refusé',
      idEntreprise: 9,
      idEtudiant: 4,
      observations: 'À recontacter dans 2 semaines'
    },
    {
      idRecherche: 10,
      dateCreation: new Date('2024-01-25'),
      dateModification: new Date('2024-02-01'),
      date1erContact: new Date('2024-01-25'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Anne Leclerc',
      fonctionContact: 'Directrice technique',
      telContact: '0601234567',
      mailContact: 'anne.leclerc@techinnovate.fr',
      dateRelance: new Date('2024-02-01'),
      statut: 'Refusé',
      idEntreprise: 10,
      idEtudiant: 4,
      observations: 'CV transmis au responsable technique'
    },
    {
      idRecherche: 11,
      dateCreation: new Date('2024-02-25'),
      dateModification: new Date('2024-03-01'),
      date1erContact: new Date('2024-02-25'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Emma Bernard',
      fonctionContact: 'Responsable RH',
      telContact: '0612345678',
      mailContact: 'emma.bernard@futuretech.fr',
      dateRelance: new Date('2024-03-01'),
      statut: 'En attente',
      idEntreprise: 11,
      idEtudiant: 5,
      observations: 'En attente de retour suite à l\'entretien'
    },
    {
      idRecherche: 12,
      dateCreation: new Date('2024-02-20'),
      dateModification: new Date('2024-02-25'),
      date1erContact: new Date('2024-02-20'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Pierre Dubois',
      fonctionContact: 'Directrice technique',
      telContact: '0623456789',
      mailContact: 'pierre.dubois@smartsolutions.fr',
      dateRelance: new Date('2024-02-25'),
      statut: 'Relancé',
      idEntreprise: 12,
      idEtudiant: 5,
      observations: 'Possibilité de stage sur un autre site'
    },
    {
      idRecherche: 13,
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Sophie Leclerc',
      fonctionContact: 'Responsable RH',
      telContact: '0634567890',
      mailContact: 'sophie.leclerc@datasystems.fr',
      dateRelance: new Date('2024-02-20'),
      statut: 'Validé',
      idEntreprise: 13,
      idEtudiant: 5,
      observations: 'Stage déjà pourvu'
    },
    {
      idRecherche: 14,
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Lucas Martin',
      fonctionContact: 'Directrice technique',
      telContact: '0645678901',
      mailContact: 'lucas.martin@webfactory.fr',
      dateRelance: new Date('2024-02-15'),
      statut: 'Refusé',
      idEntreprise: 14,
      idEtudiant: 5,
      observations: 'Demande de lettre de motivation complémentaire'
    },
    {
      idRecherche: 15,
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Pierre Dubois',
      fonctionContact: 'Responsable RH',
      telContact: '0656789012',
      mailContact: 'pierre.dubois@cloudnine.fr',
      dateRelance: new Date('2024-02-10'),
      statut: 'Refusé',
      idEntreprise: 15,
      idEtudiant: 5,
      observations: 'Contact à reprendre en septembre'
    },
    {
      idRecherche: 16,
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Sophie Leclerc',
      fonctionContact: 'Directrice technique',
      telContact: '0667890123',
      mailContact: 'sophie.leclerc@devstudio.fr',
      dateRelance: new Date('2024-02-05'),
      statut: 'Refusé',
      idEntreprise: 16,
      idEtudiant: 5,
      observations: 'Entreprise intéressée par le profil'
    },
    {
      idRecherche: 17,
      dateCreation: new Date('2024-01-25'),
      dateModification: new Date('2024-02-01'),
      date1erContact: new Date('2024-01-25'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Lucas Martin',
      fonctionContact: 'Responsable RH',
      telContact: '0678901234',
      mailContact: 'lucas.martin@codelabs.fr',
      dateRelance: new Date('2024-02-01'),
      statut: 'Refusé',
      idEntreprise: 17,
      idEtudiant: 5,
      observations: 'Période de stage ne correspond pas'
    },
    {
      idRecherche: 18,
      dateCreation: new Date('2024-01-20'),
      dateModification: new Date('2024-01-25'),
      date1erContact: new Date('2024-01-20'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Pierre Dubois',
      fonctionContact: 'Directrice technique',
      telContact: '0689012345',
      mailContact: 'pierre.dubois@techhub.fr',
      dateRelance: new Date('2024-01-25'),
      statut: 'Refusé',
      idEntreprise: 18,
      idEtudiant: 5,
      observations: 'Entreprise en restructuration'
    },
    {
      idRecherche: 19,
      dateCreation: new Date('2025-01-10'),
      dateModification: new Date('2025-01-12'),
      date1erContact: new Date('2025-01-10'),
      typeContact: 'Téléphone',
      nomPrenomContact: 'Virgile Espinasse',
      fonctionContact: 'Directeur technique',
      telContact: '0623456789',
      mailContact: 'virgile.espinasse@natali.fr',
      dateRelance: new Date('2025-01-12'),
      statut: 'En attente',
      idEntreprise: 2,
      idEtudiant: 3,
      observations: 'Entretien prévu la semaine prochaine'
    }
  ];

  private searchesSubject = new BehaviorSubject<InternshipSearch[]>(this.mockSearches);

  constructor(
    private readonly enterpriseService: EnterpriseService,
    private readonly studentService: StudentService
  ) {}

  getSearchesByStudent(): Observable<InternshipSearch[]> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') ?? '{}');
    return this.searchesSubject.asObservable().pipe(
      map(searches => searches.filter(search => search.idEtudiant === currentUser.id))
    );
  }

  getSearchesByStudentId(studentId: string): Observable<InternshipSearch[]> {
    
    // Filtrer les recherches de l'étudiant directement depuis mockSearches
    const studentSearches = this.mockSearches.filter(s => s.idEtudiant === parseInt(studentId));
    
    // Enrichir avec les données entreprise
    const enrichedSearches = studentSearches.map(search => 
      this.enterpriseService.getEnterpriseById(search.idEntreprise).pipe(
        map(enterprise => ({
          ...search,
          entreprise: enterprise
        }))
      )
    );

    return forkJoin(enrichedSearches);
  }

  getStudentSearchStats() {
    const students = [3, 4, 5].map(id => {
      const studentSearches = this.mockSearches.filter(s => s.idEtudiant === id);
      return {
        id,
        studentName: id === 3 ? 'Marie Lambert' : id === 4 ? 'Lucas Martin' : 'Emma Bernard',
        searchCount: studentSearches.length,
        lastUpdate: this.getLastUpdateDate(studentSearches),
        bestStatus: this.getBestStatus(studentSearches)
      };
    });
    return of(students);
  }

  addSearch(search: Omit<InternshipSearch, 'idRecherche'>): Observable<InternshipSearch> {
    const newSearch: InternshipSearch = {
      idRecherche: Math.max(...this.mockSearches.map(s => s.idRecherche), 0) + 1,
      dateCreation: new Date(),
      dateModification: new Date(),
      date1erContact: search.date1erContact,
      typeContact: search.typeContact,
      nomPrenomContact: search.nomPrenomContact,
      fonctionContact: search.fonctionContact,
      telContact: search.telContact,
      mailContact: search.mailContact,
      dateRelance: search.dateRelance,
      statut: search.statut,
      idEntreprise: Number(search.idEntreprise),
      idEtudiant: Number(search.idEtudiant),
      observations: search.observations ?? ''
    };

    this.mockSearches.push(newSearch);
    this.searchesSubject.next([...this.mockSearches]);
    
    return of(newSearch);
  }

  updateSearch(id: number, search: Partial<InternshipSearch>): Observable<InternshipSearch> {
    const index = this.mockSearches.findIndex(s => s.idRecherche === id);
    if (index === -1) throw new Error('Recherche non trouvée');

    // Conversion des IDs en nombres si présents dans l'update
    const updatedSearch = {
      ...this.mockSearches[index],
      ...search,
      dateModification: new Date(),
      idEntreprise: search.idEntreprise ? Number(search.idEntreprise) : this.mockSearches[index].idEntreprise,
      idEtudiant: search.idEtudiant ? Number(search.idEtudiant) : this.mockSearches[index].idEtudiant
    };

    this.mockSearches[index] = updatedSearch;
    this.searchesSubject.next([...this.mockSearches]);

    return of(updatedSearch);
  }

  deleteSearch(id: number): Observable<void> {
    this.mockSearches = this.mockSearches.filter(s => s.idRecherche !== id);
    this.searchesSubject.next([...this.mockSearches]);
    return of(void 0);
  }

  getSearchById(id: number): Observable<InternshipSearch | undefined> {
    return this.searchesSubject.pipe(
      map(searches => searches.find(s => s.idRecherche === id))
    );
  }

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