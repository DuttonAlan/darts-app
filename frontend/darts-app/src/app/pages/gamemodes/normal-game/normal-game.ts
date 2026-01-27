import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from '../../../state/app-state.service';
import { MatButtonModule } from '@angular/material/button';
import { PlayerStatDisplay } from "../../../base-components/player-stat-display/player-stat-display";
import { Subject, takeUntil, timer } from 'rxjs';
import { GameSettings, defaultSettings } from '../../../interfaces/game-settings';
import { GameInfos } from "../../../base-components/game-infos/game-infos";
import { DartKeyboard } from "../../../base-components/dart-keyboard/dart-keyboard";
import { KraftAusDemInneren } from "../../../base-components/breakfast-animations/kraft-aus-dem-inneren/kraft-aus-dem-inneren";
import { DartThrow } from '../../../interfaces/dart-throw';
import { TurnHistory } from '../../../interfaces/turn-history';
import { Player } from '../../../interfaces/player';
import { ScrollableItemDirective } from '../../../directives/scrollable-item.directive';
import { PrimaryButton } from "../../../base-components/primary-button/primary-button";
import { MessageService } from '../../../services/message.service';
import { GameEndingDialog } from '../../../base-components/dialogs/game-ending-dialog/game-ending-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-normal-game',
  imports: [MatButtonModule, PlayerStatDisplay, GameInfos, DartKeyboard, KraftAusDemInneren, ScrollableItemDirective, PrimaryButton],
  templateUrl: './normal-game.html',
  styleUrl: './normal-game.scss',
})
export class NormalGame implements OnInit, OnDestroy {
  @ViewChildren(ScrollableItemDirective) scrollableItems: QueryList<ScrollableItemDirective> | undefined;

  private dialog = inject(MatDialog);
  private router = inject(Router);
  private appStateService = inject(AppStateService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();
    
  settings: GameSettings = defaultSettings;

  currentThrows: DartThrow[] = [];
  throwHistory: TurnHistory[] = [];

  isBreakfast = false;

  ngOnInit(): void {
    this.appStateService
      .getAsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.settings = state.currentSettings;
      });

    if (this.settings.players.length === 0) {
      this.router.navigate(['/game-settings'])
    }

