import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { MasivaDialogModel, ServicioDialogModel } from 'src/app/shared/model/confirm-dialog';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { DetalleServicioService } from './detalle-servicio.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import * as moment from 'moment';
@Component({
  selector: 'app-detalle-servicio',
  templateUrl: './detalle-servicio.component.html',
  styleUrls: ['./detalle-servicio.component.css']
})
export class DetalleServicioComponent{

  
  selected = new FormControl(0);
  public form: FormGroup;
  metricaSeleciona: any;
  listaMetricas: any = [
    {
      idMetrica: 1,
      nombre: 'Disponibilidad',
      valor: '80%',
      ayer: '6%',
      sla: '99%',
      color: '#FF0D0D',
    }/* ,{
      idMetrica: 2,
      nombre: 'Latencia',
      valor: '90%',
      ayer: '8%',
      sla: '99%',
      color: '#285CED',
    } */
    ,{
      idMetrica: 2,
      nombre: 'Consumo',
      valor: '80%',
      ayer: '4%',
      sla: '99%',
      color: '#FDA700',
    },{
      idMetrica: 3,
      nombre: 'Alcanzabilidad',
      valor: '99%',
      ayer: '9%',
      sla: '99%',
      color: '#1A7F1C',
    },{
      idMetrica: 4,
      nombre: 'Pérdida de paquetes',
      valor: '70%',
      ayer: '5%',
      sla: '99%',
      color: '#285CED',
    },
  ]
  fetchCol:any = [
    { field: 'estatus', header: 'Estatus' },
    { field: 'alias', header: 'Alias' },
    { field: 'servicio', header: 'Servicio' },
    { field: 'ticket', header: 'Ticket' },
    { field: 'opciones', header: '' }
  ];
  contenido:any = [
    { 
      estatus: 'Activa',
      alias: 'WIFI Sucursal 1',
      servicio: '10.115.95.980025485',
      ticket: 'Crear ticket',
      ticketEstatus: true
    },{ 
      estatus: 'Inactiva',
      alias: 'Sala de juntas',
      servicio: '10.115.95.980025485',
      ticket: '1123513617',
      ticketEstatus: false
    },{ 
      estatus: 'Inactiva',
      alias: 'Sala de juntas',
      servicio: '10.115.95.980025485',
      ticket: 'Crear ticket',
      ticketEstatus: true
    },
  ];
  linegraph : any ={
    data : [],
    color: ""
  };
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
    color : '#000000',
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

  dispositivosDetalleSitio: any = [
    {
      dispositivo: 'enlace',
      ip: '10.115.95.980025485'
    },{
      dispositivo: 'enlace',
      ip: '10.115.95.98002555533'
    },{
      dispositivo: 'enlace',
      ip: '10.115.95.34355662331200'
    }
  ];

  dispositivosDetalleEnlace: any = [
    {
      dispositivo: 'sitios',
      ip: '10.115.95.980025485'
    },{
      dispositivo: 'sitios',
      ip: '10.115.95.980025486'
    },{
      dispositivo: 'sitios',
      ip: '10.115.95.980025487'
    }
  ];

  dispositivosDetalleServicio: any = [
    {
      dispositivo: 'sitio',
      ip: '11.115.95.000999333'
    }
  ];
  listaDispositivosDetalle: any;
  rutaDashboard: boolean ;
  nombreSitio: string;

  spinnerLoading:boolean = true;
  
