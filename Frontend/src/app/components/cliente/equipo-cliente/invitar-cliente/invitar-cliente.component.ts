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
import { ClientService } from 'src/app/shared/services/client.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Usuario } from 'src/app/shared/model/cliente.model';
import { Perfil } from 'src/app/shared/model/onboarding.model';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';


@Component({
  selector: 'app-invitar-cliente',
  templateUrl: './invitar-cliente.component.html',
  styleUrls: ['./invitar-cliente.component.css']
})
export class InvitarClienteComponent implements OnInit {

  nombrePerfil: string;
  mensajeAlerta: string;
  pageTitle:string = 'INVITAR UNA PERSONA';
  rol: any;
  public cuadrantes: string = '';
  public data: any;
  public dashboard: any;

  public form: FormGroup;
  public pendiente: boolean;
  public usuario: Usuario;
  public perfiles: Perfil[];
  public perfilRol: Perfil;

  public datadashboard: any;
  emailstring= "mailto:helpdesk@totalplay.com?Subject=Soporte SMC&body=Buen día, estoy buscando ayuda…(déjanos saber en que podemos ayudarte)";
  constructor(public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertService,
    private dialogService: ConfirmDialogService,
    private administratorService: AdministratorService,
    private workspaceService: WorkspaceService,
    private clientService: ClientService,
    private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.servicioPerfiles();
    this.createFormCreate();
    if(localStorage.getItem('equipoId')){
      localStorage.setItem('navigation', NAV.cambiarRol);
      this.pageTitle = 'CAMBIAR ROL';
      localStorage.setItem('navigation', NAV.cambiarRolCliente);
      this.clientService.obtenerClientePorId(Number(localStorage.getItem('equipoId'))).subscribe({
        next: (result) => {
          if (result.data != null) {
            this.data = result.data.usuario;
            if(this.data.tbCatEstatus.idCatEstatus == 3){
              this.pendiente = true;
            }
            //this.dashboard = result.data.dashboardDto;
            this.form.value['rol'] = this.data.tbCatPerfil.descripcion;
            this.nombrePerfil = this.data.tbCatPerfil.descripcion;
            this.perfilRol = this.data.tbCatPerfil;
            console.log('Recuperar dashboard')
            this.obtenerDashboard();
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
      this.permitirInvitar();
      localStorage.setItem('navigation', NAV.invitarCliente);
    }
    this.spinner.hide();

  }

  
  createFormCreate() {
    this.form = this.formBuilder.group({      
      correo: ['', [Validators.required]],
      rol: ['', [Validators.required]]
    });
  }
  
  goToEquipos(){
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
  }

  servicioPerfiles(){
    this.administratorService.catalogoPerfiles().subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.perfiles = data.filter((perfil) => perfil.tipo === 'cliente');
          this.perfilRol = this.perfiles[0];
        } else {
          this.alertService.error('Error al consultar catalogo de perfiles');
          
        }
      },
      error: (e) => {
        this.alertService.error('Error al consultar catalogo de perfiles');
      }
    });
  }
  
  enviarInvitacion() {
    if(this.form.get('correo').invalid){
      this.form.get('correo')?.markAllAsTouched();
      this.form.get('correo')?.setErrors({ required: true });
      return;
    }
    const body = {
      tbUsuario: {
        email: this.form.get('correo').value,
        tbCatPerfil: this.perfilRol,
      },
      tbCliente: {
        idCliente: this.administratorService.getIdCliente()
      }
    };
    this.spinner.show();
    this.clientService.emailEquipoCliente(this.administratorService.getIdUsuarios(), body).subscribe({
      next: ({httpStatus, message, data}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogService.altaMiembro()
          );
          dialogRef.afterClosed().subscribe(
            _data => {
              this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
            });
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
                    tbUsuario: {
                      email: this.form.get('correo').value,
                      tbCatPerfil: this.perfilRol,
                    },
                    tbCliente: {
                      idCliente: this.administratorService.getIdCliente()
                    }
                  };
                  if(_data == true){
                    this.spinner.show();
                    this.clientService.emailEquipoClienteTotalplayReactivar(Number(arrayDeCadenas[12]), body).subscribe({
                      next: ({httpStatus, message, data}) => {
                        if (httpStatus === 200) {
                          this.spinner.hide();
                          const dialogRef = this.dialog.open(
                            ConfirmDialogComponent, 
                            this.dialogService.altaMiembro()
                          );
                          dialogRef.afterClosed().subscribe(
                            _data => {
                              this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
                            }
                          );
                        }else{
                          this.spinner.hide();
                          this.alertService.error(message);
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
        this.alertService.error('Error al enviar la invitación');
        this.spinner.hide();
      }
    });
  }

  edit(){
    this.spinner.show();
    localStorage.removeItem('equipoId');
    this.mensajeAlerta = '<b>¡German Vega ahora tiene el Rol de '+this.perfilRol.descripcion+'!</b>'
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
    this.spinner.hide();
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
          this.clientService.eliminarClientePorId(this.data.idUsuario).subscribe({
            next: (result) => {
              if (result.httpStatus == 200) {
                this.spinner.hide();
                localStorage.removeItem('equipoId');
                this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
                setTimeout(() => {
                  this.alertService.info('<b>Miembro eliminado correctamente</b>');
                }, 100);
              }else{
                this.alertService.error('No se pudo eliminar al usuario');
                this.spinner.hide();
              }
            },
            error: (_) => {
              this.alertService.error('No se pudo eliminar al usuario');
              this.spinner.hide();
            }
          });
        }
      }
    );
    this.spinner.hide();
  }

