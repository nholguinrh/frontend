import { NgModule } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MassiveNotificationDialogComponent } from './massive-notification-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    MassiveNotificationDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    MatMenuModule,
  ],
  providers: [
    AsyncPipe
  ],
})
export class MassiveNotificationDialogModule { }
