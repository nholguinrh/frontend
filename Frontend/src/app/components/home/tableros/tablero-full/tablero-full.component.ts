import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-tablero-full',
  templateUrl: './tablero-full.component.html',
  styleUrls: ['./tablero-full.component.css'],
})
export class TableroFullComponent implements OnInit, AfterViewInit {
  public type: string = '';
  public title: string = '';
  public child: number;
  isDarkTheme: Observable<boolean>;
  public dark: boolean;
  colorFull: string;
  viewGraph: number = 1;
  typeGraph: number = 1;
  objectGraph: any;
  scale: 'week' | 'day' | 'hour' = 'day';
  marginEnlace: MarginConf = {
    top: 20,
    right: 20,
    bottom: 100,
    left: 100,
  };
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-10 00:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 00:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 00:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 00:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 00:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 00:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 00:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 00:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 00:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 00:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 00:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 00:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 01:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 01:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 01:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 01:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 01:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 01:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 01:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 01:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 01:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 01:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 01:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 01:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 02:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 02:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 02:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 02:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 02:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 02:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 02:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 02:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 02:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 02:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 02:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 02:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 03:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 03:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 03:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 03:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 03:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 03:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 03:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 03:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 03:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 03:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 03:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 03:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 04:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 04:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 04:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 04:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 04:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 04:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 04:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 04:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 04:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 04:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 04:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 04:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 05:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 05:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 05:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 05:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 05:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 05:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 05:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 05:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 05:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 05:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 05:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 05:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 06:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 06:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 06:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 06:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 06:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 06:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 06:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 06:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 06:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 06:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 06:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 06:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 07:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 07:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 07:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 07:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 07:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 07:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 07:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 07:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 07:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 07:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 07:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 07:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 08:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 08:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 08:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 08:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 08:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 08:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 08:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 08:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 08:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 08:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 08:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 08:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 09:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 09:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 09:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 09:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 09:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 09:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 09:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 09:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 09:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 09:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 09:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 09:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 10:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 10:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 10:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 10:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 10:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 10:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 10:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 10:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 10:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 10:45:00.000000'), value: 82 },
    { date: new Date('2022-10-10 10:50:00.000000'), value: 84 },
    { date: new Date('2022-10-10 10:55:00.000000'), value: 81 },

    { date: new Date('2022-10-10 11:00:00.000000'), value: 69 },
    { date: new Date('2022-10-10 11:05:00.000000'), value: 70 },
    { date: new Date('2022-10-10 11:10:00.000000'), value: 71 },
    { date: new Date('2022-10-10 11:15:00.000000'), value: 81 },
    { date: new Date('2022-10-10 11:20:00.000000'), value: 82 },
    { date: new Date('2022-10-10 11:25:00.000000'), value: 81 },
    { date: new Date('2022-10-10 11:30:00.000000'), value: 83 },
    { date: new Date('2022-10-10 11:35:00.000000'), value: 86 },
    { date: new Date('2022-10-10 11:40:00.000000'), value: 83 },
    { date: new Date('2022-10-10 11:45:00.000000'), value: 82 },
  ];

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

  typeNumber: number;
  typeService: string;
  range: '1h' | '4h' | '24h' | '7d' | '14d' | '30d';

  constructor(
    private router: Router,
    private changeGraphService: ChangeGraphService,
    private themeService: ThemeService
  ) {}

  changeTablero(t: number) {}

  ngOnInit(): void {
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
      if (this.type == 'RESOLUCION_INTERFACES') {
        this.typeNumber = 0;
      } else if (this.type == 'RESOLUCION_METRICAS') {
        this.typeNumber = 1;
      } else {
        this.typeNumber = 2;
      }
    }
    let title = localStorage.getItem('full-type-title');
    if (title != null) {
      this.title = String(title);
    }

    let child = localStorage.getItem('full-type-child');
    if (child != null) {
      this.child = Number(child);
    }

    let typeService = localStorage.getItem('type-service');
    if (typeService != null) {
      this.typeService =
        Number(typeService) == 1
          ? 'Enlaces'
          : Number(typeService) == 2
          ? 'Sitios'
          : 'Servicios';
    }

    const range = localStorage.getItem('rangoTiempo') || '1h';
    this.range = range as '1h' | '4h' | '24h' | '7d' | '14d' | '30d';

    this.getEnlace();
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
      this.router.navigateByUrl(NAV.inicioCliente);
  }

  getEnlace() {
    // TODO: Definir el método correcto para obtener la información del enlace en base al formulario
    const today = moment();
    let startDate = today;
    let enlaceTemp = [];
    switch (this.range) {
      case '1h':
        startDate = today.add(-1, 'hour').add(-1, 'minute').startOf('minute');

        for (let index = 0; index < 60; index++) {
          enlaceTemp.push({
            date: startDate.add(1, 'minute').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }
        this.enlace = enlaceTemp;
        break;

      case '4h':
        startDate = today.add(-4, 'hour').startOf('minute');
        for (let index = 0; index < 24; index++) {
          enlaceTemp.push({
            date: startDate.add(10, 'minutes').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }

        this.enlace = enlaceTemp;

        break;

      case '24h':
        startDate = today.startOf('hour').add(-24, 'hours');

        for (let index = 0; index < 24; index++) {
          enlaceTemp.push({
            date: startDate.add(1, 'hour').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }

        this.enlace = enlaceTemp;

        break;

      case '7d':
        startDate = today.startOf('hour').add(-7, 'days');

        for (let index = 0; index < 28; index++) {
          enlaceTemp.push({
            date: startDate.add(6, 'hours').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }
        this.enlace = enlaceTemp;

        break;

      case '14d':
        startDate = today.startOf('day').add(-14, 'days');

        for (let index = 0; index < 14; index++) {
          enlaceTemp.push({
            date: startDate.add(1, 'day').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }
        this.enlace = enlaceTemp;

        break;
      case '30d':
        startDate = today.startOf('day').add(-30, 'days');

        for (let index = 0; index < 30; index++) {
          enlaceTemp.push({
            date: startDate.add(1, 'day').toDate(),
            value: 20,
            interface: '5552120137',
          });
        }
        this.enlace = enlaceTemp;

        break;
    }
  }
}
