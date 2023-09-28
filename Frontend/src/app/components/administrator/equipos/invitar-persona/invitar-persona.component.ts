import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { AlertService } from 'src/app/shared/utils/alertas';

import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { Usuario } from 'src/app/shared/model/cliente.model';
import { Perfil } from 'src/app/shared/model/onboarding.model';


@Component({
  selector: 'app-invitar-persona',
  templateUrl: './invitar-persona.component.html',
  styleUrls: ['./invitar-persona.component.css']
})
export class InvitarPersonaComponent implements OnInit {

  nombreRol: string;
  mensajeAlerta: string;
  pageTitle:string = 'INVITAR UNA PERSONA';
  public cuadrantes: string = '';
  
  public form: FormGroup;
  public pendiente: boolean;
  public usuario: Usuario;
  public perfiles: Perfil[];
  public perfilRol: Perfil;

  constructor(public spinner: NgxSpinnerService,
    private workspaceService: WorkspaceService, 
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertService,
    private dialogService: ConfirmDialogService,
    private administratorService: AdministratorService) { }
    
    ngOnInit(): void {
      this.spinner.show();
      this.servicioPerfiles();
      this.createFormCreate();
      if(localStorage.getItem('equipoId')){
        localStorage.setItem('navigation', NAV.cambiarRol);
        this.pageTitle = 'DETALLE DE EQUIPO';
        this.workspaceService.obtenerUsuarioPorId(Number(localStorage.getItem('equipoId'))).subscribe({
          next: (result) => {
            if (result.data != null) {
              this.usuario = result.data;
              if(this.usuario.tbCatEstatus.idCatEstatus == 3){
                this.pendiente = true;
              }
              this.form.value['rol'] = this.usuario.tbCatPerfil.descripcion;
              this.nombreRol = this.usuario.tbCatPerfil.descripcion;
              this.perfilRol = this.usuario.tbCatPerfil
            }else{
              this.alertService.error('No se pudo recuperar la información del usuario');
            }
          },
          error: (_) => {
            console.log(_)
            this.alertService.error('No se pudo recuperar la información del usuario');
          }
        });
      } else {
        localStorage.setItem('navigation', NAV.invitarPersona);
      }
      this.spinner.hide();

    }

