import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationDialogComponent } from './notification-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NotificationDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule
  ],
  exports: [
    NotificationDialogComponent
  ]
})
export class NotificationDialogModule { }
