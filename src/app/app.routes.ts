import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { GameSettingsComponent } from './pages/game-settings/game-settings';
import { NormalGame } from './pages/gamemodes/normal-game/normal-game';

export const routes: Routes = [
  {
    path: 'homepage',
    component: Homepage
  },
  {
    path: 'game-settings',
    component: GameSettingsComponent
  },
  {
    path: 'normal-game',
    component: NormalGame
  },
  {
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
];
