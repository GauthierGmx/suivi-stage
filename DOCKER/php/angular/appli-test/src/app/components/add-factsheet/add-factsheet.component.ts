import { Component } from '@angular/core';
import { AddFactsheets1Component } from './add-factsheets-1/add-factsheets-1.component';
import { AddFactsheets2Component } from './add-factsheets-2/add-factsheets-2.component';

@Component({
  selector: 'app-add-factsheet',
  standalone: true,
  imports: [AddFactsheets1Component, AddFactsheets2Component],
  templateUrl: './add-factsheet.component.html',
  styleUrl: './add-factsheet.component.css'
})
export class AddFactsheetComponent {

}
