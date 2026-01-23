import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../../state/app-state.service';
import { MatButtonModule } from '@angular/material/button';
import { PlayerStatDisplay } from "../../../base-components/player-stat-display/player-stat-display";
import { Subject, takeUntil, timer } from 'rxjs';
import { GameSettings, defaultSettings } from '../../../interfaces/game-settings';
import { GameInfos } from "../../../base-components/game-infos/game-infos";
import { DartKeyboard } from "../../../base-components/dart-keyboard/dart-keyboard";
import { KraftAusDemInneren } from "../../../base-components/breakfast-animations/kraft-aus-dem-inneren/kraft-aus-dem-inneren";

@Component({
  selector: 'app-normal-game',
  imports: [MatButtonModule, PlayerStatDisplay, GameInfos, DartKeyboard, KraftAusDemInneren],
  templateUrl: './normal-game.html',
  styleUrl: './normal-game.scss',
})
export class NormalGame implements OnInit {
  private router = inject(Router);
  private appStateService = inject(AppStateService);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();
    
  settings: GameSettings = defaultSettings;

  currentThrows: number[] = [];

  isBreakfast = false;

  ngOnInit(): void {
    this.appStateService
      .getAsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.settings = state.currentSettings;
      });

    this.initializePlayers();
  }

  ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

  public newThrow(point: number): void {
    this.currentThrows.push(point);

    if (this.currentThrows.length === 3) {
      this.updatePlayerPoints();
      this.setCurrentPlayer();
    }
  }

  public redoThrow(): void {
    if (this.currentThrows.length <= 0) {
      return;
    }

    this.currentThrows.pop();
  }
  
  public navigateToHomepage(): void {
    this.router.navigate(['/game-settings'])
  }

  public triggerBreakfast(): void {
    this.isBreakfast = true;

    timer(11_000).subscribe(() => {
      this.isBreakfast = false;
      this.cdr.detectChanges();
    });
  }

  private initializePlayers(): void {
    this.settings.players[0].isCurrentPlayer = true;

    this.settings.players.forEach((player) => {
      player.currentPoints = this.settings.startScore;
      player.avgPoints = 0;
    })
  }

  private updatePlayerPoints(): void {
    
    this.settings.players.find(p => p.isCurrentPlayer);

    this.currentThrows?.reduce((sum, n) => sum + n, 0) ?? 0;


    this.currentThrows = [];
  }

  private setCurrentPlayer(): void {
    const players = this.settings.players;
    const currentIndex = players.findIndex(p => p.isCurrentPlayer);
    players.forEach(p => p.isCurrentPlayer = false);
    players[(currentIndex + 1) % players.length].isCurrentPlayer = true;
  }
}
