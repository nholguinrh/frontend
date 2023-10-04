import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-error',
  templateUrl: './filter-error.component.html',
  styleUrls: ['./filter-error.component.css']
})
export class FilterErrorComponent implements OnInit{

  @Output() clickReturn = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }

  returnPage() {
    this.clickReturn.emit();
  }

}
