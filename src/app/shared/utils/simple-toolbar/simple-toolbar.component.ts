import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'smc-simple-toolbar',
  templateUrl: './simple-toolbar.component.html',
  styleUrls: ['./simple-toolbar.component.css']
})
export class SimpleToolbarComponent implements OnInit {

  @Input() color: string = '#3B4559';
  @Input() logo: string = 'image-toolbar';
  constructor() { }

  ngOnInit(): void {
  }

}
