import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieModule } from 'ngx-cookie';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { AppComponent } from './component/app.component';
import { CellDirective } from './cell/cell.directive';

@NgModule({
  declarations: [AppComponent, CellDirective],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSnackBarModule,
    DragDropModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatTableModule,
    CookieModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export default class AppModule {}
