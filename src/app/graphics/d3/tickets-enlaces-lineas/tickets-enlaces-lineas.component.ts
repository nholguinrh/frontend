import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { MarginConf } from '../../../shared/model/margin-conf';
import { ReloadDataService } from '../../../shared/services/reload-data.service';
import * as moment from 'moment';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { CustomDatepickerComponent } from 'src/app/shared/utils/custom-datepicker';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-tickets-enlaces-lineas',
  templateUrl: './tickets-enlaces-lineas.component.html',
})
export class TicketsEnlacesLineasComponent implements OnInit, OnDestroy {

  @ViewChild(CustomDatepickerComponent) dateControl;

  @Input() isFull: boolean = false;
  errorCarga: number = 0;
  _dispositivo: string = '';
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  get dispositivo() {
    return this._dispositivo;
  }

  margin: MarginConf = {
    top: 10,
    right: 0,
    bottom: 20,
    left: 30,
  };
  marginFull: MarginConf = {
    top: 10,
    right: 100,
    bottom: 20,
    left: 40,
  };
  margin2: MarginConf = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  data = [
    {
      title: 'Pendientes por cliente',
      bar: {
        value: 50,
        max: 100,
        color: '#6DB2FF',
        titulo: '',
        textcolor: '#000000',
        textcolordark: '#7B8AA0',
        textx: 40,
        texty: 10,
        v1: 1,
        v2: 2
      },
    },
    {
      title: 'Cerrados',
      bar: {
        value: 66,
        max: 100,
        color: '#51459E',
        titulo: '',
        textcolor: '#FFFFFF',
        textcolordark: '#3B4559',
        textx: 10,
        texty: 10,
        v1: 8,
        v2: 12
      },
    },
  ];

  datatickets = [];
  
  dataEstatus: any[] = [
    {
      estatus: 'En curso',
      valor: 0,
      color: '#FDA700',
    },{
      estatus: 'Pendientes',
      valor: 0,
      color: '#F95A36',
    },{
      estatus: 'Resueltos',
      valor: 0,
      color: '#1A7F1C',
    },{
      estatus: 'Totales',
      valor: 0,
      color: '#285CED',
    }
  ]

  requireUpdate: Subscription;

  isDarkTheme: Observable<boolean>;

/*   today: string = moment().format('YYYY/MM/DD');
  monthAgo: string = moment().subtract(1, 'M').format('YYYY/MM/DD'); */
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  idEmpresa: string;
  enCurso:string;
  resueltos:string;
  spinnerLoading: boolean = true;
  constructor(
    private themeService: ThemeService,
    public spinner: NgxSpinnerService,
    private reloadDataService: ReloadDataService,
    private alertService: AlertService,
    public dashboardService: DashboardService,
    private auth: AdministratorService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.obtenerTickets();
        }
      },
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.idEmpresa = String(this.auth.getidClienteTotalplay());

    if (this.isFull) {
      this.margin = {
        bottom: 50,
        left: 60,
        right: 200,
        top: 30,
      };
    }

    //this.obtenerPromedios();
    this.obtenerTickets();
    console.log(this.isDarkTheme ? 'verdadero' : 'falso')
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  public get width() {
    return window.innerWidth;
  }

  public get height() {
    return window.innerHeight;
  }


  obtenerPromedios() {
    // this.spinner.show();
    let request = {
      fechaFin: 'string',
      fechaInicio: 'string',
      idEmpresa: 'string',
      limite: 'string',
      tipoDispositivo: 'string',
      numeroTicket: 'string',
      idDispositivo: 'string',
      precision: {
        unidad: 'string',
        valor: 0,
      },
      full: true,
    };
    this.dashboardService.monitoreoEnlacesPromedio(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        
      },
      error: (_) => {
        this.spinner.hide();
      },
    });
  }

  obtenerTickets(){

    /* let request = {
      "fechaInicio": this.monthAgo,
      "fechaFin": this.today,
      "idEmpresa": this.idEmpresa,
      "funcionalidad": "TicketsIncidentesPorSitiosGeneral",
      "full": true
    }; */
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
        if(response.ticketline != null){
          this.errorCarga = 0;
          this.enCurso = response.ticketline.enCurso;
          this.resueltos = response.ticketline.resueltos;
          this.data = response.ticketline.values;
          this.datatickets = response.ticketline.lineas;
          this.datatickets.forEach(ticket => {
            ticket.date = new Date(ticket.date);
          });

          this.dataEstatus[0].valor = response.ticketline.enCurso
          this.dataEstatus[1].valor = response.ticketline.pendientes
          this.dataEstatus[2].valor = response.ticketline.resueltos
          this.dataEstatus[3].valor = response.ticketline.totales

        }else{
          this.errorCarga = 0;
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion TicketsLinea: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (error) => { 
        console.log('Error ', error);
        this.errorCarga = 1;
        this.spinnerLoading = false;
        this.spinner.hide();
      }
    });

  }

  /*
  update(){
    let today = new Date(this.dateControl.dateControl.value._d)
    let dia = new Date(today.getFullYear(), today.getMonth(), 1)
    let ultimoDia;
    if(new Date().getMonth() ==  today.getMonth() && new Date().getFullYear() ==  today.getFullYear()){
      ultimoDia = new Date()
    }else{
      ultimoDia = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    }
    this.dayAgo = moment(dia).set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
    this.today = moment(ultimoDia).set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
    console.log(this.dayAgo)
    console.log(this.today)
  }
  */
}
