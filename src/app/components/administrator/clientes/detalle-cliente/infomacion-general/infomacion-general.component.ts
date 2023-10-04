import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Servicios } from 'src/app/shared/model/catalogos';
import { Cliente, Sector, DetalleCliente, HistoricoPerformance, OrigenNombre, Paquete, TipoTickets, BandejaSD, Configuracion, Servicio, Usuario } from 'src/app/shared/model/cliente.model';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ExternosService } from 'src/app/shared/services/externos.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { NotificationDialogComponent } from 'src/app/shared/utils/notification-dialog';
import { NotificationDialogService } from 'src/app/shared/utils/notification-dialog/notification-dialog.service';

@Component({
  selector: 'app-infomacion-general',
  templateUrl: './infomacion-general.component.html',
  styleUrls: ['./infomacion-general.component.css']
})
export class InfomacionGeneralComponent implements OnInit {

  @ViewChild('notificacionModal') notificacionModal : any;
  public form: FormGroup;
  public detalle: DetalleCliente;
  public editar: boolean = false;
  public cliente: string;
  mensaje: String = "Este campo es requerido";
  servicios: Servicios[] = [];
  serviciosAux: Servicios[] = [];
  sectores: Sector[] = [];
  tickets: TipoTickets[] = [];
  historicos: HistoricoPerformance[] = [];
  bandejas: BandejaSD[] = [];
  origenNombre: OrigenNombre[] = [];
  paquetes: Paquete[] = [];

  user: any;
  _reintento: number = 1;
  dialogRef: any = null; 
  favoritoTemp: boolean;

  constructor(public spinner: NgxSpinnerService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private dialogService: NotificationDialogService,
    private dialogConfirm: ConfirmDialogService,
    private administratorService: AdministratorService,
    public router: Router,
    private externosService: ExternosService,
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService ) { }

