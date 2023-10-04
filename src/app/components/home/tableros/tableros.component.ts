import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { BoxplotComponent } from 'src/app/graphics/d3/boxplot/boxplot.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Estadistica } from 'src/app/shared/model/cliente.model';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable } from 'rxjs';
import { DateValue } from '../../../shared/model/date-value';
import { MatDialog } from '@angular/material/dialog';
import { MarginConf } from 'src/app/shared/model/margin-conf';

let maxYearlyPredictedTemperature = JSON.parse(
  '[-15.4457804362, -15.0457804362, -5.4117743174, 0.4117743174,16.2549273173,17.2232958476]'
);
let minYearlyPredictedTemperature = JSON.parse(
  '[-15.4457804362, -6.4117743174, -12.443508784, -4.9721690814,4.7837347984, 10.8821338018]'
);

@Component({
  templateUrl: './tableros.component.html',
  styleUrls: ['./tableros.component.css'],
})
export class TablerosComponent implements OnInit, AfterViewChecked, OnDestroy {
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-10'), value: 5.1 },
    { date: new Date('2022-10-11'), value: 4.93 },
    { date: new Date('2022-10-12'), value: 2.1 },
    { date: new Date('2022-10-13'), value: 3.5 },
    { date: new Date('2022-10-14'), value: 4.25 },
    { date: new Date('2022-10-15'), value: 3.24 },
    { date: new Date('2022-10-16'), value: 5.2 },
    { date: new Date('2022-10-17'), value: 5.6 },
  ];

  datatickets = [
    { date: new Date('2022-10-01 06:12:58.911982'), media: "Curso", spending: 1 },
    { date: new Date('2022-10-02 06:12:58.911982'), media: "Curso", spending: 10 },
    { date: new Date('2022-10-03 06:12:58.911982'), media: "Curso", spending: 26 },
    { date: new Date('2022-10-04 06:12:58.911982'), media: "Curso", spending: 20 },
    { date: new Date('2022-10-05 06:12:58.911982'), media: "Curso", spending: 21 },
    { date: new Date('2022-10-06 06:12:58.911982'), media: "Curso", spending: 50 },
    { date: new Date('2022-10-07 06:12:58.911982'), media: "Curso", spending: 55 },
    { date: new Date('2022-10-08 06:12:58.911982'), media: "Curso", spending: 50 },
    { date: new Date('2022-10-09 06:12:58.911982'), media: "Curso", spending: 70 },

    { date: new Date('2022-10-01 06:12:58.911982'), media: "Resuelto", spending: 1 },
    { date: new Date('2022-10-02 06:12:58.911982'), media: "Resuelto", spending: 1 },
    { date: new Date('2022-10-03 06:12:58.911982'), media: "Resuelto", spending: 1 },
    { date: new Date('2022-10-04 06:12:58.911982'), media: "Resuelto", spending: 30 },
    { date: new Date('2022-10-05 06:12:58.911982'), media: "Resuelto", spending: 40 },
    { date: new Date('2022-10-06 06:12:58.911982'), media: "Resuelto", spending: 56 },
    { date: new Date('2022-10-07 06:12:58.911982'), media: "Resuelto", spending: 0 },
    { date: new Date('2022-10-08 06:12:58.911982'), media: "Resuelto", spending: 0 },
    { date: new Date('2022-10-09 06:12:58.911982'), media: "Resuelto", spending: 0 }
  ];

  @ViewChild('box') box: BoxplotComponent;
  vistaGeneralSlider: boolean = false;
  tablero: number = 1;
  servicedata = [
    0.6, 0.7, 0.81, 0.83, 0.87, 0.89, 0.69, 0.71, 0.82, 0.72, 0.88, 0.79, 0.86,
    0.68, 0.75, 0.8,
  ];
  servicedata2 = [
    0.5, 0.6, 0.63, 0.67, 0.64, 0.62, 0.69, 0.71, 0.72, 0.8, 0.88, 0.79, 0.61,
    0.65, 0.73, 0.78,
  ];
  servicedata3 = [
    0.9, 0.89, 0.88, 0.84, 0.82, 0.83, 0.85, 0.86, 0.72, 0.77, 0.78, 0.87, 0.76,
    0.78, 0.73, 0.87,
  ];
  estadisticaList: Estadistica[] = [
    { name: 'Disponibilidad', value: '83%', change: '+17%', estatus: 0 },
    { name: 'Alcanzabilidad', value: '49%', change: '+51%', estatus: 2 },
    { name: 'Pérdida de paquetes', value: '02%', change: '+98%', estatus: 0 },
    { name: 'Consumo', value: '81%', change: '+19%', estatus: 2 },
  ];
  margin?: MarginConf = {
    top: 20,
    right: 0,
    bottom: 10,
    left: 20,
  };

  isDarkTheme: Observable<boolean>;
  constructor(
    public chartElem: ElementRef,
    private themeService: ThemeService,
    private cdref: ChangeDetectorRef,
    private router: Router,
  ) {
    this.data = [
      {
        label: 'avg',
        legend: 'The Average temperature',
        data: [
          9.9689868291, 10.9689868291, 11.9689868291, 12.9689868291,
          14.9689868291, 15.9689868291, 16.9689868291,
        ],
        color: 'green',
      },
      {
        label: 'low',
        legend: 'The Min temperature',
        data: [
          8.9689868291, 9.9689868291, 10.9689868291, 11.9689868291,
          12.9689868291, 13.9689868291, 14.9689868291,
        ],
        color: 'blue',
      },
      {
        label: 'height',
        legend: 'The Max temperature',
        data: [
          11.9689868291, 12.9689868291, 14.9689868291, 16.9689868291,
          19.9689868291, 19.9689868291, 18.9689868291,
        ],
        color: 'red',
      },
    ];
  }

  ngAfterViewChecked(): void {
    this.cdref.detectChanges();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.isDarkTheme = this.themeService.isDarkTheme;
  }

  sliderChange() {
    this.vistaGeneralSlider = !this.vistaGeneralSlider;
  }

  changeTablero(t: number) {
    this.tablero = t;
  }

  expand() {
    this.ngOnDestroy();
  }

  public data;
  public dataLowTmp;
  public dataHeightTmp;
  lineChartLabels = [
    '2006',
    '2007',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
    '2028',
    '2029',
    '2030',
    '2031',
    '2032',
    '2033',
    '2034',
    '2035',
    '2036',
    '2037',
    '2038',
    '2039',
    '2040',
    '2041',
    '2042',
    '2043',
    '2044',
    '2045',
    '2046',
    '2047',
    '2048',
    '2049',
    '2050',
  ];
  public xLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];

  lineChartdata = [
    {
      legend: 'Este mes, 2450',
      label: 'Maximum Temperature',
      data: maxYearlyPredictedTemperature,
      color: '#F7B500',
    },
    {
      legend: 'Mayo, 1,040',
      label: 'Minimum Temperature',
      data: minYearlyPredictedTemperature,
      color: '#00CF99',
    },
  ];

  progressChartdata = {
    icono: 'vista-arrow-down.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#FF7F5C',
      colorFondo: '#FFFFFF',
      colorCirculo: '#FFFFFF',
    },
  };

  progressChartdata2 = {
    icono: 'assets/img/home-vista.svg',
    porcentaje: 55,
    total: 100,
    color: {
      colorPorcentaje: '#285CED',
      colorFondo: 'black',
      colorCirculo: '#FFFFFF',
    },
  };

  progressChartdata3 = {
    icono: '',
    porcentaje: 5,
    total: 6,
    color: {
      colorPorcentaje: '#FF2F5E',
      colorFondo: '#FFFFFF',
      colorCirculo: '#FFFFFF',
    },
  };

    linegraph = {
      data : [{'y': 70, 'x': 1},
              {'y': 50, 'x': 2},
              {'y': 70, 'x': 3},
              {'y': 70, 'x': 4},
              {'y': 60, 'x': 5},
              {'y': 70, 'x': 6},
              {'y': 65, 'x': 7},
              {'y': 50, 'x': 8},
              {'y': 70, 'x': 9},
              {'y': 50, 'x': 10},
              {'y': 70, 'x': 11},
              {'y': 70, 'x': 12},
              {'y': 60, 'x': 13},
              {'y': 70, 'x': 14},
              {'y': 65, 'x': 15},
              {'y': 50, 'x': 16},
              {'y': 70, 'x': 17},
              {'y': 50, 'x': 18},
              {'y': 70, 'x': 19},
              {'y': 70, 'x': 20},
              {'y': 60, 'x': 21},
              {'y': 100, 'x': 23},
              {'y': 65, 'x': 24},
              {'y': 50, 'x': 25},
              {'y': 70, 'x': 26},
              {'y': 50, 'x': 27},
              {'y': 70, 'x': 28},
              {'y': 70, 'x': 29},
              {'y': 60, 'x': 30},
              {'y': 70, 'x': 31},
              {'y': 65, 'x': 32},
              {'y': 50, 'x': 33}],
      color : '#FF0D0D',
    }
}
