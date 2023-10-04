import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { DetalleServicioComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { DetalleServicioService } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.service';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Cliente, Metrica, Tiempo } from 'src/app/shared/model/cliente.model';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Paginator } from 'array-paginator';

@Component({
  selector: 'app-afectaciones-recientes',
  templateUrl: './afectaciones-recientes.component.html',
  styleUrls: ['./afectaciones-recientes.component.css']
})
export class AfectacionesRecientesComponent implements OnInit {

  @Input() monitoreo: string;
  errorCarga: number = 0;
  isDarkTheme: Observable<boolean>;
  public dark: boolean;
  filtros: any = [{
    value: "1",
    titulo: "Más recientes"
  },{
    value: "2",
    titulo: "Rendimiento más bajo"
  },{
    value: "3",
    titulo: "Rendimiento más alto "
  },{
    value: "4",
    titulo: "Enlaces"
  },{
    value: "5",
    titulo: "Interfaces"
  }];


  listaResultadoMetricas: any[] = []
  listaResultado : any = [];
  /*
  listaResultado : any = [{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'enlace',
    sitio: 'Gran Patio Pachuca',
    porcentajeAyer: '6',
    porcentajeActual: '65',
    porcentajeSla: '89',
    ticketEstatus: true,
    ticketNumero: '03120497',
  }];
  */
  datesValueRendimiento:  Array<DateValue> = [
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
  margin?: MarginConf = {
    top: 30,
    right: 0,
    bottom: 0,
    left: 0,
  };
  linegraph = {
    data : [{'y': 75, 'x': 1},
            {'y': 50, 'x': 2},
            {'y': 75, 'x': 3},
            {'y': 75, 'x': 4},
            {'y': 50, 'x': 5},
            {'y': 75, 'x': 6},
            {'y': 75, 'x': 7},
            {'y': 65, 'x': 8},
            {'y': 75, 'x': 9},
            {'y': 75, 'x': 10},
            {'y': 65, 'x': 11},
            {'y': 75, 'x': 12},
            {'y': 50, 'x': 13},
            {'y': 65, 'x': 14}],
    color : '#FF0D0D',
  }

  metricaSeleccionada : string = 'Alcanzabilidad';
  tiempo: any = 24;
  tiempoSeleccionado: any = new Date((moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19));
  tiempoSeleccionadoFin: any = new Date();

  pageResponse: Page<Cliente> = new Page<Cliente>();
  fetchRequest: PageRequest<Cliente> = new PageRequest<Cliente>();
  public form: FormGroup;
  metricas: Metrica[];
  tiempos: Tiempo[] = [
    {
      value: '24 horas',
      time: 24 
    }
    /*
    {
      value: '48 horas',
      time: 48
    },
    {
      value: '72 horas',
      time: 72
    }*/
  ];
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(30, 'days').format();
  isDark: boolean;
  public pager:any;
  constructor(private router: Router,private workspaceService: WorkspaceService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private reloadDataService: ReloadDataService,
    private administratorService: AdministratorService,
    private confirmService: DetalleServicioService,
    private themeService: ThemeService,) { }

  ngOnInit(): void {
    //this.consultaMetrica();
    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      this.dark = mode === '1' ? true: false;
    }
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.isDark = val
    );
/*     this.form = this.formBuilder.group({
      metrica: [null],
      tiempo: [null],
      buscar: [null],
    });
    this.form.get('tiempo').setValue('24 horas');

    this.tiempoSeleccionado = moment(this.tiempoSeleccionadoFin).set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(this.tiempo, 'hours').format();
    this.consultaMetricaCliente(); */
    this.onPagedGlobal(1)
  }

  onPagedGlobal(page: number) {
		/* this.fetchRequest.page = page;
		this.fetchRequest.model = new Cliente();		    
    this.workspaceService.getJSON(this.fetchRequest).then(result => {
      this.pageResponse.init(result);
    }).catch(()=>{
    }); */
    /* let request = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "AfectacionesMonitoreoGlobal",
      "full": true
    }; */


    let request = {
      "fechaInicio": (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "funcionalidad": "ServiciosInalcanzablesMonitoreoMapa"
      //"funcionalidad": "AfectacionesRecientesMonitoreoGlobal",
    };
    console.log("se ejecuta este AfectacionesMonitoreoGlobal")
    this.dashboardService.obtenerServiciosInalcanzables(request).subscribe({
    /* this.dashboardService.obtenerAfectacionesRecientes(request).subscribe({ */
      next: (data) => {
        if(data != null){
          console.log('Datos Fullsize:',data);
          /* this.errorCarga = 0;
          this.listaResultadoMetricas = data.metricas; */
          this.listaResultado = data.dispositivos;
          /* for (var i = 0; i < 20; i++) {
            this.listaResultado.push(data.dispositivos[0]);
          } */
          this.listaResultadoMetricas = this.listaResultado;
          this.paginador(this.listaResultado);
          this.spinner.hide();
          /* this.cambiarListadoMetrica() */
        }else{
          /* this.errorCarga = 0; */
        }
      },
      error: (_) => {
        this.errorCarga = 1;
        this.spinner.hide();
      },
    });

  }

  onPagedMapa(page: number) {
		/* let request = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": "",
      "funcionalidad": "AfectacionesMonitoreoMapa",
      "full": true
    }; */
    let request = {
      "fechaInicio": String(this.tiempoSeleccionado).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "funcionalidad": "AfectacionesRecientesMonitoreoGlobal",
    };
    console.log("se ejecuta este AfectacionesRecientesMonitoreoGlobal")
    this.dashboardService.monitoreoMapaAfectaciones(request).subscribe({
      next: (data) => {
        console.log('DatosAfectaciones:',data);
        if(data.afectaciones != null){
          this.errorCarga = 0; 
          this.listaResultadoMetricas = data.afectaciones;
          this.spinner.hide();
          this.cambiarListadoMetrica()
        }else{
          this.errorCarga = 0; 
        }
      },
      error: (_) => {
        this.errorCarga = 1
      }
    });

  }

  openDialog(){
    const dialogRef = this.dialog.open(
      DetalleServicioComponent, 
      this.dark ? this.confirmService.metricaServicioDark() : this.confirmService.metricaServicio() 
    );
    localStorage.setItem('afectacionesRecientes', '1');
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
            console.log(data);
        }
      }
    );
  }
  openDialogSucursal(){
    const dialogRef = this.dialog.open(
      DetalleServicioComponent, 
      this.dark ? this.confirmService.metricaSucursalDark() : this.confirmService.metricaSucursal() 
    );
    localStorage.setItem('afectacionesRecientes', '1');
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
            console.log(data);
        }
      }
    );
  }
  detalleMetrica(id?: string, ip?: string, title?: string, tipoDispositivo?: string){

    localStorage.setItem('idDispositivo', id);
    localStorage.setItem('ipNs', ip);

    localStorage.setItem('nombreMetrica', title);
    localStorage.setItem('tipo-dispositivo', tipoDispositivo);

    localStorage.setItem('navigation', NAV.afectacionMetrica);
    localStorage.setItem('afectacionesRecientes', '1');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.afectacionMetrica+")");
  }
  detalleHistorico(id?: string, ip?: string, title?: string, tipoDispositivo?: string){
    localStorage.setItem('idDispositivo', id);
    localStorage.setItem('ipNs', ip);
    if(tipoDispositivo == null){ tipoDispositivo = 'P' }

    localStorage.setItem('nombreMetrica', title);
    localStorage.setItem('tipo-dispositivo', tipoDispositivo);

    localStorage.setItem('navigation', NAV.afectacionMetrica);
    localStorage.setItem('afectacionesRecientes', '1');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.afectacionHistorico+")");
  }

  public get width() {
    return window.innerWidth;
  }

  /*
  consultaMetrica(){
    // this.spinner.show();
    this.administratorService.catalogoMetricas().subscribe({
      next: ({ data, httpStatus }) => { 
        this.spinner.hide();
        if (httpStatus === 200) {
          if(data != null){
            this.metricas = data;
            this.form.get('metrica').setValue(this.metricas[0].metrica);
            if(this.monitoreo == 'Mapa'){
              console.log("mapa")
              this.onPagedMapa(0);
            }else{
              console.log("global")
              this.onPagedGlobal(0);
            }
          }else{
          }
        }
      },
      error: (error) => { 
        this.spinner.hide();
      }
    });
  }
  */

  consultaMetricaCliente(){
    // this.spinner.show();
    this.dashboardService.obtenerMetricasCliente(this.administratorService.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        this.spinner.hide();
        if (httpStatus === 200) {
          if(data != null){
            this.metricas = data;
            this.form.get('metrica').setValue(this.metricas[0].metrica);
            if(this.monitoreo == 'Mapa'){
              console.log("mapa")
              //this.onPagedMapa(0);
              this.onPagedGlobal(0);
            }else{
              console.log("global")
              this.onPagedGlobal(0);
            }

          }else{
          }
        }
      },
      error: (error) => { 
        this.spinner.hide();
      }
    });
  }

  cambiarListadoMetrica(){
    this.listaResultado = []
    let pasa: boolean = false;
    this.listaResultadoMetricas.forEach(element => {
      if(element.metrica.toLowerCase() == (this.form.controls['metrica'].value).toLowerCase()){
        pasa = true
      }
    })
    if(pasa){
      this.errorCarga = 0
      this.listaResultadoMetricas.forEach(element => {
        if(element.metrica.toLowerCase() ==  (this.form.controls['metrica'].value).toLowerCase()){
          this.listaResultado = element.afectaciones
        }
      });
      this.listaResultado.forEach(elemento => {
        elemento.data.forEach( ele =>{
          ele.date = new Date(ele.date);
        });
      });
    }else{
      this.errorCarga = 0
    }
  }

  alertTiempo(val){
    this.tiempo = val;
    this.tiempoSeleccionado = moment(this.tiempoSeleccionadoFin).set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(this.tiempo, 'hours').format();
    this.consultaMetricaCliente();
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  }

  onKeyDownEvent(event: any){
    let busquedaDeDatos;
    let filtro = event.target.value;
    this.listaResultado = this.listaResultadoMetricas;
    busquedaDeDatos = this.listaResultado; 
    /* busquedaDeDatos = busquedaDeDatos.filter( item =>
      item.metrica.toLowerCase() ==  (this.form.controls['metrica'].value).toLowerCase()
    ) */
    busquedaDeDatos = busquedaDeDatos.filter( item =>
      item?.sitio?.toLowerCase().includes(filtro.toLowerCase()) || item?.alias?.toLowerCase().includes(filtro.toLowerCase())
    );
    this.listaResultado = busquedaDeDatos;

    //console.log(busquedaDeDatos)
    this.paginador(this.listaResultado);
    
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
      "idEmpresa": this.administratorService.getidClienteTotalplay(),
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

  onPaged(page) {
    this.listaResultado = this.pager.page(page);
  }

  paginador(value: any){
    console.log(value)
    this.pager = new Paginator(value,12,1)
    if(value.length > 0){
      this.listaResultado = this.pager.page(1);  
    }else{
      this.listaResultado = []
    }
  }

}
