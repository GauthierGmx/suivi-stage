import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../../models/student.model';
import { Staff } from '../../../models/staff.model';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-welcome-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome-card.component.html',
  styleUrls: ['./welcome-card.component.css']
})
export class WelcomeComponent implements OnInit {
  @Input() currentUser!: Student | Staff;
  nomCurrentUser!: string;
  prenomCurrentUser!: string;
  currentUserRole!: string;

  constructor(private appComponent: AppComponent) {}

  ngOnInit() {
    if (this.appComponent.isStudent(this.currentUser)) {
        this.nomCurrentUser = this.currentUser.nomEtudiant;
        this.prenomCurrentUser = this.currentUser.prenomEtudiant;
        this.currentUserRole = 'Etudiant';
    }
    else if (this.appComponent.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
        this.nomCurrentUser = this.currentUser.nom;
        this.prenomCurrentUser = this.currentUser.prenom;
        this.currentUserRole = 'Responsable des Stages';
    }
  }
}