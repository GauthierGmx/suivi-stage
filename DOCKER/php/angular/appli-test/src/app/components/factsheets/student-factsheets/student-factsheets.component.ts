import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-student-factsheets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-factsheets.component.html',
  styleUrls: ['./student-factsheets.component.css']
})
export class StudentFactsheetsComponent {
  @Input() currentUser!: User;
} 