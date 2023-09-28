import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { Metrica } from 'src/app/shared/model/cliente.model';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';

@Component({
  selector: 'smc-servicios-enlaces-boxplot',
  templateUrl: './servicios-enlaces-boxplot.component.html',
  styles: [
    `
      ::ng-deep
        .smc-select-dashboard
        .mat-form-field-appearance-outline.mat-form-field-disabled,
      ::ng-deep .smc-select-dashboard .mat-form-field-outline {
        opacity: 0 !important;
      }

      ::ng-deep
        .smc-select-dashboard
        .mat-form-field-appearance-outline
        .mat-form-field-infix {
        margin-top: -8px;
      }

      ::ng-deep .smc-select-dashboard .mat-select-arrow {
        margin-top: 7px !important;
      }
      
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
export class ServiciosEnlacesBoxplotComponent implements OnInit {
  scale: 'week' | 'day' | 'hour' | 'minute'  = 'minute' ;
  isDarkTheme: Observable<boolean>;
  domainList: any[] = [
    //{ name: '1 hr', value: 'minute', width: '30px' },
    { name: '12 hrs', value: 'hour', width: '40px' },
    { name: '24 hrs', value: 'day', width: '55px' },
    { name: '1 Sem', value: 'week', width: '50px' },
  ];
  domainListVelas: any[] = [
    //{ name: '1 hr', value: 'minute', width: '30px' },
    { name: '6 hrs', value: 'hour', width: '40px' },
    { name: '24 hrs', value: 'day', width: '55px' },
    { name: '1 Sem', value: 'week', width: '50px' },
  ];
  unit: string = 'mls';
  metricas: any[];
  metricaSelected: any;
  public form: FormGroup;
  _dispositivo: string = '';
  funcionalidad: string = 'MetricasMonitoreoGlobal';
  slaPromedio: any;
  idDashboard: number;
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  get dispositivo() {
    return this._dispositivo;
  }
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = Constantes.FECHA_INICIO_GLOBAL_METRICAS;

  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 0 },
  ];

  dateValueDay: Array<DateValue> = [
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(8, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(9, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(10, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(11, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(13, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(14, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(15, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(16, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(17, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(18, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(19, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(20, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(21, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(22, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hour').format()), value: 0 },
  ];

  dateValueHour: Array<DateValue> = [
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(8, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(9, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(10, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(11, 'hour').format()), value: 0 },
    { date: new Date(moment().set({'hour': 23, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hour').format()), value: 0 },
  ];

  dateValue: any = this.dateValueWeek;

  marginEnlace: MarginConf = {
    top: 20,
    right: 10,
    bottom: 30,
    left: 50,
  };

  marginBarChart?: MarginConf = {
    top: 10,
    right: 10,
    bottom: 5,
    left: 35,
  };

  marginArea: MarginConf = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40,
  };

  _viewGraph;

  @Input() set viewGraph(val: number) {
    if (val == 7) {
      this._viewGraph = 8;
    } else if (val == 40) {
      this._viewGraph = 41;
    } else {
      this._viewGraph = val;
    }
  }

  get getGrafica() {
    return this._viewGraph;
  }

  @Input() full: boolean = false;
  public color = '#FFFFFF';
  @Input() colorFull: string = '#285CED';
  @Input() colorFullDark: string = '#EEF1F8';
  @Input() borderFull: boolean = true;
  @Input() tooltipColor: string = 'rgba(151,175,243, 0.2)';
  isDark: boolean;
  dataMetricas: any;
  errorCarga: number = 0;
  spinnerLoading: boolean = true;
  metricasVelas = [
    {
      idMetrica: 3,
      tbCatEstatus: {
        idCatEstatus: 10,
        descripcion: 'Activo',
        tipoEstatus: 'M',
        fechaCreacion: '2022-10-27T21:00:03',
      },
      metrica: 'Latencia',
      tipoMetrica: 'B',
      informacion: 'Metrica Basica de Latencia',
    },
    {
      idMetrica: 4,
      tbCatEstatus: {
        idCatEstatus: 10,
        descripcion: 'Activo',
        tipoEstatus: 'M',
        fechaCreacion: '2022-10-27T21:00:03',
      },
      metrica: 'Ocupación',
      tipoMetrica: 'B',
      informacion: 'Metrica Basica de Ancho de Banda',
    },
  ];

  requireUpdate: Subscription;
  porcentajePositivo: number;
  porcentajeNegativo:number;
  requireUpdateRange: Subscription;
  tiempoSeleccionada: number = 1;
  textoSeleccionado: string = "Última hora";
  isFirst:boolean = true;
  constructor(
    private themeService: ThemeService,
    public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private administratorService: AdministratorService,
    private changeGraphService:ChangeGraphService,
    private reloadDataService: ReloadDataService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response && !this.isFirst) {
          console.log("Refrescando Metricas ::::")
          this.changeMetrica();
        }
      },
    }); 

  }

  ngOnInit(): void {
    console.log("Fecha 1 hora:",Constantes.FECHA_INICIO_GLOBAL_METRICAS_1);
    this.form = this.formBuilder.group({
      metrica: [null],
      tiempo: [null],
    });
    this.form.get('tiempo').setValue('Última hora');
    this.consultaMetrica();
    this.idDashboard = Number(localStorage.getItem('dashboard'))
    this.requireUpdateRange = this.changeGraphService.enviarflagObservableRange.subscribe((response) => {
      if (response) {
        console.log("Metricas entra al flag - Response {",response,"}");
        switch (String(response)) {
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
      }
    });
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => {
      this.isDark = val;
      if (val) {
        this.color = '#21273d';
      } else {
        this.color = '#FFFFFF';
      }
    });
    if (this.full) {
       switch (Number(localStorage.getItem('scale'))) {
        case 1:this.scale = 'week'
        this.form.get('tiempo').setValue("Última semana");
        break;
        case 2:this.scale = 'hour'
        this.form.get('tiempo').setValue("Últimas 12 horas");
        break;
        case 3:this.scale = 'day'
        this.form.get('tiempo').setValue("Últimas 24 horas");
        break;
        case 4:this.scale = 'minute'
        this.form.get('tiempo').setValue("Última hora");
        break;
       }
      this.changeScale(this.scale);
    }
  }

  changeScale(t: 'week' | 'day' | 'hour' | 'minute') {
    this.scale = t;
      if (this.scale == 'week') {
        this.dayAgo = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS */
        localStorage.setItem('scale','1');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'hour') {
        this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hours').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_12 */
        localStorage.setItem('scale','2');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'day') {
        this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(24, 'hours').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_24 */
        localStorage.setItem('scale','3');
        this.obtenerDatosMetricas(t);
      }
      if (this.scale == 'minute') {
        this.dayAgo = moment().set({ 'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
        /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_1 */
        localStorage.setItem('scale','4');
        this.obtenerDatosMetricas(t);
      }
  }

  public get width() {
    return window.innerWidth;
  }

  consultaMetrica() {
    // this.spinner.show();
    if (this.dispositivo == 'Sitios') {
      this.dispositivo = 'Sitio';
    }
    if (this.dispositivo == 'Servicios') {
      this.dispositivo = 'Servicio';
    }
    this.dashboardService
      .obtenerMetricasCliente(this.administratorService.getIdCliente())
      .subscribe({
        next: ({ data, httpStatus }) => {
          this.spinner.hide();
          if (httpStatus === 200) {
            this.metricasVelas = data;
            this.metricas = data;
            this.form.get('metrica').setValue('Disponibilidad');
            this.changeMetrica();
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
    /*
    this.administratorService.catalogoMetricasDispositivo(this.dispositivo).subscribe({
      next: ({ data, httpStatus }) => {
        this.spinner.hide();
        if (httpStatus === 200) {
          //this.metricas = data.filter( ele => ele.metrica.idMetrica != 4 || ele.metrica.idMetrica == 3);
          console.log("Metricas:",this.metricas);

        }
      },
      error: (error) => {
        this.spinner.hide();
      }
    });
    */
  }

  changeMetrica() {
    /* console.log('metrica:',metrica); */

    let metric = {
      idMetrica: 0,
      metrica: '',
    };
    if(this.full){
      let metricaStorage = localStorage.getItem('metrica');
      if(metricaStorage != null){
        metric.metrica = localStorage.getItem('metrica');
      }else{
        metric.metrica = this.form.get('metrica').value;
        localStorage.setItem('metrica', metric.metrica);
      }
    }else{
      metric.metrica = this.form.get('metrica').value;
      localStorage.setItem('metrica', metric.metrica);
    }
    this.metricaSelected = metric.metrica;

    switch (metric.metrica) {
      case 'Disponibilidad':
      case 'Alcanzabilidad':
      case 'Pérdida de Paquetes':
        this.unit = '%';
        this.changeScale(this.scale);
        break;
      case 'Latencia':
        this.unit = 'mls';
        this.changeScale(this.scale);
        break;
      case 'Consumo':
        this.unit = 'Mb';
        this.changeScale(this.scale);
        break;
      default:
        this.unit = '';
        this.changeScale(this.scale);
        break;
    }
  }

  selectUnit() {
    this.metricaSelected = this.metricas[0].metrica;
  }

  obtenerDatosMetricas(tiempo) {
    console.log("Fecha day ago:", this.dayAgo.substring(0, 19));
    this.spinnerLoading = true;
    let request = {
      /* "fechaInicio": "2023-04-12T22:59:59",
      "fechaFin": "2023-04-12T23:59:59", */
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
      "funcionalidad": this.funcionalidad,
      "full": this.full
    };

    this.dashboardService.obtenerMetricas(request).subscribe({
      next: (data) => {
        var start = window.performance.now();
        this.spinnerLoading = false;
        if (data.metricas != null) {
          this.dataMetricas = data.metricas;
          let pasa: boolean = false;
          this.dataMetricas.forEach((element) => {
            if (
              element.metrica.toLowerCase() ==
              this.form.get('metrica').value.toLowerCase()
            ) {
              pasa = true;
            }
          });
          if(this.full){
            let metricaStorage = localStorage.getItem('metrica');
            if(metricaStorage != null){
              this.dataMetricas = this.dataMetricas.filter( element => element.metrica.toLowerCase() == localStorage.getItem('metrica').toLowerCase());
            }else{
              this.dataMetricas = this.dataMetricas.filter( element => element.metrica.toLowerCase() == this.form.get('metrica').value.toLowerCase());
            }
          }else{
            this.dataMetricas = this.dataMetricas.filter( element => element.metrica.toLowerCase() == this.form.get('metrica').value.toLowerCase());
          }
          //this.dataMetricas.barras = this.dataMetricas.barras.filter( element => element.date != new Date('Tue Feb 21 2023 00:00:00 GMT-0600 (hora estándar central)'));
          console.log('Datametrica',this.dataMetricas);
          if (pasa) {
              if (tiempo == 'week') {
                this.obtenerPorSemana(this.dataMetricas[0]);
              } else if (tiempo == 'day') {
                this.obtenerPorDia(this.dataMetricas[0]);
              } else if (tiempo == 'minute') {
                this.obtenerPorMinuto(this.dataMetricas[0]);
              } else {
                this.obtenerPorHora(this.dataMetricas[0]);
              }
          } else {
            if (tiempo == 'week') {
              this.obtenerPorSemana([]);
            } else if (tiempo == 'day') {
              this.obtenerPorDia([]);
            } else {
              this.obtenerPorHora([]);
            }
          }
        } else {
          if (tiempo == 'week') {
            this.obtenerPorSemana([]);
          } else if (tiempo == 'day') {
            this.obtenerPorDia([]);
          } else {
            this.obtenerPorHora([]);
          }
        }
        var end = window.performance.now();
        console.log(`Tiempo execusion Metricas: ${((end - start)/1000).toFixed(5)} segundos`);
        this.errorCarga = 0;
        this.isFirst = false;
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
    this.porcentajePositivo = data.promedioMetrica;
    this.slaPromedio = data.promedioSla;
    if(!data.barras){
      this.dateValue = this.dateValueWeek.reverse();
    }else{
      this.dateValue = data.barras;
    }
    this.dateValue.forEach((element) => {
      element.date = new Date(element.date);
      /* element.date.setHours(element.date.getMinutes() + element.date.getTimezoneOffset());  */
    });
    console.log('RespuestaPorSemana:', this.dateValue);
  }

  obtenerPorDia(data) {
    this.dateValue = [];
    this.porcentajePositivo = data.promedioMetrica;
    this.slaPromedio = data.promedioSla;
    if(!data.barras){
      this.dateValue = this.dateValueDay.reverse();
    }else{
      this.dateValue = data.barras;
    }
    this.dateValue.forEach((element) => {
      element.date = new Date(element.date);
      /* element.date.setHours(element.date.getMinutes() + element.date.getTimezoneOffset());  */
    });
    console.log('RespuestaPordia:', this.dateValue);
  }

  obtenerPorHora(data) {
    this.dateValue = [];
    this.porcentajePositivo = data.promedioMetrica;
    this.slaPromedio = data.promedioSla;
    if(!data.barras){
      this.dateValue = this.dateValueHour.reverse();
    }else{
      this.dateValue = data.barras.reverse();
      this.dateValue = this.dateValue.slice(0,12);
      this.dateValue = this.dateValue.reverse();
    }
    this.dateValue.forEach((element) => {
      element.date = new Date(element.date);
      /* element.date.setHours(element.date.getMinutes() + element.date.getTimezoneOffset()); */
    });
    console.log('RespuestaPorHora:', this.dateValue);
  }

  ponerMetrica() {
    this.funcionalidad = 'MetricasMonitoreoGlobal';
  }

  quitarMetrica() {
    this.funcionalidad = '';
  }

  obtenerPorMinuto(data) {
    this.dateValue = [];
    this.porcentajePositivo = data.promedioMetrica;
    this.slaPromedio = data.promedioSla;
    if(!data.barras){
      this.dateValue = this.dateValueDay.reverse();
    }else{
      this.dateValue = data.barras;
    }
    this.dateValue.forEach((element) => {
      element.date = new Date(element.date);
      /* element.date.setHours(element.date.getMinutes() + element.date.getTimezoneOffset());  */
    });
    console.log('RespuestaPorMinuto:', this.dateValue);
  }

  alertTiempo(tiempo,texto){
    this.tiempoSeleccionada = tiempo;
    this.textoSeleccionado = texto;
    this.changeGraphService.changeRange(this.tiempoSeleccionada);
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  }
}
