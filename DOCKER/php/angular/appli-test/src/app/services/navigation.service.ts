import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = [];

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.history.push(event.urlAfterRedirects);
      });
  }

  navigateToStudentLogbook(studentId: string) {
    this.router.navigate(['/student-logbook', studentId]);
  }

  goBack() {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  getBreadcrumbs(currentLabel: string): { label: string; path?: string; }[] {
    const basePath = [{ label: 'Tableau de bord', path: '/dashboard' }];
    
    if (this.router.url === '/dashboard') {
      return basePath;
    }

    return [...basePath, { label: currentLabel }];
  }

  navigateToSearchForm(id?: number) {
    if (id) {
      this.router.navigate(['/search-form', id]);
    } else {
      this.router.navigate(['/search-form']);
    }
  }

  navigateToSearchView(searchId: number) {
    this.router.navigate(['/search', searchId, 'view']);
  }
} 