import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CarouselVozComponent } from './carousel-voz.component';
import { MatCardModule } from '@angular/material/card';
import { D3Module } from '../../../graphics/d3/d3.module';
import { ServiceErrorDashboardModule } from '../service-error-dashboard';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AlertModule } from '../alertas';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, MatCardModule, D3Module, ServiceErrorDashboardModule, 
    MatProgressSpinnerModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, AlertModule],
  declarations: [CarouselVozComponent],
  exports: [CarouselVozComponent]
})
export class CarouselVozModule {}
