import { Component, Input, OnInit } from '@angular/core';
import { Step } from '../../model/stteper.model';

@Component({
  selector: 'smc-stteper',
  templateUrl: './stteper.component.html',
  styleUrls: ['./stteper.component.css']
})
export class StteperComponent implements OnInit {

  @Input() initial: Step;
  @Input() steps: Step[];
  @Input() final: Step;

  constructor() { }

  ngOnInit(): void {
    
  }

}
