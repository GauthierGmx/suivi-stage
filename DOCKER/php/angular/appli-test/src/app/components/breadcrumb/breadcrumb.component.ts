import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.generateBreadcrumbs();
      });
    
    // Générer les breadcrumbs initiaux
    this.generateBreadcrumbs();
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
    // Traduit les termes
    const translations: { [key: string]: string } = {
      'dashboard': 'journal de bord',
      'factsheets': 'fiche descriptive',
      'add-search-form': 'ajout recherche',
      'update-search': 'modification recherche',
      'search-details': 'consultation recherche'
    };
    
    // Traduit chaque mot s'il existe dans le dictionnaire
    const translatedWords = path.split(' ').map(word => 
      translations[word.toLowerCase()] || word
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