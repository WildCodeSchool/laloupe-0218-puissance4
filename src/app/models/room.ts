import { Player } from './player';

export class Room {
  players: Player[];
  turn: number;
  winner: number;
  grid: {line: string[]}[];
  end: boolean;
  token = [];
  chat = [];
  nbPLayers: number;

}
