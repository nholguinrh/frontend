import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';

@Component({
  selector: 'smc-voz-rendimiento-metricas',
  templateUrl: './voz-rendimiento-metricas.component.html',
  styleUrls: ['./voz-rendimiento-metricas.component.css']
})
export class VozRendimientoMetricasComponent implements OnInit {

  @Input() isFull: boolean = false;
  @ViewChild('picker', {read: undefined, static: false}) datePicker: MatDatepicker<Date>;

  isDarkTheme: Observable<boolean>;
  tooltipColor: string = 'rgba(151,175,243, 0.2)';

  scale: 'week' | 'day' | 'hour' | 'dayMonth'  = 'week' ;

  metricaSelecionada: any;

  dateValueWeek: Array<DateValue> = [
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).format()), value: 20 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format()), value: 35 },
    { date: new Date(moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(2, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format()), value: 53 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(4, 'days').format()), value: 36 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(5, 'days').format()), value: 83 },
    { date: new Date(moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(6, 'days').format()), value: 23 },
  ];

  metricasVozCatalogo: any[] = []

  dateRange = new FormGroup({
    start: new FormControl((moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format().substring(0,19))),
    end: new FormControl(moment().format().substring(0, 19))
  });
  spinnerLoading: boolean = true


  public form: FormGroup;
  metricaSelected: any;
  unit: string = '%';
  fechaInicio = this.dateRange.value.start;
  fechaFin = this.dateRange.value.end;
  requireUpdateIdDispositivo: Subscription;
  idDispositivoseleccionado: string;
  minDate: Date;
  maxDate: Date;
  tiempo: string = 'D';
  days: any;
  rangeInvalid: boolean = false;
  requireUpdate: Subscription;
  isFirst: boolean = true;
  historico: boolean = false;
  errorCarga:number = 0
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    private auth: AdministratorService,
    public dashboardService: DashboardService,
    private changeGraphService:ChangeGraphService,
    private reloadDataService: ReloadDataService,
    public spinner: NgxSpinnerService) { 
      this.minDate = new Date(moment().set({'hours': 0,'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'month').format());
      this.maxDate = new Date(moment().set({'hours': 0,'minute': 0, 'second': 0, 'millisecond': 0}).format());
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          console.log("Response:: => ",response)
          if (response && !this.isFirst) {
            console.log("Refrescando Rendimiento:::");
            this.changeMetrica(this.metricaSelected);
          }
        },
      });
    }

  ngOnInit(): void {
    this.requireUpdateIdDispositivo = this.changeGraphService.enviarflagObservableDisp.subscribe((response) => {
      if (response != 1) {
        console.log("Id Dispositivo {",response,"}");
        this.idDispositivoseleccionado = response;
        if(this.isFirst){
          this.consultaMetrica();
        }else{
          this.changeMetrica(this.metricaSelected);
        }
      }else{
        this.errorCarga = 1
      }
    });
    this.dateValueWeek = this.dateValueWeek.reverse();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.form = this.formBuilder.group({
      metricaS: [null],
    });
    if(this.isFull){
      this.consultaMetrica();
    }
  }

  servicioRendimientoMetrica(){
    this.spinnerLoading = true
    this.isFirst = false;
    let body = {
      "fechaInicio": this.fechaInicio,
      "fechaFin": this.fechaFin,
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idDispositivo": this.idDispositivoseleccionado ? this.idDispositivoseleccionado : localStorage.getItem('idDispositivo'),
      "tiempo": this.tiempo,
      "metrica": this.form.get('metricaS').value,
      "historico": this.historico
    };
    localStorage.setItem('metrica', this.form.get('metricaS').value);
    if(this.idDispositivoseleccionado != '0'){
      this.dashboardService.obtenerRendimientoMetrica(body).subscribe({
        next: (data) => { 
          var start = window.performance.now(); 
          if(data){
            console.log("Rendimiento:",data)
            data.metricas[0].data.forEach(element => {
              element.date = new Date(element.date) 
            });
            this.metricaSelecionada = data.metricas[0];
  
            this.unit = this.form.get('metricaS').value == 'PDD' ? 's' : this.form.get('metricaS').value == 'ACD' ? 's' : this.form.get('metricaS').value == 'ASR' ? '%' : ' '; 
          }
          this.spinnerLoading = false
          var end = window.performance.now();
          console.log(`Tiempo execusion Rendimiento Voz: ${((end - start)/1000).toFixed(5)} segundos`);
        },
        error: (error) => { 
          this.spinnerLoading = false
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

  consultaMetrica() {
    this.dashboardService
      .obtenerMetricasVozCliente(this.auth.getIdCliente())
      .subscribe({
        next: (data) => {
          console.log("MetricasVoz: ",data);
          if (data) {
            data.data.forEach(element => {
              this.metricasVozCatalogo.push({
                name: element.metrica,
                sigla: element.informacion
              })
            });
              this.form.get('metricaS').setValue(this.metricasVozCatalogo[0].sigla);
          }
          if(this.isFull){
            this.form.get('metricaS').setValue(localStorage.getItem('metrica'));
            this.changeMetrica(localStorage.getItem('metrica'));
          }else{
            this.changeMetrica(this.metricasVozCatalogo[0].sigla);
          }
        },
        error: (error) => {
          this.spinner.hide();
        },
      });
  }
  
  changeMetrica(metrica) {

    this.metricaSelected = metrica;
    switch (this.metricaSelected) {
      case 'LLC':
      case 'LLS':
      case 'MOS':
        this.unit = '';
        this.servicioRendimientoMetrica();
        break;
      case 'PDD':
      case 'ACD':
        this.unit = 'seg';
        this.servicioRendimientoMetrica();
        break;
      case 'ASR':
        this.unit = '%';
        this.servicioRendimientoMetrica();
        break;
    }
  }

  changeRange(){
      this.rangeInvalid = false;
      if(this.dateRange.value.end){
        let fechafinal = new Date(this.dateRange.value.end);
        let fechaInicial = new Date(this.dateRange.value.start);
        var difference= Math.abs(fechafinal.getTime()-fechaInicial.getTime());
        this.days = difference/(1000 * 3600 * 24)
        console.log("Dias:",this.days);
        if(this.days == 1){
          this.tiempo = 'H'
          this.scale = 'day'
        }else{
          this.tiempo = 'D'
          this.scale = 'week'
        }
        if(this.days == 0){
          this.rangeInvalid = true;
          console.log("::Aquí va la bandera", this.days);
          console.log("::Aquí va la bandera", this.rangeInvalid);
        }else{
          this.fechaInicio = (moment(this.dateRange.value.start).set({'minute': 0, 'second': 0, 'millisecond': 0}).format()).substring(0,19);
          this.fechaFin = (moment(this.dateRange.value.end).set({'minute': 0, 'second': 0, 'millisecond': 0}).format()).substring(0,19);
          if(this.fechaInicio == (moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format().substring(0,19)) && this.fechaFin == moment().format().substring(0, 19)){
            this.historico = false;
          }else{
            this.historico = true;
          }
          this.servicioRendimientoMetrica();
        }
        

      }

  }
  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }
}
