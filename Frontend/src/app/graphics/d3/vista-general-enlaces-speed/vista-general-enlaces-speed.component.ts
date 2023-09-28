import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {OverlayContainer} from '@angular/cdk/overlay';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';

@Component({
  selector: 'smc-vista-general-enlaces-speed',
  templateUrl: './vista-general-enlaces-speed.component.html',
  styles: [
    `
    ::ng-deep .smc-select-dashboard-speed .mat-form-field-appearance-outline.mat-form-field-disabled, 
    ::ng-deep .smc-select-dashboard-speed .mat-form-field-outline {
      opacity: 0!important;
    }

    ::ng-deep .smc-select-dashboard-speed .mat-form-field-appearance-outline .mat-form-field-infix {
      margin-top: -18px!important;
      font-size: 15px!important;
      font-weight: 600!important;
    }

    ::ng-deep .smc-select-dashboard-speed .mat-select-arrow {
      margin-top: 10px!important;
      color: #2c8eff!important;
    }

    ::ng-deep .smc-select-dashboard-speed .mat-select-value {
      color: #2c8eff!important;
    }
    
    `
  ]
})
export class VistaGeneralEnlacesSpeedComponent implements OnInit, OnDestroy {

  @Input() viewGraph: number;
  @Input() typeGraph: number;
  @Input() full: boolean = false;
  errorCarga: number = 0;
  public form: FormGroup;
  public speedValue: number = 0;
  isDarkTheme: Observable<boolean>;
  isDark: boolean;

  vistaGeneralSlider: boolean = false;
  datesValueEjemplo = [
    { date: new Date('2023-02-16 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-17 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-18 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-19 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-20 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-21 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2023-02-22 00:00:00.000000'), value: 0, media: "General" },
  ];
  datesValue = [
    { date: new Date('2022-10-01 00:00:00.000000'), value: 0, media: "General"},
    { date: new Date('2022-10-02 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2022-10-03 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2022-10-04 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2022-10-05 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2022-10-06 00:00:00.000000'), value: 0, media: "General" },
    { date: new Date('2022-10-07 00:00:00.000000'), value: 0, media: "General" },
  ];
  datatickets = [
    { date: new Date('2022-10-01 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-02 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-03 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-04 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-05 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-06 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-07 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-08 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-09 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-10 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-11 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-12 06:12:58.911982'), value: 0, media: "General" },
    { date: new Date('2022-10-13 06:12:58.911982'), value: 0, media: "General" },
  ];
  marginBarChart?: MarginConf = {
    top: 10,
    right: 10,
    bottom: 5,
    left: 35,
  };
  requireUpdate: Subscription;
  requireUpdateRange: Subscription;
  vistaGeneral: any;
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  dayAgoMonth: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(30, 'days').format();
  tiposDispositivos: any;
  rangoDatos:string = 'M';
  fechaInicio:string = moment().set({'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
  scale: 'week' | 'day' | 'hour' | 'minute'  = 'minute' ;
  spinnerLoading: boolean = true;
  isFirst:boolean = true;
  constructor(private themeService: ThemeService,
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private auth: AdministratorService,
    private reloadDataService: ReloadDataService,
    private changeGraphService:ChangeGraphService,
    private overlayContainer: OverlayContainer) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response && !this.isFirst) {
            console.log("Refrescar Vista general:::")
              this.getVistaGeneral();
          }
        },
      });
  }

  ngOnInit(): void {
    this.requireUpdateRange = this.changeGraphService.enviarflagObservableRange.subscribe((response) => {
      if (response) {
        console.log("Vista general entra al flag - Response {",response,"}")
        switch (String(response)) {
          case '1':
            this.scale = 'minute';
            this.rangoDatos = 'M';
            /* this.fechaInicio = Constantes.FECHA_INICIO_GLOBAL_METRICAS_1; */
            this.fechaInicio = moment().set({'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
            this.getVistaGeneral()
            break;
          case '12':
            this.scale = 'hour';
            this.rangoDatos = 'H';
            /* this.fechaInicio = Constantes.FECHA_INICIO_GLOBAL_METRICAS_24  */
            this.fechaInicio = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(24, 'hours').format();
            this.getVistaGeneral()
            break;
          case '24':
            this.scale = 'day';
            this.rangoDatos = 'H';
            /* this.fechaInicio = Constantes.FECHA_INICIO_GLOBAL_METRICAS_24   */
            this.fechaInicio = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hours').format();
            this.getVistaGeneral()
            break;
          case '7':
            this.scale = 'week';
            this.rangoDatos = 'D';
            /* this.fechaInicio = Constantes.FECHA_INICIO_GLOBAL_METRICAS */
            this.fechaInicio = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
            this.getVistaGeneral()
            break;
          }
      }
    });
    this.consultaTiposDispositivos();
    console.log("Dia de hoy:",this.today);
    console.log("Dia de ayer:",this.dayAgo.substring(0, 19));
    this.form = this.formBuilder.group({
      tipo: [this.reloadDataService.type]
    });
    this.form.get('tipo').setValue(3);
    this.getVistaGeneral();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val=> {
      this.isDark = val;
      if(val == true){
        this.overlayContainer.getContainerElement().classList.add('dark-theme');
      }else{
        this.overlayContainer.getContainerElement().classList.remove('dark-theme');
      }
    }));
  }

  sliderChange() {
    this.vistaGeneralSlider = !this.vistaGeneralSlider;
  }

  public get width() {
    return window.innerWidth;
  }

  changeType(){
    let type = this.form.get('tipo').value;
    this.reloadDataService.setType(type);
    /* this.getData() */
    this.getVistaGeneral();
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
    this.requireUpdateRange.unsubscribe();
  }

  getVistaGeneral(){
    this.spinnerLoading = true;
    let request = {
      /* "fechaInicio": this.full ? Constantes.FECHA_INICIO_GLOBAL_VISTA_GENERAL_FULL : Constantes.FECHA_INICIO_GLOBAL_VISTA_GENERAL, */
      "fechaInicio": this.fechaInicio.substring(0, 19) ,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay() ? this.auth.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": this.rangoDatos,
      "ipNs": "",
      "funcionalidad": "VistaGeneralMonitoreoGlobal",
      "full": this.full
    };

    this.dashboardService.monitoreoEnlaceVistaGenereal(request).subscribe({
      next: (data) => {
        var start = window.performance.now();
        this.vistaGeneral = data;
        if(data.data != null){
          this.errorCarga = 0; 
          this.speedValue = data.value / 10;
          data.data.forEach(register => {
            register.date = new Date(register.date);
          });
          this.datesValue = data.data;
          if(this.scale == 'hour'){
            this.datesValue = this.datesValue.reverse().slice(0,12);
            this.datesValue = this.datesValue.reverse();
            console.log('12 horas Data:',this.datesValue);
          }
          console.log('Barra:',this.datesValue);
          this.datatickets = data.data;
        }else{
          this.errorCarga = 0; 
        }
        var end = window.performance.now();
        console.log(`Tiempo execusion Vista General Monitoreo Global: ${((end - start)/1000).toFixed(5)} segundos`);
        this.spinnerLoading = false;
        this.isFirst = false;
      },
      error: (_) => {
        this.errorCarga = 1
        this.spinnerLoading = false;
      }
    });
  }

  consultaTiposDispositivos(){
    this.dashboardService.obtenerTiposDispositivos(this.auth.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          console.log("DataDispositivos",data)
          this.tiposDispositivos = data;
          this.form.get('tipo').setValue(this.tiposDispositivos[0].value);
        }
      },
      error: (error) => { 
        console.log("Error")
      }
    });
  }

}
