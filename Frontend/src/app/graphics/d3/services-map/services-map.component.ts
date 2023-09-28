import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

import * as d3 from 'd3';

import { ES_MX_LOCALE } from '../../../shared/const/es-mx-locale';
import { DateValue } from '../../../shared/model/date-value';
import { MarginConf } from '../../../shared/model/margin-conf';

import * as topojson from 'topojson-client';
import { GeometryCollection } from 'topojson-specification';
import { TopographyService } from 'src/app/shared/services/topography.service';
import d3Tip from 'd3-tip';
import { Mapa } from 'src/app/shared/model/dashboards.model';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import {
  latLng,
  tileLayer,
  MapOptions,
  Layer,
  marker,
  circleMarker,
  MarkerClusterGroupOptions,
  CircleMarker,
  icon,
  Icon,
} from 'leaflet';
import { MatOption } from '@angular/material/core';
@Component({
  selector: 'app-services-map',
  templateUrl: './services-map.component.html',
  styleUrls: ['./services-map.component.css'],
})
export class ServicesMapComponent implements AfterViewInit, OnInit {
  @ViewChild('svg', { static: false }) svgMapChart: ElementRef;
  @Input() data;
  @Input() showBackground: boolean = true;
  @Input() mapColor: string = '#c8def0';
  @Input() mapLine: string = '#f3fdff';
  @Input() dark: boolean = false;
  @Input() tooltipSize: number = 25;

  @Input() full: boolean = false;

