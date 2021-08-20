import { OnInit, Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import { numberRange } from '../scripts/range';
import { labels, arrays } from './models/localized';
import { scoreRaw } from './models/score';
import { animation } from './models/animtaion';
import { FieldColorNames, fieldColors } from './models/fieldColors';
import generateAlphabeticalArray from '../scripts/alphabetical';

interface CellObj {
  [id: string]: MouseEvent;
}

interface CellAny {
  [id: string]: string;
}

interface Player {
  id: number;
  name: string;
  score: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: animation,
})
export class AppComponent implements OnInit {
  @ViewChild('table') tableRef: ElementRef | undefined;

  window = window;

  language = 'english';

  scoreRaw = scoreRaw;

  labels = labels;

  arrays = arrays;

  mode = 'settings';

  players: Player[] = [];

  turn: number = 0;

  rowRange = numberRange(1, 16);

  clickedCells: CellObj = {};

  nowCells: CellObj = {};

  setCells: CellObj = {};

  cellsLetters: CellAny = {};

  nowLetters: CellAny = {};

  cellsColors: CellAny = {};

  constructor(private snackBar: MatSnackBar, private cookies: CookieService) {}

  cellRange(): string[] {
    const result: string[] = [];
    this.rowRange.forEach((nb) => {
      generateAlphabeticalArray('А', 'О').forEach((lt) => {
        result.push(lt + nb.toString());
      });
    });
    return result;
  }

  getBackground(id: string): string {
    if (Object.keys(this.cellsColors).includes(id)) {
      return this.cellsColors[id];
    }
    return 'rgb(0,100,0)';
  }

  ngOnInit(): void {
    if (this.cookies.hasKey('language')) {
      this.language = this.cookies.get('language');
    }
    Object.entries(fieldColors).forEach((colorArray: [string, string[] | unknown]) => {
      (<string[]>colorArray[1]).forEach((cell: string) => {
        Object.assign(this.cellsColors, { [cell]: colorArray[0] });
      });
    });
  }

  public cellOk(cell: MouseEvent | PointerEvent): void {
    if (cell.buttons || cell.type === 'click') {
      let target = <HTMLElement>cell.target;
      if (target.tagName === 'SPAN') {
        target = target.parentElement!;
      }
      if (!Object.keys(this.clickedCells).includes(<never>target.id)) {
        Object.assign(this.clickedCells, { [target.id]: <MouseEvent>cell });
        Object.assign(this.nowCells, { [target.id]: <MouseEvent>cell });
        const rgbColor = target.style.backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)!;
        target.style.backgroundColor = `rgb(
          ${Number(rgbColor[1]) - 30},
          ${Number(rgbColor[2]) - 30},
          ${Number(rgbColor[3]) - 30}
        )`;
        if (target.style.backgroundColor === 'rgb(255, 0, 0)') {
          target.style.backgroundImage = 'url("../assets/dot.svg")';
        }
        if (this.mode === 'waiting') {
          this.mode = 'selecting';
        }
      }
    }
  }

  public clearClicked(): void {
    Object.values(this.nowCells).forEach((el) => {
      const target = <HTMLDivElement>el.target;
      if (Object.keys(this.cellsColors).includes(target.id)) {
        target.style.backgroundColor = this.cellsColors[target.id];
      } else {
        target.style.backgroundColor = 'rgb(0,100,0)';
      }
      if (target.style.backgroundImage === 'url("../assets/dot.svg")') {
        target.style.backgroundImage = '';
      }
    });
    this.mode = 'waiting';
    Object.keys(this.nowCells).forEach((id) => {
      delete this.clickedCells[id];
      delete this.setCells[id];
    });
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(ev: KeyboardEvent): void {
    if (this.mode === 'selecting' || this.mode === 'inputting') {
      const pushedLetter = ev.key;
      if (
        this.arrays.board[this.language].includes(pushedLetter) &&
        Object.keys(this.clickedCells).length > 0
      ) {
        this.setLetter(pushedLetter);
      } else if (
        this.arrays.board[this.language === 'russian' ? 'english' : 'russian'].includes(
          pushedLetter,
        ) &&
        pushedLetter !== ' '
      ) {
        this.snackBar.open(labels.layout[this.language], undefined, { duration: 1000 });
      }
    }
  }

  setLetter(pushedLetter: string): void {
    if (Object.keys(this.setCells).length < Object.keys(this.clickedCells).length) {
      const lastId = (<HTMLDivElement>(
        Object.values(this.clickedCells)[Object.keys(this.setCells).length].target
      )).id;
      Object.assign(this.setCells, {
        [lastId]: Object.values(this.clickedCells)[Object.keys(this.setCells).length],
      });
      Object.assign(this.nowLetters, {
        [lastId]: pushedLetter.toUpperCase(),
      });
      Object.assign(this.cellsLetters, {
        [lastId]: pushedLetter.toUpperCase(),
      });
      if (this.mode === 'selecting') {
        this.mode = 'inputting';
      }
    }
    if (Object.keys(this.setCells).length === Object.keys(this.clickedCells).length) {
      const resultScore = this.calculateScore();
      this.snackBar.open(`${this.labels.wordScore[this.language]}: ${resultScore}`, undefined, {
        duration: 1000,
      });
    }
  }

  public setIncludes(id: string): boolean {
    return Object.keys(this.setCells).includes(id);
  }

  public clickedIncludes(id: string): boolean {
    return Object.keys(this.clickedCells).includes(id);
  }

  public startGame(): void {
    if (Object.keys(this.players).length >= 2) {
      this.mode = 'waiting';
    } else {
      this.snackBar.open(this.labels.notEnoughPlayers[this.language], undefined, {
        duration: 1000,
      });
    }
  }

  public getNumber(id: string): number {
    return Object.keys(this.nowCells).indexOf(id);
  }

  public createPlayer(name: string): void {
    if (name.length > 0) {
      if (!name.includes(' ')) {
        this.players.push({ id: this.players.length, name, score: 0 });
        this.players = [...this.players];
      } else {
        this.snackBar.open(this.labels.spacesInName[this.language], undefined, { duration: 1000 });
      }
    } else {
      this.snackBar.open(this.labels.emptyName[this.language], undefined, { duration: 1000 });
    }
  }

  public putLanguageCookie(lang: string) {
    this.cookies.put('language', lang);
  }

  private calculateScore(): number {
    let resultScore = 0;
    let multiplier = 0;
    Object.keys(this.nowLetters).forEach((letter) => {
      let letterScore = Number(scoreRaw(this.language)[this.cellsLetters[letter]]);
      if (Object.keys(this.cellsColors).includes(letter)) {
        const color = this.cellsColors[letter];
        if (color === FieldColorNames.red) {
          multiplier += 3;
        } else if (color === FieldColorNames.pink) {
          multiplier += 2;
        } else if (color === FieldColorNames.blue) {
          letterScore *= 2;
        } else if (color === FieldColorNames.deepBlue) {
          letterScore *= 3;
        }
      }
      resultScore += letterScore;
    });
    if (multiplier) {
      resultScore *= multiplier;
    }
    this.nowLetters = {};
    this.nowCells = {};
    this.players[this.turn].score += resultScore;
    if (!(this.turn === this.players.length - 1)) {
      this.turn += 1;
    } else {
      this.turn = 0;
    }
    this.mode = 'waiting';
    return resultScore;
  }
}
