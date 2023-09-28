import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
@Component({
  selector: 'app-detalle-grafica-full',
  templateUrl: './detalle-grafica-full.component.html',
  styleUrls: ['./detalle-grafica-full.component.css']
})
export class DetalleGraficaFullComponent implements OnInit, AfterViewInit {

    public type: string = '';
    public title: string = '';
    public child: number;
    public groupType: number;
    public groupDevice: string;
    public metrica: string;
    isDarkTheme: Observable<boolean>;
    public dark: boolean;
    colorFull: string;
    typeNumber: number;
    typeService: string;
    rutaDashboard: boolean;
  
    //Data detalle de metrica
    marginArea: MarginConf = {
      top: 40,
      right: 30,
      bottom: 20,
      left: 40,
    };
    slaPromedio: any;

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
      bottom: 100,
      left: 50,
    };
    marginInterfaz: MarginConf = {
      top: 20,
      right: 10,
      bottom: 30,
      left: 50,
    };
    rangeControl: FormControl = new FormControl('7d');

    interfaz: any = {
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
    };

    datesValue: Array<DateValue> = [
      { date: new Date('2022-10-01 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-01 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-01 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-01 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-02 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-02 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-02 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-02 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-03 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-03 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-03 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-03 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-04 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-04 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-04 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-04 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-05 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-05 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-05 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-05 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-06 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-06 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-06 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-06 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-07 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-07 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-07 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-07 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-08 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-08 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-08 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-08 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-09 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-09 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-09 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-09 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-10 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-10 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-10 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-10 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-11 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-11 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-11 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-11 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-12 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-12 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-12 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-12 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-13 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-13 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-13 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-13 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-14 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-14 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-14 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-14 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-15 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-15 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-15 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-15 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-16 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-16 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-16 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-16 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-17 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-17 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-17 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-17 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-18 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-18 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-18 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-18 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-19 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-19 06:00:00.000000'), value: 91 },
      { date: new Date('2022-10-19 12:00:00.000000'), value: 70 },
      { date: new Date('2022-10-19 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-20 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-20 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-20 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-20 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-21 00:00:00.000000'), value: 37 },
      { date: new Date('2022-10-21 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-21 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-21 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-22 00:00:00.000000'), value: 55 },
      { date: new Date('2022-10-22 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-22 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-22 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-23 00:00:00.000000'), value: 40 },
      { date: new Date('2022-10-23 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-23 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-23 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-24 00:00:00.000000'), value: 47 },
      { date: new Date('2022-10-24 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-24 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-24 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-25 00:00:00.000000'), value: 50 },
      { date: new Date('2022-10-25 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-25 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-25 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-26 00:00:00.000000'), value: 38 },
      { date: new Date('2022-10-26 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-26 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-26 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-27 00:00:00.000000'), value: 72 },
      { date: new Date('2022-10-27 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-27 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-27 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-28 00:00:00.000000'), value: 48 },
      { date: new Date('2022-10-28 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-28 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-28 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-29 00:00:00.000000'), value: 37 },
      { date: new Date('2022-10-29 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-29 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-29 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-30 00:00:00.000000'), value: 40 },
      { date: new Date('2022-10-30 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-30 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-30 18:00:00.000000'), value: 95 },
  
      { date: new Date('2022-10-31 00:00:00.000000'), value: 55 },
      { date: new Date('2022-10-31 06:00:00.000000'), value: 70 },
      { date: new Date('2022-10-31 12:00:00.000000'), value: 91 },
      { date: new Date('2022-10-31 18:00:00.000000'), value: 95 }
    ];

  data: any;
  unit: string;
  spinnerLoading: boolean = false;
  dateValue: any[];
  scale: 'week' | 'day' | 'hour' | 'minute'  = 'week' ;
  dayAgo: string = Constantes.FECHA_INICIO_GLOBAL_METRICAS;

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
    
    constructor(
      private router: Router,
      private changeGraphService: ChangeGraphService,
      private themeService: ThemeService,
      private administratorService: AdministratorService,
      private dashboardService: DashboardService
    ) {}
  
    changeTablero(t: number) {}
  
    ngOnInit(): void {
      this.rangeControl = new FormControl(localStorage.getItem('rangoTiempo'));
      let mode = localStorage.getItem('darkTheme');
      if (mode != null) {
        this.dark = mode === '1' ? true : false;
        setTimeout(() => {
          this.themeService.setDarkTheme(this.dark);
        }, 100);
      }
  
      let type = localStorage.getItem('full-type');
      if (type != null) {
        this.type = type;
        if(this.type == 'DISPOSITIVO_DETALLE_METRICA'){
          this.detalleDispositivo()
        }
      }
  
      let title = localStorage.getItem('nombre-dispositivo');
      if (title != null) {
        this.title = String(title);
      }

      let groupType = localStorage.getItem('group-type');
      if (title != null) {
        this.groupType = Number(groupType);
      }

      let groupDevice = localStorage.getItem('tipo-dispositivo');
      if (title != null) {
        this.groupDevice = groupDevice;
      }
  
      let metrica = localStorage.getItem('full-type-metrica');
      if (title != null) {
        this.metrica = metrica;
      }

      let typeService = localStorage.getItem('type-service');
      if (typeService != null) {
        this.typeService = Number(typeService) == 1 ? 'Enlaces' : Number(typeService) == 2 ? 'Puntas' : 'Interfaces';
      }

      let modeBack = localStorage.getItem('afectacionesRecientes');
      if(modeBack != null){
        let dataDispositivo = JSON.parse(localStorage.getItem('data-historico'));
        if(dataDispositivo != null){
          dataDispositivo.barras.forEach(ele => {
              ele.date = new Date(ele.date);
          });

          this.datesValue = dataDispositivo.barras
          this.metrica = dataDispositivo.metrica

          this.groupDevice = localStorage.getItem('tipoDispositivo') == 'P' ? 'Sitio' : 'Servicio';
          this.title = localStorage.getItem('title');

        }
        this.rutaDashboard = modeBack === '1' ? true: false;
      }
      

    }
  
    ngAfterViewInit(): void {}
  
    reduce() {}
  
    public get width() {
      return window.innerWidth;
    }
  
    public get height() {
      return window.innerHeight;
    }
  
    fullSize() {
      if(this.type == 'DISPOSITIVO_DETALLE_METRICA'){
        this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.detalleMetrica+")");
      }else if(this.type == 'DISPOSITIVO_DETALLE_HISTORICO'){
        if(this.rutaDashboard){
          localStorage.setItem('full-type', 'ENLACES_AFECTACIONES');
          localStorage.removeItem('data-historico')
          this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.afectacionHistorico+")");
        }else{
          this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.historicoServicio+")");
        }
      }else{
        this.router.navigateByUrl(NAV.inicioCliente);
      }
    }

    detalleDispositivo(){
      this.spinnerLoading = true;
      let obj = localStorage.getItem('dispositivo');
      let metricaSeleccionada = localStorage.getItem('metrica-seleccionada');
      this.data = JSON.parse(obj);

      this.groupDevice = Number(localStorage.getItem('type-service')) == 3 ? 'Sitio' : 'Servicio';
      this.title = localStorage.getItem('nombreLargo');

      let request = {
        "fechaInicio": this.dayAgo,
        "fechaFin": moment().format().substring(0, 19),
        "idEmpresa": this.administratorService.getidClienteTotalplay(),
        "idServicio": "",
        "idDispositivo": this.data.dispositivo.idDispositivo,
        "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
        "folioTicket": "",
        "folioTicketExterno": "",
        "metrica": "",
        "tiempo": 'D',
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
          let dispositivo =  this.data.dispositivo.linegraph.filter(element => element.metrica == metricaSeleccionada);
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

      console.log("Data:",this.data)
      this.unit = metricaSeleccionada == 'Consumo' ? 'Mb' : '%';
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
  

}
