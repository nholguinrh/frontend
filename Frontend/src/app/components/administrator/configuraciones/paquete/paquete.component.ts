import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { PermisosPaquete, Servicios } from 'src/app/shared/model/catalogos';
import { Metrica } from 'src/app/shared/model/cliente.model';
import { Dashboard } from 'src/app/shared/model/onboarding.model';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.component.html',
  styleUrls: ['./paquete.component.css']
})
export class PaqueteComponent implements OnInit {
  tituloPaquete: string = 'NUEVO PAQUETE';
  subtituloPaquete: string = 'DETALLES DEL PAQUETE';
  form: FormGroup;
  dataPaquete: any;
  mensajeAlerta: string;
  idPaquete: number;
  listadoDashboards: Dashboard[] = [];
  metricasEstatus: boolean = false;
  serviciosEstatus: boolean = false;
  dispositivosEstatus:  boolean = false;
  listadoMetricas: Metrica[] = [];
  listadoServicios: Servicios[] = [];
  listaDispositivos: PermisosPaquete[] = [
    {id: 1, descripcion: "Enlaces", estatus: false},
    {id: 2, descripcion: "Sitios", estatus: false},
    {id: 3, descripcion: "Servicios", estatus: false},
  ];
  tipoPerfil: any ;
  
  isBackOffice:  boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService, 
    private router: Router,
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private workspaceService: WorkspaceService,
    private administratorService: AdministratorService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    localStorage.setItem('navigation', NAV.configuracionPaquete);
    this.createForm();
    this.catalogoDashboard();
    this.catalogoMetricas();
    this.catalogoServicios();
    let paqueteSeleccionado = localStorage.getItem('paquete');
    if(paqueteSeleccionado != null){
      this.tituloPaquete = 'DETALLE DE PAQUETE';
      this.detallePaquete(Number(paqueteSeleccionado));
    }
    this.tipoPerfil = this.administratorService.getPerfi();
    if(this.tipoPerfil?.descripcion == 'Back Office'){
      this.isBackOffice = true;

      this.form.controls['tituloPaquete'].disable();
      this.form.controls['numeroUsuarios'].disable();
      this.form.controls['descripcion'].disable();


    }
  }

  goBack(){

    if(localStorage.getItem('paquete') != null){
        if(!this.isBackOffice){
          this.registrarBitacora(4, this.idPaquete)
        }
      }
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        tituloPaquete : [null, [Validators.required]],
        numeroUsuarios: [null, [Validators.required]],
        descripcion: [null, [Validators.required]],
        listaDashboard: [[], [Validators.required]],
        listaMetrica: [[], [Validators.required]],
        listaServicio: [[], [Validators.required]],
      }
    );
    
  }

  catalogoDashboard(){
    this.administratorService.catalogoDashboard().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.listadoDashboards = data;
        }
      },
      error: (e) => {
        console.log(e)
        this.alertService.error('Error al obtener la información del catalogo dashboards');
      }
    });
  }
  
  catalogoMetricas(){
    this.administratorService.catalogoMetricas().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.listadoMetricas = data;
        }
      },
      error: (e) => {
        console.log(e)
        this.alertService.error('Error al obtener la información del catalogo metricas');
      }
    });
  }

  catalogoServicios(){
    this.administratorService.catalogoServicios().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.listadoServicios = data;
        }
      },
      error: (e) => {
        console.log(e)
        this.alertService.error('Error al obtener la información del catalogo servicios');
      }
    });
  }

  validarPaquete(operacion: string){
    let body = {
      descripcion: this.form.controls['tituloPaquete'].value
    }
    this.administratorService.validarPaquetePost(body).subscribe({
      next: ({data, httpStatus, message}) => {
        if(data === "Descripción Valida"){
          this.agregarCheckbox();
          this.validarFormulario(operacion);
        }
        if(data === "Descripción ya registrada"){
          if(this.form.controls['tituloPaquete'].value == this.dataPaquete?.descripcion){
            this.agregarCheckbox();
            this.validarFormulario(operacion)
          }else{
            this.form.get('tituloPaquete')?.setErrors({ incorrect: true });
            this.validarFormulario()
            this.getError();
            this.spinner.hide();
          }
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('Error al validar plantilla');
      }
    });
  }
  agregarCheckbox(){
    let idLista = [];
    this.listadoDashboards.forEach(item => {
      if(item.selected){
        idLista.push({id: item.idDashboard})
      }
    });
    this.form.get('listaDashboard').setValue(idLista);
    idLista = [];
    this.listadoServicios.forEach(item => {
      if(item.selected){
        idLista.push({id: item.idCatServicios})
      }
    });
    this.form.get('listaServicio').setValue(idLista);
    idLista = [];
    this.listadoMetricas.forEach(item => {
      if(item.selected){
        idLista.push({id: item.idMetrica})
      }
    });
    this.form.get('listaMetrica').setValue(idLista);
  }

  validarFormulario(operacion?: string){
    let validacionCorrecta: Boolean = true;
    this.spinner.hide();
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control.valid == false) {
          control.markAsTouched({ onlySelf: true });
          validacionCorrecta = false
      }
    });
    if(validacionCorrecta){
      switch(operacion){
        case 'crear':
          this.altaPaquete()
          break;
        case 'editar':
          this.editarPaquete()
          break;
      }
    }
    return;
  }

  detallePaquete(id: number){
    this.metricasEstatus = true
    this.serviciosEstatus = true
    this.administratorService.consultaPaquete(id).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.dataPaquete = data;
          this.idPaquete = data.idCatPaquetes;
          this.subtituloPaquete = data.descripcion;
          this.form.get('tituloPaquete').setValue(data.descripcion);
          this.form.get('numeroUsuarios').setValue(data.cantidadUsuarios);
          this.form.get('descripcion').setValue(data.informacion);
          this.dataPaquete.dashboards?.forEach(resp => {
            this.listadoDashboards?.forEach(item => {
              if(item.idDashboard == resp.id){
                item.selected = true
              }
            })
          });
          this.dataPaquete.metricas?.forEach(resp => {
            this.listadoMetricas?.forEach(item => {
              if(item.idMetrica == resp.id){
                item.selected = true
              } 
            })
          });
          this.dataPaquete.servicios?.forEach(resp => {
            this.listadoServicios?.forEach(item => {
              if(item.idCatServicios == resp.id){
                item.selected = true
              }
            })
          });
          this.listadoMetricas?.forEach(item => {
            if(!item.selected){
              this.metricasEstatus = false
            }
          })
          this.listadoServicios?.forEach(item => {
            if(!item.selected){
              this.serviciosEstatus = false
            } 
          })
        }
      },
      error: (e) => {
        console.log(e)
        this.alertService.error('Error al obtener la información del paquete');
      }
    });
  }

  altaPaquete(){
    this.spinner.show();
    let contenido = this.cargaDato();
    const idUsuario = this.administratorService.getIdUsuarios();
    this.administratorService.crearPaquetes(contenido, idUsuario).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 201 || message === 'Recurso creado con exito') {
          this.registrarBitacora(1, data.idCatPaquetes)
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogService.altaPaquete()
          );
          dialogRef.afterClosed().subscribe(
            _data => {
              if(_data == true){
                this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
              }
            }
          );
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e)
        this.alertService.error('Error al crear un nuevo paquete');
      }
    });
  }

  editarPaquete(){
    this.spinner.show();
    let contenido = this.cargaDato();
    const idUsuario = this.administratorService.getIdUsuarios();
    this.administratorService.editarPaquete(contenido, this.idPaquete, idUsuario).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 201 || message === 'Recurso creado con exito') {
          this.alertService.info('El paquete fue editado correctamente');
          this.registrarBitacora(2, this.idPaquete)
          localStorage.removeItem('paquete');
          this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e)
        this.alertService.error('Error al actualizar el paquete');
      }
    });
  }


  setAllMetricas(estatus: boolean) {
    this.metricasEstatus = estatus;
    this.listadoMetricas.forEach(t => (t.selected = estatus));
  }
  setAllServicios(estatus: boolean) {
    this.serviciosEstatus = estatus;
    this.listadoServicios.forEach(t => (t.selected = estatus));
  }
  setAllDispositivos(estatus: boolean) {
    this.dispositivosEstatus = estatus;
    this.listaDispositivos.forEach(t => (t.estatus = estatus));
  }
  updateAllCompleteDispositivos() {
    this.dispositivosEstatus = this.listaDispositivos != null && this.listaDispositivos.every(t => t.estatus);
  }
  updateAllCompleteMetricas() {
    this.metricasEstatus = this.listadoMetricas != null && this.listadoMetricas.every(t => t.selected);
  }
  updateAllCompleteServicios() {
    this.serviciosEstatus = this.listadoServicios != null && this.listadoServicios.every(t => t.selected);
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return (!(k > 31 && (k < 48 || k > 57)));
  }

  public keyShowAutocomplete(event: any) {
    if(event.target.value > 0 || event.target.value == ''){
    }else{
      if(Number(event.target.value) == 0){
        this.form.get('numeroUsuarios')?.setErrors({ incorrect: true });
      }else{
        this.form.get('numeroUsuarios')?.setErrors({ incorrectText: true });
      }
    }
  }

  getError(){
    return this.form.get('tituloPaquete').errors?.required
      ? 'Este campo es requerido'
      : this.form.get('tituloPaquete').hasError('incorrect')
      ? 'El titulo del paquete ya existe'
      : ''
  }



  cargaDato(){
    let body = {
      informacion: this.form.controls['descripcion'].value,
      descripcion: this.form.controls['tituloPaquete'].value,
      cantidadUsuarios: Number(this.form.controls['numeroUsuarios'].value),
      servicios: this.form.controls['listaServicio'].value,
      metricas: this.form.controls['listaMetrica'].value,
      dashboards: this.form.controls['listaDashboard'].value
    }
    

    return body;
  }

  validarCheckbox(lista, estatus?){
    if(estatus){
      switch (lista) {
        case 1:
          this.form.get('listaDashboard')?.setErrors(null);
          break;
        case 2:
          this.form.get('listaMetrica')?.setErrors(null);
          break;
        case 3:
          this.form.get('listaServicio')?.setErrors(null);
          break;
      }
    }
  }

  eliminarPaquete(){
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.eliminarPaquete()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data == true){
          this.spinner.show();
          const idUsuario = this.administratorService.getIdUsuarios();
          this.administratorService.eliminarPaquete(this.idPaquete,idUsuario).subscribe({
            next: (response) => {
              this.spinner.hide();
              this.alertService.info('El paquete fue eliminado correctamente');
              setTimeout(() => {
                this.registrarBitacora(3, this.idPaquete)
                localStorage.removeItem('paquete');
                this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
              }, 2000)
            },
            error: (e) => {
              this.spinner.hide();
              console.log(e)
              this.alertService.error('Error al eliminar el paquete');
            }
          });
        }
      })

  }

  registrarBitacora(flujo?: number, idPaquete?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", agrego el nuevo paquete: "+idPaquete
      funcionalidad = 'Agregar un nuevo paquete'
      tipoOperacion = 'Alta'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo nuevos cambios para el paquete " + idPaquete
      funcionalidad = 'Guardar cambios del paquete'
      tipoOperacion = 'Cambios'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", elimino el paquete: " + idPaquete
      funcionalidad = 'Eliminar paquete'
      tipoOperacion = 'Baja'
    }else if(flujo == 4){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", cancelo los cambios del paquete: " + idPaquete
      funcionalidad = 'Cancelar cambios del paquete'
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

  paste(event){
    console.log(event);
    return false;
  }
}
