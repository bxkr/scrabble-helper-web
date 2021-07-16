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
  clicked_cells: any[] = []
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
  }

  public onCellTouch(cell: any): void {
    this.setting_word = true
    if (this.direction == undefined || cell.target.id[0] == this.dir_ref || cell.target.id[1] == this.dir_ref) {
      if (this.clicked_cells.length == 0 || cell.target.id[0] == this.clicked_cells[0].id[0] || cell.target.id[1] == this.clicked_cells[0].id[1]) {
        this.clicked_cells.push(cell.target)
        cell.target.style.outlineColor = 'red'
        if (cell.target.style.backgroundColor == 'rgb(255, 0, 0)') {
          cell.target.style.backgroundImage = 'url("../assets/dot.svg")'
        }
      }
    }
    if (this.direction == undefined && this.clicked_cells.length == 2) {
      if (this.clicked_cells[0].id[0] == this.clicked_cells[1].id[0]) {
        this.direction = 'v'
        this.dir_ref = this.clicked_cells[0].id[0]
      } else if (this.clicked_cells[0].id[1] == this.clicked_cells[1].id[1]) {
        this.direction = 'h'
        this.dir_ref = this.clicked_cells[0].id[1]
      }
    }
  }

  public clearClicked(): void {
    this.clicked_cells.forEach( (el) => {
      el.style.outlineColor = 'black'
      if (el.style.backgroundImage == 'url("../assets/dot.svg")') {
        el.style.backgroundImage = ''
      }
    })
    this.clicked_cells = []
    this.setting_word = false
    this.direction = undefined
    this.dir_ref = undefined
  }
}
