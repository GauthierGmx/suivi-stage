import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold mb-4">Confirmation de suppression</h2>
        
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer cette recherche ? Cette action est irréversible.
        </p>

        <div class="flex justify-end space-x-3">
          <button 
            class="px-4 py-2 border rounded-md hover:bg-gray-50"
            (click)="cancel.emit()"
          >
            Annuler
          </button>
          <button 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            (click)="confirm.emit()"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModalComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
} 