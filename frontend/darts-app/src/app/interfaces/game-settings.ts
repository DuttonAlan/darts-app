import { Player } from "./player";

export type GameMode = 'SINGLE' | 'TEAMS';
export type InMode = 'SINGLE_IN' | 'DOUBLE_IN' | 'TRIPLE_IN';
export type OutMode = 'DOUBLE_OUT' | 'MASTER_OUT' | 'SINGLE_OUT';
export type WinType = 'BEST_OF' | 'FIRST_TO';

export interface GameSettings {
  mode: GameMode;
  winType: WinType;
  winValue: number;

  legs: number;
  sets: number;

  startScore: number;
  inMode: InMode;
  outMode: OutMode;

  showCheckoutPercentage: boolean;
  players: Player[];
}