    createFormCreate() {
      this.form = this.formBuilder.group({      
        correo: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,4}$")]]      
      });
    }

  goToEquipos(){
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  servicioPerfiles(){
    this.spinner.show();
    this.administratorService.catalogoPerfiles().subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.perfiles = data.filter((perfil) => perfil.tipo === 'admin');
          if(!localStorage.getItem('equipoId')){
            this.perfilRol = this.perfiles[0]
          }
          this.spinner.hide();
        } else {
          this.alertService.error('Error al consultar catalogo de perfiles');
          this.spinner.hide();
        }
      },
      error: (e) => {
        this.alertService.error('Error al consultar catalogo de perfiles');
      }
    });
    
  }


  enviarInvitacion() {
    if(this.form.get('correo').invalid){
      return;
    }
    const body = {
      email:this.form.get('correo').value,
      tbCatPerfil:{
        idCatPerfil: this.perfilRol.idCatPerfil
      },
    };
    this.spinner.show();
    this.workspaceService.emailEquipoAdminTotalplay(this.administratorService.getIdUsuarios(), body).subscribe({
      next: ({httpStatus, message, data}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          this.registrarBitacora(1, data.idUsuario)
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogService.altaMiembro()
          );
          dialogRef.afterClosed().subscribe(
            _data => {
              this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
            }
          );
        } else {
          if(httpStatus === 201){
            let valor = message.includes('Pendiente');
            if(message.includes('Pendiente')){
              this.alertService.error('Este email ya cuenta con una invitación y se encuentra en estatus pendiente');
              this.form.get('correo')?.setErrors({ incorrect: true });
              this.getError();
            }
            if(message.includes('Activo')){
              this.alertService.error('Este email ya cuenta con una invitación y se encuentra activo');
              this.form.get('correo')?.setErrors({ incorrectActive: true });
              this.getError();
            }
            const arrayDeCadenas = message.split(' ');
            if(message.includes('Inactivo')){
              const dialogRef = this.dialog.open( 
                ConfirmDialogComponent, 
                this.dialogService.reactivarMiembro()
              );
              dialogRef.afterClosed().subscribe(
                
                _data => {
                  const body = {
                    idUsuario: arrayDeCadenas[12],
                    email:this.form.get('correo').value,
                    tbCatPerfil:{
                      idCatPerfil: this.perfilRol.idCatPerfil
                    },
                  };
                  if(_data == true){
                    this.spinner.show();
                    this.workspaceService.emailEquipoAdminTotalplayReactivar(Number(arrayDeCadenas[12]), body).subscribe({
                      next: ({httpStatus, message, data}) => {
                        if (httpStatus === 200) {
                          this.spinner.hide();
                          this.registrarBitacora(5, Number(arrayDeCadenas[12]))
                          const dialogRef = this.dialog.open(
                            ConfirmDialogComponent, 
                            this.dialogService.altaMiembro()
                          );
                          dialogRef.afterClosed().subscribe(
                            _data => {
                              this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
                            }
                          );
                        }
                      },
                      error: (e) => {
                        console.log('Error: ', e)
                        this.spinner.hide();
                      }
                    }); 
                  }else{
                    this.alertService.error('Este email se encuentra inactivo');
                    this.form.get('correo')?.setErrors({ inactivo: true });
                    this.getError();
                  }
                }
              );
            }

            
          }
          this.spinner.hide();
        }
      },
      error: (e) => {
        console.log('Error: ', e)
        this.spinner.hide();
      }
    });
  }

  edit(){
    this.spinner.show();
    this.usuario.tbCatPerfil.idCatPerfil = this.perfilRol.idCatPerfil;
    const _idUsuario = this.administratorService.getIdUsuarios();
    this.workspaceService.editarUsuario(this.usuario, _idUsuario).subscribe({
      next: (result) => {
        if (result.httpStatus === 200 || result.message === "Se modificó correctamente.") {
          this.registrarBitacora(4, this.usuario.idUsuario)
          this.alertService.successBlue('<b>¡<strong>'+this.usuario.nombreCompleto+'</strong> ahora tiene el Rol de <strong>'+this.perfilRol.descripcion+'</strong>!</b>');
          this.spinner.hide();
        }else{
          this.alertService.error('No se pudo editar la información del usuario');
          this.spinner.hide();
        }
      },
      error: (_) => {
        console.log(_)
        this.alertService.error('No se pudo editar la información del usuario');
        this.spinner.hide();
      }
    });
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  delete(){
    this.spinner.show();
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.eliminarMiembro()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data == true){
          this.workspaceService.eliminarUsuarioPorId(this.usuario.idUsuario).subscribe({
            next: (result) => {
              if (result.httpStatus === 200 || result.message === "Se eliminó correctamente.") {
                this.spinner.hide();
                this.registrarBitacora(3, this.usuario.idUsuario)
                localStorage.removeItem('equipoId');
                this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
                setTimeout(() => {
                  this.alertService.info('<b>Miembro eliminado correctamente</b>');
                }, 100);
              }else{
                this.alertService.error('No se pudo eliminar al usuario');
                this.spinner.hide();
              }
            },
            error: (_) => {
              console.log(_)
              this.alertService.error('No se pudo eliminar al usuario');
              this.spinner.hide();
            }
          });
        }
      }
    );
    this.spinner.hide();
  }


  seleccionaCuadrante(perfil: Perfil){
    this.perfilRol = perfil;
  }

  reenviarInvitacion(){
    this.spinner.show();
    this.workspaceService.reenviarInvitacion(this.usuario.idUsuario).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.registrarBitacora(2, this.usuario.idUsuario)
          this.alertService.info('<b>Invitación reenviada correctamente</b>');
          this.spinner.hide();
        }else{
          this.spinner.hide();
          this.alertService.error('No se pudo reenviar la invitación del usuario');
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('No se pudo reenviar la invitación del usuario');
      }
    });
    setTimeout(() => {
      this.navegar();
    }, 3000);
  }

  getError(){
    return this.form.get('correo').errors?.required
      ? 'Este campo es requerido'
      : this.form.get('correo').hasError('incorrect')
      ? 'Este email ya cuenta con una invitación y se encuentra en estatus pendiente'
      : this.form.get('correo').hasError('incorrectActive')
      ? 'Este email ya cuenta con una invitación y se encuentra activo'
      : this.form.get('correo').hasError('inactivo')
      ? 'Este email se encuentra inactivo'
      : this.form.get('correo').hasError('email')
      ? 'Correo electrónico inválido'
      : this.form.get('correo').hasError('minlength')
      ? 'El contrato debe contener al menos 3 caracteres'
      : this.form.get('correo').errors?.pattern
      ? 'Correo electrónico inválido caracteres'
      : ''
  }
  
  get formulario() {
    return this.form.controls;
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }

  navegar(){
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  registrarBitacora(flujo?: number, idUsuario?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", invito al nuevo usuario: " + idUsuario + " al equipo de trabajo"
      tipoOperacion = 'Invitar usuario al equipo'
      funcionalidad = 'Alta'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", le reenvio el correo de invitación al usuario: " + idUsuario
      tipoOperacion = 'Reenvio del correo de invitacion'
      funcionalidad = 'Envio'
    }else if(flujo == 3){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", elimino al usuario: " + idUsuario + " del equipo de trabajo "
      tipoOperacion = 'Eliminar miembro'
      funcionalidad = 'Baja'
    }else if(flujo == 4){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", modifico el rol del usuario: " + idUsuario
      tipoOperacion = 'Guardar cambio de rol'
      funcionalidad = 'Cambios'
    }else if(flujo == 5){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", reactivo al usuario: " + idUsuario
      tipoOperacion = 'Reactivar usuario'
      funcionalidad = 'Cambios'
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
