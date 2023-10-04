import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Step } from 'src/app/shared/model/stteper.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-secondstep',
  templateUrl: './secondstep.component.html',
  styleUrls: ['./secondstep.component.css'],
})
export class SecondstepComponent implements OnInit {
  
  @ViewChild('alertaModal') alertaModal : any;
  @ViewChild('password') password: MatInput;
  @ViewChild('confirmPassword') confirmPassword: MatInput;

  hideMainPassword: boolean = true;
  hideConfPassword: boolean = true;
  title: string = 'ACTUALIZAR CONTRASEÑA';
  form: FormGroup;
  initialStep: Step;
  steps: Step[] = [];
  imgLoad: boolean = false;
  user: any;

  constructor(private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private auth: AuthService,
    private router: Router,
    public spinner: NgxSpinnerService,
    private onboardingService: OnBoardignService) {}

  ngOnInit(): void {
    this.user = this.auth.usuario;
    this.createForm();
    this.initialStep = new Step('VALIDACIÓN', false, true);
    this.steps.push(new Step('CONTRASEÑA', true, false));
  }

  createForm() {
    this.form = this.formBuilder.group(
      {
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

  getErrorPasswordConf() {
    return this.form.get('confirmPassword').hasError('required')
      ? 'Este campo es requerido'
      : this.form.get('confirmPassword').hasError('mustMatch')
      ? 'Las contraseñas no coinciden'
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

  send(): void {
    const _request = {
      idUsuario: this.user.idUsuario,
      password: this.form.get('password').value
    };
    this.spinner.show();

    this.onboardingService.resetPassword(_request).subscribe({
      next: ({httpStatus}) => {

        if (httpStatus === 200) {
          localStorage.setItem('onPassowrd', this.form.get('password').value);
          this.openDialogConfirm();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.openDialog(1);
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.openDialog(1);
      }
    });
  }

  public openAlertaModal() {
    this.alertaModal.nativeElement.className = 'modal show-modal';
  }
  
  public closeAlertaModal() {
    this.alertaModal.nativeElement.className = 'modal hide-modal';
    this.router.navigateByUrl(NAV.cliente);
  }

  loadImage() {
    this.imgLoad = true;
  }

  enterConfirm(){
    if(this.form.valid){
      this.send();
    }else{
      
    }
  }

  enterPassword(){
    this.confirmPassword.focus();
    /* document.getElementById('confirmPassword').focus();
    (<HTMLInputElement>document.getElementById('confirmPassword')).focus();
    (<HTMLInputElement>document.getElementById('confirmPassword')).setSelectionRange(0,0); */
  }

  openDialogConfirm() {
    const dialogRef = this.dialog.open(
      ConfirmDialogComponent, 
      this.dialogService.leavingBeforeSubmit()
    );
    dialogRef.afterClosed().subscribe(
      data => {
        this.router.navigateByUrl(NAV.cliente);
      }
    );
  }

  openDialog(reintento:number): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: reintento},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.form.reset();
      this.form.controls.password.setErrors(null);
      this.form.controls.confirmPassword.setErrors(null);
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
