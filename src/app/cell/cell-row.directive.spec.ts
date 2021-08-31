import { ElementRef } from '@angular/core';
import { CellRowDirective } from './cell-row.directive';
import { CellService } from './cell.service';

describe('CellRowDirective', () => {
  it('should create an instance', () => {
    const directive = new CellRowDirective(new ElementRef(new HTMLElement()), new CellService());
    expect(directive).toBeTruthy();
  });
});
