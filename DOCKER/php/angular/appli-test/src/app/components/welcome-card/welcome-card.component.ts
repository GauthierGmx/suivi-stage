import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student.model';
import { Staff } from '../../models/staff.model';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isStudent(this.currentUser)) {
        this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
        this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
        this.currentUserRole = 'Etudiant';
    }
    else if (this.authService.isStaff(this.currentUser) && this.currentUser.role === 'INTERNSHIP_MANAGER') {
        this.nomCurrentUser = this.currentUser.nom ? this.currentUser.nom : '';
        this.prenomCurrentUser = this.currentUser.prenom ? this.currentUser.prenom : '';
        this.currentUserRole = 'Responsable des Stages';
    }
  }
}