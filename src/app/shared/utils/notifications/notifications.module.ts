import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { SharedModule } from '../../shared.module';
import { LinkyModule } from 'ngx-linky';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    LinkyModule,
  ],
  exports: [
    NotificationsComponent
  ]
})
export class NotificationsModule { }
