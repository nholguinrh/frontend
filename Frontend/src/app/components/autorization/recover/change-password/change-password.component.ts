import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { AdminService } from 'src/app/shared/services/admin.service';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild('email') email: MatInput;
  form: FormGroup;

  title: string = 'RECUPERA TU CONTRASEÑA';
  
  hide: boolean = true;
  imgLoad: boolean = false;
  _reintento: number = 1;

  constructor(private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private router: Router,
    public spinner: NgxSpinnerService,
    private adminService: AdminService) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,4}$")]]
    });
  }

  send() {
    if(this.form.invalid){
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (!control.valid) {
            control.markAsTouched({ onlySelf: true });
        }
      });
    }
    if(this.form.valid){
      this.spinner.show();
      const email = this.form.value.email;
      sessionStorage.setItem('email',email);
      this.adminService.enviarCodigoPass(email).subscribe({
        next: ({httpStatus}) => {
          if (httpStatus === 200) {
            localStorage.setItem('new-password-email', email);
            this.router.navigateByUrl(NAV.cambiarContrasenia+"/("+NAV.auth+":"+NAV.code+")");
            this.spinner.hide();
          } else {
            if(httpStatus === 301){
              this.spinner.hide();
              this.form.get('email').setErrors({ contrato: true });
            }else{
              this.spinner.hide();
              this.errorServer();
            }
          }
        },
        error: (_) => {
          this.errorServer();
          this.spinner.hide();
        }
      });
    } 
  }

  errorServer() {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: 1, cerrarSesion: false},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.form.reset();
      this.form.controls.email.setErrors(null);
      this._reintento++;
    });
  }

  loadImage() {
    this.imgLoad = true;
  }

  getError(value: string){
    if (this.form.get(value).errors?.required) {
      return 'Este campo es requerido';
    } else if(this.form.get(value).errors?.pattern){
      return 'El formato del correo no es valido';
    } else if (value == 'email') {
      return this.form.get('email').hasError('contrato')
      ? 'Este email no está asociado a una cuenta'
      : this.form.get('email').hasError('minlength')
      ? 'El contrato debe contener al menos 3 caracteres'
      : '';
    } 
  }

  cancel () {
    this.router.navigateByUrl(localStorage.getItem('back-return'));
    localStorage.removeItem('back-return')
  }

}
