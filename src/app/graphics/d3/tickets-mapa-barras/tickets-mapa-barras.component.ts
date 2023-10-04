import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-tickets-mapa-barras',
  templateUrl: './tickets-mapa-barras.component.html',
})
export class TicketsMapaBarrasComponent implements OnInit {
  isDarkTheme: Observable<boolean>;
  errorCarga: number = 0;
  isDark: boolean;
  options: any[];
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-01 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-02 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-03 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-04 06:12:58.911982'), value: 5 },
    { date: new Date('2022-10-05 06:12:58.911982'), value: 2 },
    { date: new Date('2022-10-06 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-07 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-08 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-09 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-10 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-11 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-12 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-13 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-14 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-15 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-16 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-17 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-18 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-19 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-20 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-21 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-22 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-23 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-24 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-25 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-26 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-27 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-28 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-29 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-30 06:12:58.911982'), value: 0 },
    { date: new Date('2022-10-31 06:12:58.911982'), value: 0 },
  ];
  margin: MarginConf = {
    top: 10,
    right: -2,
    bottom: 0,
    left: 30,
  };

  @Input() tamano: number;
  @Input() sizeX: number = 200;

  _dispositivo: string = '';
  spinnerLoading: boolean = true;
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
    this.changeOptions();
  }
  get dispositivo() {
    return this._dispositivo;
  }

  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  idEmpresa: string;
  requireUpdate: Subscription;
  isFirst : boolean = true;
  constructor(
    private themeService: ThemeService,
    public dashboardService: DashboardService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private reloadDataService: ReloadDataService,
    private auth: AdministratorService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response && !this.isFirst) {
          this.changeOptions();
        }
      },
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => (this.isDark = val));
    this.idEmpresa = String(this.auth.getidClienteTotalplay());
    //this.obtenerTickets();
  }

  public get width() {
    return window.innerWidth;
  }

  changeOptions() {
    this.obtenerTickets();
    /* if(this.dispositivo === 'Servicios'){
      this.options = [
        {
          id: 1,
          name: 'En curso',
          value: 1,
          ico: 'image-option-curso',
          color: '#FDA700',
          selected: false,
        },
        {
          id: 2,
          name: 'Pendientes',
          value: 1,
          ico: 'image-option-pendientes',
          color: '#F95A36',
          selected: false,
        },
        {
          id: 3,
          name: 'Resueltos',
          value: 5,
          ico: 'image-option-resueltos',
          color: '#1A7F1C',
          selected: false,
        },
        {
          id: 4,
          name: 'Total',
          value: 7,
          ico: 'image-option-total',
          color: '#285CED',
          selected: true,
        },
      ];
    }else{
      this.options = [
        {
          id: 1,
          name: 'En curso',
          value: 3,
          ico: 'image-option-curso',
          color: '#FDA700',
          selected: false,
        },
        {
          id: 2,
          name: 'Pendientes',
          value: 1,
          ico: 'image-option-pendientes',
          color: '#F95A36',
          selected: false,
        },
        {
          id: 3,
          name: 'Resueltos',
          value: 6,
          ico: 'image-option-resueltos',
          color: '#1A7F1C',
          selected: false,
        },
        {
          id: 4,
          name: 'Total',
          value: 10,
          ico: 'image-option-total',
          color: '#285CED',
          selected: true,
        },
      ];
    } */
  }

  obtenerTickets() {     

    /* let request = {
      fechaInicio: this.monthAgo,
      fechaFin: this.today,
      idEmpresa: this.idEmpresa,
      funcionalidad: 'TicketsIncidentesPorSitiosGeneral',
      full: true,
    }; */
    this.isFirst = true;
    this.spinnerLoading = true;
    let request = {
      
      "fechaInicio": Constantes.FECHA_INICIO_GLOBAL_TICKET,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay() ? this.auth.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "TicketsIncidentesMonitoreoGlobal",
      "full": true
    };

    this.dashboardService.monitoreoEnlaceTicketsIncidentes(request).subscribe({
      next: (response) => {
        var start = window.performance.now();
        this.spinner.hide();
        //if(response.areas != null || response.options != null || response.ticketline != null){
        if(response.options != null){
          this.errorCarga = 0;
          this.options = response.options;
          this.options?.forEach((opc) => {
            opc.data.forEach((da) => {
              da.date = new Date(da.date);
            });
            opc.name=opc.name.replace(/(^\w{1})/g, letra => letra.toUpperCase());
          });
        }else{
          this.errorCarga = 0;
        }
        this.spinnerLoading = false;
        this.isFirst = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion TicketsBarras: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (error) => {
        this.errorCarga = 1;
        this.spinnerLoading = false;
        this.isFirst = false;
        console.log('Error ', error);
        this.spinner.hide();
      },
    });
  }

  redirigir(name?: string) {
    console.log('Redirigir a incidentes');
    localStorage.setItem('menu', '2');
    localStorage.setItem('workspace', '1');
    localStorage.setItem('estatus-ticket', name);
    this.themeService.setDarkTheme(false);
    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.clienteWorspace + ')'
    );
  }
}
