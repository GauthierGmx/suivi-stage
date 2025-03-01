import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderDevelopmentComponent } from '../under-development/under-development.component';

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, UnderDevelopmentComponent, AddFactsheetComponent],
  template: '<app-add-factsheet></app-add-factsheet>'
})
export class FactsheetsComponent {}