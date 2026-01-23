import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
    FormsModule
  ],
  templateUrl: './game-settings.html',
  styleUrl: './game-settings.scss',
})
export class GameSettingsComponent implements OnInit, OnDestroy {
  private router = inject(Router);
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

  public addPlayer(): void {
    this.settings?.players.push({
      id: 0,
      name: `guest_${this.settings.players.length + 1}`,
      isBot: false,
      isCurrentPlayer: false,
      legsWon: 0,
      setsWon: 0,
      lastTurnThrows: []
    });
  }

  public startGame(): void {
    this.settings.players.forEach(p => p.isCurrentPlayer = false);
    this.appStateService.set('currentSettings', this.settings ? this.settings : defaultSettings)
    console.log(this.appStateService.get('currentSettings'));
    this.router.navigate(['/normal-game'])
  }

  public navigateToHomepage(): void {
    this.router.navigate(['/'])
  }
}