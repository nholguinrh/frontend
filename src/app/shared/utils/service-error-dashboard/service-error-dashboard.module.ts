import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceErrorDashboardComponent } from './service-error-dashboard.component';
import { HomeModule } from 'src/app/components/home/home.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';



@NgModule({
  declarations: [
    ServiceErrorDashboardComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule
  ],
  exports: [
    ServiceErrorDashboardComponent
  ]
})
export class ServiceErrorDashboardModule { }
