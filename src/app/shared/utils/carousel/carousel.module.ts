import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from './carousel.component';
import { MatCardModule } from '@angular/material/card';
import { D3Module } from '../../../graphics/d3/d3.module';
import { ServiceErrorDashboardModule } from '../service-error-dashboard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, MatCardModule, D3Module, ServiceErrorDashboardModule, MatProgressSpinnerModule],
  declarations: [CarouselComponent],
  exports: [CarouselComponent]
})
export class CarouselModule {}
