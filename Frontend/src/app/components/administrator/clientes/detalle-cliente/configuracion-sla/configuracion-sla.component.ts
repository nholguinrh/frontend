import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { Cliente, DatosPunta, DetalleCliente, Estatus } from 'src/app/shared/model/cliente.model';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-configuracion-sla',
  templateUrl: './configuracion-sla.component.html',
  styleUrls: ['./configuracion-sla.component.css']
})
export class ConfiguracionSlaComponent implements OnInit {

  form: FormGroup;
  formPlantilla: FormGroup;
  color: string = '#1A7F1C';
  mode: ProgressBarMode = 'determinate';
  value:number = 50 ;
  bufferValue:number = 150 ;

  @Input() accionGuardar: boolean;
  _reintento: number = 1;
  dialogRef: any = null; 
  public plantillas: any[] = [];

  detalleCliente: DetalleCliente;
  catEstatus: Estatus[];
  idCliente: string;
  datosPunta: DatosPunta;
  configuracionesSLA: any[] = [];
  navegacion:string;
  plantilla: boolean = false;
  configuradosSLA:any;
  plantillaDisabled: boolean = true;
  cambiarPlantilla: boolean = false;

  constructor(public spinner: NgxSpinnerService,
    private administratorService: AdministratorService,
    private confirmService: ConfirmDialogService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public router: Router,
    private formBuilder: FormBuilder,
    private workspaceService: WorkspaceService,
    public notificationService : NotificationService) { }

