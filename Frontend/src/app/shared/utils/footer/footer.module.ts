import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule { }