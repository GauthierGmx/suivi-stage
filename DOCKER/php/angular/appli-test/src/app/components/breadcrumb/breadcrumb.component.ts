import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../../app.component';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { Subscription } from 'rxjs';

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
  breadcrumbs: BreadcrumbItem[] = [];
  private selectedStudent?: Student | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private readonly router: Router,
    private readonly appComponent: AppComponent,
    private readonly studentService: StudentService
  ) {}

  ngOnInit() {
    // S'abonner aux changements de l'étudiant sélectionné
    this.subscription.add(
      this.studentService.getSelectedStudent().subscribe(student => {
        this.selectedStudent = student;
        this.generateBreadcrumbs();
      })
    );

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
    const paths = this.router.url.split('/')
      .filter(path => path !== '');
    
    // Vérifie si le dernier élément est un nombre
    const filteredPaths = this.isNumeric(paths[paths.length - 1]) 
      ? paths.slice(0, -1) 
      : paths;
    
    this.breadcrumbs = filteredPaths.map((path, index) => {
      const url = '/' + paths.slice(0, index + 1).join('/');
      const label = this.formatLabel(path);
      return { label, url };
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
        'search-details': 'consultation recherche'
      },
      'INTERNSHIP_MANAGER': {
        'dashboard': 'suivi des étudiants',
        'factsheets': 'fiche descriptive',
        'add-search-form': 'ajout recherche',
        'update-search': 'modification recherche',
        'search-details': 'détails recherche',
        'search-student-tab': this.selectedStudent?.prenomEtudiant && this.selectedStudent?.nomEtudiant
          ? `Journal de ${this.selectedStudent.prenomEtudiant} ${this.selectedStudent.nomEtudiant}`
          : 'Journal de l\'étudiant'
      }
    };
    
    // Utilise les traductions du rôle actuel ou STUDENT par défaut
    const roleTranslations = translations[this.currentUserRole || 'STUDENT'];
    
    // Traduit chaque mot s'il existe dans le dictionnaire
    const translatedWords = path.split(' ').map(word => 
      roleTranslations[word.toLowerCase()] || word
    );
    
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