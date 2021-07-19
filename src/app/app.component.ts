import { AfterViewInit, Component } from '@angular/core';
import { numberRange } from "../scripts/range";
import { read_json } from "../scripts/json";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'scrabble-helper'
  row_range = numberRange(1, 16)
  clicked_cells: object = {}
  setting_word = false
  direction: string | undefined;
  dir_ref: string | undefined;
  alpha_arr = Array.from(String.fromCharCode(...[...Array('О'.charCodeAt(0) - 'А'.charCodeAt(0) + 1).keys()].map(i => i + 'А'.charCodeAt(0))));
  cell_range(): string[] {
    let result: string[] = [];
    this.row_range.forEach((nb) => {
    this.alpha_arr.forEach((lt) => {
        result.push(lt + nb.toString())
      })
    })
    return result
  }

  ngAfterViewInit(): void {
    read_json('../assets/tile-colors.json').then( (colors) => {
      Object.entries(colors).forEach((ca: any[]) => {
        ca[1].forEach((cell: string) => {
          document.getElementById(cell)!.style.backgroundColor = ca[0]
        })
      })
    })
    document.addEventListener('keydown', this.keyDown)
  }

  public onCellTouch(cell: any): void {
    this.setting_word = true
    if (cell.target.id.length == 2) {
      if (this.direction == undefined || cell.target.id[0] == this.dir_ref || cell.target.id[1] == this.dir_ref) {
        if (Object.keys(this.clicked_cells).length == 0 || cell.target.id[0] == Object.keys(this.clicked_cells)[0][0] || cell.target.id[1] == Object.keys(this.clicked_cells)[0][1]) {
          this.cellOk(cell)
        }
      }
    } else if (cell.target.id.length == 3) {
      if (this.direction == undefined || cell.target.id[0] == this.dir_ref || cell.target.id[1] + cell.target.id[2] == this.dir_ref) {
        if (Object.keys(this.clicked_cells).length == 0 || cell.target.id[0] == Object.keys(this.clicked_cells)[0][0] || cell.target.id[1] + cell.target.id[2] == Object.keys(this.clicked_cells)[0][1] + Object.keys(this.clicked_cells)[0][2]) {
          this.cellOk(cell)
        }
      }
    }
    if (this.direction == undefined && Object.keys(this.clicked_cells).length == 2) {
      if (Object.keys(this.clicked_cells)[0][0] == Object.keys(this.clicked_cells)[1][0]) {
        this.direction = 'v'
        this.dir_ref = Object.keys(this.clicked_cells)[0][0]
      } else if (Object.keys(this.clicked_cells)[0][1] == Object.keys(this.clicked_cells)[1][1]) {
        this.direction = 'h'
        if (Object.keys(this.clicked_cells)[0].length == 2) {
          this.dir_ref = Object.keys(this.clicked_cells)[0][1]
        } else if (Object.keys(this.clicked_cells)[0].length == 3) {
          this.dir_ref = Object.keys(this.clicked_cells)[0][1] + Object.keys(this.clicked_cells)[0][2]
        }
      }
    }
  }

  public cellOk(cell: any): void {
    if (!(Object.values(this.clicked_cells).includes(cell.target))){
      Object.assign(this.clicked_cells, {[cell.target.id]: cell})
      cell.target.style.outlineColor = 'red'
      if (cell.target.style.backgroundColor == 'rgb(255, 0, 0)') {
        cell.target.style.backgroundImage = 'url("../assets/dot.svg")'
      }
      cell.target.innerText = 'Буква ' + Object.keys(this.clicked_cells).length
    }
  }

  public clearClicked(): void {
    Object.values(this.clicked_cells).forEach( (el) => {
      el.target.style.outlineColor = 'black'
      if (el.target.style.backgroundImage == 'url("../assets/dot.svg")') {
        el.target.style.backgroundImage = ''
      }
      el.target.innerText = ''
    })
    this.clicked_cells = {}
    this.setting_word = false
    this.direction = undefined
    this.dir_ref = undefined
  }

  public keyDown(ev: KeyboardEvent): void {
    let l: string | undefined
    if (ev.code.includes('Key')) {
      switch (ev.key) {
        case 'q': {l = 'й'; break}
        case 'w': {l = 'ц'; break}
        case 'e': {l = 'у'; break}
        case 'r': {l = 'к'; break}
        case 't': {l = 'е'; break}
        case 'y': {l = 'н'; break}
        case 'u': {l = 'г'; break}
        case 'i': {l = 'ш'; break}
        case 'o': {l = 'щ'; break}
        case 'p': {l = 'з'; break}
        case 'a': {l = 'ф'; break}
        case 's': {l = 'ы'; break}
        case 'd': {l = 'в'; break}
        case 'f': {l = 'а'; break}
        case 'g': {l = 'п'; break}
        case 'h': {l = 'р'; break}
        case 'j': {l = 'о'; break}
        case 'k': {l = 'л'; break}
        case 'l': {l = 'д'; break}
        case 'z': {l = 'я'; break}
        case 'x': {l = 'ч'; break}
        case 'c': {l = 'с'; break}
        case 'v': {l = 'м'; break}
        case 'b': {l = 'и'; break}
        case 'n': {l = 'т'; break}
        case 'm': {l = 'ь'; break}
      }
    }
  }
}
