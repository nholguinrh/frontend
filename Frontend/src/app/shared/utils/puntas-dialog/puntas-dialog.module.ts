import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PuntasDialogComponent } from './puntas-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatSelectModule} from '@angular/material/select';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import { PaginatorModule } from '../paginator';
import { PagerModule } from '../pager';




@NgModule({
  declarations: [
    PuntasDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    MatSelectModule,
    MatDividerModule,
    MatMenuModule,
    PaginatorModule,
    PagerModule,
  ],
  exports: [
    PuntasDialogComponent
  ]
})
export class PuntasDialogModule { }
