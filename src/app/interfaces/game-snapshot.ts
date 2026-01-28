import { DartThrow } from "./dart-throw";
import { Player } from "./player";
import { TurnHistory } from "./turn-history";

export interface GameSnapshot {
  players: Player[];
  throwHistory: TurnHistory[];
  currentThrows: DartThrow[];
  currentPlayerIndex: number;
}

