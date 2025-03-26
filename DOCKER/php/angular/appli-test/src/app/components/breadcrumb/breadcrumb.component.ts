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

  /**
   * Initializes the component by subscribing to router events
   * and generating initial breadcrumbs
   */
  ngOnInit() {
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.generateBreadcrumbs();
        })
    );
    
    this.generateBreadcrumbs();
  }

  /**
   * Cleans up subscriptions when component is destroyed
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Generates breadcrumb items based on the current URL path
   * Handles numeric path segments by attaching them to the previous segment
   */
  private generateBreadcrumbs() {
    const rawPaths = this.router.url.split('/').filter(path => path !== '');
    const paths: string[] = [];
    const urls: string[] = [];
    let lastUrlSegment = '';

    rawPaths.forEach(path => {
      if (this.isNumeric(path) && urls.length > 0) {
        urls[urls.length - 1] += '/' + path;
      } else {
        paths.push(path);
        lastUrlSegment = (urls.length > 0 ? urls[urls.length - 1] + '/' : '/') + path;
        urls.push(lastUrlSegment);
      }
    });

    this.breadcrumbs = paths.map((path, index) => {
      return { label: this.formatLabel(path), url: urls[index] };
    });
  }

  /**
   * Checks if a given string value is numeric
   * @param value - String to check
   * @returns True if the string contains only digits
   */
  private isNumeric(value: string): boolean {
    return /^\d+$/.test(value);
  }

  /**
   * Formats the path label according to user role and translations
   * Handles special cases for student dashboard and factsheets
   * @param path - Path segment to format
   * @returns Formatted and translated label
   */
  private formatLabel(path: string): string {
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
    
    const roleTranslations = translations[this.currentUserRole || 'STUDENT'];
    
    const translatedWords = path.split(' ').map(word => 
      roleTranslations[word.toLowerCase()] || word
    );
    
    if ((path.toLowerCase() === 'student-dashboard' || path.toLowerCase() === 'student-factsheets') && this.currentUserRole === 'INTERNSHIP_MANAGER') {
      return roleTranslations['student-dashboard'];
    }

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