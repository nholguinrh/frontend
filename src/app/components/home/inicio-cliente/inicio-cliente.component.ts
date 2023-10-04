import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { UserIdleService } from 'angular-user-idle';
import { Router } from '@angular/router';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';

@Component({
  selector: 'app-inicio-cliente',
  templateUrl: './inicio-cliente.component.html',
  styleUrls: ['./inicio-cliente.component.css']
})
export class InicioClienteComponent implements OnInit {

  isDarkTheme: Observable<boolean>;
  dark: boolean;
  requireUpdate: Subscription;
  constructor(
    private themeService: ThemeService,
    public router: Router,
    private administratorService: AdministratorService,
    private reloadDataService: ReloadDataService,
    private userIdle: UserIdleService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if(Number(localStorage.getItem('inactividad')) == 1){
            console.log("Reiniciar Contador")
            this.stopWatching();
            this.restart();
            this.startWatching();
          }else{
            console.log("Segir con la inactividad");
          }
        },
      });
     }

  ngOnInit(): void {
    

    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.dark = val
    );

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
    this.userIdle.onTimerStart().subscribe(() => {
    });


    this.userIdle.onTimeout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(["login"]);
      this.stop();
      this.stopWatching();
      this.restart();
    });

    let mode = localStorage.getItem('menu');
    if(mode != null){
      if(mode != '1'){
        setTimeout(() => {
          this.themeService.setDarkTheme(false);
          this.isDarkTheme.subscribe((val: boolean) => 
            this.dark = val
          );
        }, 200);
      }
    }
 
  }
  get opciones() {
    return this.userIdle.stopTimer();
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

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  startTime(){
    this.userIdle.onTimerStart()
  }

}
