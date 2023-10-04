import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { PromedioMetricasRequest } from '../../../shared/interfaces/promedio-metricas-request';
import { AdministratorService } from '../../../shared/services/administrator.service';
import { DashboardService } from '../../../shared/services/dashboards.service';
import { ReloadDataService } from '../../../shared/services/reload-data.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
@Component({
  selector: 'smc-promedios-mapa-barras',
  templateUrl: './promedios-mapa-barras.component.html',
  styles: [],
})
export class PromediosMapaBarrasComponent implements OnInit, OnDestroy {
  errorCarga: number = 0;
  scale: 'week' | 'day' | 'hour' | 'month' = 'month';
  isDarkTheme: Observable<boolean>;
  datesValue: Array<DateValue> = [];

  tiempoMinimo = 0;
  tiempoMaximo = 0;
  tiempoPromedio = 0;

  margin: MarginConf = {
    top: 10,
    right: -2,
    bottom: 5,
    left: 30,
  };

  marginLine: MarginConf = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 50,
  };

  @Input() sizeX: number;
  @Input() sizeXLarge: number;
  @Input() viewGraph: number;
  @Input() sizeYLarge: number = 280;
  @Input() sizeY: number = 160;
  @Input() isFull: boolean = false;

  _dispositivo: string = '';
  range: number[] = [0,100];
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  get dispositivo() {
    return this._dispositivo;
  }

  initDate: Date = new Date();
  endDate: Date = new Date();

  enlace = [
    {
      date: new Date('2022-12-01 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-02 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-03 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-04 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-05 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-06 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-07 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-08 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-09 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-10 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-11 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
    {
      date: new Date('2022-12-12 00:00:00.0000000'),
      value: 0,
      interface: 'Interface 1',
    },
  ];

  requireUpdate: Subscription;

  hrsMapping: { [k: string]: string } = {
    '=0': '0 hrs',
    '=1': '# hr',
    other: '# hrs',
  };
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'M').format();
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  constructor(
    private themeService: ThemeService,
    private reloadDataService: ReloadDataService,
    private dashboardService: DashboardService,
    private administratorService: AdministratorService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.getData();
        }
      },
    });
  }

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.changeSelection('Mes');
    this.range = [50, 90];
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  public get width() {
    return window.innerWidth;
  }

  private getData() {
    console.log('data obtenido');

    const requestPromedio: PromedioMetricasRequest = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      idEmpresa: this.administratorService.getidClienteTotalplay() || 0,
      idServicio: 'string',
      idDispositivo: 'string',
      tipoDispositivo: '',
      folioTicket: '',
      folioTicketExterno: 'string',
      metrica: 'string',
      ipNs: 'string',
      funcionalidad: 'PromedioResolucionMonitoreoEjecutivo',
      full: false,
      tiempo: 'D'
    };
    this.dashboardService
      .monitoreoEjecutivoPromedioResolucion(requestPromedio)
      .subscribe({
        next: (resp) => {
          this.enlace = resp.enlaces;
          this.enlace.forEach( line => {
            line.date = new Date(line.date);
          })
          this.datesValue = resp.barras;
          this.datesValue.forEach( line => {
            line.date = new Date(line.date);
          })
          this.tiempoMinimo = resp.min;
          this.tiempoMaximo = resp.max;
          this.tiempoPromedio = resp.promedio;

          this.setInitDate(this.datesValue[this.datesValue.length - 1].date);
        },
      });
  }

  changeSelection(newSelection: string) {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDay();
    if (newSelection == 'Mes') {
      this.scale = 'month';
      this.initDate = new Date(y, m, 1);
      this.endDate = new Date(y, m + 1, 0);
    } else if (newSelection == 'Semana') {
      this.scale = 'week';
      const today = date.getDate();
      this.initDate = new Date(date.setDate(today - d));
      this.endDate = new Date(date.setDate(today - d + 6));
    }

   

    this.getData();
  }

  setInitDate(date:Date){
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDay();    
      this.initDate = new Date(y, m, 1);
      this.endDate = new Date(y, m + 1, 0);    
  }
}
