import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paginator } from 'array-paginator';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { Cliente } from 'src/app/shared/model/cliente.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DetalleIncidenteComponent } from '../../incidentes-cliente/detalle-incidente/detalle-incidente.component';
import { DetalleIncidenteService } from '../../incidentes-cliente/detalle-incidente/detalle-incidente.service';
import { DetalleServicioComponent } from './detalle-servicio/detalle-servicio.component';
import { DetalleServicioService } from './detalle-servicio/detalle-servicio.service';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import * as moment from 'moment';
@Component({
  selector: 'app-busqueda-personalizada',
  templateUrl: './busqueda-personalizada.component.html',
  styleUrls: ['./busqueda-personalizada.component.css']
})
export class BusquedaPersonalizadaComponent implements OnInit {

  listaResultado:any[] = []
  listaResultadoCompleto:any[] = []
  listaResultadoContador: number;

  spinnerLoading = true; 

  public form: FormGroup;

  emailstring= "mailto:helpdesk@totalplay.com?Subject=Soporte SMC&body=Buen día, estoy buscando ayuda…(déjanos saber en que podemos ayudarte)";
  /*
  listaResultado = [{
    tipo: 'sitio',
    sitio: 'CENATRA - Periférico',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'sitio',
    sitio: 'Secretaría de Salud SSA Marina',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'sitio',
    sitio: 'COFEPRIS - Oklahoma',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'sitio',
    sitio: 'CNTS - Othon de Mendizabal',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'sitio',
    sitio: 'DGSRM - Poniente 44',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: false,
    ticketNumero: '',
  },{
    tipo: 'sitio',
    sitio: 'CISAME - Periférico Sur 2905',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'sitio',
    sitio: 'Lieja',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: true,
    ticketNumero: '03120497',
  },{
    tipo: 'sitio',
    sitio: 'DGEPI',
    metricaSelecionada: {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
    ticketEstatus: true,
    ticketNumero: '03120497',
  }]
  */

  metricas: any =[
    {
      idMetrica: 1,
      metrica: 'Disponibilidad',
      porcentajeActual: '80%',
      porcentajeAyer: '6%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },{
      idMetrica: 2,
      metrica: 'Latencia',
      porcentajeActual: '90%',
      porcentajeAyer: '8%',
      porcentajeSla: '99%',
      color: '#285CED',
    },{
      idMetrica: 3,
      metrica: 'Consumo',
      porcentajeActual: '80%',
      porcentajeAyer: '4%',
      porcentajeSla: '99%',
      color: '#FDA700',
    },{
      idMetrica: 4,
      metrica: 'Alcanzabilidad',
      porcentajeActual: '99%',
      porcentajeAyer: '9%',
      porcentajeSla: '99%',
      color: '#1A7F1C',
    },{
      idMetrica: 5,
      metrica: 'Pérdida de paquetes',
      porcentajeActual: '70%',
      porcentajeAyer: '5%',
      porcentajeSla: '99%',
      color: '#FF0D0D',
    },
  ] ;

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
  
  linegraphSecond = {
    data : [{'y': 65, 'x': 1},
            {'y': 80, 'x': 2},
            {'y': 45, 'x': 3},
            {'y': 85, 'x': 4},
            {'y': 60, 'x': 5}, 
            {'y': 75, 'x': 6},
            {'y': 40, 'x': 7},
            {'y': 60, 'x': 8},
            {'y': 95, 'x': 9},
            {'y': 85, 'x': 10},
            {'y': 95, 'x': 11},
            {'y': 85, 'x': 12},
            {'y': 70, 'x': 13},
            {'y': 75, 'x': 14}],
    color : '#285CED',
  }

