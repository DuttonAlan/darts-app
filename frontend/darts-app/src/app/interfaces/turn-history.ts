import { DartThrow } from "./dart-throw";

export interface TurnHistory {
  playerIndex: number;
  throws: DartThrow[];
  scoreBefore: number;
  scoreAfter: number;
  isBust: boolean;
}
