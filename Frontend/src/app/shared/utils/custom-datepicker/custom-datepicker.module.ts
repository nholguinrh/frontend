import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomDatepickerComponent } from './custom-datepicker.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [CustomDatepickerComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CustomDatepickerComponent],
})
export class CustomDatepickerModule {}
