import { Component, output } from '@angular/core';
import { DartThrow } from '../../interfaces/dart-throw';
import { NgClass } from '@angular/common';

type Multiplier = 1 | 2 | 3;

@Component({
  selector: 'app-dart-keyboard',
  imports: [NgClass],
  templateUrl: './dart-keyboard.html',
  styleUrl: './dart-keyboard.scss',
})
export class DartKeyboard {
  private dartHit = new Audio('assets/sounds/dart-hit.mp3');
  private dartHitHard = new Audio('assets/sounds/dart-hit-hard.mp3');

  valueSelected = output<DartThrow>();
  back = output();

  numbers = [
    1, 2, 3, 4, 5, 6, 7,
    8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 25
  ];

  multiplier: Multiplier = 1;

  public setMultiplier(value: Multiplier) {
    // Reset multiplier if pressed again
    if (this.multiplier === value) {
      this.multiplier = 1;
      return;
    }

    this.multiplier = value;
  }

  public selectNumber(num: number) {
    // Prevent triple bullseye and tripple/double null
    if (num === 25 && this.multiplier === 3) return;
    if (num === 0 && (this.multiplier !== 1)) return;

    this.valueSelected.emit({
      multiplier: this.multiplier,
      value: num * this.multiplier
    });

    this.multiplier = 1;
  }

  public goBack() {
    this.multiplier = 1;
    this.back.emit();
  }

  public isActive(value: Multiplier): boolean {
    return this.multiplier === value;
  }
}
