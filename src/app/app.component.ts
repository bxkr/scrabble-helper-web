import {AfterViewInit, Component, HostListener} from '@angular/core';
import { numberRange } from "../scripts/range";
import { read_json } from "../scripts/json";

interface cell_obj {
  [id: string]: any
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'scrabble-helper'
  row_range = numberRange(1, 16)
  clicked_cells: cell_obj = {}
  set_cells: cell_obj = {}
  cells_letters: cell_obj = {}
  setting_word = false
  direction: string | undefined;
  dir_ref: string | undefined;
  alpha_arr = Array.from(String.fromCharCode(...[...Array('О'.charCodeAt(0) - 'А'.charCodeAt(0) + 1).keys()].map(i => i + 'А'.charCodeAt(0))));
  first_arr = Array.from(String.fromCharCode(...[...Array('Я'.charCodeAt(0) - 'А'.charCodeAt(0) + 1).keys()].map(i => i + 'А'.charCodeAt(0))));
  second_arr = Array.from(String.fromCharCode(...[...Array('я'.charCodeAt(0) - 'а'.charCodeAt(0) + 1).keys()].map(i => i + 'а'.charCodeAt(0))));
  result_arr = this.first_arr.concat(this.second_arr)
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
      cell.target.children[0].innerText = 'Буква ' + (Object.keys(this.clicked_cells).length + Object.keys(this.set_cells).length)
    }
  }

  public clearClicked(): void {
    Object.values(this.clicked_cells).concat(Object.values(this.set_cells)).forEach( (el) => {
      el.target.style.outlineColor = 'black'
      if (el.target.style.backgroundImage == 'url("../assets/dot.svg")') {
        el.target.style.backgroundImage = ''
      }
      el.target.children[0].innerText = ''
    })
    this.set_cells = {}
    this.cells_letters = {}
    this.clicked_cells = {}
    this.setting_word = false
    this.direction = undefined
    this.dir_ref = undefined
  }

  @HostListener('document:keydown', ['$event']) keyDown(ev: KeyboardEvent): void {
    let l = ev.key
    if (this.result_arr.includes(l) && Object.keys(this.clicked_cells).length > 0) {
      Object.assign(this.set_cells, {
        [Object.values(this.clicked_cells)[0].target.id]: Object.values(this.clicked_cells)[0]
      })
      Object.assign(this.cells_letters, {
        [Object.values(this.clicked_cells)[0].target.id]: l
      })
      delete this.clicked_cells[Object.values(this.clicked_cells)[0].target.id]
    }
  }

  public setIncludes(id: string): boolean {
    return Object.keys(this.set_cells).includes(id)
  }
}
