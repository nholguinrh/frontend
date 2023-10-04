import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import * as moment from 'moment';


@Component({
  selector: 'app-servicios-cliente',
  templateUrl: './servicios-cliente.component.html',
  styleUrls: ['./servicios-cliente.component.css']
})
export class ServiciosClienteComponent implements OnInit {

  @ViewChild('selectDispositivo') selectDispositivo;
  @ViewChild('selectDispositivo') matRef: MatSelect;
  spinnerLoading = true; 

  mostrarFiltro: boolean = false; 
  configuracion: boolean = true;
  body = {
    "cliente":  {
      "idCliente" : 0,
     },
    "dispositivos":  [
    ],
    "tipoDispositivos":  [
    ],
    "estatus":  [
    ],
    "metricas": [
    ],
    "tipoTicket":  [
     ],
     "sla": "",
     "funcionalidadMetrica": "",
     "funcionalidadTicket": "",
     //"funcionalidadMetrica": "MetricaMonitoreoGlobal",
     //"funcionalidadTicket": "TicketsIncidentesPorSitioGeneral",
   };
  configuracionSeleccionada: any = [{
    id: 1,
    name: '- - -',
    title: 'Selecciona un dispositivo',
    subtitle: 'Dispositivo',
    filtros: [
      /* {
        id: 2,
        name: 'Enlaces',
        status: false,
      },{
        id: 0,
        name: 'Sitios',
        status: false,
      },{
        id: 1,
        name: 'Servicios',
        status: false,
      } */
    ]
  },{
    id: 2,
    name: '- - -',
    title: 'Selecciona un estatus del Ticket',
    subtitle: 'Estatus',
    filtros: [
      /*{
        id: 1,
        name: 'Sin tickets',
        busqueda: 'Sin tickets',
        status: false,
      },*/{
        id: 2,
        name: 'Ticket pendiente',
        busqueda: 'Pendiente',
        status: false,
      },{
        id: 3,
        name: 'Ticket resuelto',
        busqueda: 'Resuelto',
        status: false,
      },{
        id: 4,
        name: 'Ticket en curso',
        busqueda: 'En Curso',
        status: false,
      }
    ]
  },{
    id: 3,
    name: '- - -',
    title: 'Selecciona una métrica',
    subtitle: 'Métricas',
    filtros: [
      /* {
        id: 1,
        name: 'Alcanzabilidad',
        status: false,
      },{
        id: 2,
        name: 'Disponibilidad',
        status: false,
      },{
        id: 3,
        name: 'Latencia',
        status: false,
      },{
        id: 4,
        name: 'Ocupación',
        status: false,
      },{
        id: 5,
        name: 'Pérdida de Paquete',
        status: false,
      } */
    ]
  },{
    id: 4,
    name: '- - -',
    title: 'Selecciona un estatus del dispositivo',
    subtitle: 'Estatus',
    filtros: [
      {
        id: 1,
        name: 'Dispositivo inalcanzable',
        busqueda: 'inactivo',
        status: false,
      },{
        id: 2,
        name: 'Dispositivo sin gestión',
        busqueda: 'singestion',
        status: false,
      },{
        id: 3,
        name: 'Dispositivo en mantenimiento',
        busqueda: 'mantenimiento',
        status: false,
      }
    ]
  }
]
  filtroSelecionado:  number;
  Options = [{
    nombre: "Switch",
    icono: "image-dispositivo-servicio"
  },{
    nombre: "ONT",
    icono: "image-dispositivo-ont"
  },{
    nombre: "Radio Base",
    icono: "image-puntas-radio"
  },{
    nombre: "CPE",
    icono: "image-dispositivo-cpe"
  },{
    nombre: "Firewall",
    icono: "image-dispositivo-estatus"
  },{
    nombre: "Router",
    icono: "image-dispositivo-sitio"
  }];
  selectable = true;
  removable = true;
  dispositivosBusqueda: any;
  public form: FormGroup;
  busqueda: string;
  dispositivos: any[] = [];
  status = false;
  constructor(private formBuilder: FormBuilder, 
    public dialog: MatDialog, 
    private confirmService: ConfirmDialogService,
    private router: Router,
    private dashboardService: DashboardService,
    private administratorService: AdministratorService,
    public spinner: NgxSpinnerService,) { }

  ngOnInit(): void {
    //this.catalogosBusqueda();
    this.spinnerLoading = true;
    this.consultaTiposDispositivos();
    this.consultaMetrica();
    this.obtenerAfectaciones();
    this.form = this.formBuilder.group({      
      busqueda: [''],
      dispositivos: [],
    });
  }

  seleccionFiltro(idFiltro: number){
    this.filtroSelecionado = idFiltro
  }

  borrarSeleccionFiltro(){
    this.filtroSelecionado = 0
  }

  configuracionMasiva(opcion: boolean){
    opcion ? this.configuracion = true : this.configuracion = false;
  }

  borrarFiltros(){
    this.configuracionSeleccionada.forEach(configuracion => {
      configuracion.name = '- - -'
      configuracion.filtros.forEach(filtro => {
        filtro.status = false
      })
    });
    this.form.get('dispositivos').setValue([]);
    this.configuracion = true;
    this.mostrarFiltro = false;
  }


  borrarFiltroBusqueda(listaFiltro: any, event?: any){
    if(event){
      event.stopPropagation();
    }
    listaFiltro.forEach(element => {
      element.status = false
    });
    this.form.get('dispositivos').setValue([]);
  }

