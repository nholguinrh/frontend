import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';

@Component({
  selector: 'smc-voz-duracion-llamada',
  templateUrl: './voz-duracion-llamada.component.html',
  styleUrls: ['./voz-duracion-llamada.component.css']
})
export class VozDuracionLlamadaComponent implements OnInit {

  @Input() isFull: boolean = false;

  isDarkTheme: Observable<boolean>;
  duracionLlamada: any;
  tooltipColor: string = 'rgba(151,175,243, 0.2)';
  spinnerLoading: boolean = false;

  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 20 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 35 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 53 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 36 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 23 },
  ];

  requireUpdateIdDispositivo: Subscription;
  idDispositivoseleccionado: string;
  requireUpdate: Subscription;
  isFirst: boolean = true;
  errorCarga:number = 0
  constructor(private themeService: ThemeService
    ,public dashboardService: DashboardService,
    private auth: AdministratorService,
    private changeGraphService:ChangeGraphService,
    private reloadDataService: ReloadDataService,
    public spinner: NgxSpinnerService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          console.log("Response:: => ",response)
          if (response && !this.isFirst) {
            console.log("Refrescando Duracion Llamada:::");
            this.servicioDuracionLlamada();
          }
        },
      });
     }

  ngOnInit(): void {
    this.requireUpdateIdDispositivo = this.changeGraphService.enviarflagObservableDisp.subscribe((response) => {
      if (response != 1) {
        console.log("Id Dispositivo {",response,"}");
        this.idDispositivoseleccionado = response;
        this.servicioDuracionLlamada();
      }else{
        this.errorCarga = 1;
        this.spinnerLoading = false;
      }
    });
    console.log("Console Voz:",this.idDispositivoseleccionado)
    this.dateValueWeek = this.dateValueWeek.reverse();
    this.isDarkTheme = this.themeService.isDarkTheme;
    if(this.isFull){
      this.servicioDuracionLlamada();
    }
  }

  servicioDuracionLlamada(){
    this.spinnerLoading = true;
    this.isFirst = false;
    let body = {
      "fechaInicio": moment().set({'second': 0, 'millisecond': 0}).subtract(1, 'hour').format().substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idDispositivo": this.idDispositivoseleccionado ? this.idDispositivoseleccionado : localStorage.getItem('idDispositivo'),
      "tiempo": 'M',
      "metrica": "ACD"
    };
    console.log("Duracion")
    if(this.idDispositivoseleccionado != '0'){
      this.dashboardService.obtenerRendimientoMetrica(body).subscribe({
        next: (data) => { 
          var start = window.performance.now(); 
          if(data){
            console.log("DuracionLllamada:",data)
            data.metricas[0].data.forEach(element => {
              element.date = new Date(element.date) 
            });
            this.duracionLlamada = data.metricas[0];
          }
          this.spinnerLoading = false;
          var end = window.performance.now();
          console.log(`Tiempo execusion Duracion Llamada Voz: ${((end - start)/1000).toFixed(5)} segundos`);
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

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }

}
