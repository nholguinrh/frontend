import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-container',
  templateUrl: './cliente-container.component.html',
  styleUrls: ['./cliente-container.component.css']
})
export class ClienteContainerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
