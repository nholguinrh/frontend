import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderClienteComponent } from './header-cliente.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NotificationsModule } from '../notifications';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule, 
    MatToolbarModule, 
    MatMenuModule, 
    MatIconModule, 
    MatButtonModule,
    NotificationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    FormsModule,
    MatIconModule,
    RouterModule
  ],
  declarations: [HeaderClienteComponent],
  exports: [HeaderClienteComponent],
})
export class HeaderClienteModule {}
