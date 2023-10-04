import { Component, Input,OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';

import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Cliente } from 'src/app/shared/model/cliente.model';
import { CodigoSeguridad } from 'src/app/shared/model/codigo-seguridad';
import { PincodeComponent } from 'src/app/shared/utils/pincode/pincode.component';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-enter-code',
  templateUrl: './enter-code.component.html',
  styleUrls: ['./enter-code.component.css']
})
export class EnterCodeComponent implements OnInit {

  @ViewChild('pincode') pincode: PincodeComponent;
  @Input() user: Cliente;
  @Input() radioUsername: string = 'Usuario';
  @Input() emailPartial: string = 'c*****a@g*****.com';

  imgLoad: boolean = false;
  _codigo: CodigoSeguridad;
  email: string;

  @Output() notifyNextStep = new EventEmitter<number>();

  enabledPswCapture: boolean = false;
  btnControl: boolean = true;
  timeOut: boolean = false;

  constructor(private router: Router, 
    private dialog: MatDialog,
    private auth: AuthService, 
    public spinner: NgxSpinnerService,
    private adminService: AdminService ) {}

  ngOnInit(): void {
    this.email = localStorage.getItem('new-password-email');
  }

  sendValidationCode(): void {
    this.enabledPswCapture = true;  
  }

  btnHandlerEnabled(active: boolean) {
    this.btnControl = active;
  }

  timeOutHandler(timeout: boolean){
    this.timeOut = timeout;
  }

  validarCodigo() {
    const request = {
      email: this.email,
      codigo: this.pincode.confirmCode(),
      //idUsuario: this.user.idUsuarios
    };
    this.spinner.show();
    this.adminService.validarCodigoPass(request).subscribe({
      next: ({ data, httpStatus, message}) => {
        if (httpStatus === 200) {
          localStorage.setItem('id-cliente-reseteo', String(data.idUsuario))
          this.router.navigateByUrl(NAV.cambiarContrasenia+"/("+NAV.auth+":"+NAV.pass+")");
          this.spinner.hide();
        } else {
          this.pincode.setErrorMessage(message);
          this.pincode.confirmCodeForm.get('digits')?.setErrors({ invalid: true });
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.openDialog(1);
        this.spinner.hide();
      }
    });

  }

  reenviarCodigo(){
    this.spinner.show();
    const email = this.email;
    this.adminService.enviarCodigoPass(email).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.reiniciarComponente();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.pincode.setErrorMessage(message);
          this.pincode.confirmCodeForm.get('digits')?.setErrors({ invalid: true });
        }
      },
      error: (_) => {
        this.openDialog(1);
        this.spinner.hide();
      }
    });
  }

  loadImage() {
    this.imgLoad = true;
  }

  openDialog(reintento:number): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: reintento, cerrarSesion: false},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
    });
  }

  reiniciarComponente(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigateByUrl(NAV.cambiarContrasenia+"/("+NAV.auth+":"+NAV.code+")");
  }


}
