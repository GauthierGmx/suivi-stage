import { Injectable } from '@angular/core';
import { InternshipSearch, SearchStatus } from '../models/internship-search.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, of, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipSearchService {
  private mockSearches: InternshipSearch[] = [
    {
      idRecherche: 1,
      idEntreprise: 1,
      idUPPA: '610123',
      dateCreation: new Date('2024-02-15'),
      dateModification: new Date('2024-02-20'),
      date1erContact: new Date('2024-02-15'),
      typeContact: 'Téléphone',
      nomContact: 'Dupont',
      prenomContact: 'Jean',
      fonctionContact: 'Responsable RH',
      telephoneContact: '0612345678',
      adresseMailContact: 'jean.dupont@byewind.fr',
      statut: 'En cours',
      observations: 'Premier contact très positif, en attente de réponse',
      dateRelance: new Date('2024-02-20')
    },
    {
      idRecherche: 2,
      idEntreprise: 2,
      idUPPA: '610123',
      dateCreation: new Date('2024-02-10'),
      dateModification: new Date('2024-02-15'),
      date1erContact: new Date('2024-02-10'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Marie',
      fonctionContact: 'Directrice technique',
      telephoneContact: '0623456789',
      adresseMailContact: 'marie.martin@natali.fr',
      statut: 'Validé',
      observations: 'Entretien prévu la semaine prochaine',
      dateRelance: new Date('2024-02-15')
    },
    {
      idRecherche: 3,
      idEntreprise: 3,
      idUPPA: '610123',
      dateCreation: new Date('2024-02-05'),
      dateModification: new Date('2024-02-10'),
      date1erContact: new Date('2024-02-05'),
      typeContact: 'Téléphone',
      nomContact: 'Dubois',
      prenomContact: 'Pierre',
      fonctionContact: 'Responsable RH',
      telephoneContact: '0634567890',
      adresseMailContact: 'pierre.dubois@drewcano.fr',
      statut: 'En cours',
      observations: 'Dossier en cours d\'étude par le service RH',
      dateRelance: new Date('2024-02-10')
    },
    {
      idRecherche: 4,
      idEntreprise: 4,
      idUPPA: '610123',
      dateCreation: new Date('2024-02-01'),
      dateModification: new Date('2024-02-05'),
      date1erContact: new Date('2024-02-01'),
      typeContact: 'Téléphone',
      nomContact: 'Leclerc',
      prenomContact: 'Sophie',
      fonctionContact: 'Directrice technique',
      telephoneContact: '0645678901',
      adresseMailContact: 'sophie.leclerc@techsolutions.fr',
      statut: 'Refusé',
      observations: 'Profil ne correspond pas aux attentes',
      dateRelance: new Date('2024-02-05')
    },
    {
      idRecherche: 5,
      idEntreprise: 5,
      idUPPA: '610123',
      dateCreation: new Date('2024-02-20'),
      dateModification: new Date('2024-02-25'),
      date1erContact: new Date('2024-02-20'),
      typeContact: 'Téléphone',
      nomContact: 'Martin',
      prenomContact: 'Lucas',
      fonctionContact: 'Responsable RH',
      telephoneContact: '0656789012',
      adresseMailContact: 'lucas.martin@digitalwave.fr',
      statut: 'En cours',
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
      telephoneContact: '0667890123',
      adresseMailContact: 'anne.leclerc@websoft.fr',
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
      telephoneContact: '0678901234',
      adresseMailContact: 'pierre.dubois@infotech.fr',
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
      telephoneContact: '0689012345',
      adresseMailContact: 'sophie.leclerc@datacorps.fr',
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
      telephoneContact: '0690123456',
      adresseMailContact: 'lucas.martin@softwareplus.fr',
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
      telephoneContact: '0601234567',
      adresseMailContact: 'anne.leclerc@techinnovate.fr',
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
      telephoneContact: '0612345678',
      adresseMailContact: 'emma.bernard@futuretech.fr',
      statut: 'En cours',
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
      telephoneContact: '0623456789',
      adresseMailContact: 'pierre.dubois@smartsolutions.fr',
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
      telephoneContact: '0634567890',
      adresseMailContact: 'sophie.leclerc@datasystems.fr',
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
      telephoneContact: '0645678901',
      adresseMailContact: 'lucas.martin@webfactory.fr',
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
      telephoneContact: '0656789012',
      adresseMailContact: 'pierre.dubois@cloudnine.fr',
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
      telephoneContact: '0667890123',
      adresseMailContact: 'sophie.leclerc@devstudio.fr',
      statut: 'Refusé',
      observations: 'Entreprise intéressée par le profil',
      dateRelance: new Date('2024-02-05')
    }
  ];

  private searchesSubject = new BehaviorSubject<InternshipSearch[]>(this.mockSearches);

  constructor(private http: HttpClient) {}

  //Sélection de recherches
  getSearches(): Observable<InternshipSearch[]> {
    return of(this.mockSearches);
  }

  getSearchById(idSearch: number): Observable<InternshipSearch | undefined> {
    return of(this.mockSearches.find(s => s.idRecherche === idSearch));
  }

  getSearchesByStudentId(studentId: string): Observable<InternshipSearch[]> {
    return this.http.get<InternshipSearch[]>(`http://localhost:8000/api/etudiants/${studentId}/recherches-stages`).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, undefined))
    );
  }

  getSearchesByStudentIdAndStatut(studentId: string, statut: SearchStatus): Observable<InternshipSearch[]> {
    return of(this.mockSearches.filter(s => s.idUPPA === studentId && s.statut === statut));
  }

  //Ajout d'une recherche
  addSearch(search: InternshipSearch): Observable<InternshipSearch> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-type': 'application/json'})
    };

    console.log(search);

    return this.http.post<InternshipSearch>('http://localhost:8000/api/recherches-stages/create', search, httpOptions).pipe(
      tap(response => this.log(response)),
      catchError(error => this.handleError(error, null))
    );
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

  //Log la réponse de l'API
  private log(response: any) {
    console.table(response);
  }

  //Retourne l'erreur en cas de problème avec l'API
  private handleError(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
} 