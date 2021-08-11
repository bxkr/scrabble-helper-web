import { OnInit, Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';
import { numberRange } from '../scripts/range';
import { readJson } from '../scripts/json';
import { labels, arrays } from '../assets/localized';
import generateAlphabeticalArray from '../scripts/alphabetical';

interface CellObj {
  [id: string]: MouseEvent;
}

interface CellColors {
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

  labels = labels;

  arrays = arrays;

  mode = 'settings';

  players: Player[] = [];

  rowRange = numberRange(1, 16);

  clickedCells: CellObj = {};

  setCells: CellObj = {};

  cellsLetters: CellObj = {};

  cellsColors: CellColors = {};

  russianAlphabeticalArray = generateAlphabeticalArray('А', 'Я').concat(
    generateAlphabeticalArray('а', 'я'),
  );

  englishAlphabeticArray = generateAlphabeticalArray('A', 'z');

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
    return 'darkgreen';
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
    const target = <HTMLElement>cell.target;
    if (!Object.keys(this.clickedCells).includes(<never>target.id)) {
      Object.assign(this.clickedCells, { [target.id]: <MouseEvent>cell });
      if (target.style.backgroundColor === 'rgb(255, 0, 0)') {
        target.style.backgroundImage = 'url("../assets/dot.svg")';
      }
    }
  }

  public clearClicked(): void {
    Object.values(this.clickedCells)
      .concat(Object.values(this.setCells))
      .forEach((el) => {
        const target = <HTMLDivElement>el.target;
        if (target.style.backgroundImage === 'url("../assets/dot.svg")') {
          target.style.backgroundImage = '';
        }
        target.children[0].innerHTML = '';
      });
    this.setCells = {};
    this.cellsLetters = {};
    this.clickedCells = {};
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(ev: KeyboardEvent): void {
    const pushedLetter = ev.key;
    if (
      this.russianAlphabeticalArray.includes(pushedLetter) &&
      Object.keys(this.clickedCells).length > 0
    ) {
      this.setLetter(pushedLetter);
    } else if (this.englishAlphabeticArray.includes(pushedLetter)) {
      this.snackBar.open(labels.letter_error[this.language], undefined, { duration: 1000 });
    }
  }

  setLetter(pushedLetter: string): void {
    const lastId = (<HTMLDivElement>Object.values(this.clickedCells)[0].target).id;
    Object.assign(this.setCells, {
      [lastId]: Object.values(this.clickedCells)[0],
    });
    Object.assign(this.cellsLetters, {
      [lastId]: pushedLetter,
    });
    delete this.clickedCells[lastId];
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
