import { Directive, ElementRef } from '@angular/core';
import { CellService } from './cell.service';

@Directive({
  selector: '[appCell]',
})
export class CellDirective {
  constructor(el: ElementRef, private cs: CellService) {
    cs.pushCell(el);
  }
}