  linegraphThird = {
    data : [{'y': 65, 'x': 1},
            {'y': 50, 'x': 2},
            {'y': 75, 'x': 3},
            {'y': 65, 'x': 4},
            {'y': 65, 'x': 5}, 
            {'y': 75, 'x': 6},
            {'y': 75, 'x': 7},
            {'y': 60, 'x': 8},
            {'y': 95, 'x': 9},
            {'y': 85, 'x': 10},
            {'y': 95, 'x': 11},
            {'y': 85, 'x': 12},
            {'y': 70, 'x': 13},
            {'y': 75, 'x': 14}],
    color : '#FDA700',
  }

  pageResponse: Page<Cliente> = new Page<Cliente>();
  fetchRequest: PageRequest<Cliente> = new PageRequest<Cliente>();
  dispositivoSeleccionado : any;
  public pager:any;
  constructor(private router: Router,
    private workspaceService: WorkspaceService,
    public dialog: MatDialog,
    private auth: AdministratorService,
    private confirmService: DetalleServicioService,
    private dashboardService: DashboardService,
    public spinner: NgxSpinnerService,
    private dialogConfirm: ConfirmDialogService,
    private dialogService: DetalleIncidenteService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.busquedaPersonalizada);
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.busquedaPersonalizada();
    //this.onPaged(1);
  }

  onPaged(page) {
    this.listaResultado = this.pager.page(page);
  }

  paginador(value: any){
    console.log(value)
    this.listaResultadoContador = value.length
    console.log(value)
    this.pager = new Paginator(value,12,1)
    if(value.length > 0){
      this.listaResultado = this.pager.page(1);  
    }else{
      this.listaResultado = []
    }
  }

  onKeyDownEvent(event: any){
    let busquedaDeDatos;
    let filtro = event.target.value;
    this.listaResultado = this.listaResultadoCompleto;
    busquedaDeDatos = this.listaResultado; 
    /* busquedaDeDatos = busquedaDeDatos.filter( item =>
      item.metrica.toLowerCase() ==  (this.form.controls['metrica'].value).toLowerCase()
    ) */
    busquedaDeDatos = busquedaDeDatos.filter( item =>
      item?.sitio?.toLowerCase().includes(filtro.toLowerCase()) || item?.aliasDispositivo?.toLowerCase().includes(filtro.toLowerCase())
    );
    this.listaResultado = busquedaDeDatos;

    //console.log(busquedaDeDatos)
    this.paginador(this.listaResultado);
    
  }

  returnFilter(){
    this.form.reset()
    if(this.listaResultadoCompleto?.length > 0){
      this.paginador(this.listaResultadoCompleto);
    }else{
      this.goToBack()
    }
  }


  goToBack(){
    console.log('Regresando');
    //Variable que almacena si viene desde el dashboard o desde el workspace
    let _isDashboard: string=localStorage.getItem('isdashboard');
    console.log(_isDashboard);
    if(_isDashboard=='1'){
      this.router.navigateByUrl(NAV.inicioCliente);
    }else{
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
    }
  }

  /*
  onPaged(page: number) {
		this.fetchRequest.page = page;
		this.fetchRequest.model = new Cliente();		    
    this.workspaceService.getJSON(this.fetchRequest).then(result => {
      this.pageResponse.init(result);
    }).catch(()=>{
    });
  }
  */

  detalleMetrica(dispositivo: any){

    localStorage.setItem('navigation', NAV.detalleMetrica);


    localStorage.setItem('nombreLargo', dispositivo.sitio);
    localStorage.setItem('nombreMetrica', dispositivo.sitio);
    localStorage.setItem('nombre-sitio', dispositivo.sitio)
    localStorage.setItem('tipo-dispositivo', 'sitio');
    let json = {
      dark: false,
      dispositivo: dispositivo,
      idDispositivo: dispositivo.idDispositivo,
      showCancelMessage:false
    }
    localStorage.setItem('dispositivo', JSON.stringify(json));


    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.detalleMetrica+")");
  }

  detalleHistorico(dispositivo: any){
    localStorage.setItem('nombreMetrica', dispositivo.sitio);
    localStorage.setItem('tipo-dispositivo', dispositivo.tipo);
    localStorage.setItem('navigation', NAV.historicoServicio);
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.historicoServicio+")");
  }

  openDialogDispositivo(dispositivo: any){
    localStorage.setItem('tipo-dispositivo', dispositivo.tipo);
    localStorage.setItem('nombre-sitio', dispositivo.sitio)
    //this.obtenerDetalleAfectaciones(dispositivo.ipNs, dispositivo.idDispositivo);
    this.abrirModalDetalle(dispositivo.ipNs, dispositivo.idDispositivo);
    /*
    let selecionDialogo;
    let request = {
      "fechaInicio": "",
      "fechaFin": "",
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": dispositivo.idDispositivo,
      "tipoDispositivo": "",
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": dispositivo.ipNs,
      "full": true,
      "funcionalidad": "DetalleDispositivoGlobalGeneral",
    };
    this.dashboardService.obtenerDetalleAfectacionesRecientes(request).subscribe({
      next: (data) => {
        this.dispositivoSeleccionado = data.listaResultado[0];
        selecionDialogo = this.confirmService.detalleDispositivo(false, this.dispositivoSeleccionado)
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
      },
      error: (_) => {
      },
    });
     */
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
        selecionDialogo = this.confirmService.detalleDispositivo(false, data.listaResultado[0]);
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
    selecionDialogo = this.confirmService.detalleDispositivoModal(false, ipns, dispositivo);
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

  public get width() {
    return window.innerWidth;
  }
  
  cambiarMetrica(dispositivo: any, metodo: string){
    let arrayNumber
    this.linegraph = dispositivo.linegraph;
    if(metodo == 'back'){
      if(dispositivo.metricaSelecionada.idMetrica == 1){
        return false
      }else{
        arrayNumber = dispositivo.metricaSelecionada.idMetrica - 2
      }
    }else{
      if(dispositivo.metricaSelecionada.idMetrica == 4){
        return false
      }else{
        arrayNumber = dispositivo.metricaSelecionada.idMetrica
      }
    }
    dispositivo.metricaSelecionada = dispositivo.linegraph[arrayNumber];

    console.log(dispositivo.metricaSelecionada)
  }

  detalleIncidente(dispositivo: any){
    localStorage.setItem('nombreMetrica', dispositivo.sitio);
    localStorage.setItem('tipo-dispositivo', dispositivo.tipo);
    const dialogRef = this.dialog.open(
      DetalleIncidenteComponent, 
      this.dialogService.detalleDummy()
    );
    dialogRef.afterClosed().subscribe(
      data => {
        //this.crearTicket();
      }
    );
  }

  busquedaPersonalizada(){
    this.spinnerLoading = true;
    let body = JSON.parse(localStorage.getItem('bodyPersonalizado'));
    body.cliente.idCliente = Number(this.auth.getidClienteTotalplay());
    this.dashboardService.obtenerBusquedaPersonalizada(body).subscribe({
      next: (data) => {
        if(data.listaResultado.length > 0){
          console.log('busqueda: ', data)
          this.listaResultado = data.listaResultado;
          this.listaResultado.forEach(element => {
            if(element.metricaSelecionada.idMetrica != 0){
              let data = element.linegraph[0].data;
              element.metricaSelecionada.data = data
            }
          });
          this.listaResultadoCompleto = this.listaResultado
          /*
          data.listaResultado?.forEach( list => {
            list.linegraph.forEach( list2 => {
              if(list.metricaSelecionada.idMetrica == list2.idMetrica){
                  this.linegraph = list2;
              }
            });
          });
          */
          this.paginador(this.listaResultadoCompleto);
        }else{
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogConfirm.sinDispositivos()
          );
          dialogRef.afterClosed().subscribe(
            _data => {
              if(_data == true){
                this.help();
                this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
              }else{
                this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
              }
            }
          );
        }
        this.spinnerLoading = false;
      },
      error: (_) => {
        this.spinnerLoading = false;
      }
    });
  }

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }

  help(){
    window.location.href = this.emailstring;
  }

}
