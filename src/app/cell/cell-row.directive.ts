import { Directive, ElementRef } from '@angular/core';
import { CellService } from './cell.service';

@Directive({
  selector: '[appCellRow]',
})
export class CellRowDirective {
  constructor(el: ElementRef, private cs: CellService) {
    cs.pushCell((<HTMLDivElement>el.nativeElement).children);
  }
}
