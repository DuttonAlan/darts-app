import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

export interface MessageData {
  type: 'success' | 'error';
  message: string;
}

@Component({
  selector: 'app-message',
  imports: [CommonModule, MatSnackBarModule, MatIconModule],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class MessageComponent {
  public data = inject(MAT_SNACK_BAR_DATA) as MessageData;

  public get icon(): string {
    return this.data.type === 'success' ? 'assets/icons/checkmark.svg' : 'assets/icons/error.svg';
  }
}
