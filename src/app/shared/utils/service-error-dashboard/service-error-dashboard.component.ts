import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-service-error-dashboard',
  templateUrl: './service-error-dashboard.component.html',
  styleUrls: ['./service-error-dashboard.component.css']
})
export class ServiceErrorDashboardComponent implements OnInit {

  @Input() full: boolean = false;
  @Input() width: any = 'auto';
  @Input() height: any = 'auto';
  @Input() themeDark: boolean = true;
  @Input() typeError: number = 1;
  dark: number = 0;


  constructor() { }

  ngOnInit(): void {
    if(this.themeDark != false){
      let mode = localStorage.getItem('darkTheme');
      if (mode != null) {
        this.dark = mode === '1' ? 1 : 0;
      }
    }
    console.log(this.full)
  }

}
