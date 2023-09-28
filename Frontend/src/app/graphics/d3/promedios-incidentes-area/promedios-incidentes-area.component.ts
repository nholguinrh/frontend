import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';

import { InfoPromedioMetricas, Metrica } from '../../../shared/interfaces/info-promedio-metricas';
import { PromedioMetricasRequest } from '../../../shared/interfaces/promedio-metricas-request';
import { MarginConf } from '../../../shared/model/margin-conf';
import { AdministratorService } from '../../../shared/services/administrator.service';
import { DashboardService } from '../../../shared/services/dashboards.service';
import { ReloadDataService } from '../../../shared/services/reload-data.service';
import { ThemeService } from '../../../shared/services/theme.service';
import * as moment from 'moment';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { DateValue } from 'src/app/shared/model/date-value';
@Component({
  selector: 'smc-promedios-incidentes-area',
  templateUrl: './promedios-incidentes-area.component.html',
  styles: [`
           
      ::ng-deep .select-monitoreo-voz .mat-date-range-input-inner {
        top: 12px !important;
      }

      ::ng-deep .select-monitoreo-voz .mat-date-range-input-start-wrapper {
        position: static !important;
      }

      ::ng-deep .select-monitoreo-voz .mat-date-range-input-inner{
        font-size: 12px !important;
        margin-top: 8px !important;
      }

      ::ng-deep .select-monitoreo-voz .mat-date-range-input-separator{
        margin-top: 6px !important;
      }
      ::ng-deep .select-monitoreo-voz .mat-form-field-appearance-outline .mat-form-field-infix {
        margin-top: -18px!important;
        font-size: 12px!important;
        font-weight: 600!important;
      }

      ::ng-deep .select-monitoreo-voz .mat-select-arrow {
        border: 0;
      }

      ::ng-deep .select-monitoreo-voz .mat-form-field-prefix {
        top: 0.75em !important;
      }

      ::ng-deep .filtros-afectaciones-full-dark .mat-form-field-appearance-outline .mat-form-field-outline {
        background: #F8FDFF;
        opacity: 0.05;
        border-radius: 7px;
        color: #D0D0CE !important
      }

      ::ng-deep .filtros-afectaciones-full-dark .mat-form-field-appearance-outline.mat-focused .mat-form-field-outline-thick,
      ::ng-deep .filtros-afectaciones-full-dark .mat-form-field-flex:hover .mat-form-field-outline-thick {
        opacity: 0.1 !important;
      }

      ::ng-deep .mat-select-panel:has(.dark-theme){
        background: #22273d;
      }


      ::ng-deep .mat-select-panel:has(.dark-theme) .mat-option.mat-selected:not(.mat-option-multiple) {
          background: rgba(255, 255, 255, 0.12);
      }
      ::ng-deep  .mat-primary:has(.dark-theme) .mat-option.mat-selected:not(.mat-option-disabled) {
          color: #7b8aa0;
      }

      ::ng-deep .mat-select-panel:has(.dark-theme) .mat-option{
        color: #D0D0CE;
      }

      ::ng-deep .mat-menu-panel:has(.dark-theme),
      ::ng-deep .mat-menu-panel:has(.dark-theme) {
        background: #22273d;
      }

      ::ng-deep .select-monitoreo-voz .mat-form-field-label-wrapper {
        position: initial !important;
      }

      .img-calendar{
        background-image: url("src/assets/img/calendar-voz.svg");
        background-size: 15px 15px;
        background-position: center;
        background-repeat: no-repeat;
      }
    `,
    ],
})
export class PromediosIncidentesAreaComponent implements OnInit, OnDestroy {
  errorCarga: number = 0;
  margin: MarginConf = {
    top: 40,
    right: 10,
    bottom: 0,
    left: 40,
  };
  isDarkTheme: Observable<boolean>;
  @Input() viewGraph: number;
  scale: 'week' | 'day' | 'hour' | 'minute' = 'minute';
  requireUpdate: Subscription;
  range: any[] = [0, 100];
  rangeDianmic = true;
  infoPromedioMetricas: any;
  spinnerLoading: boolean = true;

