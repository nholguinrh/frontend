import { Component, OnInit } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';
import { AdministratorService } from 'src/app/shared/services/administrator.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private userIdle: UserIdleService,
    private administratorService: AdministratorService,
    public router: Router) { }

  ngOnInit(): void {

    this.administratorService.configuracion(1).subscribe({
      next: (response) => {
        if(response?.valor){
          console.log("Datos de entrada:",response);
          let value = Number(response?.valor);
          this.userIdle.setConfigValues({idle: value, timeout: 1, ping: 0});
          this.userIdle.startWatching();
        }
      }
    });

    this.userIdle.onTimerStart().subscribe(() =>{
    });

    this.userIdle.onTimeout().subscribe(() => {
      console.log('ere');

      localStorage.clear();
      this.router.navigate(["login-administrator"]);
      this.stop();
      this.stopWatching();
      this.restart();
    });
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

}
