import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { SucursalesAfectadas } from 'src/app/shared/model/sucurales-afectadas';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DashboardService } from '../../../../shared/services/dashboards.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
@Component({
  selector: 'smc-monitoreo-ejecutivo',
  templateUrl: './monitoreo-ejecutivo.component.html',
  styleUrls: ['./monitoreo-ejecutivo.component.css'],
})
export class MonitoreoEjecutivoComponent implements OnInit {
  public created: Date;
  typeService: string = 'Sitios';
  isDarkTheme: Observable<boolean>;
  progressChartdataDark = {
    id: 'ejecutivo-ligth',
    icono: 'assets/img/home-vista.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#285CED',
      colorFondo: '#D0D0CE',
      colorCirculo: '#FFFFFF',
    },
  };
  progressChartdata = {
    id: 'ejecutivo-dark',
    icono: 'assets/img/dash-punta.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#285CED',
      colorFondo: '#161C33',
      colorCirculo: '#DBDBDB',
    },
  };
  tabLoadTimes: Date[] = [];
  selected = new FormControl(0);
  sucAfectadas: SucursalesAfectadas[] = [];

  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-01 06:12:58.911982'), value: 30 },
    { date: new Date('2022-10-02 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-03 06:12:58.911982'), value: 67 },
    { date: new Date('2022-10-04 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-05 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-06 06:12:58.911982'), value: 27 },
    { date: new Date('2022-10-07 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-08 06:12:58.911982'), value: 47 },
    { date: new Date('2022-10-09 06:12:58.911982'), value: 34 },
    { date: new Date('2022-10-10 06:12:58.911982'), value: 20 },
  ];
  margin?: MarginConf = {
    top: 0,
    right: 5,
    bottom: 0,
    left: 5,
  };
  objectGraph: any[] = [];
  viewGraph: number = 1;
  typeGraph: number = 1;
  tabSelect: number = 0;
  requireUpdate: Subscription;
  tabGraph: number = 19;
  tabCuadran: number;
  fullType: string = 'RESOLUCION_METRICAS';
  idUsuario: number;
  totalDispositivos: number;
  totalDispositivosActivos: number = 0;
  totalDispositivosInactivos: number = 0; 
  totalDispositivosMantenimiento: number = 0; 
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format();
  totalSitios: number;
  requireUpdateTotal: Subscription;
  constructor(
    private themeService: ThemeService,
    private changeGraphService: ChangeGraphService,
    private workspaceService: WorkspaceService,
    public spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private administratorService: AdministratorService,
    private reloadDataService: ReloadDataService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          let service = localStorage.getItem('type-service');
          this.typeService =
            Number(service) == 1
              ? 'Enlaces'
              : Number(service) == 3
              ? 'Sitios'
              : 'Servicios';

              this.update();
        }
      },
    });
  }

  ngOnInit(): void {
    this.requireUpdateTotal = this.changeGraphService.enviarflagObservableTotal.subscribe((response) => {
      if (response > 0) {
        console.log("Vista general entra al flag - Response {",response,"}")
        this.totalSitios = response
      }
    });
    localStorage.setItem('type-service', '3');
    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      setTimeout(() => {
        this.themeService.setDarkTheme(mode === '1' ? true: false);
      }, 10);
    }
    this.idUsuario = this.administratorService.getIdUsuarios();
    let tab = localStorage.getItem('tabSelect');
    if (tab === '') {
      this.tabSelect = 0;
      this.selected.setValue(0);
      this.tabGraph = 19;
      this.tabCuadran = 34;
      this.fullType = 'RESOLUCION_METRICAS';
      localStorage.setItem('full-type-title', 'Consumo últimas 12 horas');
    } else {
      this.tabSelect = Number(tab);
      this.selected.setValue(this.tabSelect);
      localStorage.removeItem('tabSelect');
      if (this.tabSelect == 0) {
        this.tabGraph = 19;
        this.tabCuadran = 34;
        this.fullType = 'RESOLUCION_METRICAS';
        localStorage.setItem('full-type-title', 'Consumo últimas 12 horas');
      } else {
        this.tabGraph = 20;
        this.tabCuadran = 37;
        this.fullType = 'RESOLUCION_INTERFACES';
        localStorage.setItem('full-type-title', 'Promedio de resolución');
      }
    }
    //this.setSucAfectaciones();
    let service = localStorage.getItem('type-service');
    this.typeService =
      Number(service) == 1
        ? 'Enlaces'
        : Number(service) == 3
        ? 'Sitios'
        : 'Servicios';
    this.created = new Date();
    this.changeGraphService.enviarflagObservable.subscribe((response) => {
      this.consultaCuadrantesGraficas();
    });
    this.consultaCuadrantesGraficas();

    this.isDarkTheme = this.themeService.isDarkTheme;

    /* this.getVistaGeneral( this.typeService ); */
    //this.setSucAfectaciones();
