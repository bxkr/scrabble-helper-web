import { OnInit, Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { numberRange } from '../scripts/range';
import { readJson } from '../scripts/json';
import generateAlphabeticalArray from '../scripts/alphabetical';

interface CellObj {
  [id: string]: MouseEvent;
}

interface CellColors {
  [id: string]: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  menuTitle = 'Игровое меню';

  mode = 'ожидание';

  rowRange = numberRange(1, 16);

  clickedCells: CellObj = {};

  setCells: CellObj = {};

  cellsLetters: CellObj = {};

  cellsColors: CellColors = {};

  boardAlphabeticalArray = generateAlphabeticalArray('А', 'О');

  russianAlphabeticalArray = generateAlphabeticalArray('А', 'Я').concat(
    generateAlphabeticalArray('а', 'я'),
  );

  englishAlphabeticArray = generateAlphabeticalArray('A', 'z');

  constructor(private snackBar: MatSnackBar) {}

  cellRange(): string[] {
    const result: string[] = [];
    this.rowRange.forEach((nb) => {
      this.boardAlphabeticalArray.forEach((lt) => {
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

  public cellOk(cell: MouseEvent): void {
    let target = <HTMLDivElement>cell.target;
    if (target.className !== 'board') {
      target = <HTMLDivElement>target.parentElement;
    }
    if (!Object.values(this.clickedCells).includes(<never>target.id)) {
      Object.assign(this.clickedCells, { [target.id]: cell });
      if (target.style.backgroundColor === 'rgb(255, 0, 0)') {
        target.style.backgroundImage = 'url("../assets/dot.svg")';
      }
      (<HTMLSpanElement>target.querySelector('.letter-number')).innerText = `Буква ${
        Object.keys(this.clickedCells).length
      }`;
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
      this.snackBar.open('Переключите раскладку!', undefined, { duration: 1000 });
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
}
