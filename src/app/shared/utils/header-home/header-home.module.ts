import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderHomeComponent } from './header-home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationsModule } from '../notifications';

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
        RouterModule],
    declarations: [HeaderHomeComponent],
    exports: [HeaderHomeComponent]
})
export class HeaderHomeModule { }