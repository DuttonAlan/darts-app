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
import { GameSnapshot } from '../../../interfaces/game-snapshot';

@Component({
  selector: 'app-normal-game',
  imports: [MatButtonModule, PlayerStatDisplay, GameInfos, DartKeyboard, KraftAusDemInneren, ScrollableItemDirective, PrimaryButton],
  templateUrl: './normal-game.html',
  styleUrl: './normal-game.scss',
})
export class NormalGame implements OnInit, OnDestroy {
  @ViewChildren(ScrollableItemDirective) scrollableItems?: QueryList<ScrollableItemDirective>;

  private dialog = inject(MatDialog);
  private router = inject(Router);
  private appStateService = inject(AppStateService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  // Game State
  settings: GameSettings = defaultSettings;

  currentThrows: DartThrow[] = [];
  throwHistory: TurnHistory[] = [];
  gameUndoStack: GameSnapshot[] = [];

  legStartPlayerIndex = 0;
  isBreakfast = false;

  ngOnInit(): void {
    this.appStateService
      .getAsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.settings = state.currentSettings;
      });

    if (this.settings.players.length === 0) {
      this.navigateToSettings();
    }

    this.initializePlayers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Processes a new dart throw.
   */
  public newThrow(throwData: DartThrow): void {
    if (this.currentThrows.length >= 3) return;

    this.currentThrows.push(throwData);

    const newScore = this.calculateScoreAfterThrows().newScore;

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

  /**
   * Undo logic triggered from UI.
   * Priority: dart -> turn -> game state.
   */
  public redoThrow(forceGameState = false): void {
    if (this.currentThrows.length > 0 && !forceGameState) {
      this.currentThrows.pop();
      return;
    }

    if (this.throwHistory.length > 0 && !forceGameState) {
      this.undoLastTurnPartially();
      this.calculateAvgThrows();
      return;
    }

    this.undoGameState();
  }

  public navigateToSettings(): void {
    this.router.navigate(['/game-settings']);
    return;
  }

  /**
   * Triggers breakfast animation.
   */
  public triggerBreakfast(): void {
    this.isBreakfast = true;

    timer(11_000).subscribe(() => {
      this.isBreakfast = false;
      this.cdr.detectChanges();
    });
  }

  /**
   * Ends the current turn and applies game rules.
   */
  private finishTurn(isWinningThrow: boolean, isBust = false): void {
    this.saveGameSnapshot();
    this.updatePlayerPoints(isBust);

    if (isWinningThrow) {
      this.handleLegWin();
      return;
    }

    this.setNextPlayer();
  }

  /**
   * Handles leg win logic and rotates leg starter.
   */
  private handleLegWin(): void {
    const player = this.getCurrentPlayer();
    player.legsWon++;

    this.messageService.showSuccess(`${player.name} won a Leg!`);
    this.rotateLegStarter();

    if (player.legsWon >= this.settings.legs) {
      this.handleSetWin(player);
      return;
    }

    this.startNewLeg();
  }

  /**
   * Handles set win logic.
   */
  private handleSetWin(player: Player): void {
    player.setsWon++;

    if (player.setsWon >= this.settings.sets) {
      this.handleMatchWin();
      return;
    }

    this.resetLegs();
    this.startNewLeg();
  }

  /**
   * Opens match end dialog.
   */
  private handleMatchWin(): void {
    const dialogRef = this.dialog.open(GameEndingDialog, {
      data: { settings: this.settings },
      panelClass: 'no-material-dialog-styles',
    });

    dialogRef.afterClosed().subscribe(result => {
      result ? this.redoThrow() : this.navigateToSettings();
    });
  }

  /**
   * Saves a full snapshot of the current game state.
   */
  private saveGameSnapshot(): void {
    this.gameUndoStack.push({
      players: structuredClone(this.settings.players),
      throwHistory: structuredClone(this.throwHistory),
      currentThrows: [...this.currentThrows],
      currentPlayerIndex: this.getCurrentPlayerIndex(),
    });
  }

  /**
   * Restores the last full game snapshot.
   */
  private undoGameState(): void {
    const snapshot = this.gameUndoStack.pop();
    if (!snapshot) return;

    this.settings.players = structuredClone(snapshot.players);
    this.throwHistory = structuredClone(snapshot.throwHistory);
    this.currentThrows = [...snapshot.currentThrows];

    this.setCurrentPlayerByIndex(snapshot.currentPlayerIndex);
    this.calculateAvgThrows();
    this.scrollToActivePlayer();

    queueMicrotask(() => {
      this.cdr.detectChanges();
      this.scrollToActivePlayer();
    });

    this.currentThrows.pop();
  }

  /**
   * Undo only the last completed turn.
   */
  private undoLastTurnPartially(): void {
    const lastTurn = this.throwHistory.pop();
    if (!lastTurn) return;

    const player = this.settings.players[lastTurn.playerIndex];

    this.setCurrentPlayerByIndex(lastTurn.playerIndex);
    player.currentPoints = lastTurn.scoreBefore;
    player.lastTurnWasBust = false;

    this.currentThrows = [...lastTurn.throws];
    this.currentThrows.pop();
    player.lastTurnThrows = [];

    this.scrollToActivePlayer();
  }

  /**
   * Updates player points and history after a turn.
   */
  private updatePlayerPoints(isBust: boolean): void {
    const playerIndex = this.getCurrentPlayerIndex();
    const player = this.settings.players[playerIndex];

    const { scoreBefore, newScore } = this.calculateScoreAfterThrows();

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

  /**
   * Calculates average points per turn (3-dart average).
   */
  private calculateAvgThrows(): void {
    const index = this.getCurrentPlayerIndex();

    const allThrows = this.throwHistory
      .filter(t => t.playerIndex === index)
      .flatMap(t => t.throws);

    const avg = allThrows.length
      ? (allThrows.reduce((s, t) => s + t.value, 0) / allThrows.length) * 3
      : 0;

    this.settings.players[index].avgPoints = avg;
  }

  /**
   * Determines if a player is busted based on out mode.
   */
  private isPlayerBust(newScore: number): boolean {
    switch (this.settings.outMode) {
      case 'DOUBLE_OUT':
      case 'MASTER_OUT':
        return newScore < 0 || newScore === 1;
      default:
        return newScore < 0;
    }
  }

  /**
   * Checks if the last dart fulfills checkout rules.
   */
  private isValidOut(lastThrow: DartThrow): boolean {
    switch (this.settings.outMode) {
      case 'DOUBLE_OUT':
        return lastThrow.multiplier === 2;
      case 'MASTER_OUT':
        return lastThrow.multiplier === 2 || lastThrow.multiplier === 3;
      default:
        return true;
    }
  }

  private initializePlayers(): void {
    this.legStartPlayerIndex = 0;

    this.settings.players.forEach((p, i) => {
      p.isCurrentPlayer = i === this.legStartPlayerIndex;
      p.currentPoints = this.settings.startScore;
      p.avgPoints = 0;
    });
  }

  private startNewLeg(): void {
    this.settings.players.forEach((p, i) => {
      p.currentPoints = this.settings.startScore;
      p.lastTurnThrows = [];
      p.lastTurnWasBust = false;
      p.isCurrentPlayer = i === this.legStartPlayerIndex;
    });

    this.currentThrows = [];
    this.throwHistory = [];
  }

  private resetLegs(): void {
    this.settings.players.forEach(p => (p.legsWon = 0));
  }

  private rotateLegStarter(): void {
    this.legStartPlayerIndex =
      (this.legStartPlayerIndex + 1) % this.settings.players.length;
  }

  private setNextPlayer(): void {
    const next =
      (this.getCurrentPlayerIndex() + 1) % this.settings.players.length;
    this.setCurrentPlayerByIndex(next);
    this.scrollToActivePlayer();
  }

  private calculateScoreAfterThrows(): { scoreBefore: number; newScore: number } {
    const player = this.getCurrentPlayer();
    const scoreBefore = player.currentPoints ?? this.settings.startScore;
    const sum = this.currentThrows.reduce((a, t) => a + t.value, 0);

    return {
      scoreBefore,
      newScore: scoreBefore - sum,
    };
  }

  private getCurrentPlayerIndex(): number {
    return this.settings.players.findIndex(p => p.isCurrentPlayer);
  }

  private getCurrentPlayer(): Player {
    return this.settings.players[this.getCurrentPlayerIndex()];
  }

  private setCurrentPlayerByIndex(index: number): void {
    this.settings.players.forEach(p => (p.isCurrentPlayer = false));
    this.settings.players[index].isCurrentPlayer = true;
  }

  /**
   * Scrolls the active player into view.
   */
  private scrollToActivePlayer(): void {
    if (!this.scrollableItems) return;

    const index = this.getCurrentPlayerIndex();
    const item = this.scrollableItems.find(d => d.index() === index);

    item?.scrollIntoView();
  }
}