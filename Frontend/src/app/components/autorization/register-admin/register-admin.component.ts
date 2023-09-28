import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Auth } from 'src/app/shared/model/auth';
import { Cliente, Usuario } from 'src/app/shared/model/cliente.model';

import { CodigoSeguridad } from 'src/app/shared/model/codigo-seguridad';
import { ClientService } from 'src/app/shared/services/client.service';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})

export class RegisterAdminComponent implements OnInit, OnDestroy {

  @ViewChild('password') password: MatInput;
  @ViewChild('nombreCompleto') nombreCompleto: MatInput;
  @ViewChild('confirmPassword') confirmPassword: MatInput;

  hideConfPassword: boolean = true;

  hide: boolean = true;
  title: string = 'REGISTRARSE';
  titleAlert: string = 'Este campo es requerido';
  form: FormGroup;
  post: any;
  imgLoad: boolean = false;
  _auth: Auth;
  _codigo: CodigoSeguridad;
  _user: Cliente;
  modoAdministrador:boolean = false;
  routeSub: Subscription;
  onemail: string;
  onrol: number;
  onid: number;
  onContrato: number;

  constructor(
    private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private router: Router, 
    private route: ActivatedRoute,
    public spinner: NgxSpinnerService,
    private alertService: AlertService,
    private clientService: ClientService,
    private workspaceService: WorkspaceService,
    private onboardingService: OnBoardignService) {}

  ngOnInit(): void {
    localStorage.removeItem('onboarding-adm');
    localStorage.removeItem('onEmail');
    localStorage.removeItem('onrol');
    localStorage.removeItem('onid');
    localStorage.removeItem('onPassowrd');
    let first = localStorage.getItem('first');
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.onemail = params.email;
      this.onid = Number(params.idUsuario);
      this.onrol = params.idCatPerfiles;
      this.onContrato = params.numeroContrato;

    }); 
    if(!first){
      localStorage.setItem('first','1');
      setTimeout(() => {
        window.location.reload();
      }, 750);
    }
    this.createForm();
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
        nombreCompleto: [null, [Validators.required, Validators.pattern("^([ ]{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú])+[ ]{0,1}$")]],
        password: [null, [Validators.required, this.checkPassword]],
        confirmPassword: [null, [Validators.required]],
      },
      { validators: this.mustMatch('password', 'confirmPassword') }
    );
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

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }
      if (!matchingControl.value) {
        return null;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
      return null;
    };
  }

  login(): void{
    this.spinner.show();
    if(this.form.valid){
      this._auth = new Auth();
      this._auth.nombre = this.form.controls['nombreCompleto'].value.trim();
      this._auth.password = this.form.controls['password'].value;
      this._auth.usuario = this.onid;
      this._auth.email = this.onemail;
      this.onboardingService.loginAdmin(this._auth).subscribe({
        next: ({data, httpStatus, message}) => {
          if (httpStatus === 200) {
            localStorage.setItem('perfilCliente', data.tbCatPerfil?.descripcion.toLowerCase());
            this.sendCode();
          }else if(httpStatus === 301){
            this.spinner.hide();
            const dialogRef = this.dialog.open(
              ConfirmDialogComponent, 
              this.dialogService.cuentaRegistrada()
            );
            dialogRef.afterClosed().subscribe(
              data => {
                if(this.onrol == 5 || this.onrol == 4 || this.onrol == 3){
                  this.router.navigateByUrl(NAV.loginAdmin);
                }else{
                  this.router.navigateByUrl(NAV.login);
                }
              }
            );
          }else{
            this.spinner.hide();
            this.alertService.error(message)
          }
        },
        error: (e) => {
          this.spinner.hide();
          this.alertService.error('<b>Error al realizar el registro</b>');
        }
      });
    } 
  }

  sendCode(){
    let _res = new Cliente();
    _res.email = this.onemail
    _res.nombreAdmin = this.form.controls['nombreCompleto'].value.trim();
    localStorage.setItem('onEmail', this.onemail);
    localStorage.setItem('onContrato', this.onContrato.toString());
    localStorage.setItem('onrol', this.onrol.toString());
    localStorage.setItem('onid', this.onid.toString()); 
    localStorage.setItem('onPassowrd', this.form.controls['password'].value);
    this.onboardingService.generarCodigo(this.onemail).subscribe(
     data => {
        this.spinner.hide();
        if(this.onrol == 5 || this.onrol == 4 || this.onrol == 3){
          localStorage.setItem('onboarding-adm', '1');
          this.router.navigateByUrl(NAV.verificationAdmin+"/("+NAV.auth+":"+NAV.code+")");
        }else{
          localStorage.setItem('onboarding-adm', '2');
          this.router.navigateByUrl(NAV.verificationUser+"/("+NAV.auth+":"+NAV.code+")");
        }
      },
      (e) => {
        this.spinner.hide();
        this.alertService.error('<b>Error al realizar el registro</b>');
      }
    );
  }
    

  loadImage() {
    this.imgLoad = true;
  }


  enterPassword(){
    if(this.form.valid){
      this.login();
    }else{
      if(this.form.get('nombreCompleto').invalid){
        this.nombreCompleto.focus();
      }
    }
  }

  enterContrato(){
    this.password.focus();
  }

  getError(value: string){
    if (this.form.get(value).errors?.required) {
      return 'Este campo es requerido';
    }else if (this.form.get('nombreCompleto').errors?.pattern) {
      return 'Los caracteres especiales no son validos';
    } else if (value == 'nombreCompleto') {
      return this.form.get('nombreCompleto').hasError('contrato')
      ? 'El nombre no existe'
      : this.form.get('nombreCompleto').hasError('minlength')
      ? 'El nombre debe contener al menos 3 caracteres'
      : '';
    } else if (value == 'password') {
      return this.form.get('password').hasError('requirements')
      ? 'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número'
      : this.form.get('password').hasError('invalid')
      ? 'La contraseña no coincide con el número de contrato'
      : '' ;
    } else if (value == 'confirmPassword'){
      return this.form.get('confirmPassword').hasError('required')
      ? 'Este campo es requerido'
      : this.form.get('confirmPassword').hasError('mustMatch')
      ? 'Las contraseñas no coinciden'
      : '' ;
    }
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }

  sendLogin(){
    if(String(this.onContrato) == "null" || this.onContrato == undefined){
      this.router.navigateByUrl(NAV.loginAdmin);
    }else{
      this.router.navigateByUrl(NAV.login);      
    }
  }

  paste(event){
    console.log(event);
    return false;
  }

}
