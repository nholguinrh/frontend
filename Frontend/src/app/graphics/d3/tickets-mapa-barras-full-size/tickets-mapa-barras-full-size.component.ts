import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from '../../../shared/model/date-value';
import { MarginConf } from '../../../shared/model/margin-conf';
import { ReloadDataService } from '../../../shared/services/reload-data.service';
import { ThemeService } from '../../../shared/services/theme.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-tickets-mapa-barras-full-size',
  templateUrl: './tickets-mapa-barras-full-size.component.html',
})
export class TicketsMapaBarrasFullSizeComponent implements OnInit, OnDestroy {
  isDarkTheme: Observable<boolean>;
  options: any[];
  errorCarga: number = 0;

  margin: MarginConf = {
    top: 10,
    right: -2,
    bottom: 50,
    left: 80,
  };

  datesValue: Array<DateValue>;

  @Input() idOptionSelected: number; //TODO: Definir el método de entrada de la opción seleccionada
  optionSelected: any; // TODO: Definir interface para options en caso de que se pueda reusar

  @Input() tamano: number;
  @Input() sizeX: number = 1440;
  @Input() promedios: boolean = false;

  chartColor: string = 'none';

  unit: string = '';

  public get width() {
    return window.innerWidth;
  }

  requireUpdate: Subscription;

  fullType: string = '';
  //today: string = moment().format('YYYY/MM/DD');
  monthAgo: string = moment().subtract(1, 'M').format('YYYY/MM/DD');
  idEmpresa: string;

  consultaTickets: any = [];
  seleccionTickets: any = [{}];
  dataValue: any = [];
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  spinnerLoading: boolean = true;
  constructor(
    private themeService: ThemeService,
    public dashboardService: DashboardService,
    public spinner: NgxSpinnerService,
    private reloadDataService: ReloadDataService,
    private auth: AdministratorService) {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.options = [
      {
        id: 1,
        name: 'En curso',
        value: 60,
        ico: 'image-option-curso',
        color: '#FDA700',
        selected: false,
        selectedColor: '#FDA70033',
      },
      {
        id: 2,
        name: 'Pendientes',
        value: 2,
        ico: 'image-option-pendientes',
        color: '#F95A36',
        selected: false,
        selectedColor: '#F95A3633',
      },
      {
        id: 3,
        name: 'Resueltos',
        value: 33,
        ico: 'image-option-resueltos',
        color: '#1A7F1C',
        selected: false,
        selectedColor: '#1A7F1C33',
      },
      {
        id: 4,
        name: 'Total',
        value: 103,
        ico: 'image-option-total',
        color: '#285CED',
        selected: false,
        selectedColor: '#285CED33',
      },
    ];

    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.obtenerTickets();
        }
      },
    });
    this.fullType = localStorage.getItem('full-type');
    this.unit = this.getUnit();
  }

  ngOnInit(): void {
    this.idEmpresa = String(this.auth.getidClienteTotalplay());
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  private getUnit() {
    return this.fullType == 'RESOLUCION_INTERFACES' ? ' hrs' : '';
  }

  private getOptionSelected() {
    this.options.forEach(
      (opt) => (opt.selected = opt.id == this.idOptionSelected ? true : false)
    );

    return this.options.find((opt) => opt.selected);
  }

  public getIconBcolor(isDarkTheme: boolean, option: any) {
    return option.selected
      ? option.selectedColor
      : isDarkTheme
      ? '#161c33'
      : '#ffffff';
  }

  chageView(newSelection: number) {
    if (newSelection == this.idOptionSelected) {
      return;
    }
    this.idOptionSelected = newSelection;
    this.optionSelected = this.getOptionSelected();
    console.log(this.optionSelected)
    this.chartColor = this.optionSelected.color;

    this.obtenerTickets();
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
        if(response.options != null){
          this.errorCarga = 0; 
          this.options = response.options;
          this.options.forEach(opc => {
            opc.data.forEach( da =>{
              da.date = new Date(da.date);
            })
          })
          this.optionSelected = this.getOptionSelected();
          this.chartColor = this.optionSelected.color;
          
        }else{
          this.errorCarga = 0;
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion TicketsBarrasFullSize: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (error) => { 
        console.log('Error ', error);
        this.errorCarga = 1
        this.spinner.hide();
        this.spinnerLoading = false;
      }
    });
  }
}
