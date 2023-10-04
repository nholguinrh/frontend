import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { OptionButtonComponent } from './option-button.component';
import {MatBadgeModule} from '@angular/material/badge';

@NgModule({
    imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, MatBadgeModule],
    declarations: [OptionButtonComponent],
    exports: [OptionButtonComponent]
})
export class OptionButtonModule { }