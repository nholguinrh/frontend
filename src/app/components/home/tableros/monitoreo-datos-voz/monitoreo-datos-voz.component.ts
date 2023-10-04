import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import SwiperCore, { Keyboard, Pagination, Navigation, Virtual } from 'swiper';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
SwiperCore.use([Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'smc-monitoreo-voz',
  templateUrl: './monitoreo-datos-voz.component.html',
  styleUrls: ['./monitoreo-datos-voz.component.css']
})
export class MonitoreoDatosVozComponent implements OnInit {

  slides$ = new BehaviorSubject<string[]>(['']);
  isDarkTheme: Observable<boolean>;
  metricasVoz: any[] = []
  
  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 20 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 35 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 53 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 36 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 23 },
  ];


  colorFull: string = '#285CED';
  colorFullDark: string = '#EEF1F8';
  borderFull: boolean = true;
  tooltipColor: string = 'rgba(151,175,243, 0.2)';
  spinnerLoading: boolean = false;


  dateRange = new FormGroup({
    start: new FormControl('2023-03-05'),
    end: new FormControl('2023-03-06')
  });

  public form: FormGroup;
  requireUpdateIdDispositivo: Subscription;
  idDispositivoseleccionado: string;

  _images: any[] = [];
  requireUpdate: Subscription;
  isFirst: boolean = true;

  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private auth: AdministratorService,
    public dashboardService: DashboardService,
    private changeGraphService:ChangeGraphService,
    private reloadDataService: ReloadDataService,
    public spinner: NgxSpinnerService) { 
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          console.log("Response:: => ",response)
          if (response && !this.isFirst) {
            console.log("Refrescando Voz:::");
            this.servicioCarruselMetrica();
          }
        },
      });
    }

  ngOnInit(): void {
    localStorage.setItem('type-service', '3');
    this.requireUpdateIdDispositivo = this.changeGraphService.enviarflagObservableDisp.subscribe((response) => {
      if (response) {
        console.log("Id Dispositivo Monitotreom Vozs {",response,"}");
        this.idDispositivoseleccionado = response;
        if(this.idDispositivoseleccionado != '0'){
          this.servicioCarruselMetrica();
        }else{
          this.spinnerLoading = false;
        }
      }
    });

    this.slides$.next(
      Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`)
    );
    this.dateValueWeek = this.dateValueWeek.reverse();
    this.isDarkTheme = this.themeService.isDarkTheme;

    this.isDarkTheme.subscribe((val: boolean) => 
      setTimeout(() => {
      }, 500)
    );

    //this.servicioCarruselMetrica();
  }

  servicioCarruselMetrica(){
    this._images = []
    this.spinnerLoading = true;
    this.isFirst = false;
    let body = {
      "fechaInicio": moment().set({'second': 0, 'millisecond': 0}).subtract(1, 'hour').format(),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idDispositivo": this.idDispositivoseleccionado,
      "tiempo": 'M',
      "metrica": ""
    };
    if(this.idDispositivoseleccionado != '0'){
      this.dashboardService.obtenerMetricasCarrusel(body).subscribe({
        next: (data) => { 
          var start = window.performance.now(); 
          this._images.push({path: '', width: 0, height: 0})
          this.metricasVoz = data.metricas;
          this.metricasVoz.forEach(element => {
            element.data.forEach(e => {
              e.data = new Date(e.data) 
            });
            this._images.push({path: '', width: 0, height: 0})
          });        
          this.spinnerLoading = false;
          console.log("Data: ",this.metricasVoz);
  
          var end = window.performance.now();
          console.log(`Tiempo execusion Metricas Carrusel Voz: ${((end - start)/1000).toFixed(5)} segundos`);
        },
        error: (error) => { 
          this.spinnerLoading = false;
          console.log(error)
        }
      });
    }else{
      this.spinnerLoading = false;
    }
  }

  public get width() {
    return window.innerWidth;
  }
  
}
