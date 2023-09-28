import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'smc-custom-select-rounded',
  templateUrl: './custom-select-rounded.component.html',
  styleUrls: ['./custom-select-rounded.component.css'],
})
export class CustomSelectRoundedComponent {
  @Input() placeholder: string = 'Selecciona una opción';
  @Output() newSelection: EventEmitter<any> = new EventEmitter<any>();
  isDarkTheme: Observable<boolean>;
  
  constructor(
    private themeService: ThemeService,
  ) {

  }
  ngOnInit(): void {
    let mode = localStorage.getItem('darkTheme');   
    this.themeService.setDarkTheme(mode === '1' ? true: false);    
    this.isDarkTheme = this.themeService.isDarkTheme;  
    }
  


  private _options: Array<any> = [];
  @Input() set options(newOptions: Array<any>) {
    this._options = newOptions;
  }
  get options() {
    return this._options;
  }

  private _selected: any;
  @Input() set selected(selected: any) {
    this._selected = selected;
  }
  get selected() {
    return this._selected;
  }

  valueChange(newSelection: any) {
    this.newSelection.emit(newSelection);
  }
}
