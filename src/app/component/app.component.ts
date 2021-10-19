import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import { MatDialog } from '@angular/material/dialog';
import { numberRange } from '../../scripts/range';
import { arrays, labels } from '../models/localized';
import { scoreRaw } from '../models/score';
import { animation } from '../models/animation';
import { FieldColorNames, fieldColors } from '../models/fieldColors';
import { CellService } from '../cell/cell.service';
import { FinishDialogComponent } from './dialogs/finish.dialog';
import { Player } from '../models/player';
import { DialogData } from '../models/dialogData';
import { environment } from '../../environments/environment';
import sleep from '../../scripts/sleep';

interface CellObj {
  [id: string]: MouseEvent;
}

interface CellAny {
  [id: string]: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: animation,
})
export class AppComponent implements AfterViewInit, OnInit {
  development = !environment.production;

  @ViewChild('table') tableRef: ElementRef | undefined;

  cellElements: Element[][] = [];

  cellIterator: any[] = [...Array(15).keys()];

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

  constructor(
    private snackBar: MatSnackBar,
    private cookies: CookieService,
    private cells: CellService,
    private dialog: MatDialog,
  ) {}

  ngAfterViewInit(): void {
    this.cells.getCells().forEach((raw) => {
      this.cellElements.push(Array.from(raw));
    });
    this.prepareColorArray();
    this.setColors();
  }

  ngOnInit(): void {
    if (this.cookies.hasKey('language')) {
      this.language = this.cookies.get('language');
    }
  }

  private prepareColorArray(): void {
    Object.entries(fieldColors).forEach((colorArray: [string, number[][] | unknown]) => {
      (<number[][]>colorArray[1]).forEach((cell: number[]) => {
        Object.assign(this.cellsColors, { [cell.join(' ')]: colorArray[0] });
      });
    });
  }

  private setColors(): void {
    this.cellElements.forEach((raw_row, index) => {
      const row = Array.from(raw_row);
      row.forEach((cell, local) => {
        sleep((index + local) * 80).then(() => {
          const cellEl = <HTMLDivElement>cell;
          const coordinates = [this.cellElements.indexOf(raw_row), row.indexOf(cell)].join(' ');
          if (Object.keys(this.cellsColors).includes(coordinates)) {
            cellEl.style.backgroundColor = this.cellsColors[coordinates];
            if (coordinates === '7 7') {
              cellEl.id = 'star';
            }
          } else {
            cellEl.style.backgroundColor = 'rgb(0, 100, 0)';
          }
        });
      });
    });
  }

  private getCoordinates(target: HTMLElement): string {
    let arrIndex = -1;
    let cellIndex = -1;
    this.cellElements.forEach((arr, index) => {
      if (arr.indexOf(target) !== -1) {
        arrIndex = index;
        cellIndex = arr.indexOf(target);
      }
    });
    return `${arrIndex} ${cellIndex}`;
  }