  listaMetricas = [
    {
      id: 'CONSUMO',
      titulo: 'CONSUMO',
    },
    {
      id: 'ALCANZABILIDAD',
      titulo: 'ALCANZABILIDAD',
    },
    {
      id: 'DISPONIBILIDAD',
      titulo: 'DISPONIBILIDAD',
    },
    {
      id: 'PÉRDIDA DE PAQUETES',
      titulo: 'PÉRDIDA DE PAQUETES',
    },
  ];

  metricaSeleccionada: string;
  dataGrafica:any;
  loading: boolean = true;
  metricas: Metrica[];
  public form: FormGroup;
  sla = 90;
  today: string = moment().format();
  dayAgo: string = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
  tiempoSeleccionada: number = 1;
  textoSeleccionado: string = "Última hora";
  idDashboard: number;
  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 0 },
  ];
  dateValue: any = this.dateValueWeek;
  unit: string = '%';
  constructor(
    private themeService: ThemeService,
    private reloadDataService: ReloadDataService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private administratorService: AdministratorService,
    private changeGraphService:ChangeGraphService,
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.obtenerDatosMetricas(this.scale)
        }
      },
    }); 
    /* this.requireUpdate = this.reloadDataService.requireUpdate
      .pipe(
        filter((resp) => Boolean(resp)),
        switchMap(() => { 
          const requestPromedioMetricas: PromedioMetricasRequest = {
            fechaInicio: Constantes.FECHA_INICIO_MAPA_METRICAS_12,
            fechaFin: moment().format(),
            idEmpresa: this.administratorService.getidClienteTotalplay() || 0,
            idServicio: 'string',
            idDispositivo: '',
            tipoDispositivo: Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
            //tipoDispositivo: 'p',
            folioTicket: 'string',
            folioTicketExterno: 'string',
            metrica: '',
            ipNs: 'string',
            tiempo: 'H',
            funcionalidad: 'PromedioMetricasMonitoreoEjecutivo',
            full: false
          };
          return this.dashboardService.monitoreoEjecutivoPromedioMetricas(
            requestPromedioMetricas
          );
        })
      )
      .subscribe({
        next: (resp) => {
          if(resp.metricas){
            this.infoPromedioMetricas = resp;
            this.consultaMetricaCliente();
            this.loading = false;
            this.errorCarga = 0
          }
        },
        error: (_) => (this.errorCarga = 1),
      }); */
  }

  ngOnInit(): void {
    this.idDashboard = Number(localStorage.getItem('dashboard'))
    this.form = this.formBuilder.group({
      metrica: [null],
      tiempo: [null]
    });
    this.form.get('tiempo').setValue('Última hora');
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  /* get getData() {
    return this.infoPromedioMetricas.metricas.find(
      (met) =>
        met.metrica.toLowerCase() ==
          this.metricaSeleccionada.value.toLowerCase() ||
        met.metrica == 'Disponibilidad'
    );
  } */

  public get width() {
    return window.innerWidth;
  }

  consultaMetricaCliente(){
    this.dashboardService.obtenerMetricasCliente(this.administratorService.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        console.log('Metricas cliente: ', data);
        if (httpStatus === 200) {
          this.metricas = data;
          let aux : Metrica[] = [];
          this.metricas.forEach( m => {
            if(m.metrica != 'Latencia'){
              aux.push(m);
            }
          })
          this.metricas = aux;
          this.form.get('metrica').setValue(2);
          this.metricaSeleccionada = 'Disponibilidad';
          this.seleccionarMetrica(this.metricaSeleccionada);
        }
      },
      error: (error) => { 
      }
    });
  }

  seleccionarMetrica(metricaSeleccionada){
    localStorage.setItem('metrica',metricaSeleccionada);
    this.dataGrafica = this.infoPromedioMetricas.metricas.find(
      (met) =>
        met.metrica.toLowerCase() ==
          metricaSeleccionada.toLowerCase()
    );
    if(!this.dataGrafica){
      this.errorCarga = 0
    }else{
      this.errorCarga = 0
      this.dataGrafica.barras.forEach(barra => {
        barra.date = new Date(barra.date);
      });
      
      console.log('this.metricaSeleccionada:',metricaSeleccionada)
      this.unit = metricaSeleccionada == 'Consumo' ? 'Mb' : '%';
      this.sla = this.dataGrafica.sla;
      if (this.scale == 'week') {
        this.obtenerPorSemana(this.dataGrafica);
      } else if (this.scale == 'day') {
        this.obtenerPorDia(this.dataGrafica);
      } else if (this.scale == 'minute') {
        this.obtenerPorMinuto(this.dataGrafica);
      } else {
        this.obtenerPorHora(this.dataGrafica);
      }
    }
    console.log("data",this.dataGrafica);
  }

  alertTiempo(tiempo,texto){
    this.tiempoSeleccionada = tiempo;
    this.textoSeleccionado = texto;
    switch (String(this.tiempoSeleccionada)) {
      case '1':
           this.changeScale('minute');
        break;
      case '12':
           this.changeScale('hour');
        break;
      case '24':
           this.changeScale('day');
        break;
      case '7':
           this.changeScale('week');
        break;
      }
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  }

  changeScale(t: 'week' | 'day' | 'hour' | 'minute') {
    this.scale = t;
      if (this.scale == 'week') {
        this.dayAgo = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS; */
        localStorage.setItem('scale','1');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'hour') {
        this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hours').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_12; */
        localStorage.setItem('scale','2');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'day') {
        this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(24, 'hours').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_24; */
        localStorage.setItem('scale','3');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'minute') {
        this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_1; */
        localStorage.setItem('scale','4');
        this.obtenerDatosMetricas(t);
      }
  }


  obtenerDatosMetricas(tiempo) {

    this.spinnerLoading = true;

    let request = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": tiempo == 'week' ? 'D' : tiempo == 'minute' ? 'M' : 'H',
      "ipNs": "",
      "funcionalidad": 'PromedioMetricasMonitoreoEjecutivo',
      "full": true
    };

    this.dashboardService.monitoreoEjecutivoPromedioMetricas(request).subscribe({
      next: (data) => {
        var start = window.performance.now(); 
        if (data != null) {
          this.infoPromedioMetricas = data;
            this.consultaMetricaCliente();
            this.loading = false;
        } 
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Metricas Monitoreo Ejecutivo: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        console.log('Respuesta:', _);
        this.errorCarga = 1;
        this.spinnerLoading = false;
      },
    });
  }

  obtenerPorSemana(data) {
    this.dateValue = [];
    if(!data.barras){
      this.dateValue = this.dateValueWeek.reverse();
    }else{
      this.dateValue = data.barras;
    }
    console.log('RespuestaPorSemana:', this.dateValue);
  }

  obtenerPorDia(data) {
    this.dateValue = [];
    if(!data.barras){
      this.dateValue = this.dateValueWeek.reverse();
    }else{
      this.dateValue = data.barras;
    }
    console.log('RespuestaPordia:', this.dateValue);
  }

  obtenerPorHora(data) {
    this.dateValue = [];
    if(!data.barras){
      this.dateValue = this.dateValueWeek.reverse();
    }else{
      this.dateValue = data.barras.reverse();
      this.dateValue = this.dateValue.slice(0,12);
      this.dateValue = this.dateValue.reverse();
    }
    console.log('RespuestaPorHora:', this.dateValue);
  }
  obtenerPorMinuto(data) {
    this.dateValue = [];
    if(!data.barras){
      this.dateValue = this.dateValueWeek.reverse();
    }else{
      this.dateValue = data.barras;
    }
    console.log('RespuestaPorMinuto:', this.dateValue);
  }
}
