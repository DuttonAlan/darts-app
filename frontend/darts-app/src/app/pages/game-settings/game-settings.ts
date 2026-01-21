import { Component } from '@angular/core';
import { GameSettings } from '../../interfaces/game-settings';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';

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
export class GameSettingsComponent {

  settings: GameSettings = {
    mode: 'SINGLE',
    winType: 'BEST_OF',
    winValue: 5,
    legs: 1,
    sets: 1,
    startScore: 501,
    inMode: 'SINGLE_IN',
    outMode: 'DOUBLE_OUT',
    showCheckoutPercentage: true,
    players: [
      {
        id: 1,
        name: 'Alan',
        isBot: false
      }
    ]
  };

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

  public addPlayer(): void {
    this.settings.players.push({
      id: 0,
      name: `guest_${this.settings.players.length + 1}`,
      isBot: false
    });
  }

  public startGame(): void {
    console.log('Spiel starten mit Settings:', this.settings);
  }
}