  ngOnInit(): void {
    this.idCliente = localStorage.getItem('cliente');
    this.navegacion = localStorage.getItem('navigation');
    localStorage.removeItem('configuracionSLA');
    this.cargarCliente();
    this.consultarDatosPunta();
    this.createFormArray();
    this.consultarConfiguracionesSLA();
    this.consultarConfigurados();
    /* this.catEstatus = JSON.parse(localStorage.getItem('catEstatus')!); */
    this.loadCatalogoEstatus();
    this.spinner.hide();
    this.formPlantilla = this.formBuilder.group({
      plantilla: [null],
    });
    this.administratorService.catalogoPlantillasSLA().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.plantillas = data;
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });

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

  createForm() {
    this.form = this.formBuilder.group({
      metricasBasicas: this.formBuilder.group({
        nombreBasica: [null, Validators.required],
        alcanzabilidadBasica: [null],
        disponibilidadBasica: [null],
        latenciaBasica: [null],
        anchoBasica: [null],
        perdidaBasica: [null],
      })
    });
  }

  createFormArray() {
    this.form = this.formBuilder.group({
      metricasBasicas: this.formBuilder.array([]),
      metricasVoz: this.formBuilder.array([])
    });
  }

  get metricasBasicas(){
    return this.form.get('metricasBasicas') as FormArray;
  }

  get metricasVoz(){
    return this.form.get('metricasVoz') as FormArray;
  }

  addMetricaBasica(event?: any){
    if(event){
      event.stopPropagation();
    }

    if(this.metricasBasicas.controls.length > 0 && (this.configuracionesSLA.length < this.metricasBasicas.controls.length)){
      this.alertService.notify('Es necesario asignar la configuración antes de crear una nueva');
      return;
    }

    if( this.metricasBasicas.controls.length > 0 && this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].invalid){
      Object.keys(this.form.controls).forEach((field) => {
        if(field == 'registro'){
          this.metricasBasicas.markAllAsTouched();
        }else{
          const control = this.form.get(field);
          if (!control.valid) {
              control.markAsTouched({ onlySelf: true });
          }
        }
      });
    }else{
      this.metricasBasicas.push(this.formBuilder.group({
        nombreBasica: [null, [Validators.required, Validators.pattern("^([0-9a-zA-Z]+[ '\.]{0,1}[0-9a-zA-Z])+$")]],
        alcanzabilidadBasica: [null, [Validators.min(1),Validators.max(100)]],
        disponibilidadBasica: [null, [Validators.min(1),Validators.max(100)]],
        latenciaBasica: [null , [Validators.min(1)]],
        anchoBasica: [null, [Validators.min(1)]],
        perdidaBasica: [null, [Validators.min(1),Validators.max(100)]],
      }));
      //prueba
      this.plantilla = false
      this.plantillaDisabled = false;
    }
  }

  removeMetricaBasica(i: number, event?: any){
    if(event){
      event.stopPropagation();
    }
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.confirmService.eliminarConfiguracionSLA()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data){
          this.metricasBasicas.removeAt(i);
        }
      }
    );
  }

  inputClick(event?: any){
    if(event){
      event.stopPropagation();
    }
  }

  keyMetric(event?: any){
    event.stopPropagation();
    event.preventDefault();
  }

  addMetricaVoz(){
    const add = this.form.get('metricasBasicas') as FormArray;
    add.push(this.formBuilder.group({
      nombreVoz: [null, [Validators.required]],
      alcanzabilidadVoz: [null, [Validators.required]],
      disponibilidadVoz: [null, [Validators.required]],
      latenciaVoz: [null, [Validators.required]],
    }))
  }

  deleteMetricaBasica(index: number) {
    const add = this.form.get('address') as FormArray;
    add.removeAt(index)
  }
  deleteMetricaVoz(index: number) {
    const add = this.form.get('metricasVoz') as FormArray;
    add.removeAt(index)
  }

  configurarSLA(control: AbstractControl, index: number){
    localStorage.setItem('configuracionSLA', control.get('nombreBasica').value);
    localStorage.setItem('idConfiguracionSLA', this.configuracionesSLA[index].configuracionSLA.idConfiguracionSLA.toString());
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.sla+")");
  }

  goToWorkspace(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":" + NAV.administratorWorspace + ")");
  }

  finalizar() {
    if(this.configuradosSLA?.totalSitiosConfigurados < 1){
      this.alertService.successBlue('<b>Es necesario configurar por lo menos un dispositivo</b>');
      return;
    }
    this.registrarBitacora(5)
    this.actualizarEstatusCliente(21);
  }

  guardar() {
    this.actualizarEstatusCliente(23);
  }

  actualizarEstatusCliente(idCatEstatus:number) {
    this.spinner.show();
    let _cliente = this.detalleCliente.cliente;
    _cliente.tbCatEstatus = this.obtenerEstatusConfiguracion(idCatEstatus);
    const _configuracion = this.detalleCliente.configuracion;
    const _servicios = this.detalleCliente.servicios;
    const _idUsuario = this.administratorService.getIdUsuarios();

    this.administratorService.editarCliente(_idUsuario, _cliente, _configuracion, _servicios,this.detalleCliente.usuario).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.enviarEmailNuevoCliente(_cliente, idCatEstatus);
        } else {
          console.error(message);
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
      }
    });
  }



  enviarEmailNuevoCliente(nuevoCliente:Cliente, idCatEstatus:number) {
    if (idCatEstatus === 21) {

      const body = {
        "cliente": {
          "idCliente": nuevoCliente.idCliente,
          "razonSocial": nuevoCliente.razonSocial,
          "representante": nuevoCliente.representante,
          "email":  nuevoCliente.email,
          "contrato": nuevoCliente.contrato,
          "pwd": nuevoCliente.pwd
        },
        "tipo": "INVITACION_CTE" 
      };
      
      const _idUsuario = this.administratorService.getIdUsuarios();
  
      this.administratorService.enviarEmailNuevoCliente(_idUsuario, body).subscribe({
        next: ({httpStatus, message}) => {
          this.spinner.hide();
          if(httpStatus == 200){
            this.confirmar();
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
  }

  llenaCampos(){
    let id = this.formPlantilla.get('plantilla').value;
    console.log(id)
    this.administratorService.detalleSLA(id).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          let validarPlantilla = false;
          console.log(this.metricasBasicas.controls.length > 0) 
          console.log(!this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].disabled)
          this.metricasBasicas.controls.forEach( metrica => {
            if(metrica.get('nombreBasica').value == data.configuracionSLA.tituloSLA){
              validarPlantilla = true;
            }
          });
          if(this.metricasBasicas.controls.length > 0 && !this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].disabled || this.metricasBasicas.controls.length > 0 && this.cambiarPlantilla){
            if(!validarPlantilla){
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('nombreBasica').setValue(data.configuracionSLA.tituloSLA);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('alcanzabilidadBasica').setValue(data.metricasSLA[0].valor);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('disponibilidadBasica').setValue(data.metricasSLA[1].valor);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('latenciaBasica').setValue(data.metricasSLA[2].valor);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('anchoBasica').setValue(data.metricasSLA[3].valor);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].get('perdidaBasica').setValue(data.metricasSLA[4].valor);
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].disable();
              this.plantilla = true;
              this.cambiarPlantilla = true;
            }else{
              this.alertService.error('¡La plantilla ya fue asignada a una configuración!');
            }
          }
        }
      },
      error: (_) => {
        this.alertService.error('Error al obtener la información de la plantilla');
      }
    });
  }

  guardarConfiguracion(control: AbstractControl, event?: any){

    if(event){
      event.stopPropagation();
    }

    if (control.invalid) {
      Object.keys(this.form.controls).forEach((field) => {
        if(field == 'registro'){
          this.metricasBasicas.markAllAsTouched();
        }else{
          const control = this.form.get(field);
          if (control.valid == false) {
              control.markAsTouched({ onlySelf: true });
          }
        }
    });
    }else{
      this.spinner.show();
      let request = {
        configuracionSLA: {
          tituloSLA: control.get('nombreBasica').value,
          descripcion: '',
          slaUtilizado: 0,
          totalPuntasConfiguradas: 0,
          totalInterfacesConfiguradas: 0,
        },
        metricasSLA:[
        {
          tbMetrica: {
            idMetrica: 1
          },
          valor: control.get('alcanzabilidadBasica').value
        },
        {
          tbMetrica: {
            idMetrica: 2
          },
          valor: control.get('disponibilidadBasica').value
        },
        {
          tbMetrica: {
            idMetrica: 3
          },
          valor: control.get('latenciaBasica').value
        },
        {
          tbMetrica: {
            idMetrica: 4
          },
          valor: control.get('anchoBasica').value
        },
        {
          tbMetrica: {
            idMetrica: 5
          },
          valor: control.get('perdidaBasica').value
        }
        
        ]
      }
      let metricasValidadas = false;
      request.metricasSLA.forEach(ele => {
        if(ele.valor != null && ele.valor != ''){
          metricasValidadas = true;
          return metricasValidadas;
        }
      });
      let plantillaValida = true;
      this.plantillas.forEach(element => {
        if(element.configuracionSLA.tituloSLA == control.get('nombreBasica').value){
          if(!this.plantilla){
            plantillaValida = false;
            return plantillaValida;
          }
        }
      });

      if(metricasValidadas){
        if(plantillaValida){
          const _idUsuario = this.administratorService.getIdUsuarios();
          this.administratorService.configureSLACliente(_idUsuario, request, Number(this.idCliente)).subscribe({
            next: ({data, httpStatus, message}) => {
              if (httpStatus === 200) {
                if(this.plantilla){
                  this.registrarBitacora(2, data.idConfiguracionSLA)
                }else{
                  this.registrarBitacora(1, data.idConfiguracionSLA)
                }
                this.cambiarPlantilla = false
                this.spinner.hide();
                localStorage.setItem('configuracionSLA', data.tituloSLA);
                localStorage.setItem('idConfiguracionSLA', data.idConfiguracionSLA.toString());
                this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.sla+")");
              } else {
                console.error(message);
                this.spinner.hide();
              }
            },
            error: (_) => {
              this.spinner.hide();
            }
          });
        }else{
          this.spinner.hide();
          this.alertService.error("¡El nombre ingresado para la configuración ya esta ligado a una plantilla!");
        }
      }else{
        this.spinner.hide();
          this.alertService.error("¡Debes agregar por lo menos una metrica a la configuración!");
      }
    }
  }

  confirmar(){
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.confirmService.finalizarCliente()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        this.updateNotify();
        this.goToWorkspace();
      }
    );
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    console.log(event.target.value);
    return (!(k > 31 && (k < 48 || k > 57)));
  }

  obtenerEstatusConfiguracion(_idCatEstatus:number) {
    let _estatus: Estatus;
    this.catEstatus.forEach(estatus => {
      if (estatus.idCatEstatus === _idCatEstatus) {
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
    const _idCliente = localStorage.getItem('cliente');
    const _idUsuario = this.administratorService.getIdUsuarios();
    this.administratorService.consultarDetalleCliente(_idUsuario, Number(_idCliente)).subscribe({
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

  consultarDatosPunta() {

    this.workspaceService.consultarContadorPuntaSLA(Number(this.idCliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.datosPunta = data;
        } else {
          this.alertService.error('Error al obtener información de las puntas');
        }
      },
      error: (e) => {
        this.alertService.error('Error al obtener información de las puntas');
      }
    });
  }


  consultarConfiguracionesSLA() {
    this.spinner.show();
    this.workspaceService.consultarConfiguracionesSLA(Number(this.idCliente)).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          if(data.length > 0){
            const result = data.filter(conf => conf.configuracionSLA.tbCatEstatus.idCatEstatus == 16);
            this.configuracionesSLA = result;
            this.configuracionesSLA.forEach(element => {
              this.metricasBasicas.push(this.formBuilder.group({
                nombreBasica: [element.configuracionSLA.tituloSLA , [Validators.required]],
                alcanzabilidadBasica: [element.metricasSLA[0].valor, [Validators.required]],
                disponibilidadBasica: [element.metricasSLA[1].valor, [Validators.required]],
                latenciaBasica: [element.metricasSLA[2].valor, [Validators.required]],
                anchoBasica: [element.metricasSLA[3].valor, [Validators.required]],
                perdidaBasica: [element.metricasSLA[4].valor, [Validators.required]],
              }));
              this.metricasBasicas.controls[this.metricasBasicas.controls.length - 1].disable();
            });
            this.spinner.hide();
          }else{
            this.addMetricaBasica();
            this.spinner.hide();
          }
        } else {
          console.error(message);
          this.spinner.hide();
        }
      },
      error: (e) => {
        console.error(e.message);
        this.spinner.hide();
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
        parametros: ""+cliente.idCliente+",3",
        tipoServicio: "string"
      }
    }
    this.notificationService.crearNotificacionAutomatica(this.administratorService.getIdUsuarios(),body).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.registrarBitacora(4)
        if(result.httpStatus == 200){
          this.alertService.notify('¡Tienes un cliente pendiente de configurar!');
        }
      },
      error: () => {
        this.spinner.hide();
        console.log("No se pudo crear la notificacion");
      }
    });

  }

  cancelar(){ 
    const _ruta = NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")";
    this.enviarNotificacion(this.detalleCliente.cliente);
    this.router.navigateByUrl(_ruta);
  }

  eliminarPlantilla(index,control){
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.confirmService.eliminarConfiguracionSLA()
    );
    
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data){
        
          let idConfiguracion = this.configuracionesSLA[index]?.configuracionSLA?.idConfiguracionSLA;
          if(idConfiguracion){
            this.workspaceService.eliminarConfiguracion(idConfiguracion).subscribe({
              next: ({data, httpStatus, message}) => {
                if (httpStatus === 200) {
                  this.registrarBitacora(3, idConfiguracion)
                  this.metricasBasicas.clear();
                  this.consultarConfigurados();
                  this.consultarConfiguracionesSLA();
                  this.consultarDatosPunta();
                  this.spinner.hide();
                  this.alertService.notify('<b>Configuración de SLA´s eliminada correctamente</b>');
                } else {
                  this.spinner.hide();
                  this.alertService.error('Error al eliminar plantilla');
                }
              },
              error: (_) => {
                this.spinner.hide();
                this.alertService.error('Error al eliminar plantilla');
              }
            });
          }else{
            this.metricasBasicas.removeAt(index);
            this.alertService.info('<b>Configuración de SLA´s eliminada correctamente</b>');
          }
          this.formPlantilla.reset();


          this.plantillaDisabled = true;
        }
      }
    );
    this.spinner.hide();
  }

  asignarSLA(index){
    localStorage.setItem('configuracionSLA', this.configuracionesSLA[index].configuracionSLA.tituloSLA);
    localStorage.setItem('idConfiguracionSLA', this.configuracionesSLA[index].configuracionSLA.idConfiguracionSLA.toString());
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.sla+")");
  }


  consultarConfigurados() {
    this.configuradosSLA = [];
    this.workspaceService.consultarAsignadosSLA(Number(this.idCliente)).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.configuradosSLA = data;
        }
      },
      error: (_) => {
        this.alertService.error('Error al obtener datos de la configuración');
      }
    });
  }

  updateNotify(){
    this.notificationService.actualizarNotificacionesAccion(Number(this.idCliente)).subscribe({
      next: () => { 
        console.log('Notificacion enviada con exito');
      },
      error: (_) => {
        this.alertService.error('Error al obtener datos de la configuración');
      }
    });
  }


  registrarBitacora(flujo?: number, idSLA?: number){
    let cliente: string
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(!this.accionGuardar){
      cliente = (', al nuevo cliente: '+ Number(this.idCliente))
    }else{
      cliente = (', al cliente: '+ Number(this.idCliente))
    }
    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", agrego una nueva configuración de SLA " + idSLA + cliente
      funcionalidad = 'Nueva configuración SLA'
      tipoOperacion = 'Alta'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", agrego una nueva configuración con una plantilla de SLA "+ idSLA + cliente 
      funcionalidad = 'Nueva configuración SLA con plantilla'
      tipoOperacion = 'Alta'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", elimino la configuración SLA "+ idSLA + cliente
      funcionalidad = 'Eliminar configuración SLA'
      tipoOperacion = 'Baja'
    }else if(flujo == 4){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", eligió continuar mas tarde con la configuración del nuevo cliente: " + Number(this.idCliente)
      funcionalidad = 'Continuar mas tarde'
      tipoOperacion = 'Envió'
    }else if(flujo == 5){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", finalizo el regitro del nuevo cliente" + Number(this.idCliente)
      funcionalidad = 'Regitro de cliente exitoso'
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

  paste(event){
    console.log(event);
    return false;
  }

}
