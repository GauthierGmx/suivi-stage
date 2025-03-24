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
  // Input property to track the current active step number
  @Input() currentStep: number = 1;
  
  // Event emitter to notify parent component when step changes
  @Output() stepChange = new EventEmitter<number>();

  // Array of tab objects containing step information
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

  /**
   * Handles the click event on a tab
   * Emits the new step number to the parent component
   * @param stepNumber - The step number of the clicked tab
   */
  onTabClick(stepNumber: number) {
    this.stepChange.emit(stepNumber);
  }

  /**
   * Checks if the given step number is the current active step
   * @param stepNumber - The step number to check
   * @returns True if the step is active, false otherwise
   */
  isActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }
}