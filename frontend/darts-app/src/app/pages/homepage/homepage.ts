import { Component } from '@angular/core';
import { GameSettingsComponent } from "../game-settings/game-settings";

@Component({
  selector: 'app-homepage',
  imports: [GameSettingsComponent],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {

}
