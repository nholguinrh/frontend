import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleToolbarComponent } from './simple-toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    imports: [CommonModule, MatToolbarModule],
    declarations: [SimpleToolbarComponent],
    exports: [SimpleToolbarComponent]
})
export class SimpleToolbarModule { }