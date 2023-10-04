import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CustomSelectRoundedComponent } from './custom-select-rounded.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  declarations: [CustomSelectRoundedComponent],
  exports: [CustomSelectRoundedComponent],
})
export class CustomSelectRoundedModule {}
