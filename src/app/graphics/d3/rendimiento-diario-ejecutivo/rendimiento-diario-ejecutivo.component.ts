import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-rendimiento-diario-ejecutivo',
  templateUrl: './rendimiento-diario-ejecutivo.component.html',
  styles: [
  ]
})
export class RendimientoDiarioEjecutivoComponent implements OnInit {

  errorCarga: number = 0;
  margin?: MarginConf = {
    top: 0,
    right: 3,
    bottom: 0,
    left: 15,
  };
  spinnerLoading: boolean = true;

  /* rendimiento: any = [
    {title: 'Disponibilidad', value: 99, type: '%', status: true, sla: true, slaVale: '98.5', enlaces: '1,512', min: 40, max: 90, datesValue: [
      { date: new Date('2022-10-01 06:12:58.911982'), value: 40 },
      { date: new Date('2022-10-02 06:12:58.911982'), value: 30 },
      { date: new Date('2022-10-03 06:12:58.911982'), value: 70 },
      { date: new Date('2022-10-04 06:12:58.911982'), value: 80 },
      { date: new Date('2022-10-05 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-06 06:12:58.911982'), value: 40 },
      { date: new Date('2022-10-07 06:12:58.911982'), value: 30 },
      { date: new Date('2022-10-08 06:12:58.911982'), value: 70 },
      { date: new Date('2022-10-09 06:12:58.911982'), value: 80 }
    ]},
    {title: 'Latencia', value: '150', type: 'mls', status: false, sla: true, slaVale: '160', enlaces: '3,231', min: 40, max: 90, datesValue: [
      { date: new Date('2022-10-01 06:12:58.911982'), value: 60 },
      { date: new Date('2022-10-02 06:12:58.911982'), value: 30 },
      { date: new Date('2022-10-03 06:12:58.911982'), value: 80 },
      { date: new Date('2022-10-04 06:12:58.911982'), value: 70 },
      { date: new Date('2022-10-05 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-06 06:12:58.911982'), value: 40 },
      { date: new Date('2022-10-07 06:12:58.911982'), value: 30 },
      { date: new Date('2022-10-08 06:12:58.911982'), value: 70 },
      { date: new Date('2022-10-09 06:12:58.911982'), value: 80 }
    ]},
    {title: 'Pérdida de paquetes', value: '01', type: '%', status: true, sla: true, slaVale: '02', enlaces: '142', min: 40, max: 90, datesValue: [
      { date: new Date('2022-10-01 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-02 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-03 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-04 06:12:58.911982'), value: 48 },
      { date: new Date('2022-10-05 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-06 06:12:58.911982'), value: 70 },
      { date: new Date('2022-10-07 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-08 06:12:58.911982'), value: 20 },
      { date: new Date('2022-10-09 06:12:58.911982'), value: 20 }
    ]},
    {title: 'Consumo', value: '80', type: '%', status: true, sla: false, slaVale: '160', enlaces: '1,512', min: 40, max: 90, datesValue: []}
  ] */
  rendimiento: any;

  isDarkTheme: Observable<boolean>;
  isDark: boolean;
  body = {
    "cliente":  {
      "idCliente" : 0
     },
    "dispositivos":  [
    ],
    "tipoDispositivos":  [
    ],
    "estatus":  [
    ],
    "metricas": [
    ],
    "tipoTicket":  [
     ],
     "sla": "",
     "funcionalidadMetrica": "MetricaMonitoreoGlobal",
     "funcionalidadTicket": "TicketsIncidentesPorSitioGeneral",
   };
   today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
   dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(30, 'days').format();
   requireUpdate: Subscription;