  constructor(
    public dialogRef: MatDialogRef<DetalleServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    public dialog: MatDialog,
    private confirmService: DetalleServicioService,
    public spinner: NgxSpinnerService,
    private auth: AdministratorService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      alias: ['']
    });
    console.log('Data',this.data)
    this.detalleDispositivo()
  }

  detalleDispositivo(){
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": moment().set({ 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(24, 'hours').format().substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": this.data.idDispositivo,
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": this.data.ipns,
      "full": true,
      "funcionalidad": "AfectacionesMonitoreoGlobal",
    };
    console.log("Detalle:",request)
    this.dashboardService.obtenerDetalleAfectacionesRecientes(request).subscribe({
      next: (data) => {
        this.data.dispositivo = data.listaResultado[0]
        this.spinnerLoading = false;
        this.form.get('alias').setValue(this.data.dispositivo.aliasDispositivo);
      },
      error: (_) => {
        this.spinnerLoading = false;
      },
    });

    this.data.dispositivo.linegraph.forEach(e => {
      e.data.forEach(element => {
        element.y = Number(element.y);
        element.x = Number(element.x);
        element.color = '#FDA700'
      });
    });
    this.linegraph.data = this.data.dispositivo.linegraph[0].data;
    this.linegraph.color = '#FDA700';
    console.log(this.linegraph);
    this.dialogRef.disableClose = true;
    
    let mode = localStorage.getItem('afectacionesRecientes');
    if(mode != null){
      this.rutaDashboard = mode === '1' ? true: false;
    }
    this.nombreSitio = localStorage.getItem('nombre-sitio');
    this.metricaSeleciona = this.listaMetricas[0];

    this.listadoDispositivos();
  }

  listadoDispositivos(){
    if(this.data.dispositivo.tipo == 'sitio'){
      this.listaDispositivosDetalle = this.dispositivosDetalleSitio
    }
    if(this.data.dispositivo.tipo == 'enlace'){
      this.listaDispositivosDetalle = this.dispositivosDetalleEnlace
    }
    if(this.data.dispositivo.tipo == 'servicio'){
      this.listaDispositivosDetalle = this.dispositivosDetalleServicio
    }
  }



  closeDialog() {
    this.dialogRef.close(false);
  }

  detalleMetrica(nombre?,nombreLargo?){
    localStorage.setItem('nombreLargo', nombreLargo);
    localStorage.setItem('nombreMetrica', this.nombreSitio);
    localStorage.setItem('nombre-sitio', this.nombreSitio)
    localStorage.setItem('tipo-dispositivo', 'sitio');
    localStorage.setItem('dispositivo', JSON.stringify(this.data));
    this.dialogRef.close(false);
    this.rutaDashboard ? localStorage.setItem('navigation', NAV.afectacionHistorico) : localStorage.setItem('navigation', NAV.historicoServicio);
    this.rutaDashboard ? this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.afectacionMetrica+")") : this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.detalleMetrica+")")
  }

  detalleHistorico(nombre?){
    localStorage.setItem('nombreMetrica', this.nombreSitio);
    localStorage.setItem('nombre-sitio', this.nombreSitio)
    localStorage.setItem('tipo-dispositivo', 'sitio');
    this.dialogRef.close(false);
    this.rutaDashboard ? localStorage.setItem('navigation', NAV.afectacionHistorico) : localStorage.setItem('navigation', NAV.historicoServicio);
    this.rutaDashboard ? this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.afectacionHistorico+")") : this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.historicoServicio+")")
  }

  mostrarListadoMetrica(listado: any){
    if(this.data.dispositivo.tipo == 'servicio'){
      let _listado = []
      listado.forEach(element => {
        if(element.nombre != 'Latencia'){
          _listado.push(element);
        }
      });
      return _listado;
    }else{
      return listado;
    }
    
  }

  openEnlace(){
    let selecionDialogo;
    switch (this.data.dispositivo.tipo) {
      case 'sitio':
        selecionDialogo = this.confirmService.metricaEnlace(false)
        break;
      case 'enlace':
        selecionDialogo = this.confirmService.metricaSitio(false)
        break;
      case 'servicio':
        selecionDialogo = this.confirmService.metricaSitio(false)
        break;
    }
    
    const dialogRef = this.dialog.open(
      DetalleServicioComponent, 
      selecionDialogo
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
        }
      }
    );
  }

  iconoDispositivo(){
    switch (this.data.dispositivo?.tipo) {
      case 'sitio':
        return 'img-dispositivo-sitio'
      case 'enlace':
        return 'img-dispositivo-enlace'
      case 'servicio':
        return 'img-dispositivo-servicio'
    }
  }

  graficaMetrica(metrica: any){
    setTimeout(() => {
      this.data.dispositivo.metricaSelecionada = metrica
      this.linegraph.data = this.data.dispositivo.linegraph[metrica.idMetrica - 1].data;
      //this.linegraph.color = this.data.dispositivo.linegraph[metrica.idMetrica - 1].color;
     }, 300);
  } 

  public get width() {
    return window.innerWidth;
  }

  actualizarAlias(){
    let texto = this.form.get('alias').value;
    let ali = texto.trim();
    if(ali.length > 0){
      let request = {
        "dispositivoAlias": this.form.get('alias').value.trim(),
        "idDispositivo": this.data.dispositivo.idDispositivo,
        "idClienteTotalPlay": this.auth.getidClienteTotalplay()
      };
      console.log("Request:",request)
      this.dashboardService.personalizaAlias(request).subscribe({
        next: (data) => {
          console.log("Alias actualizado");
          this.alertService.info('<b>!Alias del sitio actualizado! </b>');
          this.detalleDispositivo();
        },
        error: (_) => {
          console.log("Error al actualiar Alias");
        },
      });
    }else{
      let request = {
        "dispositivoAlias": "",
        "idDispositivo": this.data.dispositivo.idDispositivo,
        "idClienteTotalPlay": this.auth.getidClienteTotalplay()
      };
      this.alertService.error('<b>!No se pudo actualizar el alias! </b>');
      console.log("Request:",request)
      this.dashboardService.personalizaAlias(request).subscribe({
        next: (data) => {
          console.log("Alias actualizado");
          this.alertService.info('<b>!Alias del sitio actualizado! </b>');
          this.detalleDispositivo();
        },
        error: (_) => {
          console.log("Error al actualiar Alias");
        },
      });
    }
  }
}
