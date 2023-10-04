import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Auth } from 'src/app/shared/model/auth';
import { Cliente, Usuario } from 'src/app/shared/model/cliente.model';

import { CodigoSeguridad } from 'src/app/shared/model/codigo-seguridad';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @ViewChild('password') password: MatInput;
  @ViewChild('contrato') contrato: MatInput;
  hide: boolean = true;
  title: string = 'REGISTRARSE';
  titleAlert: string = 'Este campo es requerido';
  form: FormGroup;
  post: any;
  imgLoad: boolean = false;
  _auth: Auth;
  _codigo: CodigoSeguridad;
  _user: Cliente;
  _reintento: number = 1;

  constructor(
    private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private router: Router, 
    private dialogService: ConfirmDialogService,
    public spinner: NgxSpinnerService,
    private onboardingService: OnBoardignService) {}

  ngOnInit(): void {
    
    localStorage.removeItem('usuario-monitoreo');
    localStorage.removeItem('onboarding-adm');
    localStorage.removeItem('onEmail');
    localStorage.removeItem('onrol');
    localStorage.removeItem('onid');
    localStorage.removeItem('onPassowrd');

    let first = localStorage.getItem('first');
    if(!first){
      localStorage.setItem('first','1');
      setTimeout(() => {
        window.location.reload();
      }, 750);
    }
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      numContrato: [null, [Validators.required]],
      password: [null, [Validators.required, this.checkPassword]],
    });
  }

  checkPassword(control) {
    let enteredPassword = control.value;
    let passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    return !passwordCheck.test(enteredPassword) && enteredPassword
      ? { requirements: true }
      : null;
  }

  getErrorPassword() {
    return this.form.get('password').hasError('required')
      ? 'Este campo es requerido'
      : this.form.get('password').hasError('requirements')
      ? 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.'
      : '';
  }

  login(): void{
    this.spinner.show();
    if(this.form.valid){
      this._auth = new Auth();
      this._auth.contrato = this.form.controls['numContrato'].value;
      this._auth.password = this.form.controls['password'].value;
      this.continueLogin();
    } 
  }

  continueLogin() {
    this.onboardingService.login(this._auth).subscribe({
      next: ({data, httpStatus, message}) => {
        console.error(message);
        if (httpStatus === 200) {
          localStorage.setItem('onEmail', data.tbUsuario.email);
          localStorage.setItem('onContrato', this._auth.contrato);
          this.send(data.tbUsuario);
        } else {
          this.spinner.hide();
          if(message === 'El cliente no tiene un estatus Onboarding. No es posible completar el proceso de Onboarding'){
            this.openDialogCuentaRegistrada();
          } else {
            this.selectMessageError(message);
          }
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
  }

  send(usuario: Usuario): void {
    if(usuario != null) {
      localStorage.setItem('onPassowrd', this.form.controls['password'].value);
      this.onboardingService.generarCodigo(usuario.email).subscribe({
        next: ({httpStatus}) => {
          if (httpStatus === 200) {
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            this.router.navigateByUrl(NAV.verification+"/("+NAV.auth+":"+NAV.code+")");
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.openDialog();
          }
        },
        error: (_) => {
          this.spinner.hide();
          this.openDialog();
        }
      });
    }
  }

  loadImage() {
    this.imgLoad = true;
  }

  enterPassword(){
    if(this.form.valid){
      this._auth = new Auth();
      this._auth.contrato = this.form.controls['numContrato'].value;
      this._auth.password = this.form.controls['password'].value;
      /* this._auth.email = "branhdzluz@gmail.com",
      this._auth.ip = "20.20.121.21"; */
      this.continueLogin();
    } else {
      if(this.form.get('numContrato').invalid) {
        this.contrato.focus();
      }
    }
  }

  enterContrato(){
    this.password.focus();
  }

  getError(value: string){
    if (this.form.get(value).errors?.required) {
      return 'Este campo es requerido';
    } else if (value == 'numContrato') {
      return this.form.get('numContrato').hasError('contrato')
      ? 'El número de contrato no existe'
      : this.form.get('numContrato').hasError('minlength')
      ? 'El contrato debe contener al menos 3 caracteres'
      : '';
    } else if (value == 'password') {
      return this.form.get('password').hasError('requirements')
      ? 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número'
      : this.form.get('password').hasError('invalid')
      ? 'La contraseña no coincide con el número de contrato'
      : this.form.get('password').hasError('onboarding') 
      ? 'El usuario no tiene un estatus Onboarding.'
      : '';
    }
    
  }

  changePassword() {
    this.router.navigateByUrl(NAV.cambiarContrasenia);
  }

  selectMessageError(message:string) {
    if(message === 'La contraseña es incorrecta.'){
      this.form.get('password')?.setErrors({ invalid: true });
      this.getError('password');
    }
    if(message === 'El número de contrato no existe' || message === 'El cliente no se encuentra registrado en el sistema.'){
      this.form.get('numContrato')?.setErrors({ contrato: true });
      this.getError('numContrato');
    }
  }

  openDialogCuentaRegistrada() {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.cuentaRegistrada()
    );
    dialogRef.afterClosed().subscribe(
      _data => {
        this.router.navigateByUrl(NAV.login);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: this._reintento, cerrarSesion: false},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((data) => {
      if(data > 0){
        this._reintento++;
        this.continueLogin();
      }
    });
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }
  paste(event){
    console.log(event);
    return false;
  }

}