  @Input() sizex: number;
  @Input() sizey: number;
  @Input() scale: number;
  @Input() margin?: MarginConf = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 30,
  };

  errorCarga: number = 0;
  width: number;
  height: number;
  selected: any;
  selectedMark: any;
  service: number;

  public svg: any;
  public g: any;
  public zoom: any;

  topography: any = Object;

  _dispositivo: string = '';
  totalDispositivosglobal: number;
  spinnerLoading: boolean = true;
  @Input() set dispositivo(val: string) {
    this._dispositivo = val;
  }
  get dispositivo() {
    return this._dispositivo;
  }

  carruselActual: number = 0;
  carruselNext: number;
  carruselBack: number;

  prueba: number = 1;
  mostrarMapa: boolean = false;
  mostrarCarrusel: boolean = true;
  totalDispositivos: number;
  markers: any[] = [];
  progressChartdata: any;
  isDarkTheme: Observable<boolean>;
  line: any;
  formatDate = d3.timeFormat('%d %B %Y, %I:%M %p');
  today: string = moment()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format();
  dayAgo: string = moment()
    .startOf('month')
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format();
  requireUpdate: Subscription;

  get options(): MapOptions {
    return {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          minZoom: 4,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          className: this.dark ? 'map-tiles-dark' : 'map-tiles',
        }),
      ],
      zoom: 4,
      maxBounds: [
        [32.768333333333, -118.45666666667],
        [14.5, -86.71],
      ],
      center: latLng(23.634501, -102.552784),
    };
  }

  optionsFull: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 5,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        className: this.dark ? 'map-tiles-dark' : 'map-tiles',
      }),
    ],
    zoom: 5,
    maxBounds: [
      [32.768333333333, -118.45666666667],
      [14.5, -86.71],
    ],
    center: latLng(23.634501, -102.552784),
  };

  layers: Layer[] = [];
  layersWithMark: Layer[] = [];

  clusterOptions: MarkerClusterGroupOptions = {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: false,
  };

  zoomLevel: number;
  message: boolean = false;
  constructor(
    private topographyService: TopographyService,
    private auth: AdministratorService,
    private el: ElementRef,
    private themeService: ThemeService,
    private alertService: AlertService,
    public spinner: NgxSpinnerService,
    private reloadDataService: ReloadDataService,
    private dashboardService: DashboardService
  ) {
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.service = Number(localStorage.getItem('type-service'));
          this.obtenerServicio();
        }
      },
    });
  }

  ngOnInit(): void {
    if (this.dark) {
      this.progressChartdata = {
        id: 'mapa-ligth',
        icono: 'assets/img/vista-arrow-down.svg',
        porcentaje: 0,
        total: 100,
        color: {
          colorPorcentaje: '#F95A36',
          colorFondo: '#161C33',
          colorCirculo: '#97969d',
        },
      };
    } else {
      this.progressChartdata = {
        id: 'mapa-dark',
        icono: 'assets/img/vista-arrow-down.svg',
        porcentaje: 0,
        total: 100,
        color: {
          colorPorcentaje: '#F95A36',
          colorFondo: '#FFFFFF',
          colorCirculo: '#FFFFFF',
        },
      };
    }
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.service = Number(localStorage.getItem('type-service'));
  }

  obtenerServicio() {
    console.log('************** Recargando mapa');
    this.spinnerLoading = true;
    let request = {
      fechaInicio: (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19),
      fechaFin: moment().format().substring(0, 19),
      idEmpresa: this.auth.getidClienteTotalplay()
        ? this.auth.getidClienteTotalplay()
        : 0,
      idServicio: '',
      idDispositivo: '',
      tipoDispositivo:
        Number(localStorage.getItem('type-service')) === 3 ? 'p' : 'i',
      folioTicket: '',
      folioTicketExterno: '',
      metrica: '',
      tiempo: 'D',
      ipNs: '',
      funcionalidad: ' ServiciosInalcanzablesMonitoreoMapa',
      full: this.full,
    };
    console.log('primero');
    this.dashboardService.obtenerServiciosInalcanzables(request).subscribe({
      next: (data) => {
        var start = window.performance.now();
        this.spinnerLoading = false;
        if(data.dispositivos.length == 0){
          this.message = true;
        }else{
          this.message = false;
        }
        console.log('Monitoreo mapa: ', data);
        if (data.dispositivos != null) {
          this.markers = [];
          this.errorCarga = 0;
          let tipoDispositivo;
          data.dispositivos.forEach((element) => {
            tipoDispositivo =
              element.tipoDispositivo == 'E' ? 'Enlaces' : 'ONT';

            this.markers.push({
              long:  element.longitud == '-' ? '19.334229' : Number(element.longitud.replace(',', '.')),
              lat: element.longitud == '-' ? '-99.198857' : Number(element.latitude.replace(',', '.')),
              group: element.group,
              size: 20,
              data: {
                tittle: element.punta,
                sitio: element.sitio,
                fecha: this.formatDate(new Date(element.fecha)),
                tipo: tipoDispositivo,
                enlace: element.enlace,
                ip: element.ip,
                tiempo: element.tiempo,
                total: Number(element.total),
                avance: Number(element.avance),
                estatus: element.estatus,
                group: element.group,
                alias: element.alias
              },
            });
          });
          console.log('Puntos', this.markers);

          this.layers = [];

          this.markers = this.markers.filter(
            (mark) => !Number.isNaN(mark.lat) && !Number.isNaN(mark.long)
          );

          console.log(this.markers);

          this.markers.forEach((markerP) => {
            const layerTemp: Layer = circleMarker([markerP.lat, markerP.long], {
              radius: markerP.size,
              fillColor: this.getMarkColor(markerP),
              color: this.getMarkColor(markerP),
            }).on('click', (e) => {
              this.selectedMark = this.markers.find(
                (mk) =>
                  mk.lat == e.target._latlng.lat &&
                  mk.long == e.target._latlng.lng
              );

              if (this.selectedMark) {
                this.selected = this.selectedMark.data;
                this.updateLayersWithMark();
              }
            });
            this.layers.push(layerTemp);
          });
          this.selectedMark = this.markers[0];
          this.selected = this.selectedMark?.data;

          this.updateLayersWithMark();

          this.progressChartdata.porcentaje = this.selected.avance;
          this.progressChartdata.total = this.selected.total;
          console.log("Numero de puntos",this.markers.length);
          this.totalDispositivos = data.dispositivos.length;
          console.log("Numero de puntos",this.totalDispositivos);
          this.changeCarruselCard();

          /* this.totalDispositivosglobal = Number(
            localStorage.getItem('totalDispositivos')
          ); */
          this.totalDispositivosglobal = this.totalDispositivos;

          if (this.totalDispositivos > 1) {
            this.mostrarCarrusel = true;
          } else {
            this.mostrarCarrusel = false;
          }
        } else {
          this.mostrarMapa = false;
          this.mostrarCarrusel = false;
          this.errorCarga = 0;
        }
        
        var end = window.performance.now();
        console.log(`Tiempo execusion Mapa: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1;
        this.mostrarMapa = false;
        this.spinnerLoading = false;
      },
    });
  }

  getMarkColor(mark: any) {
    return mark?.group == 'A' ? '#F95A36' : '#4A4A4A';
  }

  ngAfterViewInit(): void {
    this.setDimensions();
    this.topographyService.getTopographyData().subscribe((topography: any) => {
      this.topography = topography;

      // this.draw(topography);
    });
  }

  private setDimensions() {
    this.width = this.sizex - this.margin.left - this.margin.right;
    this.height = this.sizey - this.margin.top - this.margin.bottom;
  }

  public verlog(algo: any) {
    const prevZoom = Number(this.zoomLevel);
    this.zoomLevel = algo.target._zoom;
    console.log(this.zoomLevel, prevZoom);

    if (this.zoomLevel > 6 && prevZoom <= 6) {
      console.log((this.layers[0] as CircleMarker).options.radius);

      this.layers = this.layers.map((lay) => {
        (lay as CircleMarker).options.radius =
          (lay as CircleMarker).options.radius + 100;
        return lay;
      });

      console.log((this.layers[0] as CircleMarker).options.radius);
    } else if (this.zoomLevel <= 6 && prevZoom > 6) {
      console.log((this.layers[0] as CircleMarker).options.radius);

      this.layers = this.layers.map((lay) => {
        (lay as CircleMarker).options.radius =
          (lay as CircleMarker).options.radius - 100;
        return lay;
      });

      console.log((this.layers[0] as CircleMarker).options.radius);
    }

    this.layersWithMark = [];
    this.updateLayersWithMark();
  }

  updateLayersWithMark() {
    this.layersWithMark = [...this.layers];

    this.layersWithMark.push(
      marker([this.selectedMark.lat, this.selectedMark.long], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
        }),
      })
    );
  }

  /**
   * @deprecated
   *
   * @param {*} topography
   * @return {*}
   * @memberof ServicesMapComponent
   */
  draw(topography) {
    this.mostrarMapa = true;
    this.svg = d3
      .select(this.svgMapChart.nativeElement)
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    const projection = d3
      .geoMercator()
      .scale(this.scale)
      .center([-102.552784, 23.634501])
      .translate([this.width / 2, this.height / 2]);

    const path = d3.geoPath().projection(projection);

    let markers;
    markers = [
      {
        long: -116.118165,
        lat: 31.954102,
        group: 'A',
        size: 3,
        data: {
          tittle: 'Anillo Perif. 2767',
          sitio: 'CSP10901410',
          fecha: '02 Enero 2023, 01:12 PM',
          tipo: 'ONT',
          enlace: '10.115.95.46874',
          ip: '48575443A82FF93A',
          estatus: 'Inactivo',
          group: 'A',
        },
      },
      {
        long: -103.685303,
        lat: 20.636747,
        group: 'B',
        size: 4,
        data: {
          tittle: 'Francisco P. Miranda 177',
          sitio: 'CSP10901399',
          fecha: '02 Enero 2023, 02:32 PM',
          tipo: 'ONT',
          enlace: '10.115.95.6711',
          ip: '48575443EE4FDD61',
          estatus: 'Sin gestión',
          group: 'B',
        },
      },
      {
        long: -88.403319,
        lat: 20.895167,
        group: 'A',
        size: 9,
        data: {
          tittle: 'Prolongación Salvador Díaz',
          sitio: 'CSP10901495',
          fecha: '02 Enero 2023, 06:55 PM',
          tipo: 'ONT',
          enlace: '10.115.95.234008',
          ip: '48575443FF5E399C',
          estatus: 'Inactivo',
          group: 'A',
        },
      },
    ];

    /* const markers = [
        {long: -116.118165, lat: 31.954102, group: "A", size: 8, data: {tittle: "Anillo Perif. 2767", sitio: "CSP10901410", fecha: "02 Enero 2023, 01:12 PM", tipo: "ONT", enlace: "10.115.95.46874", ip: "48575443A82FF93A"}},
        {long: -108.457031, lat: 27.165473, group: "A", size: 10, data: {tittle: "Av. Marina Nacional 60", sitio: "485754439728FE56", fecha: "02 Enero 2023, 03:32 PM", tipo: "ONT", enlace: "10.115.95.7236", ip: "192.168.1.0.2"}},
        {long: -105.336914, lat: 25.511461, group: "A", size: 4, data: {tittle: "Oklahoma 14", sitio: "485754439561B8A5", fecha: "02 Enero 2023, 02:55 AM", tipo: "ONT", enlace: "10.115.95.6867234", ip: "192.168.1.0.3"}},
        {long: -98.635254, lat: 25.114047, group: "A", size: 14, data: {tittle: "Av. Othón de Mendizábal 195", sitio: "48575443A377F79C", fecha: "02 Enero 2023, 06:13 PM", tipo: "ONT", enlace: "10.115.95.2534", ip: "192.168.1.0.4"}},
        {long: -102.465819, lat: 22.148828, group: "A", size: 10, data: {tittle: "Poniente 44 3915", sitio: "48575443AD0AB69C", fecha: "02 Enero 2023, 02:25 PM", tipo: "ONT", enlace: "10.115.95.872364", ip: "192.168.1.0.5"}},
        {long: -105.073242, lat: 20.209367, group: "A", size: 9, data: {tittle: "Lieja 7", sitio: "485754430EF6F69C", fecha: "02 Enero 2023, 01:15 AM", tipo: "ONT", enlace: "10.115.95.542376", ip: "192.168.1.0.6"}},
        {long: -103.685303, lat: 20.636747, group: "A", size: 4, data: {tittle: "Francisco P. Miranda 177", sitio: "CSP10901399", fecha: "02 Enero 2023, 02:32 PM", tipo: "ONT", enlace: "10.115.95.6711", ip: "48575443EE4FDD61"}},
        {long: -101.938476, lat: 19.368591, group: "A", size: 10, data: {tittle: "Calzada Arenal 134", sitio: "48575443EE4FDD61", fecha: "02 Enero 2023, 03:21 AM", tipo: "ONT", enlace: "10.115.95.28763", ip: "192.168.1.0.8"}},
        {long: -96.767578, lat: 17.170971, group: "A", size: 10, data: {tittle: "Casino Casahonda	15", sitio: "48575443956873A5", fecha: "02 Enero 2023, 05:43 PM", tipo: "ONT", enlace: "10.115.95.11946", ip: "192.168.1.0.9"}},
        {long: -99.847412, lat: 19.650024, group: "A", size: 8, data: {tittle: "Casino Casahonda	15", sitio: "48575443699990A4", fecha: "02 Enero 2023, 04:22 PM", tipo: "ONT", enlace: "10.115.95.09823", ip: "192.168.1.0.10"}},
        {long: -99.353027, lat: 19.250002, group: "A", size: 8, data: {tittle: "Calle Niño Jesús	2", sitio: "48575443956872A5", fecha: "02 Enero 2023, 05:11 AM", tipo: "ONT", enlace: "10.115.95.70983", ip: "192.168.1.0.11"}},
        {long: -98.364258, lat: 18.813801, group: "A", size: 8, data: {tittle: "Chimalpopoca 135", sitio: "485754439434869D", fecha: "02 Enero 2023, 01:11 AM", tipo: "ONT", enlace: "10.115.95.802364", ip: "192.168.1.0.12"}},
        {long: -100.191650, lat: 20.746375, group: "A", size: 12, data: {tittle: "Plaza San Pablo 13", sitio: "48575443B59CC19C", fecha: "02 Enero 2023, 09:32 PM", tipo: "ONT", enlace: "10.115.95.49902", ip: "192.168.1.0.13"}},
        {long: -99.114990, lat: 20.396659, group: "A", size: 18, data: {tittle: "Aniceto Ortega 1321", sitio: " 4857544301384EA5", fecha: "02 Enero 2023, 03:21 PM", tipo: "ONT", enlace: "10.115.95.330073", ip: "192.168.1.0.14"}},
        {long: -98.027344, lat: 19.839598, group: "A", size: 12, data: {tittle: "Benjamín Franklin 132", sitio: "485754433586D29D", fecha: "02 Enero 2023, 03:34 AM", tipo: "ONT", enlace: "10.115.95.990234", ip: "192.168.1.0.15"}},
        {long: -99.470215, lat: 21.245542, group: "A", size: 4, data: {tittle: "Gustavo E. Campa 54", sitio: "485754439568A0A5", fecha: "02 Enero 2023, 05:40 AM", tipo: "ONT", enlace: "10.115.95.55098", ip: "192.168.1.0.16"}},
        {long: -88.403319, lat: 20.895167, group: "A", size: 9, data: {tittle: "Prolongación Salvador Díaz", sitio: "CSP10901495", fecha: "02 Enero 2023, 06:55 PM", tipo: "ONT", enlace: "10.115.95.234008", ip: "48575443FF5E399C"}}
      ]; */

    const enlaces = [
      /* {long1: -116.118165, lat1: 31.954102, long2: -108.457031, lat2: 27.165473, group: "A", size: 8, data: {tittle: "Enlace 01", sitio: "1321-FG454-1DV", fecha: "03 Mayo 2022, 01:12 PM", tipo: "ROUTER", enlace: "11.321.43.98765", ip: "192.168.1.0.1"}},
        {long1: -105.073242, lat1: 20.209367, long2: -99.847412, lat2: 19.650024, group: "A", size: 8, data:  {tittle: "Enlace 02", sitio: "1534-OU547-98J", fecha: "11 Agosto 2022, 01:12 PM", tipo: "CPE", enlace: "10.874.44.17238", ip: "192.168.1.0.1"}},
        {long1: -100.191650, lat1: 20.746375, long2: -88.403319, lat2: 20.895167, group: "A", size: 8, data:  {tittle: "Enlace 03", sitio: "3451-MK567-99D", fecha: "07 Febrero 2022, 01:12 PM", tipo: "RADIO", enlace: "11.123.98.67895", ip: "192.168.1.0.1"}},
        {long1: -102.465819, lat1: 22.148828, long2: -88.403319, lat2: 20.895167, group: "A", size: 8, data:  {tittle: "Enlace 04", sitio: "5367-LP684-07N", fecha: "03 Noviembre 2022, 01:12 PM", tipo: "ONT", enlace: "10.887.78.23456", ip: "192.168.1.0.1"}}, */
    ];

    const size = d3.scaleLinear().domain([1, 100]).range([1, 30]);

    let color = d3
      .scaleOrdinal()
      .domain(['A', 'B', 'C'])
      .range(['#CB0000', '#697181', '#8FD175']);

    let colorFiller = d3
      .scaleOrdinal()
      .domain(['A', 'B', 'C'])
      .range(['#F95A36', '#C4C4C4', '#8FD175']);

    this.svg.selectAll('path').remove();
    this.svg.selectAll('circle').remove();
    this.svg.selectAll('line').remove();

    this.g = this.svg.append('g');

    this.g
      .append('path')
      .datum(topojson.feature(topography, topography?.objects?.MEX_adm1))
      .attr('fill', (d) => this.mapColor)
      .attr('stroke', this.mapLine)
      .attr('d', path);

    var tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-2, 0])
      .html((d) => {
        return (
          "<div class='image-dashboard-tooltip-mapa' style='width:" +
          this.tooltipSize +
          'px; height: ' +
          this.tooltipSize +
          "px;'></div>"
        );
      });

    this.svg.call(tip);
    this.g
      .selectAll('myCircles')
      .data(this.markers)
      .join('circle')
      .attr('cx', (d) => projection([d.long, d.lat])[0])
      .attr('cy', (d) => projection([d.long, d.lat])[1])
      .attr('r', (d) => size(d.size))
      .style('fill', (d) => colorFiller(d.group))
      .style('cursor', 'pointer')
      .attr('stroke', (d) => color(d.group))
      .attr('stroke-width', 1.5)
      .attr('fill-opacity', 1)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', (data) => {
        this.selected.tittle = data.target.__data__.data.tittle;
        this.selected.sitio = data.target.__data__.data.sitio;
        this.selected.tipo = data.target.__data__.data.tipo;
        this.selected.enlace = data.target.__data__.data.enlace;
        this.selected.ip = data.target.__data__.data.ip;
        this.selected.fecha = data.target.__data__.data.fecha;
        this.selected.tiempo = data.target.__data__.data.tiempo;
        this.selected.estatus = data.target.__data__.data.estatus;
        this.selected.group = data.target.__data__.data.group;
        this.progressChartdata.porcentaje = data.target.__data__.data.avance;
        this.progressChartdata.total = data.target.__data__.data.total;
      });

    /* this.svg.selectAll("line")
      .remove(); */

    /* let data = [{
        "source": {
            "lat": 31.954102,
            "lon": -116.118165
        },
        "destination": {
            "lat": 27.165473,
            "lon": -108.457031
        }
      }]

      var line = d3.line()
      .x(function(d) {
        return projection([d.lon,d.lat])[0];
      })
      .y(function(d) {
        return projection([d.lon,d.lat])[1];
      })
      .curve(d3.curveCardinal.tension(0.5));

      this.svg.selectAll(null)
      .data(data)
      .enter()
      .append("path")
      .datum(function(d) {
        return [d.source,d.destination];
      })
      .attr("d", line)
      .style("stroke","black")
      .style("stroke-width", 1.5);  */

    this.svg
      .selectAll('line')
      .data(enlaces)
      .enter()
      .append('line')
      .attr('x1', (d) => projection([d.long1, d.lat1])[0])
      .attr('y1', (d) => projection([d.long1, d.lat1])[1])
      .attr('x2', (d) => projection([d.long2, d.lat2])[0])
      .attr('y2', (d) => projection([d.log2, d.lat2])[1])
      .style('cursor', 'pointer')
      .style('stroke', '#F95A36')
      .style('stroke-width', 2)
      .on('click', (data) => {
        this.selected.tittle = data.target.__data__.data.tittle;
        this.selected.sitio = data.target.__data__.data.sitio;
        this.selected.tipo = data.target.__data__.data.tipo;
        this.selected.enlace = data.target.__data__.data.enlace;
        this.selected.ip = data.target.__data__.data.ip;
        this.selected.fecha = data.target.__data__.data.fecha;
        this.selected.tiempo = data.target.__data__.data.tiempo;
        this.selected.estatus = data.target.__data__.data.estatus;
        this.selected.group = data.target.__data__.data.group;
        this.progressChartdata.porcentaje = data.target.__data__.data.avance;
        this.progressChartdata.total = data.target.__data__.data.total;
      });

    this.zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [this.width, this.height],
      ])
      .on('zoom', (event) => {
        this.svg.selectAll('line').attr('transform', event.transform);

        let size = 20 * Number(event.transform.k);
        if (size < 25) {
          this.tooltipSize = 25;
        } else {
          this.tooltipSize = size;
        }
        return this.g.attr('transform', event.transform);
      });
    this.zoom.scaleBy(this.svg.transition().duration(10), 1 / 1.5);

    this.svg.call(this.zoom);

    return this.svg.node();
  }

  // public zoomIn() {
  //   this.zoom.scaleBy(this.svg.transition().duration(750), 1.5);
  // }

  // public zoomOut() {
  //   this.zoom.scaleBy(this.svg.transition().duration(750), 1 / 1.5);
  // }

  public get innerwidth() {
    return window.innerWidth;
  }

  crearTicket() {
    // this.spinner.show();
    let request = {
      categoria: 'string',
      descripcion: ['string'],
      diagnosticoInicial: 'string',
      estatus: 'string',
      grupo: 'string',
      idItsm: 'string',
      organizacion: 'string',
      proactivoReactivo: 'string',
      puntaId: 'string',
      regCiuId: 'string',
      resumen: 'string',
      solicitadoPor: 'string',
      tenant: 'string',
      ticketExterno: 'string',
      tipo: 'string',
      tipoRed: 'string',
      url: 'string',
      numeroTicket: 'string',
    };
    this.dashboardService.monitoreoMapaCrearTicket(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.alertService.success('<b>Ticket creado correctamante</b>');
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('<b>Error al crear ticket</b>');
      },
    });
  }

  selectDataCard(idCard) {
    this.carruselActual = idCard;
    this.selected = this.markers[idCard].data;
    this.progressChartdata.porcentaje = this.selected.avance;
    this.progressChartdata.total = this.selected.total;

    this.changeCarruselCard();
  }

  changeCarruselCard() {
    console.log(this.markers);
    for (let index = 0; index < 2; index++) {
      if (index == 0) {
        if (this.carruselActual == 0) {
          this.carruselBack = this.markers.length - 1;
        } else {
          this.carruselBack = this.carruselActual - 1;
        }
      } else {
        if (this.carruselActual == this.markers.length - 1) {
          this.carruselNext = 0;
        } else {
          this.carruselNext = this.carruselActual + 1;
        }
      }
    }
  }

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }
}
