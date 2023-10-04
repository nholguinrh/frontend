import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { ReloadDataService } from '../../../shared/services/reload-data.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-tickets-incidentes-area',
  templateUrl: './tickets-incidentes-area.component.html',
  styles: [],
})
export class TicketsIncidentesAreaComponent implements OnInit {
  errorCarga: number = 0;
  @Input() isFull: boolean = false;
  isDarkTheme: Observable<boolean>;
  isDark: boolean;

  options: any[];
  selected: number;
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-10 00:00:00.000000'), value: 51 },
    { date: new Date('2022-10-11 00:00:00.000000'), value: 49 },
    { date: new Date('2022-10-12 00:00:00.000000'), value: 21 },
    { date: new Date('2022-10-13 00:00:00.000000'), value: 35 },
    { date: new Date('2022-10-14 00:00:00.000000'), value: 42 },
    { date: new Date('2022-10-15 00:00:00.000000'), value: 32 },
    { date: new Date('2022-10-16 00:00:00.000000'), value: 52 },
  ];
  margin: MarginConf = {
    top: 30,
    right: 0,
    bottom: 0,
    left: 0,
  };

  color: string = '#fca404';
  gradientStart: string = '#fee8bb';
  gradientStop: string = 'rgba(253, 167, 0, 0.1)';
  @Input() sizeY: number;
  @Input() sizeX: number;
  @Input() sizeXLarge: number;
  _dispositivo: string = '';
  optionSelected: any; //Definir variables
  chartColor: string = 'none';
  tooltipColor: string = 'none';  

  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  get dispositivo() {
    return this._dispositivo;
  }

  requireUpdate: Subscription;

  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  idEmpresa: string;
  titleOption: string = 'Total';
  dataValue: number = 0;
  spinnerLoading: boolean = true;
  constructor(private themeService: ThemeService,
    public dashboardService: DashboardService,
    public spinner: NgxSpinnerService,
    private reloadDataService: ReloadDataService,
    private router: Router,
    private auth: AdministratorService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response) {
            this.obtenerTickets();
          }
        },
      });
    }

  ngOnInit(): void {
    if (this.isFull) {
      this.margin = {
        top: 70,
        right: 30,
        bottom: 0,
        left: 30,
      };
    }
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.isDark = val
    );
    this.idEmpresa = String(this.auth.getidClienteTotalplay());
    this.selected = 5;
  }

  private getOptionSelected() {
    this.options.forEach(
      (opt) => (opt.selected = opt.id == this.selected ? true : false)
    );

    return this.options.find((opt) => opt.selected);
  }


  public get width() {
    return window.innerWidth;
  }

  public selectOption(id: number) {
    this.options.forEach((element) => {
      element.selected = false;
      if (element.id == id) {
        this.selected = id;
        element.selected = true;
        switch (this.selected) {
          case 1: this.titleOption = 'Pendiente'; this.dataValue = this.options[1]?.value; break;
          case 2: this.titleOption = 'En curso'; this.dataValue = this.options[0]?.value; break;
          case 3: this.titleOption = 'Resulto'; this.dataValue = this.options[2]?.value; break;
          case 5: this.titleOption = 'Total'; this.dataValue = this.options[3]?.value; break;
          default:
            break;
        }
         /* case 4: this.estatusTickets = "Todos los tickets"; this.estatusTicketShow = 'todos'; this.ticketsStatusList = this.ticketEstatus[0].dataNoAgrupados; break;
          case 2: this.estatusTickets = "Tickets en curso"; this.estatusTicketShow = 'en curso'; this.ticketsStatusList = this.ticketEstatus[0].dataNoAgrupados.filter(word => word.estatus == 'en curso'); break;
          case 1: this.estatusTickets = "Tickets pendientes"; this.estatusTicketShow = 'pendiente'; this.ticketsStatusList = this.ticketEstatus[0].dataNoAgrupados.filter(word => word.estatus == 'pendiente'); break;
          case 3: this.estatusTickets = "Tickets resueltos"; this.estatusTicketShow = 'resuelto'; this.ticketsStatusList = this.ticketEstatus[0].dataNoAgrupados.filter(word => word.estatus == 'resuelto'); break; */
      }
    });

    this.datesValue = [
      { date: new Date('2022-10-10 00:00:00.000000'), value: 51 },
      { date: new Date('2022-10-11 00:00:00.000000'), value: 49 },
      { date: new Date('2022-10-12 00:00:00.000000'), value: 21 },
      { date: new Date('2022-10-13 00:00:00.000000'), value: 35 },
      { date: new Date('2022-10-14 00:00:00.000000'), value: 42 },
      { date: new Date('2022-10-15 00:00:00.000000'), value: 32 },
      { date: new Date('2022-10-16 00:00:00.000000'), value: 52 },
    ];
  }
  
  chageView(newSelection: number) {
    if (newSelection == this.selected) {
      return;
    }
    this.selected = newSelection;
    this.optionSelected = this.getOptionSelected();
    console.log(this.optionSelected)
    this.chartColor = this.optionSelected.color;
    switch (this.selected) {
      case 1: this.tooltipColor = 'rgba(253, 167, 0, 0.2)'; break;
      case 2: this.tooltipColor = 'rgba(253,141,141, 0.6)'; break;
      case 3: this.tooltipColor = 'rgba(209,229,210, 0.6)'; break;
      case 5: this.tooltipColor = 'rgba(151,175,243, 0.2)'; break;
    }
    //this.getData();
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
        if(response.areas != null){
          this.errorCarga = 0; 
          this.options = response.areas;
          this.options.forEach(opc => {
            opc.data.forEach( da =>{
              da.date = new Date(da.date);
            })
          })
          //this.dataValue = this.options[4]?.value;
          this.optionSelected = this.getOptionSelected();
          this.chartColor = this.optionSelected.color;
          this.tooltipColor = 'rgba(151,175,243, 0.2)';
        }else{
          this.errorCarga = 0;
        }    
        this.spinnerLoading = false;      
        var end = window.performance.now();
        console.log(`Tiempo execusion TicketsArea: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (error) => {
        this.spinner.hide();
        this.errorCarga = 1 
        this.spinnerLoading = false;
        console.log('Error ', error);
      }
    });
  }

  redirigir() {
    console.log('Redirigir a incidentes');
    localStorage.setItem('menu', '2');
    localStorage.setItem('workspace', '0');
    this.themeService.setDarkTheme(false);
    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.clienteWorspace + ')'
    );
  }
}

