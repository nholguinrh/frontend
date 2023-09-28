import { Component } from '@angular/core';
import { TokenService } from './shared/services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private tokenService: TokenService) {
    this.tokenService.getNewToken().subscribe();
  }
}
