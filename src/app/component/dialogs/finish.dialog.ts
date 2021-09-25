import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../models/dialogData';

@Component({
  templateUrl: './finish.dialog.html',
  styleUrls: ['./finish.dialog.css'],
})
export class FinishDialogComponent {
  positions: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public dialog_data: DialogData) {
    this.positions = [];
    let rawArr: { [name: string]: number } = {};
    dialog_data.players.forEach((value) => {
      rawArr = { ...rawArr, [value.name]: value.score };
    });
    const addOne = (i: number) => {
      const name =
        Object.keys(rawArr)[Object.values(rawArr).indexOf(Math.max(...Object.values(rawArr)))];
      this.positions[i] = name;
      delete rawArr[name];
    };
    for (let i = 0; i < 2; i += 1) {
      addOne(i);
    }
    if (dialog_data.players.length >= 3) {
      addOne(2);
    }
  }
}
