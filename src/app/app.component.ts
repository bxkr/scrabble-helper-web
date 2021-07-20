import { OnInit, Component, HostListener } from '@angular/core';
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
  title = 'scrabble-helper';

  rowRange = numberRange(1, 16);

  clickedCells: CellObj = {};

  setCells: CellObj = {};

  cellsLetters: CellObj = {};

  cellsColors: CellColors = {};

  direction: string | undefined;

  directionHint: string | undefined;

  boardAlphabeticalArray = generateAlphabeticalArray('А', 'О');

  firstLetterAlphabeticalArray = generateAlphabeticalArray('А', 'Я');

  secondLetterAlphabeticalArray = generateAlphabeticalArray('а', 'я');

  resultLetterAlphabeticalArray = this.firstLetterAlphabeticalArray.concat(
    this.secondLetterAlphabeticalArray,
  );

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

  public onCellTouch(cell: MouseEvent): void {
    const cellId = (<HTMLDivElement>cell.target).id;
    const clickedKeys = Object.keys(this.clickedCells);
    if (cellId.length === 2) {
      if (
        this.direction === undefined ||
        cellId[0] === this.directionHint ||
        cellId[1] === this.directionHint
      ) {
        if (
          clickedKeys.length === 0 ||
          cellId[0] === clickedKeys[0][0] ||
          cellId[1] === clickedKeys[0][1]
        ) {
          this.cellOk(cell);
        }
      }
    } else if (cellId.length === 3) {
      if (
        this.direction === undefined ||
        cellId[0] === this.directionHint ||
        cellId[1] + cellId[2] === this.directionHint
      ) {
        if (
          clickedKeys.length === 0 ||
          cellId[0] === clickedKeys[0][0] ||
          cellId[1] + cellId[2] === clickedKeys[0][1] + clickedKeys[0][2]
        ) {
          this.cellOk(cell);
        }
      }
    }
    if (this.direction === undefined && clickedKeys.length === 2) {
      if (clickedKeys[0][0] === clickedKeys[1][0]) {
        [this.direction, this.directionHint] = ['v', clickedKeys[0][0]];
      } else if (clickedKeys[0][1] === clickedKeys[1][1]) {
        this.direction = 'h';
        if (clickedKeys[0].length === 2) {
          [this.directionHint] = [clickedKeys[0][1]];
        } else if (clickedKeys[0].length === 3) {
          this.directionHint = clickedKeys[0][1] + clickedKeys[0][2];
        }
      }
    }
  }

  public cellOk(cell: MouseEvent): void {
    const target = <HTMLDivElement>cell.target;
    if (!Object.values(this.clickedCells).includes(<never>target)) {
      Object.assign(this.clickedCells, { [target.id]: cell });
      target.style.outlineColor = 'red';
      if (target.style.backgroundColor === 'rgb(255, 0, 0)') {
        target.style.backgroundImage = 'url("../assets/dot.svg")';
      }
      target.children[0].innerHTML = `Буква ${Object.keys(this.clickedCells).length}`;
    }
  }

  public clearClicked(): void {
    Object.values(this.clickedCells)
      .concat(Object.values(this.setCells))
      .forEach((el) => {
        const target = <HTMLDivElement>el.target;
        target.style.outlineColor = 'black';
        if (target.style.backgroundImage === 'url("../assets/dot.svg")') {
          target.style.backgroundImage = '';
        }
        target.children[0].innerHTML = '';
      });
    this.setCells = {};
    this.cellsLetters = {};
    this.clickedCells = {};
    this.direction = undefined;
    this.directionHint = undefined;
  }

  @HostListener('document:keydown', ['$event']) keyDown(ev: KeyboardEvent): void {
    const pushedLetter = ev.key;
    if (
      this.resultLetterAlphabeticalArray.includes(pushedLetter) &&
      Object.keys(this.clickedCells).length > 0
    ) {
      const lastId = (<HTMLDivElement>Object.values(this.clickedCells)[0].target).id;
      Object.assign(this.setCells, {
        [lastId]: Object.values(this.clickedCells)[0],
      });
      Object.assign(this.cellsLetters, {
        [lastId]: pushedLetter,
      });
      delete this.clickedCells[lastId];
    }
  }

  public setIncludes(id: string): boolean {
    return Object.keys(this.setCells).includes(id);
  }
}
