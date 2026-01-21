import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-player-stat-display',
  imports: [],
  templateUrl: './player-stat-display.html',
  styleUrl: './player-stat-display.scss',
})
export class PlayerStatDisplay {
  name = input.required<string>();
  currentPoints = input<number>();

  endResult = output<number>();
}
