import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CellService {
  private cellRefs: HTMLCollection[] = [];

  public getCells(): HTMLCollection[] {
    return this.cellRefs;
  }

  public pushCell(el: HTMLCollection): void {
    this.cellRefs.push(el);
  }
}
