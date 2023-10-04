import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';

@Component({
  selector: 'smc-voz-vista-llamadas',
  templateUrl: './voz-vista-llamadas.component.html',
  styleUrls: ['./voz-vista-llamadas.component.css']
})
export class VozVistaLlamadasComponent implements OnInit {

  @Input() isFull: boolean = false;

  scale: 'week' | 'day' | 'hour' | 'minute'  = 'week' ;
  
  isDarkTheme: Observable<boolean>;
  colorArea: string[] = ['#1F3BB3', '#75787D']
  colorTol: string[] = ['#d2d8f0', '#e3e4e5']
  llamadas: any[] = []
  datesValueArea: Array<DateValue> = [];
  datesValue: Array<DateValue> = []
  doubleArea: boolean = true;
  margin?: MarginConf = {
    top: 50,
    right: 10,
    bottom: 0,
    left: 30,
  };
  tiempoSeleccionada: number = 1;
  textoSeleccionado: string = "Última hora";

  dayAgo = Constantes.FECHA_LLAMADAS_VOZ_7;
  spinnerLoading = true; 

  public form: FormGroup;

  requireUpdateIdDispositivo: Subscription;
  idDispositivoseleccionado: string;
  requireUpdate: Subscription;
  isFirst: boolean = true;
  errorCarga:number = 0
  constructor(private themeService: ThemeService,
    private formBuilder: FormBuilder,
    public dashboardService: DashboardService,
    private auth: AdministratorService,
    private reloadDataService: ReloadDataService,
    public spinner: NgxSpinnerService,
    private changeGraphService:ChangeGraphService) { 
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response && !this.isFirst) {
            console.log("Refrescando Rendimiento:::");
            this.servicioLlamadas();
          }
        },
      });
    }

  ngOnInit(): void {
    this.requireUpdateIdDispositivo = this.changeGraphService.enviarflagObservableDisp.subscribe((response) => {
      if (response != 1) {
        console.log("Id Dispositivo {",response,"}");
        this.idDispositivoseleccionado = response;
        this.servicioLlamadas();
      }else{
        this.errorCarga = 1;
      }
    });
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.form = this.formBuilder.group({
      tiempo: [null],
    });
    this.form.get('tiempo').setValue('Última semana');
    /* let id = localStorage.getItem('idDispositivo');
    console.log("ID: ",id); */
    if(this.isFull){
      this.servicioLlamadas();
    }
  }

  public get width() {
    return window.innerWidth;
  }
  
  cambiarData(){
    if(this.llamadas[0].estatus == this.llamadas[1].estatus ){
      this.datesValue = this.datesValueArea
      this.doubleArea = true
    }else if(this.llamadas[0].estatus){
      this.datesValue = this.datesValueArea.filter( function(d){return d.type === "Completa"} )
      this.doubleArea = false
    }else{
      this.datesValue = this.datesValueArea.filter( function(d){return d.type === "Simultanea"} )
      this.doubleArea = false
    }
  }

  servicioLlamadas(){
    this.spinnerLoading = true;
    this.isFirst = false;
    let body = {
      "fechaInicio": this.dayAgo.substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idDispositivo": this.idDispositivoseleccionado ? this.idDispositivoseleccionado : localStorage.getItem('idDispositivo'),
      "tiempo": this.scale == 'week' ? 'D' : this.scale == 'minute' ? 'M' : 'H',
      "metrica": ""
    };
    if(this.idDispositivoseleccionado != '0'){
      this.dashboardService.obtenerLlamadas(body).subscribe({
        next: (data) => { 
          var start = window.performance.now(); 
          console.log("Llamadas:",data)
          if(data){
            this.colorArea = []
            this.colorTol = []
            this.llamadas = data.llamadas
            this.llamadas.forEach(element => {
              this.colorArea.push(element.colorGrafica)
              this.colorTol.push(element.colorTooltip)
              element.estatus = false;
            });
            data.data.forEach(element => {
              element.date = new Date(element.date) 
            });
            this.datesValueArea = data.data        
            this.cambiarData();
          }
          this.spinnerLoading = false;
          var end = window.performance.now();
          console.log(`Tiempo execusion Llamadas Voz: ${((end - start)/1000).toFixed(5)} segundos`);
        },
        error: (error) => { 
          console.log(error)
          this.spinnerLoading = false;
        }
      });
    }else{
      this.spinnerLoading = false;
    }
  }

  alertTiempo(tiempo,texto){
    this.tiempoSeleccionada = tiempo;
    //this.textoSeleccionado = texto;
    this.changeGraphService.changeRange(this.tiempoSeleccionada);
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
    if(tiempo == 1){
      this.scale = 'minute'
      this.dayAgo = (moment().set({'second': 0, 'millisecond': 0}).subtract(1, 'hour').format())
    }
    if(tiempo == 12){
      this.scale = 'hour'
      this.dayAgo = moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hour').format()
    }
    if(tiempo == 24){
      this.scale = 'day'
      this.dayAgo = moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hour').format()
    }
    if(tiempo == 7){
      this.scale = 'week'
      this.dayAgo = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format()
    }

    this.servicioLlamadas();
  }

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }


}
