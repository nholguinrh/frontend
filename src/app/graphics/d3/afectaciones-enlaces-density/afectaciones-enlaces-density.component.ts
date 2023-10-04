import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { DetalleServicioComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { MatDialog } from '@angular/material/dialog';
import { DetalleServicioService } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import * as moment from 'moment';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';

@Component({
  selector: 'smc-afectaciones-enlaces-density',
  templateUrl: './afectaciones-enlaces-density.component.html',
  styleUrls: ['./afectaciones-enlaces-density.component.css'],
})
export class AfectacionesEnlacesDensityComponent implements OnInit {

  isDarkTheme: Observable<boolean>;
  errorCarga: number = 0;
  isDark: boolean;
  
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-10 00:00:00.000000'), value: 3.1 },
    { date: new Date('2022-10-11 00:00:00.000000'), value: 3.93 },
    { date: new Date('2022-10-12 00:00:00.000000'), value: 3.1 },
    { date: new Date('2022-10-13 00:00:00.000000'), value: 3.5 },
    { date: new Date('2022-10-14 00:00:00.000000'), value: 4.25 },
    { date: new Date('2022-10-15 00:00:00.000000'), value: 3.24 },
    { date: new Date('2022-10-16 00:00:00.000000'), value: 3.2 },
    { date: new Date('2022-10-17 00:00:00.000000'), value: 3.6 },
    { date: new Date('2022-10-18 00:00:00.000000'), value: 3.5 },
  ];

  metricasAfectaciones:any = []
  margin: MarginConf = {
    top: 50,
    right: 0,
    bottom: 0,
    left: 0,
  };


  afectaciones : any[] = ['1', '2', '3', '4', '5']
  metricaSeleccionada: string = "Alcanzabilidad";
  tiempoSeleccionadaFin: any = new Date(moment().format());
  tiempoSeleccionada: any = new Date((moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19));
  timeFecha = 24;
  message: boolean = false;

  //@Input() metrica = "Alcanzabilidad";

  @Input() set tiempo(val: number) {
    console.log("Fecha afectacion:",val)
    this.tiempoSeleccionada = moment(this.tiempoSeleccionadaFin).set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(val, 'hours').format();
    //this.obtenerAfectaciones();
  }

  @Input() set metrica(val: string) {
    this.metricaSeleccionada = val;
    //this.cambiarDatos();
  }

  metricas : any;

  public get width() {
    return window.innerWidth;
  }

  requireUpdate: Subscription;
  spinnerLoading: boolean = true;
  isFirst:boolean = true;
  constructor(
    private themeService: ThemeService,
    public spinner: NgxSpinnerService,
    private alertService: AlertService,
    private auth: AdministratorService,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private reloadDataService: ReloadDataService,
    private confirmService: DetalleServicioService,
    private changeGraphService:ChangeGraphService,
    ) {

      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response && !this.isFirst) {
            console.log("Refrescando servicios inactivos :::")                        
            this.obtenerAfectaciones();
          }
        },
      }); 
     }

  ngOnInit(): void {
    // this.spinner.show();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.isDark = val
    );
    this.obtenerAfectaciones();
    this.spinner.hide();
  }

  obtenerAfectaciones() {
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "M",
      "funcionalidad": "ServiciosInalcanzablesMonitoreoMapa",
    };
    this.dashboardService.obtenerServiciosInalcanzables(request).subscribe({
    /* this.dashboardService.obtenerAfectacionesRecientes(request).subscribe({ */
      next: (data) => {
        var start = window.performance.now();
        this.spinner.hide();
        console.log('data:',data)
        if(data != null){
          console.log('data:',data)
          this.changeGraphService.changetotal(data.dispositivos.length);
          this.metricasAfectaciones = data.dispositivos.slice(0, 5);
          console.log("metricasAfectaciones:",this.metricasAfectaciones);
          if(this.metricasAfectaciones.length == 0){
            this.message = true;
          }else{
            this.message = false;
          }
        }else{
          this.message = true;
        }
        this.spinnerLoading = false;
        this.isFirst = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Sitios inactivos: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1;
        this.spinnerLoading = false;
      },
    });
  }  


  openDetalle(sitio){
    console.log(sitio);
    //this.obtenerDetalleAfectaciones(sitio.ipNs, sitio.idDispositivo);
    this.abrirModalDetalle(sitio.ipNs, sitio.idDispositivo)
  }

  cambiarDatos(){
    this.metricasAfectaciones = [];
    let pasa: boolean = false;
    this.metricas.forEach(element => {
      if(element.metrica.toLowerCase() == this.metricaSeleccionada.toLowerCase()){
        pasa = true
      }
    })
    if(pasa){
      this.errorCarga = 0
      this.metricas?.forEach( metricaOpc => {
        if(metricaOpc.metrica.toLowerCase() == this.metricaSeleccionada.toLowerCase()){
          this.metricasAfectaciones = metricaOpc.afectaciones.slice(0,5);
          this.metricasAfectaciones.forEach(elemento => {
            elemento.data.forEach( ele =>{
              ele.date = new Date(ele.date);
            });
          });
          console.log('Metricas:',this.metricasAfectaciones);
          if(this.metricasAfectaciones.length == 0){
            this.message = true;
          }else{
            this.message = false;
          }
          return;
        }
      });
    }else{
      this.errorCarga = 0
    }
  }

  obtenerDetalleAfectaciones(ipns , dispositivo) {
    let selecionDialogo;
    // this.spinner.show();
    let request = {
      "fechaInicio": (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": dispositivo,
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": ipns,
      "full": true,
      "funcionalidad": "AfectacionesMonitoreoGlobal",
    };
    console.log("Detalle:",request)
    this.dashboardService.obtenerDetalleAfectacionesRecientes(request).subscribe({
      next: (data) => {
        selecionDialogo = this.confirmService.detalleDispositivo(this.isDark, data.listaResultado[0]);
        const dialogRef = this.dialog.open(
          DetalleServicioComponent,
          selecionDialogo
        );
        localStorage.removeItem('afectacionesRecientes');
        dialogRef.afterClosed().subscribe(
          data => {
            if(data){
                console.log(data);
            }
          }
        );
        this.spinner.hide();
      },
      error: (_) => {
        this.spinner.hide();
      },
    });
  } 

  abrirModalDetalle(ipns, dispositivo) {
    let selecionDialogo;
    selecionDialogo = this.confirmService.detalleDispositivoModal(this.isDark, ipns, dispositivo);
    const dialogRef = this.dialog.open(
      DetalleServicioComponent,
      selecionDialogo
    );
    localStorage.removeItem('afectacionesRecientes');
    dialogRef.afterClosed().subscribe(
      data => {
      }
    );    
  } 

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }

}
