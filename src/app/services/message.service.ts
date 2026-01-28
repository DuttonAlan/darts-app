import { inject, Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageComponent, MessageData } from '../base-components/message/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private snackBar = inject(MatSnackBar);

  /**
   * Shows a green message, with a check-mark icon.
   * @param message text to show.
   */
  public showSuccess(message: string): void {
    this.openSnackbar({ type: 'success', message });
  }

  /**
   * Shows a red message, with a error icon.
   * @param message text to show.
   */
  public showError(message: string): void {
    this.openSnackbar({ type: 'error', message });
  }

  /**
   * Opens a new message and closes the previous one.
   * @param data message and type to send.
   */
  private openSnackbar(data: MessageData): void {
    this.snackBar.openFromComponent(MessageComponent, {
      data,
      duration: 5000, // 5 seconds
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['transparent-snackbar'], // Needed to remove the default background
    });
  }
}
