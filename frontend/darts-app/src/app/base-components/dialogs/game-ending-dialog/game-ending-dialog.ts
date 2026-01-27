import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from "../base-dialog/base-dialog";
import { PrimaryButton } from "../../primary-button/primary-button";
import { Router } from '@angular/router';
import { formatInMode, formatOutMode, formatWinType, GameSettings, InMode, OutMode, WinType } from '../../../interfaces/game-settings';

@Component({
  selector: 'app-game-ending-dialog',
  imports: [BaseDialog, PrimaryButton],
  templateUrl: './game-ending-dialog.html',
  styleUrl: './game-ending-dialog.scss',
})
export class GameEndingDialog {
  private router = inject(Router);
  private dialogRef = inject(MatDialogRef<GameEndingDialog>);

  data = inject(MAT_DIALOG_DATA) as {
    settings: GameSettings;
    policyName: string;
  };

  public get currentTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onPrimaryClick(): void {
    this.dialogRef.close();
  }

  public goToSettings(): void {
    this.dialogRef.close();
    this.router.navigate(['/game-settings'])
  }

  public restart(): void {

  }

  public redo(): void {

  }

  public getInMode(inMode: InMode): string {
    return formatInMode(inMode);
  }

  public getOutMode(outMode: OutMode): string {
    return formatOutMode(outMode);
  }

  public getWinType(winType: WinType): string {
    return formatWinType(winType);
  }
}
