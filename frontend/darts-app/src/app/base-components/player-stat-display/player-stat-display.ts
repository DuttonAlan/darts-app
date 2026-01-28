import { Component, input } from '@angular/core';
import { PointDisplay } from "../point-display/point-display";
import { NgClass } from '@angular/common';
import { Player } from '../../interfaces/player';
import { DartThrow } from '../../interfaces/dart-throw';

@Component({
  selector: 'app-player-stat-display',
  imports: [PointDisplay, NgClass],
  templateUrl: './player-stat-display.html',
  styleUrl: './player-stat-display.scss',
})
export class PlayerStatDisplay {
  player = input.required<Player>();

  points = input<DartThrow[] | undefined>();
  isBust = input<boolean>(false);

  public get thrownPoints(): number {
    return this.points()?.reduce((sum, n) => sum + n.value, 0) ?? 0;
  }

  public get currentPoints(): number {
    return this.player().isCurrentPlayer 
      ? (this.player().currentPoints ?? 0) - this.thrownPoints
      : (this.player().currentPoints ?? 0)
  }

  public get avgPointsFormatted(): string {
    const value = this.player()?.avgPoints;
    return value == null
      ? '–'
      : value.toLocaleString('en-EN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
  }
}
