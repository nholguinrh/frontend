import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';

@Component({
  selector: 'smc-alarmas-enlaces-burbujas',
  templateUrl: './alarmas-enlaces-burbujas.component.html',
  styles: [
  ]
})
export class AlarmasEnlacesBurbujasComponent implements OnInit {

  @Input() full: boolean = false;
  errorCarga: number = 0;
  isDarkTheme: Observable<boolean>;
  requireUpdate: Subscription;
  totalAlarmas: number ;
   public data : any = [  
   ]
   today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
   dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
   public indicadores : any = [];
   fechaInicio:string = (moment().set({ 'second': 0, 'millisecond': 0}).subtract(4, 'minute').format()).substring(0,19);
   requireUpdateRange: Subscription;
   time: string = 'M';
   spinnerLoading: boolean = true;
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private reloadDataService: ReloadDataService,
    private auth: AdministratorService,
    private dashboardService: DashboardService,
    private changeGraphService:ChangeGraphService,
    private overlayContainer: OverlayContainer) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response) {            
            this.getAlarmas();
          }
        },
      });
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val=> {
      if(val){
        this.overlayContainer.getContainerElement().classList.add('dark-theme');
      }else{
        this.overlayContainer.getContainerElement().classList.remove('dark-theme');
      }
    }));    
  }

  public get width() {
    return window.innerWidth;
  }


  getAlarmas(){
    // Se Crea el request
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": this.fechaInicio,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay() ? this.auth.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo":  Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": this.time,
      "ipNs": "",
      "funcionalidad": "AlarmasMonitoreoGlobal",
      "full": this.full
    };

    this.dashboardService.monitoreoEnlaceAlarmas(request).subscribe({
      next: (data) => {
        var start = window.performance.now();
        console.log('Respuesta Alarmas');
        console.log(data);

        if(data.data != null){
          this.errorCarga = 0;             
          //Datos de Burbujas                      
          this.data = data.burbujas; 
          console.log('DATA Burbuja: ',this.data); 
          this.indicadores = this.data;   
          //Numero en pantalla
          //this.totalAlarmas=data.totalAlarmas;      
          this.totalAlarmas = 0
          data.values.forEach(element => {
            this.totalAlarmas = this.totalAlarmas + element.value;
          });
          
          console.log('Total desde Componente padre: '+this.totalAlarmas);
        }else{
          this.data =[];     
          this.totalAlarmas = 0
          this.errorCarga = 0; 
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Alarmas Burbuja: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1
        this.spinnerLoading = false;
      }
    });

  }   

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

}
