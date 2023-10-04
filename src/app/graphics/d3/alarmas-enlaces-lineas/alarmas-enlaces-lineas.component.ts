import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';


@Component({
  selector: 'smc-alarmas-enlaces-lineas',
  templateUrl: './alarmas-enlaces-lineas.component.html',
  styles: [
  ]
})
export class AlarmasEnlacesLineasComponent implements OnInit {

  @Input() full: boolean = false;
  _dispositivo: string = '';
  errorCarga: number = 0;
  valueInalcanzables: any;
  valueCPU: any;
  valueGestion: any;
  valueMemoria: any;
  spinnerLoading: boolean = true;
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
    this.changeDispositivo();
  }
  get dispositivo() {
    return this._dispositivo;
  }

  rendimiento: any;
  incremento: any;
  gestion: any;
  TotalAlarmas: number;
  EsteMes: string;
  MesAnterior: string;

  datatickets: any = [
    { date: new Date('2022-10-01 06:12:58.911982'), media: "Curso", value: Number(10) },
    { date: new Date('2022-10-09 06:12:58.911982'), media: "Curso", value: Number(30) },
    { date: new Date('2022-10-03 06:12:58.911982'), media: "Resuelto", value: Number(25) },
    { date: new Date('2022-10-02 06:12:58.911982'), media: "Resuelto", value: Number(50) },    
  ];
  margin?: MarginConf = {
    top: 20,
    right: 0,
    bottom: 10,
    left: 20,
  };

  requireUpdate: Subscription;
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dias =  Number(this.today.substring(0,9));
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  isDarkTheme: Observable<boolean>;
  isDark: boolean;
  typeDispositivo:string;
  fechaInicio:string = (moment().set({ 'second': 0, 'millisecond': 0}).subtract(4, 'minute').format()).substring(0,19);
  requireUpdateRange: Subscription;
  time: string = 'M';
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private reloadDataService: ReloadDataService,
    private auth: AdministratorService,
    private dashboardService: DashboardService,
    private router: Router,
    private overlayContainer: OverlayContainer,
    private changeGraphService:ChangeGraphService,
    ) {
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

    this.typeDispositivo = Number(localStorage.getItem('type-service')) == 3 ? 'Sitios' : 'Servicios';

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
        
        if(data != null){
          this.errorCarga = 0;             
          
          console.log("Alarmas: ",this.datatickets);
          //Numero en pantalla
          this.TotalAlarmas = data.totalAlarmas;
          /* data.values.forEach(element => {
            this.TotalAlarmas = this.TotalAlarmas + element.value;
          }); */

          //Descripciones
          this.EsteMes=data.description1;
          this.MesAnterior=data.description2;                    

          console.log(this.full);
          /* if(this.full){     
            //Tarjetas de Incremento
            this.incremento=data.values.filter(item=> item.title.includes('Incremento'));
            //Tarjetas de rendimiento
            this.rendimiento=data.values.filter(item=> item.title.includes('inalcanzables')); 
            //Tarjetas de gestion
            this.gestion =data.values.filter(item=> item.title.includes('gestion')); 
          }else{
            //Tarjetas de Incremento
            this.incremento=data.values.filter(item=> item.title.includes('Incremento'));
            //Tarjetas de rendimiento
            this.rendimiento=data.values.filter(item=> item.title.includes(Number(localStorage.getItem('type-service')) == 3 ? 'Sitios' : 'Servicios')); 
          } */ 
          this.valueInalcanzables= data.inalcanzables;
          this.valueCPU= data.incrementoVoltaje;
          this.valueGestion= data.sinGestion;
          this.valueMemoria= data.incrementoMemoria;                                     
        }else{
          this.datatickets=[];
          this.TotalAlarmas = 0;
          this.errorCarga = 0; 
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Alarmas Cards: ${((end - start)/1000).toFixed(5)} segundos`);
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

  changeDispositivo(){
    if(this.dispositivo == 'Sitio'){
      this.dispositivo = 'Sitios'
    }
    if(this.dispositivo == 'Servicio'){
      this.dispositivo = 'Servicios'
    }             
  }  

  redirigir() {
    console.log('Redirigir a dispositivos');
    localStorage.setItem('menu', '1');
    localStorage.setItem('workspace', '0');
    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.clienteWorspace + ')'
    );
  }
}
