import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AccesoDirecto } from 'src/app/shared/model/cliente.model';
import { DateValue } from 'src/app/shared/model/date-value';
import { MarginConf } from 'src/app/shared/model/margin-conf';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import * as moment from 'moment';

@Component({
  selector: 'app-servicios-directos',
  templateUrl: './servicios-directos.component.html',
  styleUrls: ['./servicios-directos.component.css']
})
export class ServiciosDirectosComponent implements OnInit {

  @ViewChild('accesosModal') accesosModal : any;
  errorCarga: number = 0;
  public accesosDirectos: AccesoDirecto[] = [];
  public accesosUsuario: AccesoDirecto[] = [];
  public accesosUsuarioAux: AccesoDirecto[] = [];
  public accesosDirectosPrueba: AccesoDirecto[] = [
    {
      activoInactivo: 'activo',
      descripcion: 'Baja disponibilidad con tickets pendientes',
      idCatAccesoDirecto: 1,
      predeterminado: 1
    },
    {
      activoInactivo: 'inactivo',
      descripcion: 'Bajo rendimiento con tickets pendientes',
      idCatAccesoDirecto: 2,
      predeterminado: 0
    },
    {
      activoInactivo: 'inactivo',
      descripcion: 'Consumo con tickets pendientes',
      idCatAccesoDirecto: 3,
      predeterminado: 0
    },
    {
      activoInactivo: 'activo',
      descripcion: 'Dispositivos sin gestión',
      idCatAccesoDirecto: 4,
      predeterminado: 1
    },
    {
      activoInactivo: 'activo',
      descripcion: 'Sitios con SLA fuera de rango',
      idCatAccesoDirecto: 5,
      predeterminado: 1
    },
    {
      activoInactivo: 'inactivo',
      descripcion: 'Dispositivos con SLA en peligro',
      idCatAccesoDirecto: 6,
      predeterminado: 0
    },
    {
      activoInactivo: 'inactivo',
      descripcion: 'Dispositivos en mantenimiento',
      idCatAccesoDirecto: 7,
      predeterminado: 0
    },
    {
      activoInactivo: 'inactivo',
      descripcion: 'Dispositivos con alta cantidad de tickets',
      idCatAccesoDirecto: 8,
      predeterminado: 0
    },
    {
      activoInactivo: 'activo',
      descripcion: 'Dispositivos con Latencia fuera de SLA',
      idCatAccesoDirecto: 9,
      predeterminado: 1
    }
  ];
 
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-01 06:12:58.911982'), value: 50 },
    { date: new Date('2022-10-02 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-03 06:12:58.911982'), value: 72 },
    { date: new Date('2022-10-04 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-05 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-06 06:12:58.911982'), value: 55 },
    { date: new Date('2022-10-07 06:12:58.911982'), value: 40 },
    { date: new Date('2022-10-08 06:12:58.911982'), value: 47 },
    { date: new Date('2022-10-09 06:12:58.911982'), value: 50 },
    { date: new Date('2022-10-10 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-11 06:12:58.911982'), value: 72 },
    { date: new Date('2022-10-12 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-13 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-14 06:12:58.911982'), value: 55 },
    { date: new Date('2022-10-15 06:12:58.911982'), value: 40 },
    { date: new Date('2022-10-16 06:12:58.911982'), value: 47 },
    { date: new Date('2022-10-17 06:12:58.911982'), value: 50 },
    { date: new Date('2022-10-18 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-19 06:12:58.911982'), value: 72 },
    { date: new Date('2022-10-20 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-21 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-22 06:12:58.911982'), value: 55 },
    { date: new Date('2022-10-23 06:12:58.911982'), value: 40 },
    { date: new Date('2022-10-24 06:12:58.911982'), value: 47 },
    { date: new Date('2022-10-25 06:12:58.911982'), value: 50 },
    { date: new Date('2022-10-26 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-27 06:12:58.911982'), value: 72 },
    { date: new Date('2022-10-28 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-29 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-30 06:12:58.911982'), value: 40 },
    { date: new Date('2022-10-31 06:12:58.911982'), value: 55 }
  ];
  datesValueRendimiento;

  botton: number = 1;
  botonLista: any = [{
    numero: 1,
    color: "info"
  },{
    numero: 2,
    color: "light"
  },{
    numero: 3,
    color: "light"
  },{
    numero: 4,
    color: "light"
  },{
    numero: 5,
    color: "light"
  },{
    numero: 6,
    color: "light"
  }];
  promedioMetricas: any = [
    {
      titulo: 'Disponibilidad',
      promedio: '+0.12%',
      actual: '83%',
      color: 'primary'
    },
    {
      titulo: 'Alcanzabilidad',
      promedio: '+0.12%',
      actual: '89%',
      color: 'primary'
    },
    {
      titulo: 'Pérdida de paquetes',
      promedio: '+0.12%',
      actual: '02%',
      color: 'danger'
    },
    {
      titulo: 'Latencia',
      promedio: '+0.12%',
      actual: '98mls',
      color: 'danger'
    },
    {
      titulo: 'Consumo',
      promedio: '+0.12%',
      actual: '90mps',
      color: 'danger'
    }
  ];


  malRendimiento: any = [
  ];
  fueraRango: any = [
    {
      titulo: 'Gran Patio Pachuca',
      promedio: '-9.12%',
      actual: '65%',
      color: 'danger'
    },
    {
      titulo: 'Paseo Santa Fé',
      promedio: '-8.12%',
      actual: '08%',
      color: 'danger '
    },
    {
      titulo: 'Gran Sur CDMX',
      promedio: '-7.12%',
      actual: '78%',
      color: 'danger'
    },
    {
      titulo: 'Galerias Perisur',
      promedio: '-6.12%',
      actual: '03%',
      color: 'danger'
    },
    {
      titulo: 'Explanada Puebla',
      promedio: '-5.12%',
      actual: '78%',
      color: 'danger'
    }
  ];
  afectacionesRecientes: any = [
    {
      titulo: 'Gran Patio Pachuca',
      graficaNombre: 'Disponibilidad',
      promedio: '2.35%',
      actual: '78.43%',
      color: 'danger'
    },
    {
      titulo: 'Paseo Santa Fé',
      graficaNombre: 'Consumo',
      promedio: '5.35%',
      actual: '86.01%',
      color: 'secondary'
    },
    {
      titulo: 'Gran Sur CDMX',
      graficaNombre: 'Alcanzabilidad',
      promedio: '2.35%',
      actual: '94.35%',
      color: 'secondary'
    },
  ];
  slaPeligro: any = [
    {
      titulo: 'Gran Patio Pachuca',
      promedio: '-9.12%',
      actual: '65%',
      color: 'danger'
    },
    {
      titulo: 'Paseo Santa Fé',
      promedio: '-8.12%',
      actual: '08%',
      color: 'danger '
    },
    {
      titulo: 'Gran Sur CDMX',
      promedio: '-7.12%',
      actual: '78%',
      color: 'danger'
    },
    {
      titulo: 'Galerias Perisur',
      promedio: '-6.12%',
      actual: '03%',
      color: 'danger'
    },
    {
      titulo: 'Explanada Puebla',
      promedio: '-5.12%',
      actual: '78%',
      color: 'danger'
    }
  ];

  margin?: MarginConf = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  accesoDirecto: number = 1;

  body = {
    "cliente":  {
      "idCliente" : 0
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
   };

   spinnerLoading: boolean = true;
  constructor(private _formBuilder: FormBuilder,
    private router: Router,
    public dashboardService: DashboardService,
    private administratorService: AdministratorService,
    public spinner: NgxSpinnerService,
    private workspaceService: WorkspaceService) { }

  ngOnInit(): void {
    this.obtenerEstadisticas();
    this.malRendimientoTop();
    //this.accesosDirectosPredeterminados()


    this.loadAccesoDirectoCatalogo()
  }

  loadAccesoDirectoCatalogo(){
    this.accesosDirectos = []
    this.administratorService.catalogoAccesoDirecto().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          data.forEach((accesoDirecto) => {
            if (accesoDirecto.predeterminado === 1 && accesoDirecto.tipoAcceso === 'cliente') {
              this.accesosUsuario.push(accesoDirecto);
            } else {
              if(accesoDirecto.tipoAcceso === 'cliente'){
                this.accesosDirectos.push(accesoDirecto);
              }
            }
          });
          this.loadAccesoDirectoUsuario();
        }
      },
      error: (_) => {
        this.spinner.hide();
      }
    });
  }

  loadAccesoDirectoUsuario() {
    this.administratorService.consultaAccesosDirectos(this.administratorService.getIdUsuarios()).subscribe({
      next: ({ data, httpStatus }) => {
        if (httpStatus === 200) {
          data.forEach((usuarioAccesoDirecto) => {
            this.accesosUsuario.push(usuarioAccesoDirecto.accesoDirecto);
          });
          this.accesosUsuarioAux = [...this.accesosUsuario];
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
      }
    });
  }

  public openAccesosModal() {
    this.accesosModal.nativeElement.className = 'modal show-modal';
  }

  public closeAccesosModal() {
    this.accesosModal.nativeElement.className = 'modal hide-modal';
  }

  public limpiarAccesos(){
    this.closeAccesosModal();
    this.accesosUsuarioAux = [...this.accesosUsuario];
  }

  public actualizarAccesos(){
    const _accesosDirectos:any = this.generateJSON();
    //this.spinner.show();
    this.administratorService.editaAccesosDirectos(
      this.administratorService.getIdUsuarios(),
      _accesosDirectos)
      .subscribe({
      next: ({httpStatus}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          this.accesosUsuario = [...this.accesosUsuarioAux];
          this.closeAccesosModal();
        } else {
          this.spinner.hide();
          this.limpiarAccesos();
        }
      },
      error: (_) => {
        this.closeAccesosModal();
        this.spinner.hide();
      }
    });
  }

  generateJSON() {
    let _accesosDirectos:any = [];
    this.accesosUsuarioAux.forEach((accesoUsuario,i) => {

      if (accesoUsuario.predeterminado !== 1) {
        _accesosDirectos.push({
          paraUsuario: {
            idUsuario: this.administratorService.getIdUsuarios()
          },
          orden: i+1,
          accesoDirecto: accesoUsuario
        });
      }

    });
    return _accesosDirectos;
  }

  deleteAccesoDirecto(acceso: AccesoDirecto, event?: any){
    if(event != null){
      event.stopPropagation();
    }
    this.modificaAcceso(acceso);
    this.actualizarAccesos()
  }

  public modificaAcceso(acceso: AccesoDirecto){
    const i = this.accesosUsuarioAux.findIndex(e => e.idCatAccesoDirecto === acceso.idCatAccesoDirecto);
    if (i > -1) {
      this.accesosUsuarioAux.splice(i, 1);
    } else {
      this.accesosUsuarioAux.push(acceso);
    }
  }

  isAccesoActivo(descripcion: string){
    return this.accesosUsuarioAux?.some(e => e.descripcion === descripcion);
  }

  accesosDirectosPredeterminados(){
    this.accesosUsuario = []
    this.accesosDirectos.forEach(element => {
      if(element.predeterminado == 1){
        this.accesosUsuario.push(element);
      }
    });
  }

  cambiarContenido(acceso: number){
    setTimeout(() => {
        this.accesoDirecto = acceso;
    }, 100);
    this.botton = acceso;

  }

  busquedaPersonalizada(cuadranteCarrusel?,busqueda?){

    switch(cuadranteCarrusel){
      case 1: this.body.metricas.push({'nombreMetrica': busqueda});
        break;
      case 2: 
      console.log("Numero:::",busqueda)
          switch (Number(busqueda)) {
            case 2:
              this.body.estatus.push({"nombreEstatus": "inactivo"})
              break;
            case 3:
              this.body.estatus.push({"nombreTicket": "Pendiente"})
              break;
            case 4:
              this.body.estatus.push({"nombreEstatus": "singestion"})
              break;
            case 5:
              this.body.estatus.push({"nombreTicket": "Resuelto"})
              break;
            case 6:
              this.body.estatus.push({"nombreEstatus": "mantenimiento"});
              break;
          }
        break;
      case 3: this.body.estatus.push({"nombreEstatus": busqueda});
        break;
    }
    localStorage.setItem('bodyPersonalizado', JSON.stringify(this.body));
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.busquedaPersonalizada+")");
  }



  public get width() {
    return window.innerWidth;
  }

  obtenerEstadisticas(){
    this.spinnerLoading = true;
    let body = {
      "fechaInicio": Constantes.FECHA_INICIO_GLOBAL_ENCABEZADO,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": 'p',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "EncabezadoGeneralMonitoreoGlobal",
      "full": true
    }

    this.dashboardService.obtenerEstadisticas(body).subscribe({
      next: ( data ) => { 
          this.promedioMetricas = data.estadisticasMetricas;
          this.spinnerLoading = false;
      },
      error: (error) => { 
        console.log('Error ', error);
        this.spinnerLoading = false;
      }
    });
    /*
    let body = {
      "fechaInicio": "",
      "fechaFin": "",
      "idEmpresa": this.administratorService.getidClienteTotalplay(),
      "funcionalidad": "EncabezadoMonitoreoGlobal",
      "full": true
    }

    this.dashboardService.obtenerEstadisticas(body).subscribe({
      next: ( data ) => { 
        console.log(data)
        if(data.estadisticasMetricas != null){
          this.errorCarga = 0;
          this.promedioMetricas = data.estadisticasMetricas;
        }else{
          this.errorCarga = 0;
        }
      },
      error: (error) => { 
        this.errorCarga = 1;
        console.log('Error ', error);
      }
    });
     */
  }

  malRendimientoTop(){
    let body = {
        "cliente": {
            "idCliente":  Number(this.administratorService.getidClienteTotalplay())
        },
        "dispositivos": [
            {
                "idDispositivo": "3",
                "nombreDispositivo": "Sitios"
            }
        ],
        "tipoDispositivos": [],
        "estatus": [
            {
                "nombreEstatus": "inactivo"
            }
        ],
        "metricas": [],
        "tipoTicket": [],
        "sla": "",
        "funcionalidadMetrica": "",
        "funcionalidadTicket": ""
    }
    this.dashboardService.obtenerBusquedaPersonalizada(body).subscribe({
      next: (data) => {
        if(data){
          console.log('busqueda: ', data);
          data.listaResultado.slice(0,5);
          data.listaResultado.forEach(element => {
            this.malRendimiento.push({
              titulo: element.sitio,
              ipSitio: element.ipSitio,
              idDispositivo: element.idDispositivo,
              promedio: ( element.linegraph[0].porcentajeActual - element.linegraph[0].porcentajeSla) + '%',
              actual: element.linegraph[0].porcentajeActual + '%',
              color: 'danger'
            });
          });
        }
      },
      error: (_) => {
      }
    });
  }

}
