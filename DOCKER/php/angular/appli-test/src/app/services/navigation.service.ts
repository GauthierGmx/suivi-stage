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

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToSearchForm() {
    this.router.navigate(['/dashboard/add-search-form']);
  }

  navigateToAddFactSheetForm() {
    this.router.navigate(['/factsheets/add-factsheet']);
  }

  navigateToSearchView(searchId: number) {
    this.router.navigate(['/dashboard/search-details/', searchId]);
  }

  navigateToSheetView(sheetId:number){
    this.router.navigate(['factsheets/sheet-details/',sheetId]);
  }

  navigateToSearchEditForm(searchId: number) {
    this.router.navigate(['/dashboard/update-search/', searchId]);
  }

  navigateToDescriptiveSheetEditForm(idFicheDescriptive: number){
    this.router.navigate(['/factsheets/update-factsheet/', idFicheDescriptive])
  }

  navigateToStudentDashboardManagerView(studentId: string) {
    this.router.navigate(['dashboard/student-dashboard/', studentId]);
  }

  navigateToStudentFactsheetsManagerView(studentId: string) {
    this.router.navigate(['/factsheets/add-factsheet', studentId]);
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