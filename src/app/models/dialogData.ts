import { Player } from './player';
import { Labels } from './localized';

export interface DialogData {
  labels: Labels;
  language: string;
  players: Player[];
}
