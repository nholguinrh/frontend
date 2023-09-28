import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Servicios } from 'src/app/shared/model/catalogos';
import { Cliente, Configuracion, ConfiguracionSLA, DatosPunta, DetalleCliente, DetallePunta, Estatus, Punta } from 'src/app/shared/model/cliente.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ExternosService } from 'src/app/shared/services/externos.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { PuntasDialogComponent } from 'src/app/shared/utils/puntas-dialog';
import { PuntasDialogService } from 'src/app/shared/utils/puntas-dialog/puntas-dialog.service';
import { ConfiguracionMasivaComponent } from '../configuracion-masiva/configuracion-masiva.component';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { Constantes } from 'src/app/shared/const/date-graph';


@Component({
  selector: 'app-puntas',
  templateUrl: './puntas.component.html',
  styleUrls: ['./puntas.component.css']
})
export class PuntasComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('selectDispositivo') selectDispositivo;
  @ViewChild('selectDispositivo') matRef: MatSelect;

  @Input() accionGuardar: boolean;
  public dataSource = null;
  fetchRequest: PageRequest<Punta> = new PageRequest<Punta>();
  pageResponse: Page<Punta> = new Page<Punta>();
  public form: FormGroup;
  cliente: string;

  detalleCliente: DetalleCliente;
  catEstatus: Estatus[];
  datosPunta: DatosPunta;
  public filtro:number = 0;
  public tipo: string = '';
  estatusDispositivo: String[] = [];
  tdispositivo: String[] = [];
  dispositivo: any[] = [];
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
    nombre: 'Inactivo'
  },{
    estatus: false,
    tipo: 2,
    nombre: 'Activo'
  },{
    estatus: false,
    tipo: 2,
    nombre: 'Mantenimiento'
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
  selectable = true;
  removable = true;
  idClienteActivo: number;
  autoGuardado: boolean = false;
  actualPage: number;

  constructor(
    private alertService: AlertService,
    private dialogService: PuntasDialogService,
    private confirmService: ConfirmDialogService,
    private dialog: MatDialog,
    private workspaceService: WorkspaceService,
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService,
    public router: Router,
    private administratorService: AdministratorService,
    public notificationService : NotificationService
  ) { }

  ngOnInit(): void {
    this.cliente = localStorage.getItem('cliente');
    this.consultarDatosPunta();
    this.cargarCliente();
    /* this.catEstatus = JSON.parse(localStorage.getItem('catEstatus')!); */
    this.loadCatalogoEstatus();
    this.form = this.formBuilder.group({      
      busqueda: [''],
      servicio: [null, [Validators.required]],
      dispositivos: [],
    });
    this.onPaged(0);
  }

  loadCatalogoEstatus() {
    this.administratorService.catalogoEstatus().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.catEstatus = data;
          localStorage.setItem('catEstatus', JSON.stringify(this.catEstatus));
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  onPaged(page: number) {	
    console.log(this.filtro)
    this.actualPage = page;
    if(this.filtro == 0){
      this.listarPuntas(page);
      this.consultarDatosPunta();
    }
    if(this.filtro == 1){
      this.listarPuntasPorTipo(page);
      this.consultarDatosPunta();
    }
    if(this.filtro == 2){
      this.listarPuntasPorNombre(page);
      this.consultarDatosPunta();
    }
    if(this.filtro == 3){
      this.filtrarDispositivo(page);
      this.consultarDatosPunta(true);
    }
  }

  listarPuntas(page: number){
    this.spinner.show();
    this.workspaceService.consultarPuntas(6, page, Number(this.cliente)).subscribe({
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

  listarPuntasPorTipo(page: number){
    this.spinner.show();
    this.workspaceService.consultarPuntasPorTipo(6, page, Number(this.cliente), this.tipo).subscribe({
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

  listarPuntasPorNombre(page: number){
    const busqueda = this.form.controls['busqueda'].value;
    if (busqueda != null && busqueda != '') {
      this.spinner.show();
      this.workspaceService.consultarPuntasPorTexto(6, page, Number(this.cliente), busqueda).subscribe({
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
    }else{
      this.filtro = 0;
      this.listarPuntas(0);
    }
  }

  selectTipo(tipo: string){
    this.filtro = 1;
    this.tipo = tipo;
    this.onPaged(0);
    this.borrarFiltro(3);
  }

  filterString() {
    this.filtro = 2;
    this.onPaged(0);
  }

  getIcon(punta: Punta){
    if(punta.tbCatEstatus.idCatEstatus == 16){      
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
          return 'image-dispositivo-ont-inactive'
        case 'RADIO':
        case 'RADIO BASE':
          return 'image-puntas-radio-inactive'
        case 'SWITCH':
          return 'image-dispositivo-servicio-inactive'
        case 'CPE':
          return 'image-dispositivo-cpe-inactive'
        case 'FIREWALL':
          return 'image-dispositivo-estatus-inactive'
        case 'ROUTER':
          return 'image-dispositivo-sitio-inactive'
        case 'ENLACE':
          return 'image-dispositivo-enlace-inactive'
      }
    }
  }

  getDetalle(idClientePunta:number){
    this.spinner.show();
    this.workspaceService.consultarDetallePunta(idClientePunta,"dispositivos").subscribe({
      next: ({data, message, httpStatus}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          this.openPuntasDialog(data);
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

  openPuntasDialog(detallePunta:DetallePunta) {
    const dialogRef = this.dialog.open(
      PuntasDialogComponent,
      this.dialogService.detallePunta(detallePunta)
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data == true){
          this.registrarBitacora(4, detallePunta.punta.idClientePunta)
          this.alertService.info('<b>¡Cambios guardados correctamente!</b>');
          this.filtro = 3
          this.onPaged(this.actualPage);
        }else{
          this.registrarBitacora(5, detallePunta.punta.idClientePunta)
        }
      }
    );
  }

  activarPuntas(){
    const dialogRef = this.dialog.open(
      ConfiguracionMasivaComponent, 
      this.confirmService.activarPuntas(this.datosPunta)
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data[0] == true){
          this.autoGuardado = false;
          let puntasActivadas = data[1];
          const _idUsuario = this.administratorService.getIdUsuarios();
          this.spinner.show();
          this.workspaceService.activacionMasivaPuntas(_idUsuario, data[1], Number(this.cliente)).subscribe({
            next: ({data, httpStatus, message}) => {
              if (httpStatus === 200) {
                if(puntasActivadas == true){
                  this.registrarBitacora(2)
                  this.alertService.successBlue('<b>¡Se han activado todos los dispositivos correctamente!</b>');
                  this.autoGuardado = true
                }else{
                  this.registrarBitacora(3)
                  this.alertService.successBlue('<b>¡Se han desactivado todos los dispositivos correctamente!</b>');
                  this.autoGuardado = true
                }
                setTimeout(() => {
                  this.autoGuardado = false
                }, 2000);
                this.onPaged(0);
                this.consultarDatosPunta();
              } else {
                this.autoGuardado = false
                this.spinner.hide();
                this.alertService.error('<b>Error</b> al modificar el dispositivo');
              }
            },
            error: (e) => {
              this.spinner.hide();
              this.autoGuardado = false;
              this.alertService.error('<b>Error</b> al modificar el dispositivo');
            }
          });
        }
      }
    );
  }

  actualizarPunta(punta: any, estatus: boolean){
      this.spinner.show();
      this.autoGuardado = false;
      this.workspaceService.consultarDetallePunta(punta.idClientePunta,"dispositivos").subscribe({
        next: ({data, message, httpStatus}) => {
          if (httpStatus === 200) {
            let estatusObj = new Estatus();
            let slaConf: ConfiguracionSLA =  null;
            const _idUsuario = this.administratorService.getIdUsuarios();
            data.punta.activarPunta = estatus;
            estatusObj.idCatEstatus = 16;
            data.punta.tbCatEstatus = estatusObj;
            punta.tbCatEstatus = estatusObj;
            punta.activarPunta = estatus;
            data.interfaces.forEach(element => {
              if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
                element.tbConfiguracionSLA = slaConf;
              }
            });
            data.date = Constantes.FECHA_ACTUAL_SITIOS;
            data.activacion = true;
            this.workspaceService.updatePunta(_idUsuario, data).subscribe({
              next: ({data, httpStatus, message}) => {
                if (httpStatus === 200) {
                  this.registrarBitacora(1, punta.idClientePunta)
                  this.spinner.hide();
                  this.autoGuardado = true;
                  this.alertService.info('<b>¡Se ha modificado el dispositivo correctamente!</b>');
                  this.consultarDatosPunta();
                } else {
                  punta.activarPunta = !estatus;
                  this.spinner.hide();
                  this.autoGuardado = false;
                  this.alertService.error('<b>Error</b> al modificar el dispositivo');
                }
                setTimeout(() => {
                  this.autoGuardado = false
                }, 2000);
              },
              error: (e) => {
                punta.activarPunta = !estatus;
                this.spinner.hide();
                this.autoGuardado = false;
                this.alertService.error('<b>Error</b> al modificar el dispositivo');
              }
            });
          } else {
            punta.activarPunta = !estatus;
            this.spinner.hide();
            this.autoGuardado = false;
            this.alertService.error('<b>Error</b> al modificar el dispositivo');
          }
        },
        error: (_) => {
          punta.activarPunta = !estatus;
          this.spinner.hide();
          this.autoGuardado = false;
          this.alertService.error('<b>Error</b> al modificar el dispositivo');
        }
      });
  }

  altaPuntasCliente(){ 
    const _ruta = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteConfiguracion+")";
    if(this.datosPunta?.totalPuntasActivas < 1){
      this.alertService.info('<b>Es necesario activar por lo menos un dispositivo</b>');
      return;
    }
    this.registrarBitacora(6)
    this.actualizarEstatusCliente(_ruta);
  }

  continuarDespues(){ 
    const _ruta = NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")";
    this.enviarNotificacion(this.detalleCliente.cliente);
    this.router.navigateByUrl(_ruta);
  }

  actualizarEstatusCliente(ruta:string) {
    this.spinner.show();
    let _cliente = this.detalleCliente.cliente;
    _cliente.tbCatEstatus = this.obtenerEstatusActivacion();
    let _configuracion: Configuracion = this.detalleCliente.configuracion;
    let _servicios: Servicios[] = this.detalleCliente.servicios;
    const _idUsuario = this.administratorService.getIdUsuarios();
    console.log("Puntas:",this.detalleCliente);
    this.administratorService.editarCliente(_idUsuario, _cliente, _configuracion, _servicios,this.detalleCliente.usuario).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.router.navigateByUrl(ruta);
          this.spinner.hide();
        } else {
          console.error(message);
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
  }

  obtenerEstatusActivacion() {
    let _estatus: Estatus;
    this.catEstatus.forEach(estatus => {
      if (estatus.idCatEstatus === 22) {
        _estatus = estatus;
      }
    });
    return _estatus;
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

  cargarCliente() {
    const _idUsuario = this.administratorService.getIdUsuarios();
    this.administratorService.consultarDetalleCliente(_idUsuario, Number(this.cliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.detalleCliente = data as DetalleCliente;
          console.log("Detalle::",this.detalleCliente)
        }
      },
      error: (e) => {
        console.error(e.message);
      }
    });
  }

  consultarDatosPunta(typeDispositivo?: boolean) {
    this.workspaceService.consultarDatosPunta(Number(this.cliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.datosPunta = data;
          if(typeDispositivo){
            return
          }else{
            if(this.datosPunta.totalEnlaces == 0 || this.datosPunta.totalEnlaces == null){
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
                nombre: 'Inactivo'
              },{
                estatus: false,
                tipo: 2,
                nombre: 'Activo'
              },{
                estatus: false,
                tipo: 2,
                nombre: 'Mantenimiento'
              }];
            }
          }
        } else {
          console.error(message);
        }
      },
      error: (e) => {
        console.error(e.message);
      }
    });
  }

  desactivarDispositivo(punta: any){
      this.autoGuardado = false;
      this.spinner.show();
      this.workspaceService.consultarDetallePunta(punta.idClientePunta,"dispositivos").subscribe({
        next: ({data, message, httpStatus}) => {
          let estatus = new Estatus();
          let estatusIntyerfaz = new Estatus();
          let slaConf: ConfiguracionSLA =  null;
          if (httpStatus === 200) {
            const _idUsuario = this.administratorService.getIdUsuarios();
            estatus.idCatEstatus = 17;
            data.punta.activarPunta = false;
            punta.activarPunta = false;
            data.punta.tbCatEstatus = estatus;
            punta.tbCatEstatus = estatus;
            punta.interfacesActivas = 0;
            data.punta.tbConfiguracionSLA = slaConf;
            data.interfaces.forEach((element) =>{
              element.activarInterfaz = false;
              estatusIntyerfaz.idCatEstatus = 28;
              element.tbCatEstatus = estatusIntyerfaz;
              element.tbConfiguracionSLA = slaConf;
            });
            data.date = Constantes.FECHA_ACTUAL_SITIOS;
            data.activacion = true;
            this.workspaceService.updatePunta(_idUsuario, data).subscribe({
              next: ({data, httpStatus, message}) => {
                if (httpStatus === 200) {
                  this.registrarBitacora(1, punta.idClientePunta)
                  this.spinner.hide();
                  this.autoGuardado = true;
                  this.alertService.info('<b>¡Se ha modificado el dispositivo correctamente!</b>');
                  this.consultarDatosPunta();
                } else {
                  punta.activarPunta = true;
                  this.spinner.hide();
                  this.autoGuardado = false;
                  this.alertService.error('<b>Error</b> al modificar el dispositivo');
                }
                setTimeout(() => {
                  this.autoGuardado = false
                }, 2000);
              },
              error: (e) => {
                punta.activarPunta = true;
                this.spinner.hide();
                this.autoGuardado = false;
                this.alertService.error('<b>Error</b> al modificar el dispositivo');
              }
            });
          } else {
            punta.activarPunta = true;
            this.spinner.hide();
            this.autoGuardado = false;
            this.alertService.error('<b>Error</b> al modificar el dispositivo');
          }
        },
        error: (_) => {
          punta.activarPunta = true;
          this.spinner.hide();
          this.autoGuardado = false;
          this.alertService.error('<b>Error</b> al modificar el dispositivo');
        }
    });
  }

  enviarNotificacion(cliente){
    const body = {
      notificacion: {
        titulo: "Configuración pendiente",
        descripcion: "¡Hey! Dejaste pendiente la configuración de " ,
        tipoNotificacion: "A"
      },
      parametros: {
        descripcion: cliente.razonSocial,
        accion: "string",
        servidorIp: "string",
        path: "string",
        parametros: ""+cliente.idCliente+",2",
        tipoServicio: "string"
      }
    }
    this.notificationService.crearNotificacionAutomatica(this.administratorService.getIdUsuarios(),body).subscribe({
      next: (result) => {
        this.spinner.hide();
        if(result.httpStatus == 200){
            this.registrarBitacora(7)
            this.alertService.notify('¡Tienes un cliente pendiente de configurar!');
          }
        },
        error: () => {
          this.spinner.hide();
          console.log("No se pudo crear la notificacion");
        }
    });

  }


  removeService(index: number, item: any){
    
    this.matRef.options.forEach((data: MatOption) => {      
      if(item === data.value){
        data.deselect();
      }
    });
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

  filtrarDispositivo(page){
    this.tdispositivo = [];
    this.estatusDispositivo = [];
    this.spinner.show();
    this.dispositivosBusqueda.forEach(dispositivo => {
      if(dispositivo.tipo == 1 && dispositivo.estatus == true){
        this.tdispositivo.push((dispositivo.nombre).toLowerCase());
      }else if(dispositivo.tipo == 2 && dispositivo.estatus == true){
        this.estatusDispositivo.push((dispositivo.nombre).toLowerCase());
      }
    });
    let body = {
      idCliente:  Number(this.cliente),
      dispositivos: this.tdispositivo,
      estatus: this.estatusDispositivo,
      tipos: this.form.controls['dispositivos'].value ?  this.form.controls['dispositivos'].value : []
    }
    this.workspaceService.filtrarPuntas(body,6,page).subscribe({
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

  closeAutocomplete() {
    this.autocomplete.closePanel();
  }

  searchEnter(event: any){
    event.stopPropagation();
    this.trigger.closeMenu();
    this.filterString();
  }

  keyShowAutocomplete(event: any) {
    if(event.target.value.length > 0) {
      this.showAutocomplete = false;
    }else{
      this.showAutocomplete = true;
    }
  }

  filtradoBusqueda(){
    this.filtro = 3;
    this.tdispositivo = [];
    this.estatusDispositivo = [];
    this.form.controls['busqueda'].reset();
    this.filtrarDispositivo(0);
  }

  returnPage(){
    this.filtro = 0
    this.onPaged(0);
    this.form.reset();
  }

  registrarBitacora(flujo?: number, idPunta?: number){
    let cliente: string
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    this.accionGuardar ? cliente = ', del nuevo cliente: ' + Number(this.cliente) : cliente = ', del cliente: '+ Number(this.cliente)

    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", actualizo el estatus del dispositivo: " + idPunta + cliente
      funcionalidad = 'Modificar dispositivo'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", activo todos los dispositivos de forma masiva " + cliente 
      funcionalidad = 'Activar dispositivos'
      tipoOperacion = 'Cambios'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", desactivo todos los dispositivos de forma masiva " + cliente
      funcionalidad = 'Desactivar dispositivos'
      tipoOperacion = 'Cambios'
    }else if(flujo == 4){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo nuevo cambios al dispositivo: " + idPunta + cliente
      funcionalidad = 'Guarda cambios del dispositivo'
      tipoOperacion = 'Baja'
    }else if(flujo == 5){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", cancelo los cambios del dispositivo: " + idPunta + cliente
      funcionalidad = 'Cancelar cambios del dispositivo'
      tipoOperacion = 'Cancelar'
    }else if(flujo == 6){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", acaba de guardar los cambios de los dispositivos del nuevo cliente: " + Number(this.cliente)
      funcionalidad = 'Activación de puntas'
      tipoOperacion = 'Cancelar'
    }else if(flujo == 7){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", eligió continuar mas tarde con la configuración del nuevo cliente: " + Number(this.cliente)
      funcionalidad = 'Continuar mas tarde'
      tipoOperacion = 'Envió'
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