import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Page } from '../../model/page';



@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html'
})
export class PagerComponent implements OnInit {


  @Input() pageModel : Page<any>;
  @Input() variant:boolean = false;
  @Output() paged = new EventEmitter<number>();
  
  ngOnInit() {
    //this.pageModel.prepare();
  }
  
  page( pagina : number ){
    this.paged.emit(pagina);
  }
  
}
