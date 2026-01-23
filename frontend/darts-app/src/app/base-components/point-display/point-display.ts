import { Component, input } from '@angular/core';

@Component({
  selector: 'app-point-display',
  imports: [],
  templateUrl: './point-display.html',
  styleUrl: './point-display.scss',
})
export class PointDisplay {
  points = input<number | undefined>();
}
