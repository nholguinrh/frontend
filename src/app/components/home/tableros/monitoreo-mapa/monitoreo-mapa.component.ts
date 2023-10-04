import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { TitleDashboardComponent } from '../title-dashboard/title-dashboard.component';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'smc-monitoreo-mapa',
  templateUrl: './monitoreo-mapa.component.html',
  styleUrls: ['./monitoreo-mapa.component.css'],
})
export class MonitoreoMapaComponent implements OnInit {
  public created: Date;
  isDarkTheme: Observable<boolean>;
  viewGraph: number = 1;
  typeGraph: number = 1;
  objectGraph: any;
  //Esta parte se habia comentado, se retorna para la correcta inicializacion
  progressChartdata = {
    id: 'mapa-ligth',
    icono: 'assets/img/vista-arrow-down.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#285CED',
      colorFondo: '#D0D0CE',
      colorCirculo: '#FFFFFF',
    },
  };
  //Esta parte se habia comentado, se retorna para la correcta inicializacion
  progressChartdataDark = {
    id: 'mapa-dark',
    icono: 'assets/img/vista-arrow-down.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#285CED',
      colorFondo: '#161C33',
      colorCirculo: '#DBDBDB',
    },
  };
  requireUpdate: Subscription;
  typeService: string = 'Enlaces';
  idUsuario: number;
  totalDispositivos: number;
  totalDispositivosActivos: number = 0;
  totalDispositivosInactivos: number = 0; 
  totalDispositivosMantenimiento: number = 0; 
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  requireUpdateRange: Subscription;
  escalaTiempo:string = 'Ultima hora';
  totalSitios: number;
  requireUpdateTotal: Subscription;
  spinnerLoading: boolean = true;
  constructor(
    private themeService: ThemeService,
    private changeGraphService: ChangeGraphService,
    private workspaceService: WorkspaceService,
    private administratorService: AdministratorService,
    public dashboardService: DashboardService,
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
    this.requireUpdateRange = this.changeGraphService.enviarflagObservableRange.subscribe((response) => {
      if (response) {
        console.log("Vista general entra al flag - Response {",response,"}")
        switch (String(response)) {
          case '1':
              this.escalaTiempo = 'Última hora';
            break;
          case '12':
            this.escalaTiempo = 'Últimas 12 hrs';
            break;
          case '24':
            this.escalaTiempo = 'Últimas 24 hrs';
            break;
          case '7':
            this.escalaTiempo = 'Última semana';
            break;
          }
      }
    });
    this.requireUpdateTotal = this.changeGraphService.enviarflagObservableTotal.subscribe((response) => {
      if (response > 0) {
        console.log("Vista general entra al flag - Response {",response,"}")
        this.totalSitios = response
      }
    });
    localStorage.setItem('type-service', '3');
    this.idUsuario = this.administratorService.getIdUsuarios();
    let service = localStorage.getItem('type-service');
    this.typeService =
      Number(service) == 1
        ? 'Enlaces'
        : Number(service) == 3
        ? 'Sitios'
        : 'Servicios';
    this.created = new Date();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.changeGraphService.enviarflagObservable.subscribe((response) => {
      this.consultaCuadrantesGraficas();
    });
    this.consultaCuadrantesGraficas();
    /*     this.changeGraphService.enviarflagObservable.subscribe((response) => {
      this.viewGraph = response.viewGraph;
      this.typeGraph = response.typeGraph;
      if(this.typeGraph == 1){
        this.objectGraph[0].viewGraph = this.viewGraph;
      }else if(this.typeGraph == 2){
        this.objectGraph[1].viewGraph = this.viewGraph;
      }else if(this.typeGraph == 3){
        this.objectGraph[2].viewGraph = this.viewGraph;
      }else if(this.typeGraph == 4){
        this.objectGraph[3].viewGraph = this.viewGraph;
      }else{
        this.objectGraph[4].viewGraph = this.viewGraph;
      }
      console.log("Monitoreo",this.viewGraph);
    });

    this.workspaceService.getObject().then(result => {
      this.objectGraph = result.data.enlace;
      let mode = localStorage.getItem('darkTheme');
      if(mode != null){
        setTimeout(() => {
          this.themeService.setDarkTheme(mode === '1' ? true: false);
        }, 100);
      }
    }); 
    */
    /* this.getVistaGeneral(this.typeService); */
  }

  public get width() {
    return window.innerWidth;
  }

  update() {
    this.getVistaGeneral(this.typeService);
  }

  consultaCuadrantesGraficas() {
    this.dashboardService
      .recuperarCuadranteDashboard(this.idUsuario, 6)
      .subscribe({
        next: ({ data, httpStatus }) => {
          if (httpStatus === 200) {
            this.objectGraph = data.filter(
              (cuadrante) => cuadrante.activarEdicion === 1
            );

            this.objectGraph.forEach((cua) => {
              if (cua.cuadranteActivo == null) {
                cua.cuadranteActivo = {
                  idCuadranteGrafica:
                    cua.cuadranteGrafica[0].idCuadranteGrafica,
                };
              }
            });

            let mode = localStorage.getItem('darkTheme');
            if (mode != null) {
              setTimeout(() => {
                this.themeService.setDarkTheme(mode === '1' ? true : false);
              }, 20);
            }
          }
        },
        error: (error) => {
          console.log('Error ', error);
        },
      });
  }

  getVistaGeneral( type ){
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": (moment().set({'second': 0, 'millisecond': 0}).subtract(59, 'minute').format()).substring(0,19),
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
        console.log(data);
        if(data != null){          
          this.totalDispositivos = data.total;
          this.totalDispositivosActivos = data.activos;
          this.totalDispositivosInactivos = data.inactivos; 
          this.totalDispositivosMantenimiento = data.mantenimiento; 
          localStorage.setItem('totalDispositivos', data.total);
          this.progressChartdataDark = {
            id: 'mapa-dark',
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
            id: 'mapa-ligth',
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
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Vista General Monitoreo Mapa: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.spinnerLoading = false;
      }
    });
  }
}