  public cellOk(cell: MouseEvent | PointerEvent): void {
    if (cell.buttons || cell.type === 'click') {
      let target = <HTMLElement>cell.target;
      const className = target.className.split(' ');
      if (
        className.includes('letter-number') ||
        className.includes('letter') ||
        className.includes('coordinates')
      ) {
        target = target.parentElement!;
      } else if (className.includes('letter-score')) {
        target = target.parentElement!.parentElement!;
      }
      const coordinates = this.getCoordinates(<HTMLElement>target);
      if (
        !Object.keys(this.clickedCells).includes(<never>coordinates) &&
        !Object.keys(this.setCells).includes(<never>coordinates)
      ) {
        Object.assign(this.clickedCells, { [coordinates]: <MouseEvent>cell });
        Object.assign(this.nowCells, { [coordinates]: <MouseEvent>cell });
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
      const coordinates = this.getCoordinates(target);
      if (Object.keys(this.cellsColors).includes(coordinates)) {
        target.style.backgroundColor = this.cellsColors[coordinates];
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
  private keyDown(ev: KeyboardEvent): void {
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

  private setLetter(pushedLetter: string): void {
    if (Object.keys(this.setCells).length < Object.keys(this.clickedCells).length) {
      const lastCoordinates = Object.keys(this.clickedCells)[Object.keys(this.setCells).length];
      Object.assign(this.setCells, {
        [lastCoordinates]: Object.values(this.clickedCells)[Object.keys(this.setCells).length],
      });
      Object.assign(this.nowLetters, {
        [lastCoordinates]: pushedLetter.toUpperCase(),
      });
      Object.assign(this.cellsLetters, {
        [lastCoordinates]: pushedLetter.toUpperCase(),
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

  private getLetterScore(coordinatesString: string): number[] {
    const letterScore = Number(scoreRaw(this.language)[this.cellsLetters[coordinatesString]]);
    let letterMultiplier = 1;
    let wordMultiplier = 0;
    const color = this.cellsColors[coordinatesString];
    switch (color) {
      case FieldColorNames.red:
        wordMultiplier = 3;
        break;
      case FieldColorNames.pink:
        wordMultiplier = 2;
        break;
      case FieldColorNames.blue:
        letterMultiplier = 2;
        break;
      case FieldColorNames.deepBlue:
        letterMultiplier = 3;
        break;
      default:
        break;
    }
    return [letterScore, letterMultiplier, wordMultiplier];
  }

  private calculateScore(): number {
    let resultScore = 0;
    let multiplier = 0;
    const newMethod = () => {
      const toCoordinate = (str: string): number[] => {
        return str.split(' ').map(Number);
      };
      const toStringCoordinate = (list: number[]): string => {
        return list.join(' ');
      };
      const center = Object.keys(this.nowCells)[0];
      const hozFirstFun = (tempCoordR: string): string => {
        let tempCoord = tempCoordR;
        let lastFound = String();
        while (this.setCells[tempCoord]) {
          lastFound = tempCoord;
          const temp = toCoordinate(tempCoord);
          tempCoord = toStringCoordinate([temp[0] - 1, temp[1]]);
        }
        return lastFound;
      };
      const vertFirstFun = (tempCoordR: string): string => {
        let tempCoord = tempCoordR;
        let lastFound = String();
        while (this.setCells[tempCoord]) {
          lastFound = tempCoord;
          const temp = toCoordinate(tempCoord);
          tempCoord = toStringCoordinate([temp[0], temp[1] - 1]);
        }
        return lastFound;
      };
      const hozFirst = hozFirstFun(center);
      const vertFirst = vertFirstFun(center);
      let blocked: string[] = [];
      const hozIterate = (tempCoordR: string) => {
        let tempCoord = tempCoordR;
        while (this.setCells[tempCoord]) {
          blocked = [...blocked, tempCoord];
          let letterScore = this.getLetterScore(tempCoord)[0];
          if (Object.keys(this.nowCells).includes(tempCoord)) {
            letterScore *= this.getLetterScore(tempCoord)[1];
            multiplier += this.getLetterScore(tempCoord)[2];
          }
          resultScore += letterScore;
          const temp = toCoordinate(tempCoord);
          tempCoord = toStringCoordinate([temp[0] + 1, temp[1]]);
        }
      };
      const vertIterate = (tempCoordR: string) => {
        let tempCoord = tempCoordR;
        if (tempCoordR === center) {
          const temp = toCoordinate(tempCoord);
          tempCoord = toStringCoordinate([temp[0], temp[1] + 1]);
        }
        while (this.setCells[tempCoord]) {
          if (!blocked.includes(tempCoord)) {
            blocked = [...blocked, tempCoord];
            let letterScore = this.getLetterScore(tempCoord)[0];
            if (Object.keys(this.nowCells).includes(tempCoord)) {
              multiplier += this.getLetterScore(tempCoord)[2];
              letterScore *= this.getLetterScore(tempCoord)[1];
            }
            resultScore += letterScore;
          }
          const temp = toCoordinate(tempCoord);
          tempCoord = toStringCoordinate([temp[0], temp[1] + 1]);
        }
      };
      hozIterate(hozFirst);
      vertIterate(vertFirst);
    };
    newMethod();
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

  public finishGame(): void {
    this.mode = 'settings';
    this.dialog.open(FinishDialogComponent, {
      data: <DialogData>{
        labels: this.labels,
        language: this.language,
        players: this.players,
      },
    });
    this.players = [];
    this.clearClicked();
    this.setCells = {};
    this.clickedCells = {};
    this.cellsLetters = {};
  }
}
