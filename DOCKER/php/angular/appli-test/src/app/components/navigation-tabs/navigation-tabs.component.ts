import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navigation-tabs.component.html',
  styleUrl: './navigation-tabs.component.css'
})
export class NavigationTabsComponent {
  @Input() currentStep: number = 1;
  @Output() stepChange = new EventEmitter<number>();

  tabs = [
    { id: 1, name: 'Étudiant' },
    { id: 2, name: 'Établissement' },
    { id: 3, name: 'Entreprise 1' },
    { id: 4, name: 'Entreprise 2' },
    { id: 5, name: 'Représentant Entreprise' },
    { id: 6, name: 'Lieux stage' },
    { id: 7, name: 'Tuteur stage' },
    { id: 8, name: 'Contenu stage' },
    { id: 9, name: 'Déroulement stage' }
  ];


  onTabClick(stepNumber: number) {
    this.stepChange.emit(stepNumber);
  }

  isActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }
} 