  ngOnInit(): void {
    this.cliente = localStorage.getItem('cliente');
    this.catalogos();
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    this.form = this.formBuilder.group({
        nombreEmpresa: [null, [Validators.required]],
        nombreAdmin: [null, [Validators.required, Validators.minLength(10), Validators.pattern("^([ ]{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú])+[ ]{0,1}$")]],
        email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,4}$")]],
        telefono: [null, [Validators.minLength(10), Validators.maxLength(10)]],
        paquete: [null, [Validators.required]],
        contrato: [null, [Validators.required]],
        servicio: [null, [Validators.required]],
        enlace: [null, [Validators.required]],
        servicios: [null, [Validators.required]],
        totalPuntas: [null, [Validators.required]],
        sector: [null, [Validators.required]],
        historico: [null, [Validators.required]],
        ticket: [null, [Validators.required]],
        bandeja: [null, [Validators.required]],
        origen: [null, [Validators.required]],
        observaciones: [null],
    });
    this.form.controls['nombreEmpresa'].disable();
    this.consultaDetalle();
  }

  catalogos() {
    this.loadCatalogoPaquete();
    this.loadCatalogoBandeja();
    this.loadCatalogoHistoricoPerformance();
    this.loadCatalogoOrigenNombre();
    this.loadCatalogoSector();
    this.loadCatalogoServicio();
    this.loadCatalogoTipoTicket();
  }

  loadCatalogoPaquete() {
    this.administratorService.catalogoPaquetesActivos().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.paquetes = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoBandeja() {
    this.administratorService.catalogoBandeja().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.bandejas = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoHistoricoPerformance() {
    this.administratorService.catalogoHistoricoPerformance().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.historicos = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoOrigenNombre() {
    this.administratorService.catalogoOrigenesNombres().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.origenNombre = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoSector() {
    this.administratorService.catalogoSectores().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.sectores = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoServicio() {
    this.administratorService.catalogoServicios().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.servicios = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadCatalogoTipoTicket() {
    this.administratorService.catalogoTiposTickets().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.tickets = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  sendNotification(){
    const dialogRef = this.dialog.open(
      NotificationDialogComponent, 
      this.dialogService.sendNotification(this.detalle.cliente.razonSocial, 'icon', this.detalle.cliente.indicadorFavorito == 0 ? false : true , true)
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data == true){
          this.alertService.info('<b>¡Se ha enviado la notificación correctamente!</b>');
        }
      }
    );
  }

  serviceRemoved(servicio: string) {
    const toppings = this.form.value['servicio'] as string[];
    this.removeFirst(toppings, servicio);
    this.form.patchValue({servicio: toppings});
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  setFavorito(favorito: boolean){
    this.favoritoTemp = favorito;
    this.detalle.cliente.indicadorFavorito = favorito ? 1 : 0;
  }

  updateFavorito(favorito: boolean){
    this.spinner.show();
    this.administratorService.setfavorito(
      favorito,
      Number(this.cliente),
      this.administratorService.getIdUsuarios()).subscribe({
        next: ({data, httpStatus, message}) => {
          if (httpStatus === 200) {
            this.registrarBitacora(2)
            this.consultaDetalle()
            this.spinner.hide();
          } 
        }, 
        error: (_) => {
          this.mostrarError();
        }
      });
  }

  mostrarError() {
    this.alertService.error('<b>Error al obtener datos del cliente</b>');
    this.spinner.hide();
  }

  consultaDetalle(){
    this.spinner.show();
    this.administratorService.consultarDetalleCliente(
      this.administratorService.getIdUsuarios(), 
      Number(this.cliente)
      ).subscribe({
      next: ({data, httpStatus}) => {
        if (httpStatus === 200) {
          this.detalle = data as DetalleCliente;
          console.log("Clientes:",this.detalle);
          this.favoritoTemp = this.detalle.cliente.indicadorFavorito == 1 ? true : false;
          this.serviciosAux = [];
          this.detalle.servicios.forEach((element) => {
            this.servicios.forEach((servicio) => {
              if(element.idCatServicios == servicio.idCatServicios){
                this.serviciosAux.push(servicio);
              }
            });
          });

          this.consultaPuntas();
          this.spinner.hide();
        } else {
          this.mostrarError();
          this.spinner.hide();
        }
      }, 
      error: (_) => {
        this.mostrarError();
        this.spinner.hide();
      }
    });
  }

  delete(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
      this.alertService.info('<b>El usuario fue eliminado</b>');
    }, 300);
  }

  canEdit(editar: boolean){
    this.form.reset();
    if(editar){
      this.form.get('nombreEmpresa').setValue(this.detalle.cliente.razonSocial);
      this.form.get('nombreAdmin').setValue(this.detalle.cliente.representante);
      this.form.get('email').setValue(this.detalle.cliente.email);
      this.form.get('telefono').setValue(this.detalle.cliente.telefonoCelular);
      this.form.get('paquete').setValue(this.detalle.cliente.tbCatPaquete.idCatPaquete);
      this.form.get('contrato').setValue(this.detalle.cliente.contrato);
      this.form.get('observaciones').setValue(this.detalle.cliente.observaciones);
      this.form.get('totalPuntas').setValue(this.detalle.cliente.sitiosContratados);
      this.form.get('servicios').setValue(this.detalle.cliente.serviciosContratados);
      this.form.get('enlace').setValue(this.detalle.cliente.enlacesContratados);
      this.form.get('historico').setValue(this.detalle.configuracion?.tbCatHistoricoPerformance.idCatHistoricoPerformance);
      this.form.get('sector').setValue(this.detalle.configuracion?.tbCatSector.idCatSector);
      this.form.get('ticket').setValue(this.detalle.configuracion?.tbCatTipoTicket.idCatTipoTicket);
      this.form.get('origen').setValue(this.detalle.configuracion?.tbCatOrigenNombre.idCatOrigenNombre);
      this.form.get('bandeja').setValue(this.detalle.configuracion?.tbCatBandejaSD.idCatBandejaSD);
      this.form.get('servicio').setValue(this.serviciosAux);
    }
    this.editar = editar;
  }

  get formulario() {
    return this.form.controls;
  }

  guardarCambios(){
    if(!this.form.invalid){
      this.spinner.show();
      let _cliente = this.detalle.cliente;
      let _configuracion = new Configuracion();
      if (this.detalle.configuracion !== null) {
        _configuracion = this.detalle.configuracion;
      }
    
    _cliente.razonSocial = this.form.controls['nombreEmpresa'].value;
    _cliente.representante = this.form.controls['nombreAdmin'].value.trim();
    _cliente.email = this.form.controls['email'].value;
    _cliente.telefonoCelular = this.form.controls['telefono'].value;
    _cliente.serviciosContratados = this.form.controls['servicios'].value;
    _cliente.enlacesContratados = this.form.controls['enlace'].value;
    _cliente.favorito = this.favoritoTemp;

    let paquete = new Paquete();
    this.paquetes.forEach(e => {
      if (e.idCatPaquete === this.form.controls['paquete'].value) {
        paquete = e;
      }
    });
    _cliente.tbCatPaquete = paquete;

    _cliente.contrato = this.form.controls['contrato'].value;
    _cliente.sitiosContratados = this.form.controls['totalPuntas'].value;

    const _servicios = this.form.controls['servicio'].value;

    let sector = new Sector();
    this.sectores.forEach(e => {
      if (e.idCatSector === this.form.controls['sector'].value) {
        sector = e;
      }
    });
    _configuracion.tbCatSector = sector;

    let historicoPerformance = new HistoricoPerformance();
    this.historicos.forEach(e => {
      if (e.idCatHistoricoPerformance === this.form.controls['historico'].value) {
        historicoPerformance = e;
      }
    });
    _configuracion.tbCatHistoricoPerformance = historicoPerformance;

    let ticket = new TipoTickets();
    this.tickets.forEach(e => {
      if (e.idCatTipoTicket === this.form.controls['ticket'].value) {
        ticket = e;
      }
    });
    _configuracion.tbCatTipoTicket = ticket;
    _cliente.observaciones = this.form.controls['observaciones'].value;

    let bandeja = new BandejaSD();
    this.bandejas.forEach(e => {
      if (e.idCatBandejaSD === this.form.controls['bandeja'].value) {
        bandeja = e;
      }
    });
    _configuracion.tbCatBandejaSD = bandeja;

    let origen = new OrigenNombre();
    this.origenNombre.forEach(e => {
      if (e.idCatOrigenNombre === this.form.controls['origen'].value) {
        origen = e;
      }
    });
    _configuracion.tbCatOrigenNombre = origen;
    _configuracion.tbCliente = _cliente;

    
    console.log("Usuario object:"+this.detalle.usuario);
    this.administratorService.editarCliente(this.user.idUsuario, _cliente, _configuracion, _servicios, this.detalle.usuario).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.registrarBitacora(1);
          this.canEdit(false);
          this.updateFavorito(this.favoritoTemp);
          this.consultaDetalle();
          this.alertService.successBlue('<b>¡Cambios guardados correctamente!</b>');
        } else {
          this.spinner.hide();
          if(message === 'El contrato ya existe'){
            this.form.controls['contrato'].setErrors({'incorrect': true});
          } else if(message === 'El email ya existe'){
            this.form.controls['email'].setErrors({'incorrect': true});
          } else{
            this.alertService.error(`Error ${message}`);
          }
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
    }
  }

  eliminar() {
    this.spinner.show();
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogConfirm.eliminarCliente()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data == true){
          this.administratorService.eliminarCliente(this.user.idUsuario,Number(this.cliente)).subscribe({
            next: ({httpStatus, message}) => {
              
              if (httpStatus === 200) {
                this.registrarBitacora(4)
                this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
                this.spinner.hide();
                setTimeout(() => {
                  this.alertService.info('<b>Cliente eliminado correctamente</b>');
                }, 100);
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
      }
    );
    this.spinner.hide();

    

  }

  public onlyalpha(event) {
    let k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 241 || k == 209);
  }

  public onlyalphaEmail(event) {
    let k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (!(k > 31 && (k < 48 || k > 57))) || k == 8 || k == 46 || k == 64 || k == 241 || k == 209 || k == 45 || k == 95 );
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return (!(k > 31 && (k < 48 || k > 57)));
  }

  public keyShowAutocomplete(event: any) {
    if(event.target.value > 0 || event.target.value == ''){
    
    }else{
      if(Number(event.target.value) != 0){
        this.form.get('telefono')?.setErrors({ incorrectText: true });
      }
    }
  }

  openDialog(): void {
    if (this.dialogRef === null) {
      this.dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
        width: '449px',
        height: '360px ',
        data:{numero: this._reintento},
        disableClose: true
      });
  
      this.dialogRef.afterClosed().subscribe((_) => {
        this._reintento++;
        this.dialogRef = null;
      });
    }
  }

  reenviarInvitacion() {
    this.spinner.show()
      const body = {
        "cliente": {
          "idCliente": this.detalle.cliente.idCliente,
          "razonSocial": this.detalle.cliente.razonSocial,
          "representante": this.detalle.cliente.representante,
          "email":  this.detalle.cliente.email,
          "contrato": this.detalle.cliente.contrato,
          "pwd": this.detalle.cliente.pwd
        },
        "tipo": "INVITACION_CTE" 
      };
      const _idUsuario = this.administratorService.getIdUsuarios();
  
      this.administratorService.enviarEmailNuevoCliente(_idUsuario, body).subscribe({
        next: ({httpStatus, message}) => {
          this.spinner.hide();
          if(httpStatus == 200){
            this.registrarBitacora(3)
            this.alertService.info('<b>Invitación reenviada correctamente</b>');
          }else{
            this.alertService.error(message);
          }
        }, 
        error: (e) => {
          this.spinner.hide();
          this.alertService.error(e.message);
          console.error(e.message);
        }
      });
    
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }

  registrarBitacora(flujo?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " guardo la nueva información del cliente " + + ''
      funcionalidad = 'Guardar cambios del cliente'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " acaba de cambiar al cliente " + +" como favorito " 
      funcionalidad = 'Guardar cambios de estatus'
      tipoOperacion = 'Cambios'
    }else if(flujo == 3){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " reenvió el correo de onboarding al cliente" + + ''
      funcionalidad = 'Reenvió de correo onboarding'
      tipoOperacion = 'Envió'
    }else if(flujo == 4){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " elimino al cliente " + + ''
      funcionalidad = 'Eliminar cliente'
      tipoOperacion = 'Baja'
    }else if(flujo == 5){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " cancelo la edición de información del cliente " + + ''
      funcionalidad = 'Cancelar cambios información'
      tipoOperacion = 'Cancelar'
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

  consultaPuntas(){
    this.externosService.actualizarPuntas(this.detalle.cliente.idClienteTotalPlay, this.user.idUsuario).subscribe({
      next: () => {
        console.log('Se cargaron las puntas correctamente');
      },
      error: () => {
        console.error('Error al hacer petición de puntas');
      }
    });
  }

}
