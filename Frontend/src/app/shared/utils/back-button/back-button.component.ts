import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'smc-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.css']
})
export class BackButtonComponent implements OnInit {

  @Input() url: string;
  @Input() image: string;
  @Input() tittle: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToUrl(){
    this.router.navigateByUrl(this.url);
  }
}
