import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ConfiguracionSLA, DatosPunta, DetalleCliente, DetallePunta, Punta } from 'src/app/shared/model/cliente.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { InterfacesDialogComponent } from 'src/app/shared/utils/interfaces-dialog';
import { InterfacesDialogService } from 'src/app/shared/utils/interfaces-dialog/interfaces-dialog.service';
import { PuntasDialogComponent } from 'src/app/shared/utils/puntas-dialog';
import { PuntasDialogService } from 'src/app/shared/utils/puntas-dialog/puntas-dialog.service';
import { ConfiguracionMasivaComponent } from '../configuracion-masiva/configuracion-masiva.component';

@Component({
  selector: 'app-sla',
  templateUrl: './sla.component.html',
  styleUrls: ['./sla.component.css']
})
export class SlaComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('selectDispositivo') selectDispositivo;
  @ViewChild('selectDispositivo') matRef: MatSelect;
  public dataSource = null;
  fetchRequest: PageRequest<Punta> = new PageRequest<Punta>();
  pageResponse: Page<Punta> = new Page<Punta>();
  public form: FormGroup;
  cliente: string;
  configuracionSLA: string;
  detalleCliente: DetalleCliente;
  datosPunta: DatosPunta;
  public filtro:string = 'activas';
  sla: ConfiguracionSLA;
  idUsuario: number;
  idConfiguracionSLA: number;
  findBy: number = 0;
  estatusDispositivo: String[] = [];
  tdispositivo: String[] = [];
  dispositivo: [];
  dispositivosBusqueda = [{
    estatus: false,
    tipo: 1,
    nombre: 'Enlaces'
  },{
    estatus: false,
    tipo: 1,
    nombre: 'Sitios'
  },{
    estatus: false,
    tipo: 1,
    nombre: 'Servicios'
  },{
    estatus: false,
    tipo: 2,
    nombre: 'SLA sin asignar',
    val: 'SIN_SLA'
  },{
    estatus: false,
    tipo: 2,
    nombre: 'SLA asignado',
    val: 'CON_SLA'
  }];

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

  showAutocomplete: boolean = true;
  asigandosSLA:any;
  selectable = true;
  removable = true;
  actualPage: number;

  constructor( private alertService: AlertService,
    private dialogService: InterfacesDialogService,
    private dialog: MatDialog,
    private confirmService: ConfirmDialogService,
    private workspaceService: WorkspaceService,
    private administratorService: AdministratorService,
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService,
    public router: Router) { }

  ngOnInit(): void {
    this.idUsuario = this.administratorService.getIdUsuarios();
    localStorage.setItem('navigation', NAV.sla);
    this.cliente = localStorage.getItem('cliente');
    this.configuracionSLA = localStorage.getItem('configuracionSLA');
    this.idConfiguracionSLA = Number(localStorage.getItem('idConfiguracionSLA'));
    this.detallePlantilla(this.idConfiguracionSLA);
    this.form = this.formBuilder.group({
      busqueda: [''],
      dispositivos: []
    });
    this.cargarCliente();
    this.consultarDatosPunta();
    this.onPaged(0);
  }

  onPaged(page: number) {
    this.actualPage = page;
      if(this.findBy == 0){
        this.listarPuntas(page);
      }else if(this.findBy == 2){
        this.filtradoDispositivo(page);
      }else{
        this.listarPuntasPorTexto(page);
      }
  }

  cargarCliente() {
    const _idUsuario = this.administratorService.getIdUsuarios();
    this.administratorService.consultarDetalleCliente(_idUsuario, Number(this.cliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.detalleCliente = data as DetalleCliente;
        }
      },
      error: (e) => {
        console.error(e.message);
      }
    });
  }

  consultarDatosPunta(typeDispositivo?: boolean) {
    this.workspaceService.consultarContadorPuntaSLA(Number(this.cliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.datosPunta = data;
          this.asigandosSLA = data;
          if(typeDispositivo){
            return
          }else{
            if(this.asigandosSLA.totalEnlacesActivos == 0 || this.asigandosSLA.totalEnlacesActivos == null){
              this.dispositivosBusqueda = [{
                estatus: false,
                tipo: 1,
                nombre: 'Sitios'
              },{
                estatus: false,
                tipo: 1,
                nombre: 'Servicios'
              },{
                estatus: false,
                tipo: 2,
                nombre: 'SLA sin asignar',
                val: 'SIN_SLA'
              },{
                estatus: false,
                tipo: 2,
                nombre: 'SLA asignado',
                val: 'CON_SLA'
              }];
            }
          }
          
        } else {
          this.alertService.error('Error al obtener información de las puntas');
        }
      },
      error: (e) => {
        this.alertService.error('Error al obtener información de las puntas');
      }
    });
  }

  getIcon(punta: Punta){
    if(punta.tbConfiguracionSLA){
      switch (punta.tipoPunta.toUpperCase()) {
        case 'ONT':
        case 'Other Network Device':
          return 'image-dispositivo-ont-active'
        case 'RADIO':
        case 'RADIO BASE':
          return 'image-puntas-radio-active'
        case 'SWITCH':
          return 'image-dispositivo-servicio-active'
        case 'CPE':
          return 'image-dispositivo-cpe-active'
        case 'FIREWALL':
          return 'image-dispositivo-estatus-active'
        case 'ROUTER':
          return 'image-dispositivo-sitio-active'
        case 'ENLACE':
          return 'image-dispositivo-enlace-active'
      }
    }else{
      switch (punta.tipoPunta.toUpperCase()) {
        case 'ONT':
        case 'Other Network Device':
          return 'image-dispositivo-ont'
        case 'RADIO':
        case 'RADIO BASE':
          return 'image-puntas-radio'
        case 'SWITCH':
          return 'image-dispositivo-servicio'
        case 'CPE':
          return 'image-dispositivo-cpe'
        case 'FIREWALL':
          return 'image-dispositivo-estatus'
        case 'ROUTER':
          return 'image-dispositivo-sitio'
        case 'ENLACE':
          return 'image-dispositivo-enlace'
      }
    }
  }

  getDetalle(idClientePunta:number){
    this.spinner.show();
    this.workspaceService.consultarDetallePunta(idClientePunta,"sla").subscribe({
      next: ({data, message, httpStatus}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          this.openSLADialog(data);
        } else {
          this.spinner.hide();
          this.alertService.error(message);
        }
      },
      error: (_) => {
        this.spinner.hide();
      }
    });
  }

  openSLADialog(detallePunta: DetallePunta){
    const dialogRef = this.dialog.open(
      InterfacesDialogComponent,
      this.dialogService.detallePunta(detallePunta)
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data == true){
          this.alertService.successBlue('<b>¡Cambios guardados correctamente!</b>');
          this.findBy = 2
          this.consultarDatosPunta(true);
          this.onPaged(this.actualPage);
        }
      }
    );
  }

  goToDetalleCliente(){
    this.alertService.successBlue('<b>¡Cambios guardados correctamente!</b>');
    setTimeout(() => {
      let navigation = localStorage.getItem('backsla');
      if(navigation === NAV.nuevoClienteConfiguracion){
        this.registrarBitacora(4)
        this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteConfiguracion+")");
      }else{
        localStorage.setItem('detalle-cliente', '2');
        this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.detalleCliente+")");
      }
    }, 500);
    
  }

  activarInterfaces(){
    const dialogRef = this.dialog.open(
      ConfiguracionMasivaComponent, 
      this.confirmService.activarInterfaces(this.asigandosSLA)
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data[0] == true){
          let puntasActivadas = data[1];
          const _idUsuario = this.administratorService.getIdUsuarios();
          this.spinner.show();
          this.workspaceService.configuracionMasivaPuntas(_idUsuario, Number(this.cliente), this.idConfiguracionSLA, data[1] ? 'ACTIVAR':'DESACTIVAR').subscribe({
            next: ({data, httpStatus, message}) => {
              if (httpStatus === 200) {
                if(puntasActivadas == true){
                  this.registrarBitacora(2)
                  this.alertService.successBlue('<b>¡Se ha asignado un SLA todos los dispositivos correctamente!</b>');
                }else{
                  this.registrarBitacora(3)
                  this.alertService.successBlue('<b>¡Se ha eliminado el SLA de todos los dispositivos correctamente!</b>');
                }
                this.consultarDatosPunta();
                this.onPaged(0);
              } else {
                this.spinner.hide();
                this.alertService.error('<b>Error</b> al modificar puntas');
              }
            },
            error: (e) => {
              this.spinner.hide();
              this.alertService.error('<b>Error</b> al modificar puntas');
            }
          });
          this.consultarDatosPunta();
        }
        this.consultarDatosPunta();
      }
    );
  }

  activarDispositivo(dispositivo: any, sla: boolean){
    this.spinner.show();
    this.workspaceService.consultarDetallePunta(dispositivo.idClientePunta,"sla").subscribe({
      next: ({data, message, httpStatus}) => {
        if (httpStatus === 200) {
            if(sla){
              data.punta.tbConfiguracionSLA = this.sla;
            }else{
              data.punta.tbConfiguracionSLA = null;
            }
            data.activacion = false
            data.interfaces.forEach((element) =>{
              if(element.tbCatEstatus.idCatEstatus == 27){
                element.tbConfiguracionSLA = this.sla;
              }else{
                let slaConf: ConfiguracionSLA =  null;
                element.tbConfiguracionSLA = slaConf;
              }
            });
            this.workspaceService.modificarDetallePunta(
              this.idUsuario,
              data
            ).subscribe({
              next: ({httpStatus, message}) => {
                if (httpStatus === 200) {
                  this.registrarBitacora(1, data.punta.idClientePunta)
                  this.alertService.successBlue('<b>¡Se ha asignado un SLA al dispositivo correctamente!</b>');
                  this.onPaged(this.actualPage);
                  this.consultarDatosPunta();
                  this.spinner.hide();
                } else {
                  this.alertService.error('Error al asignar configuración');
                  this.spinner.hide();
                }
              }, 
              error: (e) => {
                this.alertService.error('Error al asignar configuración');
                this.spinner.hide();
              }
            });
            this.consultarDatosPunta();
        } else {
          this.spinner.hide();
          this.alertService.error('Error al asignar configuración');
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('Error al asignar configuración');
      }
    });
  }

  listarPuntas(page: number){
    this.spinner.show();
    this.workspaceService.consultarPuntasSLA(6, page, Number(this.cliente), this.filtro).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.pageResponse.init(result);
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    }); 
  }

  listarPuntasPorTexto(page: number){
    const busqueda = this.form.controls['busqueda'].value;
    if (busqueda != null && busqueda != '') {
      this.spinner.show();
      this.workspaceService.consultarPuntasSLAPorTexto(5, page, Number(this.cliente), busqueda).subscribe({
        next: (result) => {
          if (result.data != null) {
            this.pageResponse.init(result);
            this.spinner.hide();
          }else{
            this.spinner.hide();
          }
        },
        error: (_) => {
          this.openDialog();
          this.spinner.hide();
        }
      }); 
    }else{
      this.findBy = 0;
      this.filtro = 'activas';
      this.listarPuntas(page);
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: 0},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
    });
  }

  detallePlantilla(id: number){
    this.administratorService.detalleSLA(id).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.sla = data.configuracionSLA;
        }
      },
      error: (_) => {
        this.alertService.error('Error al obtener datos de la configuración seleccionada');
      }
    });
  }

  changeFiltro(filtro: string){
    this.findBy = 0;
    this.filtro = filtro;
    this.onPaged(0)
    this.borrarFiltro(3);
  }

  filterString() {
    this.findBy = 1;
    this.onPaged(0);
    this.borrarFiltro(3);
  }

  borrarFiltro(condition: number, event?: any){
    if(event){
      event.stopPropagation();
    }
    if(condition == 1 ){
      this.dispositivosBusqueda.forEach(element => {
        element.estatus = false;
      });
    }else if(condition == 2){
      this.form.get('dispositivos').setValue([]);
    }else if(condition == 3){
      this.dispositivosBusqueda.forEach(element => {
        element.estatus = false;
      });
      this.form.get('dispositivos').setValue([]);
    }
  }

  filtrarDispositivo(){
    this.findBy = 2;
    this.form.controls['busqueda'].reset();
    this.estatusDispositivo = [];
    this.tdispositivo = [];
    this.filtradoDispositivo(0);
  }

  removeService(index: number, item: any){
    this.matRef.options.forEach((data: MatOption) => {      
      if(item === data.value){
        data.deselect();
      }
    });
  }

  

  refresh(){
    this.form.controls['busqueda'].reset();
    this.estatusDispositivo = [];
    this.tdispositivo = [];
    this.listarPuntas(0);
  }

  keyShowAutocomplete(event: any) {
    if(event.target.value.length > 0) {
      this.showAutocomplete = false;
    }else{
      this.showAutocomplete = true;
    }
  }

  searchEnter(event){
    event.stopPropagation();
    this.trigger.closeMenu();
    this.filterString();
  }

  closeAutocomplete() {
    this.autocomplete.closePanel();
  }

  filtradoDispositivo(page){
    this.tdispositivo = [];
    this.estatusDispositivo = [];
    this.spinner.show();
    this.dispositivosBusqueda.forEach(dispositivo => {
      if(dispositivo.tipo == 1 && dispositivo.estatus == true){
        this.tdispositivo.push((dispositivo.nombre).toLowerCase());
      }else if(dispositivo.tipo == 2 && dispositivo.estatus == true){
        this.estatusDispositivo.push((dispositivo.val));
      }
    });

    let body = {
      idCliente: Number(this.cliente),
      dispositivo: this.tdispositivo,
      conSLA: this.estatusDispositivo.length == 2 ||  this.estatusDispositivo.length ==  0 ? "TODOS" : this.estatusDispositivo[0],
      tipoDispositivo: this.form.controls['dispositivos'].value ?  this.form.controls['dispositivos'].value : []
    }
    this.workspaceService.filtrarPuntasSLA(body,6,page).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.pageResponse.init(result);
        }
        this.spinner.hide();
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
  }


  registrarBitacora(flujo?: number, idDispositivo?: number){
    let cliente: string = ', del cliente: '+ Number(this.cliente)
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;

    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", acaba de asignar el dispositivo "+ idDispositivo +", con el SLA " + this.idConfiguracionSLA + cliente
      funcionalidad = 'Asignar dispositivo con SLA'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", acaba de asignar todos los dispositivos con el SLA " + this.idConfiguracionSLA + cliente 
      funcionalidad = 'Asignar dispositivos'
      tipoOperacion = 'Cambios'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", acaba de desasignar la configuración SLA de todos los dispositivos " + cliente
      funcionalidad = 'Desasignar dispositivos'
      tipoOperacion = 'Cambios'
    }else if(flujo == 4){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo los cambios de la asignación del SLA " + this.idConfiguracionSLA + cliente
      funcionalidad = 'Asignación de SLA a dispositivos'
      tipoOperacion = 'Cambios'
    }else{
      return
    }
    let body = {
      "funcionalidad": funcionalidad,
      "tipoOperacion": tipoOperacion,
      "datos": comentario,
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios()
      }
    }

    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }
}