    this.initializePlayers();
  }

  ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();

    this.throwHistory = [];
	}

  public newThrow(throwData: DartThrow): void {
    if (this.currentThrows.length >= 3) return;

    this.currentThrows.push(throwData);

    const player = this.getCurrentPlayer();
    const scoreBefore = player.currentPoints ?? this.settings.startScore;
    const sum = this.currentThrows.reduce((a, t) => a + t.value, 0);
    const newScore = scoreBefore - sum;

    // Bust, end turn
    if (this.isPlayerBust(newScore)) {
      this.finishTurn(false, true);
      return;
    }

    // Regular finish, end turn
    if (newScore === 0 && this.isValidOut(throwData)) {
      this.finishTurn(true);
      return;
    }

    // Normal turn end
    if (this.currentThrows.length === 3) {
      this.finishTurn(false);
    }
  }

  private finishTurn(isWinningThrow: boolean, isBust = false): void {
    this.updatePlayerPoints(isBust);

    if (isWinningThrow) {
      this.handleLegWin();
      return;
    }

    this.setNextPlayer();
  }

  private setNextPlayer(): void {
    const index = this.getCurrentPlayerIndex();
    const nextIndex = (index + 1) % this.settings.players.length;
    this.setCurrentPlayerByIndex(nextIndex);

    this.scrollToActivePlayer()
  }

  public redoThrow(): void {
    if (this.currentThrows.length > 0) {
      this.currentThrows.pop();
      return;
    }

    this.undoLastTurnPartially();
    this.calculateAvgThrows();
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

  private updatePlayerPoints(isBust: boolean): void {
    const playerIndex = this.getCurrentPlayerIndex();
    const player = this.settings.players[playerIndex];

    const scoreBefore = player.currentPoints ?? this.settings.startScore;
    const sum = this.currentThrows.reduce((a, t) => a + t.value, 0);
    const newScore = scoreBefore - sum;

    player.lastTurnThrows = [...this.currentThrows];
    player.lastTurnWasBust = isBust;

    this.throwHistory.push({
      playerIndex,
      throws: [...this.currentThrows],
      scoreBefore,
      scoreAfter: isBust ? scoreBefore : newScore,
      isBust
    });

    if (!isBust) {
      player.currentPoints = newScore;
    }

    this.currentThrows = [];
    this.calculateAvgThrows();
  }


  private handleLegWin(): void {
    const player = this.getCurrentPlayer();
    player.legsWon++;

    this.messageService.showSuccess(`${player.name} won a Leg!`);

    // Check if Set was won.
    if (player.legsWon >= this.settings.legs) {
      this.handleSetWin(player);
      return;
    }

    this.startNewLeg(player);
  }

  private handleSetWin(player: Player): void {
    player.setsWon++;

    // Check if Match was won
    if (player.setsWon >= this.settings.sets) {
      this.handleMatchWin();
      return;
    }

    // New Set
    this.resetLegs();
    this.startNewLeg(player);
  }

  private startNewLeg(startingPlayer: Player): void {
    this.settings.players.forEach(p => {
      p.currentPoints = this.settings.startScore;
      p.isCurrentPlayer = p.id === startingPlayer.id;
    });

    this.currentThrows = [];
    this.throwHistory = [];
  }

  private resetLegs(): void {
    this.settings.players.forEach(p => p.legsWon = 0);
  }

  private undoLastTurnPartially(): void {
    const lastTurn = this.throwHistory.pop();
    if (!lastTurn) return;

    const player = this.settings.players[lastTurn.playerIndex];

    this.setCurrentPlayerByIndex(lastTurn.playerIndex);
    player.currentPoints = lastTurn.scoreBefore;

    // Undo bust
    player.lastTurnWasBust = false;

    // redo lastTurn
    this.currentThrows = [...lastTurn.throws];
    this.currentThrows.pop();

    // Reset player point display
    player.lastTurnThrows = [];

    this.scrollToActivePlayer();
  }

  private isPlayerBust(newScore: number): boolean {
    switch (this.settings.outMode) {
      case 'DOUBLE_OUT':
        return newScore < 0 || newScore === 1;

      case 'MASTER_OUT':
        return newScore < 0 || newScore === 1;

      case 'SINGLE_OUT':
      default:
        return newScore < 0;
    }
  }

  private isValidOut(lastThrow: DartThrow): boolean {
    switch (this.settings.outMode) {
      case 'DOUBLE_OUT':
        return lastThrow.multiplier === 2;

      case 'MASTER_OUT':
        return lastThrow.multiplier === 2 || lastThrow.multiplier === 3;

      case 'SINGLE_OUT':
        return true;

      default:
        return false;
    }
  }

  private handleMatchWin(): void {
    const dialogRef = this.dialog.open(GameEndingDialog, {
      data: {
        settings: this.settings
      },
      panelClass: 'no-material-dialog-styles',
    });

    dialogRef.afterClosed().subscribe((result): void => {

    });
  }

  private getCurrentPlayerIndex(): number {
    return this.settings.players.findIndex(p => p.isCurrentPlayer);
  }

  private getCurrentPlayer(): Player {
    const index = this.getCurrentPlayerIndex();

    return this.settings.players[index];
  }

  private setCurrentPlayerByIndex(index: number): void {
    this.settings.players.forEach(p => p.isCurrentPlayer = false);
    this.settings.players[index].isCurrentPlayer = true;
  }

  /**
   * Calculates the average points per turn (3 Throws combined)
   */
  private calculateAvgThrows(): void {
    const index = this.getCurrentPlayerIndex();

    const allThrows: DartThrow[] = this.throwHistory
      .filter(turn => turn.playerIndex === index)
      .flatMap(turn => turn.throws);

    const avg = allThrows.length > 0
      ? (allThrows.reduce((sum, t) => sum + t.value, 0) / allThrows.length) * 3
      : 0;

    this.settings.players[index].avgPoints = avg;
  }

  /**
   * Scrolls to the active Player.
   */
  private scrollToActivePlayer(): void {
    if (!this.scrollableItems) return;

    const activeIndex = this.settings.players.findIndex(
      p => p.isCurrentPlayer
    );

    if (activeIndex === -1) return;

    const item = this.scrollableItems.find(
      d => d.index() === activeIndex
    );

    item?.scrollIntoView();
  }
}
