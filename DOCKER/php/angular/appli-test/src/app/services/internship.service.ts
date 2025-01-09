import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Internship } from '../models/internship.model';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private mockInternships: Internship[] = [
    {
      id: '1',
      studentId: '1',
      companyName: 'Tech Solutions',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-07-31'),
      description: 'Stage de développement web full-stack avec React et Node.js',
      status: 'APPROVED',
      supervisor: {
        name: 'Jean Dupont',
        email: 'j.dupont@techsolutions.fr',
        phone: '0612345678',
        position: 'Lead Developer'
      },
      location: {
        address: '15 rue de l\'Innovation',
        city: 'Pau',
        postalCode: '64000',
        country: 'France'
      },
      documents: {
        agreement: 'signed_agreement.pdf',
        description: 'internship_description.pdf'
      },
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      salary: 800,
      weeklyHours: 35
    },
    {
      id: '2',
      studentId: '2',
      companyName: 'Data Analytics Corp',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-08-15'),
      description: 'Stage en analyse de données et BI, développement de tableaux de bord',
      status: 'SEARCHING',
      location: {
        address: '25 avenue des Sciences',
        city: 'Bordeaux',
        postalCode: '33000',
        country: 'France'
      },
      documents: {},
      skills: ['Python', 'SQL', 'Power BI', 'Data Analysis'],
      weeklyHours: 35
    }
  ];

  getInternships(): Observable<Internship[]> {
    return of(this.mockInternships);
  }

  getInternshipById(id: string): Observable<Internship | undefined> {
    return of(this.mockInternships.find(i => i.id === id));
  }

  createInternship(internship: Omit<Internship, 'id'>): Observable<Internship> {
    const newInternship = {
      ...internship,
      id: Math.random().toString(36).substr(2, 9)
    };
    this.mockInternships.push(newInternship);
    return of(newInternship);
  }

  updateInternship(internship: Internship): Observable<Internship> {
    const index = this.mockInternships.findIndex(i => i.id === internship.id);
    if (index !== -1) {
      this.mockInternships[index] = internship;
    }
    return of(internship);
  }

  deleteInternship(id: string): Observable<boolean> {
    const index = this.mockInternships.findIndex(i => i.id === id);
    if (index !== -1) {
      this.mockInternships.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}