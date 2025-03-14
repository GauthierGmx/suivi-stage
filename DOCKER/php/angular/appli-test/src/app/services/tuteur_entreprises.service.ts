import { Injectable } from '@angular/core';
import { tuteur_entreprises } from '../models/companyTutor';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, tap, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class tuteur_entreprisesService {
  // Données de test
  private mockTuteurs: tuteur_entreprises[] = [
    {
      idTuteur: 1,
      nom: "Dupont",
      prenom: "Jean",
      telephone: "+33 6 01 02 03 04",
      adresseMail: "jean.dupont@entreprise.com",
      fonction: "Responsable RH",
      idEntreprise: 101,
    },
    {
      idTuteur: 2,
      nom: "Martin",
      prenom: "Sophie",
      telephone: "+33 6 11 22 33 44",
      adresseMail: "sophie.martin@entreprise.com",
      fonction: "Directrice Technique",
      idEntreprise: 102,
    },
  ];

  constructor(private http: HttpClient) {}

  

 



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