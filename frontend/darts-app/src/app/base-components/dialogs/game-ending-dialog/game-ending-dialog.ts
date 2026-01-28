import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimaryButton } from "../../primary-button/primary-button";
import { formatInMode, formatOutMode, GameSettings, InMode, OutMode } from '../../../interfaces/game-settings';
import { Player } from '../../../interfaces/player';

interface PlayerRanking {
  player: Player;
  rank: number;
}

@Component({
  selector: 'app-game-ending-dialog',
  imports: [PrimaryButton],
  templateUrl: './game-ending-dialog.html',
  styleUrl: './game-ending-dialog.scss',
})
export class GameEndingDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<GameEndingDialog>);
  private winSound = new Audio('assets/sounds/win.mp3');

  currentTime = '';
  playerRanked: PlayerRanking[] = [];

  data = inject(MAT_DIALOG_DATA) as {
    settings: GameSettings;
  };

  ngOnInit(): void {
    this.winSound.currentTime = 0;
    this.winSound.play();

    this.currentTime = this.getCurrentTime();
    this.playerRanked = this.getPlayerRanked();
  }

  public getCurrentTime(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  public getPlayerRanked(): PlayerRanking[] {
    const players = [...this.data.settings.players];

    // 1. Sort by normal rules
    players.sort((a, b) => {
      if (b.setsWon !== a.setsWon) {
        return b.setsWon - a.setsWon;
      }

      if (b.legsWon !== a.legsWon) {
        return b.legsWon - a.legsWon;
      }

      const pointsA = a.currentPoints ?? Number.MAX_SAFE_INTEGER;
      const pointsB = b.currentPoints ?? Number.MAX_SAFE_INTEGER;

      return pointsA - pointsB;
    });

    // 2. Ranking with same points
    const ranking: PlayerRanking[] = [];

    let currentRank = 1;
    let lastPlayer: Player | null = null;

    players.forEach((player, index) => {
      if (
        lastPlayer &&
        player.setsWon === lastPlayer.setsWon &&
        player.legsWon === lastPlayer.legsWon &&
        (player.currentPoints ?? null) === (lastPlayer.currentPoints ?? null)
      ) {
        // complete tie
        ranking.push({ player, rank: currentRank });
      } else {
        // new Rank (Index + 1, to skip ranks)
        currentRank = index + 1;
        ranking.push({ player, rank: currentRank });
      }

      lastPlayer = player;
    });

    return ranking;
  }

  public getAvgPointsFormatted(player: Player): string {
    const value = player.avgPoints;
    return value == null
      ? '–'
      : value.toLocaleString('en-EN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
  }

  public goToSettings(): void {
    this.dialogRef.close(false);
  }

  public redo(): void {
    this.dialogRef.close(true);
  }

  public getInMode(inMode: InMode): string {
    return formatInMode(inMode);
  }

  public getOutMode(outMode: OutMode): string {
    return formatOutMode(outMode);
  }
}
