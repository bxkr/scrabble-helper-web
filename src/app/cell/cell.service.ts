import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CellService {
  private cellRefs: ElementRef[] = [];

  public getCells(): ElementRef[] {
    return this.cellRefs;
  }

  public pushCell(el: ElementRef): void {
    this.cellRefs.push(el);
  }
}
