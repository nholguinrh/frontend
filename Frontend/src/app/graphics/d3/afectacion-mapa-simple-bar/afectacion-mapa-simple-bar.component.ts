import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { DetalleIncidenteComponent } from 'src/app/components/cliente/incidentes-cliente/detalle-incidente/detalle-incidente.component';
import { DetalleIncidenteService } from 'src/app/components/cliente/incidentes-cliente/detalle-incidente/detalle-incidente.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import * as moment from 'moment';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AlertService } from 'src/app/shared/utils/alertas';
import { NgxSpinnerService } from 'ngx-spinner';
import { DetalleServicioComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { DetalleServicioService } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';

@Component({
  selector: 'smc-afectacion-mapa-simple-bar',
  templateUrl: './afectacion-mapa-simple-bar.component.html',
  styleUrls: ['./afectacion-mapa-simple-bar.component.css'],
})
export class AfectacionMapaSimpleBarComponent implements OnInit {
  errorCarga: number = 0;
  data = [];
  isDarkTheme: Observable<boolean>;
  today: string = moment()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .format();
  dayAgo: string = moment()
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .subtract(2, 'M')
    .format();

    requireUpdate: Subscription;
    isDark: boolean;
  spinnerLoading: boolean = true;
  message: boolean = false;
  constructor(
    private themeService: ThemeService,
    private dialog: MatDialog,
    private dialogService: DetalleIncidenteService,
    private auth: AdministratorService,
    private reloadDataService: ReloadDataService,
    private changeGraphService:ChangeGraphService,
    private dashboardService: DashboardService,
    private alertService: AlertService, 
    public spinner: NgxSpinnerService,
    private confirmService: DetalleServicioService
  ) {
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
      next: (response) => {
        if (response) {
          this.getData();
        }
      },
    });
  }

  ngOnInit(): void {
    this.isDarkTheme.subscribe((val: boolean) => 
      this.isDark = val
    );
  }

  detalleIncidente(dispositivo: string) {
    const dialogRef = this.dialog.open(
      DetalleIncidenteComponent,
      this.dialogService.detalleSitio(dispositivo)
    );
    dialogRef.afterClosed().subscribe((data) => {
      //this.crearTicket();

      //TODO: Definir esto
    });
  }

  public get width() {
    return window.innerWidth;
  }

  getData() {
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
      "tiempo": "D",
      "funcionalidad": "ServiciosInalcanzablesMonitoreoMapa",
    };

    /* this.dashboardService.monitoreoMapaAfectaciones(request).subscribe({ */
    this.dashboardService.obtenerServiciosInalcanzables(request).subscribe({
      next: (data) => {
        var start = window.performance.now(); 
        console.log('DatosAfectaciones:', data);
        if (data != null) {
          this.changeGraphService.changetotal(data.dispositivos.length);
          this.data = data.dispositivos.slice(0, 5);
          if(this.data.length == 0){
            this.message = true;
          }else{
            this.message = false;
          }
          /* for (var i = 0; i < 5; i++) {
            this.data.push(data.dispositivos[0]);
          } */
        }else{
          this.message = true;
        }
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Sitios Inactivos Mapa: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1;
        this.spinnerLoading = false;
      },
    });
  }

  crearTicket(){
    // this.spinner.show();
    let request = {
      categoria: "",
      descripcion: [
        ""
      ],
      diagnosticoInicial: "",
      estatus: "",
      grupo: "",
      idItsm: "",
      organizacion: "",
      proactivoReactivo: "",
      puntaId: "",
      regCiuId: "",
      resumen: "",
      solicitadoPor: "",
      tenant: "",
      ticketExterno: "",
      tipo: "",
      tipoRed: "",
      url: "",
      numeroTicket: ""
    };
    this.dashboardService.monitoreoMapaCrearTicket(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.alertService.success('<b>Ticket creado correctamante</b>');
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('<b>Error al crear ticket</b>');
      }
    });
  }

  openDetalle(sitio){
    console.log(sitio);
    //this.obtenerDetalleAfectaciones(sitio.ipNs, sitio.idDispositivo);
    this.abrirModalDetalle(sitio.ipNs, sitio.idDispositivo)
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
