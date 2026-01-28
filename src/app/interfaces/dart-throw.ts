export type Multiplier = 1 | 2 | 3;

export interface DartThrow {
  base: number;
  multiplier: Multiplier;
  value: number;
}