import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly users: { [key: string]: User } = {
    'superadmin@test.com': {
      id: '1',
      email: 'superadmin@test.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPERADMIN'
    },
    'admin@test.com': {
      id: '2',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    },
    'jean.dupont@etud.univ-pau.fr': {
      id: '3',
      email: 'jean.dupont@etud.univ-pau.fr',
      firstName: 'Jean',
      lastName: 'Dupont',
      role: 'STUDENT'
    },
    'sophie.martin@etud.univ-pau.fr': {
      id: '4',
      email: 'sophie.martin@etud.univ-pau.fr',
      firstName: 'Sophie',
      lastName: 'Martin',
      role: 'STUDENT'
    },
    'lucas.bernard@etud.univ-pau.fr': {
      id: '5',
      email: 'lucas.bernard@etud.univ-pau.fr',
      firstName: 'Lucas',
      lastName: 'Bernard',
      role: 'STUDENT'
    },
    'responsable@test.com': {
      id: '6',
      email: 'responsable@test.com',
      firstName: 'Responsable',
      lastName: 'Stages',
      role: 'INTERNSHIP_MANAGER'
    },
    'enseignant@test.com': {
      id: '7',
      email: 'enseignant@test.com',
      firstName: 'Enseignant',
      lastName: 'Référent',
      role: 'TEACHER'
    }
  };

  constructor(private readonly router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    // Pour le test, on accepte n'importe quel mot de passe
    const user = this.users[email];
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      await this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
}