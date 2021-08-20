import { ElementRef } from '@angular/core';
import { CellDirective } from './cell.directive';

describe('CellDirective', () => {
  it('should create an instance', () => {
    const directive = new CellDirective(new ElementRef<any>(new HTMLElement()));
    expect(directive).toBeTruthy();
  });
});
