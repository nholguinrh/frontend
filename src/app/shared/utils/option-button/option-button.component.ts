import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'smc-option-button',
  templateUrl: './option-button.component.html',
  styleUrls: ['./option-button.component.css']
})
export class OptionButtonComponent implements OnInit {

  @Input() selected: boolean;
  @Input() recomendado: boolean;
  @Input() index: number;
  @Input() tittle: string;
  @Input() class: string;
  @Output() seleccionado = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  click(){
    this.seleccionado.emit(this.index);
  }

}
