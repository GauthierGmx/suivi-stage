import { Injectable } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly history: string[] = [];
  private factsheetStepSubject = new BehaviorSubject<number>(1);
  factsheetStep$ = this.factsheetStepSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.history.push(event.urlAfterRedirects);
      });
  }

  goBack() {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  navigateToSearchForm() {
    this.router.navigate(['/dashboard/add-search-form']);
  }

  navigateToSearchView(searchId: number) {
    this.router.navigate(['/dashboard/search-details/', searchId]);
  }

  navigateToSearchEditForm(searchId: number) {
    this.router.navigate(['/dashboard/update-search/', searchId]);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getCurrentPageUrl() {
    const currentUrl = this.router.url;
    return currentUrl;
  }

  setFactsheetStep(step: number) {
    this.factsheetStepSubject.next(step);
  }

  getCurrentFactsheetStep(): number {
    return this.factsheetStepSubject.value;
  }
} 