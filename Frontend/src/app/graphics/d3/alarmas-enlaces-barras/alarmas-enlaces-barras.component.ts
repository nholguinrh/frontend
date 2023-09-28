import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
@Component({
  selector: 'smc-alarmas-enlaces-barras',
  templateUrl: './alarmas-enlaces-barras.component.html',
  styles: [
  ]
})
export class AlarmasEnlacesBarrasComponent implements OnInit {
  @Input() full: boolean = false;
  errorCarga: number = 0;
  _dispositivo: string = '';
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  requireUpdate: Subscription;
  data = [
    { title: 'Sitios inalcanzables',  bar: {value: 1, max: 10,  color: '#ced9f6', titulo: ''}},
  ]
  dataTotal =  { title: 'Total de alarmas',  value: 0};
  
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  isDarkTheme: Observable<boolean>;
  fechaInicio:string = (moment().set({ 'second': 0, 'millisecond': 0}).subtract(4, 'minute').format()).substring(0,19);
   requireUpdateRange: Subscription;
   time: string = 'M';
   spinnerLoading: boolean = true;
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private reloadDataService: ReloadDataService,
    private auth: AdministratorService,
    private changeGraphService:ChangeGraphService,
    private dashboardService: DashboardService,
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
    if(this._dispositivo == 'Sitio'){
      this.data[0].title = 'Sitio inalcanzables';
      this.data[1].title = 'Sitio sin gestión';
    }
    if(this._dispositivo == 'Servicio'){
      this.data[0].title = 'Servicio inalcanzables';
      this.data[1].title = 'Servicio sin gestión';
    }
    this.data.forEach(element => {
      this.dataTotal.value = this.dataTotal.value + element.bar.value  
            
    });
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
          //Esto no se que es     
                      
          this.data = data.values;     
          this.dataTotal.value=data.totalAlarmas;      

          this.dataTotal.value = 0
          data.values.forEach(element => {
            this.dataTotal.value = this.dataTotal.value + element.value;
          });
        }else{
          this.data = [];     
          this.dataTotal.value = 0
          this.errorCarga = 0; 
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Alarmas Barras: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1
        this.spinnerLoading = false;
      }
    });

  }


  getData(){
    this.data = [
      { title: 'Sitios inalcanzables',  bar: {value:1 , max: 10,  color: '#ced9f6', titulo: ''}},
      { title: 'Sitios sin gestión',  bar: {value: 0 , max: 10, color: '#ced9f6', titulo: ''}},
      { title: 'Incremento de memoria',  bar: {value: 1 , max: 10, color: '#ced9f6', titulo: ''}},
      { title: 'Incremento de voltaje',  bar: {value: 2 , max: 10, color: '#ced9f6', titulo: ''}},
    ]
    if(this._dispositivo == 'Sitio'){
      this.data[0].title = 'Sitio inalcanzables';
      this.data[1].title = 'Sitio sin gestión';
    }
    if(this._dispositivo == 'Servicio'){
      this.data[0].title = 'Servicio inalcanzables';
      this.data[1].title = 'Servicio sin gestión';
    }

  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }
}
