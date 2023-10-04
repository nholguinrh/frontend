import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from '../../../../../shared/services/reload-data.service';

@Component({
  selector: 'app-detalle-metrica',
  templateUrl: './detalle-metrica.component.html',
  styleUrls: ['./detalle-metrica.component.css'],
})
export class DetalleMetricaComponent implements OnInit, AfterViewInit {
  eventos: any = [
    {
      value: 1,
      estatus: 'Número de eventos',
      cantidad: 12,
      clase: 'estatus-pendientes',
    },
    {
      value: 2,
      estatus: 'Promedio de respuesta',
      cantidad: 65,
      clase: 'estatus-curso',
    },
    {
      value: 3,
      estatus: 'Impacto',
      cantidad: 80,
      clase: 'estatus-resueltos',
    },
    {
      value: 4,
      estatus: 'Incidentes',
      cantidad: 0,
      clase: 'estatus-todos',
    },
  ];
  optionSelected: number = 1;
  dispositivo: string;
  nombreMetrica: string;
  enlace = [
    { date: new Date(2022, 9, 10), value: 31, interface: '5552120137' },
    { date: new Date(2022, 9, 11), value: 33, interface: '5552120137' },
    { date: new Date(2022, 9, 12), value: 29, interface: '5552120137' },
    { date: new Date(2022, 9, 13), value: 32, interface: '5552120137' },
    { date: new Date(2022, 9, 14), value: 31, interface: '5552120137' },
    { date: new Date(2022, 9, 15), value: 30, interface: '5552120137' },
    { date: new Date(2022, 9, 16), value: 27, interface: '5552120137' },
    { date: new Date(2022, 9, 17), value: 33, interface: '5552120137' },
    { date: new Date(2022, 9, 18), value: 35, interface: '5552120137' },
    { date: new Date(2022, 9, 19), value: 15, interface: '5552120137' },
    { date: new Date(2022, 9, 20), value: 32, interface: '5552120137' },
    { date: new Date(2022, 9, 21), value: 28, interface: '5552120137' },
    { date: new Date(2022, 9, 22), value: 37, interface: '5552120137' },
  ];
  marginEnlace: MarginConf = {
    top: 20,
    right: 10,
    bottom: 50,
    left: 50,
  };
  marginInterfaz: MarginConf = {
    top: 20,
    right: 10,
    bottom: 20,
    left: 50,
  };
  inteterfaces: any = [
    {
      data: [
        { date: new Date(2022, 9, 10), value: 31, interface: '5552120137' },
        { date: new Date(2022, 9, 11), value: 33, interface: '5552120137' },
        { date: new Date(2022, 9, 12), value: 29, interface: '5552120137' },
        { date: new Date(2022, 9, 13), value: 32, interface: '5552120137' },
        { date: new Date(2022, 9, 14), value: 31, interface: '5552120137' },
        { date: new Date(2022, 9, 15), value: 30, interface: '5552120137' },
        { date: new Date(2022, 9, 16), value: 27, interface: '5552120137' },
        { date: new Date(2022, 9, 17), value: 33, interface: '5552120137' },
        { date: new Date(2022, 9, 18), value: 35, interface: '5552120137' },
        { date: new Date(2022, 9, 19), value: 15, interface: '5552120137' },
        { date: new Date(2022, 9, 20), value: 32, interface: '5552120137' },
        { date: new Date(2022, 9, 21), value: 28, interface: '5552120137' },
        { date: new Date(2022, 9, 22), value: 37, interface: '5552120137' },

        { date: new Date(2022, 9, 10), value: 31 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 11), value: 33 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 12), value: 29 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 13), value: 32 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 14), value: 31 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 15), value: 30 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 16), value: 27 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 17), value: 33 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 18), value: 35 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 19), value: 15 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 20), value: 32 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 21), value: 28 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 22), value: 37 - 2, interface: '5552862383' },

        { date: new Date(2022, 9, 10), value: 31 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 11), value: 33 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 12), value: 29 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 13), value: 32 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 14), value: 31 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 15), value: 30 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 16), value: 27 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 17), value: 33 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 18), value: 35 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 19), value: 15 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 20), value: 32 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 21), value: 28 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 22), value: 37 - 4, interface: '5552862695' },

        { date: new Date(2022, 9, 10), value: 31 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 11), value: 33 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 12), value: 29 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 13), value: 32 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 14), value: 31 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 15), value: 30 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 16), value: 27 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 17), value: 33 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 18), value: 35 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 19), value: 15 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 20), value: 32 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 21), value: 28 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 22), value: 37 - 5, interface: '5552862850' },

        { date: new Date(2022, 9, 10), value: 31 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 11), value: 33 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 12), value: 29 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 13), value: 32 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 14), value: 31 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 15), value: 30 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 16), value: 27 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 17), value: 33 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 18), value: 35 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 19), value: 15 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 20), value: 32 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 21), value: 28 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 22), value: 37 - 6, interface: '5552863953' },

        {
          date: new Date(2022, 9, 10),
          value: 31 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 11),
          value: 33 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 12),
          value: 29 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 13),
          value: 32 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 14),
          value: 31 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 15),
          value: 30 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 16),
          value: 27 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 17),
          value: 33 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 18),
          value: 35 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 19),
          value: 15 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 20),
          value: 32 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 21),
          value: 28 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 22),
          value: 37 - 10,
          interface: '5552863957',
        },
      ],

      dataComplementary: [
        {
          interface: '5552120137',
          value: 50,
        },
        {
          interface: '5552862383',
          value: 45,
        },
        {
          interface: '5552862695',
          value: 40,
        },
        {
          interface: '5552862850',
          value: 35,
        },
        {
          interface: '5552863953',
          value: 30,
        },
        {
          interface: '5552863957',
          value: 25,
        },
      ],
      title: 'Utilización Input',
      color: '#FFBD14',
    },
    {
      data: [
        { date: new Date(2022, 9, 10), value: 31, interface: '5552120137' },
        { date: new Date(2022, 9, 11), value: 33, interface: '5552120137' },
        { date: new Date(2022, 9, 12), value: 29, interface: '5552120137' },
        { date: new Date(2022, 9, 13), value: 32, interface: '5552120137' },
        { date: new Date(2022, 9, 14), value: 31, interface: '5552120137' },
        { date: new Date(2022, 9, 15), value: 30, interface: '5552120137' },
        { date: new Date(2022, 9, 16), value: 27, interface: '5552120137' },
        { date: new Date(2022, 9, 17), value: 33, interface: '5552120137' },
        { date: new Date(2022, 9, 18), value: 35, interface: '5552120137' },
        { date: new Date(2022, 9, 19), value: 15, interface: '5552120137' },
        { date: new Date(2022, 9, 20), value: 32, interface: '5552120137' },
        { date: new Date(2022, 9, 21), value: 28, interface: '5552120137' },
        { date: new Date(2022, 9, 22), value: 37, interface: '5552120137' },

        { date: new Date(2022, 9, 10), value: 31 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 11), value: 33 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 12), value: 29 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 13), value: 32 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 14), value: 31 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 15), value: 30 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 16), value: 27 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 17), value: 33 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 18), value: 35 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 19), value: 15 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 20), value: 32 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 21), value: 28 - 2, interface: '5552862383' },
        { date: new Date(2022, 9, 22), value: 37 - 2, interface: '5552862383' },

        { date: new Date(2022, 9, 10), value: 31 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 11), value: 33 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 12), value: 29 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 13), value: 32 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 14), value: 31 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 15), value: 30 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 16), value: 27 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 17), value: 33 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 18), value: 35 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 19), value: 15 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 20), value: 32 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 21), value: 28 - 4, interface: '5552862695' },
        { date: new Date(2022, 9, 22), value: 37 - 4, interface: '5552862695' },

        { date: new Date(2022, 9, 10), value: 31 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 11), value: 33 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 12), value: 29 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 13), value: 32 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 14), value: 31 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 15), value: 30 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 16), value: 27 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 17), value: 33 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 18), value: 35 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 19), value: 15 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 20), value: 32 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 21), value: 28 - 5, interface: '5552862850' },
        { date: new Date(2022, 9, 22), value: 37 - 5, interface: '5552862850' },

        { date: new Date(2022, 9, 10), value: 31 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 11), value: 33 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 12), value: 29 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 13), value: 32 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 14), value: 31 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 15), value: 30 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 16), value: 27 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 17), value: 33 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 18), value: 35 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 19), value: 15 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 20), value: 32 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 21), value: 28 - 6, interface: '5552863953' },
        { date: new Date(2022, 9, 22), value: 37 - 6, interface: '5552863953' },

        {
          date: new Date(2022, 9, 10),
          value: 31 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 11),
          value: 33 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 12),
          value: 29 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 13),
          value: 32 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 14),
          value: 31 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 15),
          value: 30 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 16),
          value: 27 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 17),
          value: 33 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 18),
          value: 35 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 19),
          value: 15 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 20),
          value: 32 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 21),
          value: 28 - 10,
          interface: '5552863957',
        },
        {
          date: new Date(2022, 9, 22),
          value: 37 - 10,
          interface: '5552863957',
        },
      ],
      dataComplementary: [
        {
          interface: '5552120137',
          value: 50,
        },
        {
          interface: '5552862383',
          value: 45,
        },
        {
          interface: '5552862695',
          value: 40,
        },
        {
          interface: '5552862850',
          value: 35,
        },
        {
          interface: '5552863953',
          value: 30,
        },
        {
          interface: '5552863957',
          value: 25,
        },
      ],
      title: 'Utilización Input',
      color: '#FF6F6F',
    },
  ];
  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 0 },
    { date: new Date(moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 0 },
  ];
  rutaDashboard: boolean;
  cambiarModo: boolean;
  nombreMetricaLargo: string;
  rangeControl: FormControl;
  rangeMetrica: FormControl;

  readonly services = [
    {
      label: '1 hora',
      value: '1',
    },
    {
      label: '12 horas',
      value: '12',
    },
    {
      label: '24 horas',
      value: '24',
    },
    {
      label: '1 semana',
      value: '7',
    }
  ];
  marginArea: MarginConf = {
    top: 40,
    right: 30,
    bottom: 20,
    left: 40,
  };

  update : Date;
  requireUpdate: Subscription;
  metricas: any;
  data: any;
  metricaSeleccionada: string = 'Disponibilidad';
  dateValue: any[] = this.dateValueWeek;
  slaPromedio: any;
  unit: string = '%';
  public form: FormGroup;
  scale: 'week' | 'day' | 'hour' | 'minute'  = 'week' ;
  dayAgo: string = Constantes.FECHA_INICIO_GLOBAL_METRICAS;
  spinnerLoading: boolean = true;
  fechaCabezado = moment().format();
  constructor(
    private router: Router,
    private reloadDataService: ReloadDataService,
    private dashboardService: DashboardService,
    private administratorService: AdministratorService,
    private formBuilder: FormBuilder,
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.update = new Date();
        }
      },
    });
  }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      metrica: [null],
    });
    this.consultaMetrica();
    this.obtenerData();
    this.update = new Date();
    const mode = localStorage.getItem('afectacionesRecientes');
    if (mode != null) {
      this.rutaDashboard = mode === '1' ? true : false;
    }

    const range = '7';
    this.rangeControl = new FormControl(range);
    this.nombreMetricaLargo = localStorage.getItem('nombreLargo');
    this.dispositivo = localStorage.getItem('tipo-dispositivo');
    if(this.dispositivo == null){
      this.dispositivo = 'sitio'
    }
    if(this.dispositivo == 'P'){
      this.dispositivo = 'sitio'
    }
    this.dispositivo == 'sitio' || this.dispositivo == 'Sitio' || this.dispositivo == 'P'
      ? (this.optionSelected = 1)
      : this.dispositivo == 'servicio' || this.dispositivo == 'Servicio'
      ? (this.optionSelected = 2)
      : (this.optionSelected = 3);

    this.rutaDashboard
      ? localStorage.setItem('navigation', NAV.afectacionMetrica)
      : localStorage.setItem('navigation', NAV.detalleMetrica);
  }

  ngAfterViewInit(): void {
    this.rangeControl.valueChanges.subscribe((val: string) => {
      localStorage.setItem('rangoTiempo', val);
    });
  }

  goToBack() {
    localStorage.removeItem('afectacionesRecientes');
    if(this.rutaDashboard){
      localStorage.setItem('full-type', 'ENLACES_AFECTACIONES')
      this.router.navigateByUrl( NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.fullSize + ')')
    }else{
      let _isDashboard: string=localStorage.getItem('isdashboard');
      console.log(_isDashboard);
      if(_isDashboard=='1'){
        this.router.navigateByUrl(NAV.inicioCliente);
      }else{        
        this.router.navigateByUrl( NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.busquedaPersonalizada + ')');
      }
    }
  }

  cambiarDetalle() {
    console.log(this.optionSelected);
  }

  public get width() {
    return window.innerWidth;
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
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
          if (httpStatus === 200) {
            this.metricas = data;
            this.nombreMetrica = this.metricas[0].metrica;
            this.form.get('metrica').setValue(this.metricas[0].metrica);
          }
        },
        error: (error) => {
        },
      });
  }
  changeMetrica() {
    console.log("Metrica seleccionada:",this.form.get('metrica').value);
    this.metricaSeleccionada = this.form.get('metrica').value;
    this.obtenerData();
  }

  obtenerData(){
     let obj = localStorage.getItem('dispositivo');
     this.data = JSON.parse(obj);
     console.log("Data:",this.data)
    this.unit = this.metricaSeleccionada == 'Consumo' ? 'Mb' : '%';
    console.log(this.unit);
    this.detalleDispositivo();
  }

  detalleDispositivo(){
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": this.data.dispositivo.idDispositivo,
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": this.scale == 'week' ? 'D' : this.scale == 'minute' ? 'M' : 'H',
      "ipNs": this.data.dispositivo.ipns,
      "full": true,
      "funcionalidad": "AfectacionesMonitoreoGlobal",
    };
    console.log("Detalle:",request)
    this.dashboardService.obtenerDetalleAfectacionesRecientes(request).subscribe({
      next: (data) => {
        this.dateValue = [];
        console.log("Data ::: ==",data)
        this.data.dispositivo = data.listaResultado[0]
        let dispositivo =  this.data.dispositivo.linegraph.filter(element => element.metrica == this.metricaSeleccionada);
        console.log('Dispositivo:',dispositivo);
        dispositivo[0].data.forEach(element => {
          this.dateValue.push({date: new Date(element.id) , value: Number(element.y)});  
        });

        console.log('DATA Grafica:',this.dateValue);
        this.spinnerLoading = false;
      },
      error: (_) => {
        this.spinnerLoading = false;
      },
    });
  }

  changeRange(tiempo){
    if(tiempo == 1){
      this.scale = 'minute'
      this.dayAgo = moment().set({'second': 0, 'millisecond': 0}).subtract(59, 'minutes').format();
      /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_1 */
    }
    if(tiempo == 12){
      this.scale = 'hour'
      this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(12, 'hours').format();
      /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_12 */
    }
    if(tiempo == 24){
      this.scale = 'day'
      this.dayAgo = moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(24, 'hours').format();
      /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS_24 */
    }
    if(tiempo == 7){
      this.scale = 'week'
      this.dayAgo = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
      /* this.dayAgo = Constantes.FECHA_INICIO_GLOBAL_METRICAS */
    }
    this.detalleDispositivo();
  }

  fullSizeDashboard(grafica?: any) {
    localStorage.setItem('full-type', 'DISPOSITIVO_DETALLE_METRICA');
    localStorage.setItem('group-type', '1');

    localStorage.setItem('tipo-dispositivo', this.dispositivo);
    localStorage.setItem('metrica-seleccionada', this.metricaSeleccionada);
    localStorage.setItem('rango-seleccionado', this.scale);
    

    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.detalleFullSize + ')'
    );
  }
  
}
