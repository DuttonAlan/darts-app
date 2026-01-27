import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { defaultSettings, GameSettings } from '../../interfaces/game-settings';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { Router } from '@angular/router';
import { AppStateService } from '../../state/app-state.service';
import { Subject, takeUntil } from 'rxjs';
import { PrimaryButton } from "../../base-components/primary-button/primary-button";
import { ClosableChip } from "../../base-components/closable-chip/closable-chip";
import { MatDialog } from '@angular/material/dialog';
import { NameInputDialog } from '../../base-components/dialogs/name-input-dialog/name-input-dialog';

@Component({
  selector: 'app-game-settings',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSliderModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    FormsModule,
    PrimaryButton,
    ClosableChip
],
  templateUrl: './game-settings.html',
  styleUrl: './game-settings.scss',
})
export class GameSettingsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private cd = inject(ChangeDetectorRef);
  private appStateService = inject(AppStateService);

  private destroy$ = new Subject<void>();
  
  settings: GameSettings = defaultSettings;

  startScores = [301, 501, 701];

  inModes = [
    { label: 'Single In', value: 'SINGLE_IN' },
    { label: 'Double In', value: 'DOUBLE_IN' },
    { label: 'Triple In', value: 'TRIPLE_IN' }
  ];

  outModes = [
    { label: 'Double Out', value: 'DOUBLE_OUT' },
    { label: 'Single Out', value: 'SINGLE_OUT' },
    { label: 'Master Out', value: 'MASTER_OUT' }
  ];

  public get showStartButton(): boolean {
    return this.settings.players.length > 0 && this.settings.legs > 0 && this.settings.sets > 0
  }

  ngOnInit(): void {
    this.appStateService
      .getAsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.settings = state.currentSettings;
      });
  }

  ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

  public removePlayer(playerId: number): void {
    this.settings.players = this.settings.players.filter(p => p.id !== playerId);
  }

  public startGame(): void {
    this.resetPlayerStats();
    this.appStateService.set('currentSettings', this.settings ? this.settings : defaultSettings)
    this.router.navigate(['/normal-game'])
  }

  public navigateToHomepage(): void {
    this.router.navigate(['/'])
  }

  public openNameInputDialog(): void {
    const dialogRef = this.dialog.open(NameInputDialog, {
      panelClass: 'no-material-dialog-styles',
    });

    dialogRef.afterClosed().subscribe((playerName: string): void => {
      if (playerName) {
        this.addPlayer(playerName);
      }
    });
  }

  private addPlayer(playerName: string): void {
    this.settings.players.push({
      id: this.settings.players.length + 1,
      name: playerName,
      isBot: false,
      isCurrentPlayer: false,
      legsWon: 0,
      setsWon: 0,
      lastTurnThrows: []
    });

    this.cd.detectChanges();
  }

  private resetPlayerStats(): void {
    this.settings.players.forEach(p => p.isCurrentPlayer = false);
    this.settings.players.forEach(p => p.legsWon = 0);
    this.settings.players.forEach(p => p.setsWon = 0);
    this.settings.players.forEach(p => p.lastTurnThrows = []);
    this.settings.players.forEach(p => p.lastTurnWasBust = false);
  }
}