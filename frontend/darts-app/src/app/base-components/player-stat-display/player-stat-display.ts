import { Component, input, output } from '@angular/core';
import { PointDisplay } from "../point-display/point-display";
import { NgClass } from '@angular/common';
import { Player } from '../../interfaces/player';

@Component({
  selector: 'app-player-stat-display',
  imports: [PointDisplay, NgClass],
  templateUrl: './player-stat-display.html',
  styleUrl: './player-stat-display.scss',
})
export class PlayerStatDisplay {
  player = input.required<Player>();

  points = input<number[] | undefined>();

  public get thrownPoints(): number {
    return this.points()?.reduce((sum, n) => sum + n, 0) ?? 0;
  }
}