/*     this.changeGraphService.enviarflagObservable.subscribe((response) => {
      this.viewGraph = response.viewGraph;
      this.typeGraph = response.typeGraph;
      if (this.typeGraph == 1) {
        this.objectGraph[0].viewGraph = this.viewGraph;
      } else if (this.typeGraph == 2) {
        this.objectGraph[1].viewGraph = this.viewGraph;
      } else if (this.typeGraph == 3) {
        this.objectGraph[2].viewGraph = this.viewGraph;
      } else if (this.typeGraph == 4) {
        this.objectGraph[3].viewGraph = this.viewGraph;
      } else if (this.typeGraph == 5) {
        this.objectGraph[4].viewGraph = this.viewGraph;
      } else {
        this.objectGraph[5].viewGraph = this.viewGraph;
      }
      let mode = localStorage.getItem('darkTheme');
      if (mode != null) {
        setTimeout(() => {
          this.themeService.setDarkTheme(mode === '1' ? true : false);
        }, 100);
      }
      console.log('Ejecutivo:', this.viewGraph);
      console.log('Ejecutivo Object:', this.objectGraph);
    });

    this.workspaceService.getObject().then((result) => {
      this.objectGraph = result.data.enlace;
      let mode = localStorage.getItem('darkTheme');
      if (mode != null) {
        setTimeout(() => {
          this.themeService.setDarkTheme(mode === '1' ? true : false);
        }, 100);
      }
    }); */
  }

  setSucAfectaciones(): void {
    let sucAfectada: SucursalesAfectadas = {
      idCard: 1,
      title: 'CSP10901410-SSA',
      alcanzabilidad: 2,
      disponibilidad: 2,
      perdidaPaquetes: 1,
    };
    this.sucAfectadas.push(sucAfectada);

    sucAfectada = {
      idCard: 2,
      title: 'CSP10901417',
      alcanzabilidad: 4,
      disponibilidad: 3,
      perdidaPaquetes: 2,
    };
    this.sucAfectadas.push(sucAfectada);

    sucAfectada = {
      idCard: 3,
      title: 'CSP10901423-SSA',
      alcanzabilidad: 6,
      disponibilidad: 4,
      perdidaPaquetes: 5,
    };
    this.sucAfectadas.push(sucAfectada);

    sucAfectada = {
      idCard: 4,
      title: 'CSP10901429-SSA',
      alcanzabilidad: 4,
      disponibilidad: 2,
      perdidaPaquetes: 1,
    };
    this.sucAfectadas.push(sucAfectada);
  }

  public get width() {
    return window.innerWidth;
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }
    return this.tabLoadTimes[index];
  }

  selectTab(index: number) {
    this.selected.setValue(index);
  }

  tabChange(index: any) {
    this.tabSelect = index;
    localStorage.setItem('tabSelect', String(this.tabSelect));
    if (this.tabSelect == 0) {
      this.tabGraph = 19;
      this.tabCuadran = this.objectGraph[1].cuadranteActivo.idCuadranteGrafica;
      this.fullType = 'RESOLUCION_METRICAS';
      localStorage.setItem('full-type-title', 'Consumo últimas 12 horas');
    } else {
      this.tabGraph = 20;
      this.tabCuadran = this.objectGraph[2].cuadranteActivo.idCuadranteGrafica;
      this.fullType = 'RESOLUCION_INTERFACES';
      localStorage.setItem('full-type-title', 'Promedio de resolución');
    }
    let mode = localStorage.getItem('darkTheme');
    if (mode != null) {
      setTimeout(() => {
        this.themeService.setDarkTheme(mode === '1' ? true : false);
      }, 100);
    }
  }

  obtenerAfectaciones() {
    // this.spinner.show();
    let request = {
      "fechaInicio": Constantes.FECHA_INICIO_EJECUTIVO_AFECTACIONES_24,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "AfectacionesMonitoreoEjecutivo",
      "full": true
    };
    this.dashboardService.monitoreoEjecutivoAfectaciones(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        console.log('Data:',data)
        this.sucAfectadas = data.afectaciones;
      },
      error: (_) => {
        this.spinner.hide();
        console.log(_);       
      },
    });
  }

  consultaCuadrantesGraficas(){
    this.dashboardService.recuperarCuadranteDashboard(this.idUsuario,4).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.objectGraph = data.filter((cuadrante) => cuadrante.activarEdicion === 1);
          this.objectGraph.forEach( cua => {
            if(cua.cuadranteActivo == null){
              cua.cuadranteActivo = {
                idCuadranteGrafica : cua.cuadranteGrafica[0].idCuadranteGrafica
              }
            }
          });

          let mode = localStorage.getItem('darkTheme');
          if(mode != null){
            setTimeout(() => {
              this.themeService.setDarkTheme(mode === '1' ? true: false);
            }, 10);
          }
        }
      },
      error: (error) => { 
        console.log('Error ', error);
        this.spinner.hide();
      }
    });
  }

  getVistaGeneral( type ){
    let request = {
      "fechaInicio": Constantes.FECHA_INICIO_GLOBAL_METRICAS_1,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "M",
      "ipNs": "",
      "funcionalidad": "VistaGeneralMonitoreoGlobal",
      "full": true
    };

    this.dashboardService.monitoreoEnlaceVistaGenereal(request).subscribe({
      next: (data) => {
        var start = window.performance.now(); 
        console.log(data)
        if(data != null){
          this.totalDispositivos = data.total;
          this.totalDispositivosActivos = data.activos;
          this.totalDispositivosInactivos = data.inactivos; 
          this.totalDispositivosMantenimiento = data.mantenimiento; 
          this.progressChartdataDark = {
            id: 'ejecutivo-ligth',
            icono: 'assets/img/home-vista.svg',
            porcentaje: data.activos,
            total: data.total,
            color: {
              colorPorcentaje: '#285CED',
              colorFondo: '#D0D0CE',
              colorCirculo: '#FFFFFF',
            },
          };
          this.progressChartdata = {
            id: 'ejecutivo-dark',
            icono: 'assets/img/dash-punta.svg',
            porcentaje: data.activos,
            total: data.total,
            color: {
              colorPorcentaje: '#285CED',
              colorFondo: '#161C33',
              colorCirculo: '#DBDBDB',
            },
          };
        }
        var end = window.performance.now();
        console.log(`Tiempo execusion vista General Ejecutivo: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
      }
    });
  }

  update(){
    this.getVistaGeneral( this.typeService );
  }

  
}
