import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnderDevelopmentComponent } from '../shared/under-development/under-development.component';
import { AddFactsheetComponent } from "../add-factsheet/add-factsheet.component";

@Component({
  selector: 'app-factsheets',
  standalone: true,
  imports: [CommonModule, UnderDevelopmentComponent, AddFactsheetComponent],
  template: '<app-add-factsheet></app-add-factsheet>'
})
export class FactsheetsComponent {}