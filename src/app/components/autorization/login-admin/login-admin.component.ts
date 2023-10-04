import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Auth } from 'src/app/shared/model/auth';
import { Cliente } from 'src/app/shared/model/cliente.model';
import { CodigoSeguridad } from 'src/app/shared/model/codigo-seguridad';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  @ViewChild('password') password: MatInput;
  @ViewChild('email') email: MatInput;
  hide: boolean = true;
  titleAdmin: string = 'BIENVENIDO';
  titleAlert: string = 'Este campo es requerido';
  form: FormGroup;
  post: any;
  imgLoad: boolean = false;
  _auth: Auth;
  _codigo: CodigoSeguridad;
  _user: Cliente;
  _reintentoAdmin: number = 1;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder, 
    private router: Router, 
    public spinner: NgxSpinnerService,
    public wokspaceService : WorkspaceService,
    private adminService: AdministratorService) {}

  ngOnInit(): void {
    let first = localStorage.getItem('first');
    this.adminService.logout();
    if(!first){
      localStorage.setItem('first','1');
      setTimeout(() => {
        window.location.reload();
      }, 750);
    }else{
      localStorage.setItem('first','1');
    }
    this.createFormAdmin();
  }

  createFormAdmin() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  checkPasswordAdmin(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  getErrorPasswordAdmin() {
    return this.form.get('password').hasError('required')
      ? 'Este campo es requerido'
      : this.form.get('password').hasError('requirements')
      ? 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número'
      : '';
  }

  loginAdmin(): void{
    this.obtenerIP();
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control.valid == false) {
            control.markAsTouched({ onlySelf: true });
        }
      });
    }
    if(this.form.valid){
      this._auth = new Auth();
      this._auth.email = this.form.controls['email'].value;
      this._auth.password = this.form.controls['password'].value;
      this.spinner.show();
      this.continueLogin();
    } 
  }

  continueLogin() {
    this.adminService.loginAdmin(this._auth).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          if(this.adminService.getPerfi()?.descripcion == 'Administrador' 
          || this.adminService.getPerfi()?.descripcion == 'Back Office'
          || this.adminService.getPerfi()?.descripcion == 'Super Administrador'){
            this.registrarBitacora();
            this.router.navigateByUrl(NAV.administrator);
          }
          else{
            this.selectMessageError('El usuario no se encuentra registrado en el sistema.');
          }
        } else {
          this.selectMessageError(message);
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      } 
    });
  }

  loadImageAdmin() {
    this.imgLoad = true;
  }

  enterContrato(){
    this.password.focus();
  }

  getError(value: string){
    if (this.form.get(value).errors?.required) {
      return 'Este campo es requerido';
    } else if (value == 'email') {
      return this.form.get('email').hasError('contrato')
      ? 'Este email no está asociado a una cuenta'
      : this.form.get('email').hasError('email')
      ? 'Correo electrónico inválido'
      : this.form.get('email').hasError('activo')
      ? 'Este email no está activo'
      : '';
    } else if (value == 'password') {
      return this.form.get('password').hasError('requirements')
      ? ''
      : this.form.get('password').hasError('invalid')
      ? 'La contraseña no coincide con el correo electrónico'
      : '' ;
    }
  }

  changePassword() {
    localStorage.setItem('back-return', NAV.loginAdmin);
    this.router.navigateByUrl(NAV.cambiarContrasenia);
  }

  selectMessageError(message:string) {
    this.spinner.hide();
    if(message.startsWith('La contrase')){
      this.form.get('password')?.setErrors({ invalid: true });
      this.getError('password');
    }
    if(message === 'El usuario no se encuentra registrado en el sistema.'){
      this.form.get('email')?.setErrors({ contrato: true });
      this.getError('email');
    } 
    if(message === 'El usuario no se encuentra ACTIVO.'){
      this.form.get('email')?.setErrors({ activo: true });
      this.getError('email');
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: this._reintentoAdmin, cerrarSesion: false},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((data) => {
      if(data > 0){
        this._reintentoAdmin++;
        this.continueLogin();
      }
    });
  }

  registrarBitacora(){
    let body = {
      "funcionalidad": "Login",
      "tipoOperacion": "Loggeo",
      "datos": "Login de usuario " + this.adminService.getIdUsuarios() +" : "+this.adminService.getNombreUsuario(),
      "creadoPor": {
        "idUsuario": this.adminService.getIdUsuarios()
      }
    }

    this.wokspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }

  paste(event){
    console.log(event.target.value);
    let texto = event.target.value;
    this.form.get('email').setValue(texto.trim());
  }

  obtenerIP(){
    this.wokspaceService.GetIp().subscribe({
      next: (resp) => {
        console.log("RespIP:",resp);
        localStorage.setItem('ipDispositivo',resp.ip)
      },
      error: (_) => {
        console.log('No se puddo obtener la ip');
      }
    });
  }

}
