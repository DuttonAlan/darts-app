import { DartThrow } from "./dart-throw";

export interface Player {
  id: number;
  name: string;
  isBot: boolean;

  isCurrentPlayer: boolean;
  currentPoints?: number;
  avgPoints?: number;

  legsWon: number;
  setsWon: number;

  lastTurnThrows: DartThrow[];
  lastTurnWasBust?: boolean;
}