  cerrarFiltrosBusqueda(listaFiltro: any,){
    this.borrarSeleccionFiltro()
    if(listaFiltro.name == '- - -'){
      listaFiltro.filtros.forEach(element => {
        element.status = false
      });
    }else{

    }
  }

  borrarFiltroDispositivos(event?:  any){
    if(event){
      event.stopPropagation();
    }
    this.form.get('dispositivos').setValue([]);
  }

  removeService(index: number, item: any){

    this.matRef.options.forEach((data: MatOption) => {      
      if(item === data.value){
        data.deselect();
      }
    });
  }

  aceptarFiltrosBusqueda(metricaBusqueda: any){
    this.borrarSeleccionFiltro()
    let index = 0
    metricaBusqueda.name = '- - -'
    metricaBusqueda.filtros.forEach(element => {
      if(element.status == true){
        this.mostrarFiltro = true
        if(index == 0){
          metricaBusqueda.name = element.name
        }else{
          metricaBusqueda.name = metricaBusqueda.name + ', ' + element.name
        }
        index ++;
      }
    });

    let contador = 0;
    if(metricaBusqueda.id == 1){
      let OpcionesDispositivos = this.form.get('dispositivos').value;
      if(OpcionesDispositivos){
        OpcionesDispositivos.forEach(element => {
          if(contador == 0){
            if(metricaBusqueda.name !== '- - -'){
              metricaBusqueda.name = metricaBusqueda.name + ', ' + element
            }else{
              metricaBusqueda.name = element
            }
          }else{
            metricaBusqueda.name = metricaBusqueda.name + ', ' + element
          }
          index ++;
        });
      }
    }
  }

  buscarServicios(){
    let pase: boolean;
      this.configuracionSeleccionada[0].filtros.forEach(element => {
        if(element.status){
          this.body.dispositivos.push({'idDispositivo': element.id, 'nombreDispositivo': element.name});
        }
      });
      /* this.configuracionSeleccionada[1].filtros.forEach(element => {
        if(element.status){
          this.body.tipoTicket.push(element.name);
        }
      }); */
      this.configuracionSeleccionada[1].filtros.forEach(element => {
        if(element.status){
            this.body.tipoTicket.push({'nombreTicket': element.busqueda});
        }
      });
      this.configuracionSeleccionada[2].filtros.forEach(element => {
        if(element.status){
          this.body.metricas.push({'nombreMetrica': element.name});
        }
      });
      this.configuracionSeleccionada[3].filtros.forEach(element => {
        if(element.status){
          this.body.estatus.push({'nombreEstatus': element.busqueda});
        }
      });

      let tiposDispositivos = this.form.controls['dispositivos'].value;
      if(tiposDispositivos){
        tiposDispositivos.forEach(element => {
          this.body.tipoDispositivos.push({"nombreTipoDispositivo": element.toUpperCase() })
        });
      }
      /*
      if(this.body.metricas.length == 0){
        this.body.metricas.push({'nombreMetrica': 'Todos'});
      }
       */

      if(this.status){
        console.log("Entro a el check");
        if(this.configuracion){
          this.body.sla = "FUERA_RANGO";
        }else{
          this.body.sla = "EN_PELIGRO";
        }
      }

      this.configuracionSeleccionada.forEach(element => {
        if(element.name != '- - -'){
          pase = true
        }
      });

    if(pase == true){
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.busquedaPersonalizada+")");
      localStorage.setItem('bodyPersonalizado', JSON.stringify(this.body));
    }
  }

  catalogosBusqueda(){
    //this.spinner.show();
    this.administratorService.catalogoMetricas().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
        console.log('Error:' + _);
      }
    });

    this.administratorService.catalogoEstatusTipo('E').subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
        console.log('Error:' + _);
      }
    });

    this.administratorService.catalogoEstatusTipo('T').subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
        console.log('Error:' + _);
      }
    });
  }

  buscarFiltro(){
    localStorage.setItem('dispositivo-buscado',this.busqueda)
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.busquedaPersonalizada+")");
  }

  presionar(event){
    console.log("Event:",event)
  }

  consultaTiposDispositivos(){
    this.dashboardService.obtenerTiposDispositivos(this.administratorService.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.spinnerLoading = false;
          console.log("DataDispositivos",data)
          data.forEach(element => {
            this.configuracionSeleccionada[0].filtros.push({id: element.value,name: element.name,status: false})
          });
        }
      },
      error: (error) => { 
        this.spinnerLoading = false;
        console.log("Error")
      }
    });
  }

  consultaMetrica() {
    this.dashboardService
      .obtenerMetricasCliente(this.administratorService.getIdCliente())
      .subscribe({
        next: ({ data, httpStatus }) => {
          this.spinnerLoading = false;
          if (httpStatus === 200) {
            data.forEach(element => {
              this.configuracionSeleccionada[2].filtros.push({id: element.idMetrica,name: element.metrica,status: false})
            });
            console.log("Metricas:",data)
          }
        },
        error: (error) => {
          this.spinnerLoading = false;
        },
      });
  }

  obtenerAfectaciones() {
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format().substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "ipNs": "",
      "funcionalidad": "AfectacionesMonitoreoGlobal",
      "tiempo": "D",
      "full": true
    };
    this.dashboardService.monitoreoEnlacesAfectaciones(request).subscribe({
      next: () => {
        var start = window.performance.now();
        var end = window.performance.now();
        console.log(`Tiempo execusion Sitios inactivos: ${((end - start)/1000).toFixed(5)} segundos`);
        this.spinnerLoading = false;
      }
    });
  }  
}
