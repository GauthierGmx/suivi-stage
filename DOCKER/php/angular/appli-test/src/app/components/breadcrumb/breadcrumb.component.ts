import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Student } from '../../models/student.model';
import { Subscription, filter } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  @Input() currentUserRole?: string;
  @Input() selectedStudent?: Student;
  breadcrumbs: BreadcrumbItem[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly router: Router
  ) {}

  ngOnInit() {
    // S'abonner aux changements de route
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.generateBreadcrumbs();
        })
    );
    
    // Générer les breadcrumbs initiaux
    this.generateBreadcrumbs();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private generateBreadcrumbs() {
    const rawPaths = this.router.url.split('/').filter(path => path !== '');
    const paths: string[] = [];
    const urls: string[] = [];
    let lastUrlSegment = '';

    rawPaths.forEach(path => {
      if (this.isNumeric(path) && urls.length > 0) {
        // Attache le nombre au dernier segment d'URL trouvé
        urls[urls.length - 1] += '/' + path;
      } else {
        paths.push(path); // Ajoute uniquement les segments non numériques au chemin
        lastUrlSegment = (urls.length > 0 ? urls[urls.length - 1] + '/' : '/') + path;
        urls.push(lastUrlSegment);
      }
    });

    this.breadcrumbs = paths.map((path, index) => {
      return { label: this.formatLabel(path), url: urls[index] };
    });
  }

  private isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  private formatLabel(path: string): string {
    // Dictionnaire de traduction selon le rôle
    const translations: { [key: string]: { [key: string]: string } } = {
      'STUDENT': {
        'dashboard': 'journal de bord',
        'factsheets': 'fiche descriptive',
        'add-search-form': 'ajout recherche',
        'update-search': 'modification recherche',
        'search-details': 'consultation recherche',
        'sheet-details': 'consultation fiche descriptive',
        'update-factsheet': 'modification fiche descriptive',
        'add-factsheet': 'ajout fiche descriptive',
      },
      'INTERNSHIP_MANAGER': {
        'dashboard': 'suivi des étudiants',
        'factsheets': 'fiche descriptive',
        'search-details': 'détails recherche',
        'student-dashboard': this.selectedStudent?.prenom && this.selectedStudent?.nom
          ? `Journal de ${this.selectedStudent.prenom} ${this.selectedStudent.nom}`
          : 'Journal de l\'étudiant',
        'student-factsheets': this.selectedStudent?.prenom && this.selectedStudent?.nom
          ? `Fiches descriptives de ${this.selectedStudent.prenom} ${this.selectedStudent.nom}`
          : 'Fiches descriptives de l\'étudiant',
        'sheet-details': 'détails fiche descriptive',
      }
    };
    
    // Utilise les traductions du rôle actuel ou STUDENT par défaut
    const roleTranslations = translations[this.currentUserRole || 'STUDENT'];
    
    // Traduit chaque mot s'il existe dans le dictionnaire
    const translatedWords = path.split(' ').map(word => 
      roleTranslations[word.toLowerCase()] || word
    );
    
    if (path.toLowerCase() === 'student-dashboard' && this.currentUserRole === 'INTERNSHIP_MANAGER') {
      return roleTranslations['student-dashboard'];
    }

    // Met une majuscule uniquement au premier mot
    return translatedWords
      .map((word, index) => {
        if (index === 0) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word.toLowerCase();
      })
      .join(' ');
  }
}