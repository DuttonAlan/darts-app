import { Component, inject } from '@angular/core';
import { BaseDialog } from "../base-dialog/base-dialog";
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-name-input-dialog',
  imports: [BaseDialog, MatFormField, MatLabel, FormsModule, MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule],
  templateUrl: './name-input-dialog.html',
  styleUrl: './name-input-dialog.scss',
})
export class NameInputDialog {
  private dialogRef = inject(MatDialogRef<NameInputDialog>);

  playerName = '';

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onPrimaryClick(): void {
    if (this.playerName === '') return;
    this.dialogRef.close(this.playerName);
  }
}
