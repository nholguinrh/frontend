import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeModule } from '../components/home/home.module';
import { ServiceErrorDialogComponent } from './components/service-error-dialog/service-error-dialog.component';
import { SafePipe } from './pipe/safe.pipe';
import { ServiceErrorDashboardComponent } from './utils/service-error-dashboard';

@NgModule({
  declarations: [ServiceErrorDialogComponent, SafePipe],
  imports: [
    CommonModule,
    HomeModule,
    MatDialogModule,
    FlexLayoutModule,
    MatBadgeModule,
  ],
  exports: [SafePipe],
})
export class SharedModule {}
