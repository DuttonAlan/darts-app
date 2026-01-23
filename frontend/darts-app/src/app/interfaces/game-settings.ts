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

  players: Player[];
}

export const defaultSettings: GameSettings = {
  mode: 'SINGLE',
  winType: 'BEST_OF',
  winValue: 3,
  legs: 1,
  sets: 1,
  startScore: 501,
  inMode: 'SINGLE_IN',
  outMode: 'DOUBLE_OUT',
  players: [
      {
        id: 1,
        name: 'Alan',
        isBot: false,
        isCurrentPlayer: true
      },
      {
        id: 2,
        name: 'Alex',
        isBot: false,
        isCurrentPlayer: false
      },
      {
        id: 3,
        name: 'Jannik',
        isBot: false,
        isCurrentPlayer: false
      }
  ]
}

export function formatGameMode(value: GameMode): string {
  switch (value) {
    case 'SINGLE':
      return 'Single';
    case 'TEAMS':
      return 'Teams';
    default:
      return value;
  }
}

export function formatInMode(value: InMode): string {
  switch (value) {
    case 'SINGLE_IN':
      return 'Single In';
    case 'DOUBLE_IN':
      return 'Double In';
    case 'TRIPLE_IN':
      return 'Triple In';
    default:
      return value;
  }
}

export function formatOutMode(value: OutMode): string {
  switch (value) {
    case 'SINGLE_OUT':
      return 'Single Out';
    case 'DOUBLE_OUT':
      return 'Double Out';
    case 'MASTER_OUT':
      return 'Master Out';
    default:
      return value;
  }
}

export function formatWinType(value: WinType): string {
  switch (value) {
    case 'BEST_OF':
      return 'Best of';
    case 'FIRST_TO':
      return 'First to';
    default:
      return value;
  }
}