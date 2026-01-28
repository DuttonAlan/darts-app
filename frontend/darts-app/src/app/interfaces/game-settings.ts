import { Player } from "./player";

export type InMode = 'SINGLE_IN' | 'DOUBLE_IN' | 'TRIPLE_IN';
export type OutMode = 'DOUBLE_OUT' | 'MASTER_OUT' | 'SINGLE_OUT';

export interface GameSettings {
  winValue: number;

  legs: number;
  sets: number;

  startScore: number;
  inMode: InMode;
  outMode: OutMode;

  players: Player[];
}

export const defaultSettings: GameSettings = {
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
        isCurrentPlayer: false,
        legsWon: 0,
        setsWon: 0,
        lastTurnThrows: []
      },
      {
        id: 2,
        name: 'Alex',
        isBot: false,
        isCurrentPlayer: false,
        legsWon: 0,
        setsWon: 0,
        lastTurnThrows: []
      },
      // {
      //   id: 3,
      //   name: 'Jannik',
      //   isBot: false,
      //   isCurrentPlayer: false,
      //   legsWon: 0,
      //   setsWon: 0,
      //   lastTurnThrows: []
      // }
  ]
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