  deleteMiembro(){
    this.spinner.show();
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.eliminarMiembro()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        if(_data == true){
          this.clientService.eliminarMiembroPorId(this.data.idUsuario).subscribe({
            next: (result) => {
              if (result.httpStatus == 200) {
                this.spinner.hide();
                localStorage.removeItem('equipoId');
                this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
                setTimeout(() => {
                  this.alertService.info('<b>Miembro eliminado correctamente</b>');
                }, 100);
              }else{
                this.alertService.error('No se pudo eliminar al usuario');
                this.spinner.hide();
              }
            },
            error: (_) => {
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
  
  get formulario() {
    return this.form.controls;
  }

  getError(){
    return this.form.get('correo').errors?.required
      ? 'Este campo es requerido'
      : this.form.get('correo').hasError('incorrect')
      ? 'Este email ya cuenta con una invitación'
      : this.form.get('correo').hasError('email')
      ? 'Correo electrónico inválido'
      : this.form.get('correo').hasError('minlength')
      ? 'El contrato debe contener al menos 3 caracteres'
      : ''
  }

  reenviarInvitacion(){
    this.spinner.show();
    this.workspaceService.reenviarInvitacion(Number(localStorage.getItem('equipoId'))).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.spinner.hide();
          this.alertService.info('<b>Invitación reenviada correctamente</b>');
          
          /* setTimeout(() => {
            this.spinner.hide();
            this.alertService.info('<b>Invitación reenviada correctamente</b>');
          }, 300);
          this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")"); */
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
      this.goToEquipos();
    }, 3000);
  }

  modificarEquipoCliente(){
    this.spinner.show();
    this.workspaceService.modificarEquipoCliente(Number(localStorage.getItem('equipoId')), this.perfilRol.idCatPerfil).subscribe({
      next: (result) => {
        if (result.httpStatus === 200 || result.message === "Consulta exitosa.") {
          this.alertService.successBlue('<b>¡<strong>'+this.data.nombreCompleto+'</strong> ahora tiene el Perfil de <strong>'+this.perfilRol.descripcion+'</strong>!</b>');
          this.spinner.hide();
        }else{
          this.alertService.error('No se pudo editar la información del usuario');
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('No se pudo editar la información del usuario');
      }
    });
    localStorage.removeItem('equipoId');
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
  }

  obtenerDashboard(){
    console.log("Dentro del obtener dashboard")
    this.dashboardService.obtenerDashboard(this.data.idUsuario).subscribe({
      next: (result) => {
        if (result.data != null) {
          this.dashboard = result.data;
        }else{
          this.alertService.error('No se pudo recuperar la información');
        }
      },
      error: (_) => {
        console.log(_)
        this.alertService.error('No se pudo recuperar la información del usuario');
      }
    });
  }

  permitirInvitar(){
    this.spinner.show();
    console.log("Dentro del permitir invitar");
    this.workspaceService.permitirInvitar(this.administratorService.getIdCliente()).subscribe({
      next: (result) => {
        if (result.httpStatus == 200) {
          console.log("Puede registrar");
          this.spinner.hide();
        }else if (result.httpStatus == 301){
          this.spinner.hide();
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogService.permitirEnviar()
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
      },
      error: (_) => {
         this.spinner.hide();
        console.error('No se pudo obtener el servicio');
      }
    });
  }

  help(){
    window.location.href = this.emailstring;
  }

}