  constructor(
    private themeService: ThemeService,
    private dashboardService: DashboardService,
    public auth : AdministratorService,
    private router: Router,
    private reloadDataService: ReloadDataService,
    public spinner: NgxSpinnerService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response) {
            this.obtenerRendimiento();
          }
        },
      });
     }

  ngOnInit(): void {
    /* this.getRendimiento(); */
    /* this.obtenerRendimiento(); */
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.isDark = val
    );

    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      this.themeService.setDarkTheme(mode === '1' ? true: false);

      /* setTimeout(() => {
      }, 10); */
    }
  }

  public get width() {
    return window.innerWidth;
  }

  obtenerRendimiento(){
    // this.spinner.show();
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hours').format()).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": "",
      "funcionalidad": "RendimientoDiarioMonitoreoEjecutivo",
      "full": true
    };
    this.dashboardService.monitoreoEjecutioRendimiento(request).subscribe({
      next: (data) => {
        
        var start = window.performance.now(); 
        /*this.spinner.hide();
        data.data.map(register =>{
          register.datesValue.map(dates =>{
            dates.date = new Date(dates.date);
          });
        });*/
        this.rendimiento = [];
        this.spinner.hide();
        if(data.rendimiento != null){
          this.errorCarga = 0; 
          let datos = data.rendimiento.filter( red => red.title != 'alcanzabilidad');
          datos.forEach(element => {
            if(element.title !== 'consumo'){
              element.sla = true;
            }
            element.datesValue =  element.datesValue.reverse().slice(0,12);
            element.datesValue.forEach(ele => {
              ele.date = new Date(ele.date);
            });
          });
          this.rendimiento = datos;
          //this.getRendimiento();
        }else{
          this.errorCarga = 0;
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Rendimiento Diario Ejecutivo: ${((end - start)/1000).toFixed(5)} segundos`);
        
      },
      error: (_) => {
        this.spinner.hide();
        this.errorCarga = 1;
        this.spinnerLoading = false;
        //this.getRendimiento();
      }
    });
  }

  getRendimiento(){
    /*this.rendimiento = [
      {title: 'Disponibilidad', value: 0, type: '%', status: true, sla: true, slaVale: '0', enlaces: '0', min: 0, max: 0, datesValue: [
        { date: new Date('2022-10-01 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-02 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-03 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-04 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-05 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-06 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-07 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-08 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-09 06:12:58.911982'), value: 0 }
      ]},
      {title: 'Alcanzabilidad', value: '0', type: '%', status: false, sla: true, slaVale: '0', enlaces: '0', min: 0, max: 0, datesValue: [
        { date: new Date('2022-10-01 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-02 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-03 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-04 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-05 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-06 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-07 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-08 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-09 06:12:58.911982'), value: 0 }
      ]},
      {title: 'Pérdida de paquetes', value: '0', type: '%', status: true, sla: true, slaVale: '0', enlaces: '0', min: 0, max: 0, datesValue: [
        { date: new Date('2022-10-01 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-02 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-03 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-04 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-05 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-06 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-07 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-08 06:12:58.911982'), value: 0 },
        { date: new Date('2022-10-09 06:12:58.911982'), value: 0 }      
      ]},
      {title: 'Consumo', value: '0', type: '%', status: true, sla: false, slaVale: '0', enlaces: '0', min: 0, max: 0, datesValue: []
    }]*/
    this.rendimiento = [
      {title: 'Disponibilidad', value: 98, type: '%', status: true, sla: true, slaVale: '99', enlaces: '1', min: 40, max: 90, datesValue: [
        { date: new Date('2022-10-01 06:12:58.911982'), value: 40 },
        { date: new Date('2022-10-02 06:12:58.911982'), value: 30 },
        { date: new Date('2022-10-03 06:12:58.911982'), value: 70 },
        { date: new Date('2022-10-04 06:12:58.911982'), value: 80 },
        { date: new Date('2022-10-05 06:12:58.911982'), value: 20 },
        { date: new Date('2022-10-06 06:12:58.911982'), value: 40 },
        { date: new Date('2022-10-07 06:12:58.911982'), value: 30 },
        { date: new Date('2022-10-08 06:12:58.911982'), value: 70 },
        { date: new Date('2022-10-09 06:12:58.911982'), value: 80 },
        { date: new Date('2022-10-10 06:12:58.911982'), value: 67 },
        { date: new Date('2022-10-11 06:12:58.911982'), value: 70 },
        { date: new Date('2022-10-12 06:12:58.911982'), value: 71 },
      ]},
      {title: 'Alcanzabilidad', value: '93', type: '%', status: false, sla: true, slaVale: '99', enlaces: '1', min: 40, max: 90, datesValue: [
        {  date: new Date('2022-10-01 06:12:58.911982'), value: 60 },
        {  date: new Date('2022-10-02 06:12:58.911982'), value: 30 },
        {  date: new Date('2022-10-03 06:12:58.911982'), value: 80 },
        {  date: new Date('2022-10-04 06:12:58.911982'), value: 70 },
        {  date: new Date('2022-10-05 06:12:58.911982'), value: 20 },
        {  date: new Date('2022-10-06 06:12:58.911982'), value: 40 },
        {  date: new Date('2022-10-07 06:12:58.911982'), value: 30 },
        {  date: new Date('2022-10-08 06:12:58.911982'), value: 70 },
        {  date: new Date('2022-10-09 06:12:58.911982'), value: 80 },
        {  date: new Date('2022-10-10 06:12:58.911982'), value: 40 },
        {  date: new Date('2022-10-11 06:12:58.911982'), value: 45 },
        {  date: new Date('2022-10-12 06:12:58.911982'), value: 50 }
      ]},
      {title: 'Pérdida de paquetes', value: '19', type: '%', status: true, sla: true, slaVale: '99', enlaces: '1', min: 80, max: 20, datesValue: [
        {  date: new Date('2022-10-01 06:12:58.911982'), value: 50 },
        {  date: new Date('2022-10-02 06:12:58.911982'), value: 60 },
        {  date: new Date('2022-10-03 06:12:58.911982'), value: 40 },
        {  date: new Date('2022-10-04 06:12:58.911982'), value: 48 },
        {  date: new Date('2022-10-05 06:12:58.911982'), value: 70 },
        {  date: new Date('2022-10-06 06:12:58.911982'), value: 50 },
        {  date: new Date('2022-10-07 06:12:58.911982'), value: 40 },
        {  date: new Date('2022-10-08 06:12:58.911982'), value: 70 },
        {  date: new Date('2022-10-09 06:12:58.911982'), value: 80 },
        {  date: new Date('2022-10-10 06:12:58.911982'), value: 60 },
        {  date: new Date('2022-10-11 06:12:58.911982'), value: 40 },
        {  date: new Date('2022-10-12 06:12:58.911982'), value: 55 }
      ]},
      {title: 'Consumo', value: '95', type: '%', status: false, sla: false, slaVale: '160', enlaces: '1', min: 10, max: 90, datesValue: []}
    ] 
  }
  
  busquedaPersonalizada(busqueda?){
    this.body.metricas.push({'nombreMetrica': busqueda});
    localStorage.setItem('bodyPersonalizado', JSON.stringify(this.body));
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.busquedaPersonalizada+")");
  }

}
