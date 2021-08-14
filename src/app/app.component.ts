import { OnInit, Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';
import { numberRange } from '../scripts/range';
import { readJson } from '../scripts/json';
import { labels, arrays } from '../assets/localized';
import generateAlphabeticalArray from '../scripts/alphabetical';
import { scoreRaw } from '../assets/score';

interface CellObj {
  [id: string]: MouseEvent;
}

interface CellAny {
  [id: string]: string;
}

interface Player {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('smooth', [
      transition(':enter', [style({ opacity: 0 }), animate('.5s ease-out', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('.5s ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  language = 'english';

  scoreRaw = scoreRaw;

  labels = labels;

  arrays = arrays;

  mode = 'settings';

  players: Player[] = [];

  rowRange = numberRange(1, 16);

  clickedCells: CellObj = {};

  setCells: CellObj = {};

  cellsLetters: CellAny = {};

  cellsColors: CellAny = {};

  constructor(private snackBar: MatSnackBar) {}

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
    readJson('../assets/tile-colors.json').then((colors) => {
      Object.entries(colors).forEach((colorArray: [string, string[] | unknown]) => {
        (<string[]>colorArray[1]).forEach((cell: string) => {
          Object.assign(this.cellsColors, { [cell]: colorArray[0] });
        });
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
    Object.values(this.clickedCells)
      .concat(Object.values(this.setCells))
      .forEach((el) => {
        const target = <HTMLDivElement>el.target;
        if (Object.keys(this.cellsColors).includes(target.id)) {
          target.style.backgroundColor = this.cellsColors[target.id];
        } else {
          target.style.backgroundColor = 'rgb(0,100,0)';
        }
        if (target.style.backgroundImage === 'url("../assets/dot.svg")') {
          target.style.backgroundImage = '';
        }
        target.children[0].innerHTML = '';
      });
    this.mode = 'waiting';
    this.setCells = {};
    this.cellsLetters = {};
    this.clickedCells = {};
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(ev: KeyboardEvent): void {
    const pushedLetter = ev.key;
    if (
      this.arrays.board[this.language].includes(pushedLetter) &&
      Object.keys(this.clickedCells).length > 0 &&
      (this.mode === 'selecting' || this.mode === 'inputting')
    ) {
      this.setLetter(pushedLetter);
    } else if (
      this.arrays.board[this.language === 'russian' ? 'english' : 'russian'].includes(pushedLetter)
    ) {
      this.snackBar.open(labels.layout[this.language], undefined, { duration: 1000 });
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
      Object.assign(this.cellsLetters, {
        [lastId]: pushedLetter.toUpperCase(),
      });
      if (this.mode === 'selecting') {
        this.mode = 'inputting';
      }
    }
    if (Object.keys(this.setCells).length === Object.keys(this.clickedCells).length) {
      let resultScore = 0;
      Object.values(this.cellsLetters).forEach((letter) => {
        resultScore += Number(scoreRaw(this.language)[letter]);
      });
      this.snackBar.open(`${this.labels.score[this.language]}: ${resultScore}`, undefined, {
        duration: 1000,
      });
      this.clearClicked();
    }
  }

  public setIncludes(id: string): boolean {
    return Object.keys(this.setCells).includes(id);
  }

  public clickedIncludes(id: string): boolean {
    return Object.keys(this.clickedCells).includes(id);
  }

  public startGame(): void {
    this.mode = this.mode === 'settings' ? 'waiting' : 'settings';
  }

  public getNumber(id: string): number {
    return Object.keys(this.clickedCells).indexOf(id);
  }
}
