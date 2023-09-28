import { Component, Input, OnInit } from '@angular/core';
import { Step } from '../../model/stteper.model';

@Component({
  selector: 'smc-stteper-admin',
  templateUrl: './stteper-admin.component.html',
  styleUrls: ['./stteper-admin.component.css']
})
export class StteperAdminComponent implements OnInit {

  @Input() initial: Step;
  @Input() steps: Step[];
  @Input() final: Step;

  constructor() { }

  ngOnInit(): void {
    
  }

}
