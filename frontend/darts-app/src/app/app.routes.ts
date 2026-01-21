import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { GameSettingsComponent } from './pages/game-settings/game-settings';

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
    path: '',
    redirectTo: 'homepage',
    pathMatch: 'full',
  },
];
