import { Component } from '@angular/core';
import {numberRange} from "../scripts/range";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'scrabble-helper'
  row_range = numberRange(1, 16)
  col_range(rn: number, cn: number): string {
    const al = Array.from(String.fromCharCode(...[...Array('О'.charCodeAt(0) - 'А'.charCodeAt(0) + 1).keys()].map(i => i + 'А'.charCodeAt(0))))
    const nl = numberRange(1, 16)
    return al[cn-1] + nl[rn-1].toString()
  }
}
