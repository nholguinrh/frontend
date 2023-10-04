import { Component, Input,OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { CodigoSeguridad } from 'src/app/shared/model/codigo-seguridad';
import { Step } from 'src/app/shared/model/stteper.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PincodeComponent } from '../../../../shared/utils/pincode/pincode.component';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from 'src/app/shared/model/cliente.model';
import { ConfirmDialogComponent } from 'src/app/shared/utils/confirm-dialog';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';

@Component({
  selector: 'app-codestep',
  templateUrl: './codestep.component.html',
  styleUrls: ['./codestep.component.css']
})
export class CodestepComponent implements OnInit {

  @ViewChild('pincode') pincode: PincodeComponent;
  @Input() 
  user: Cliente;
  @Input()
  radioUsername: string = 'Usuario';
  @Input()
  emailPartial: string = 'c*****a@g*****.com';
  @Input()
  phonePartial: string = '55******80';
  initialStep: Step;
  steps: Step[] = [];
  imgLoad: boolean = false;
  _codigo: CodigoSeguridad;

  @Output() notifyNextStep = new EventEmitter<number>();

  enabledPswCapture: boolean = false;
  optionSelected: number;
  btnControl: boolean = true;
  timeOut: boolean = false;
  mostrarStteper = true;
  _reintento: number = 1;

  constructor(private router: Router, 
    private auth: AuthService, 
    private onboardingService: OnBoardignService, 
    private location: Location, 
    public spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private dialogService: ConfirmDialogService) {}

  ngOnInit(): void {
    this.optionSelected = Number(localStorage.getItem('code'));
    this.initialStep = new Step('VALIDACIÓN', true, false);
    this.steps.push(new Step('CONTRASEÑA', false, false));
    this.user = this.auth.usuario;
    if(this.router.url.substring(1, 19) == 'verification-admin' ||  this.router.url.substring(1, 21) == 'verification-usuario'){
      let cliente = new Cliente();
      cliente.email = localStorage.getItem('onEmail');
      this.user =  cliente;
      this.mostrarStteper = false;
    } 
    console.log(this.mostrarStteper)
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

  goToSecondStep(){
    this._codigo = new CodigoSeguridad();
    this._codigo.codigo = this.pincode.confirmCode();
    this._codigo.correo = this.user.email;
    this._codigo.idClienteUsuarios = this.user.idClienteUsuarios;
    this.spinner.show();
    this.onboardingService.validarCodigo(this._codigo).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.router.navigateByUrl(NAV.verification+"/("+NAV.auth+":"+NAV.pass+")");
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.pincode.setErrorMessage(message);
          this.pincode.confirmCodeForm.get('digits')?.setErrors({ invalid: true });
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  reenviarCodigo() {
    this._codigo = new CodigoSeguridad();
    this._codigo.correo = this.user.email;
    this._codigo.idClienteUsuarios = this.user.idClienteUsuarios;
    this.spinner.show();
    const email = this.user.email;
    this.onboardingService.generarCodigo(email).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          this.reiniciarComponente();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.pincode.setErrorMessage(message);
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  confirmarCodigo(){
    this._codigo = new CodigoSeguridad();
    this._codigo.codigo = this.pincode.confirmCode();
    this._codigo.correo = this.user.email;
    this.spinner.show();
    let perfil = Number(localStorage.getItem('onrol'));
    
    console.log("Confirmar codigo")
    this.onboardingService.validarCodigo(this._codigo).subscribe({
      next: ({httpStatus, message}) => {
        if (httpStatus === 200) {
          if(perfil == 5 || perfil == 4 || perfil == 3){
            const dialogRef = this.dialog.open(
              ConfirmDialogComponent, 
              this.dialogService.cuentaCreada()
            );
            dialogRef.afterClosed().subscribe(
              data => {
                setTimeout(() => {
                  this.router.navigateByUrl(NAV.loginAdmin);
                }, 300);
              });
          } else {  
            localStorage.setItem('usuario-monitoreo', '1');
            this.router.navigateByUrl(NAV.cliente);
          }
          this.spinner.hide();
        }else{
          this.spinner.hide();
          this.pincode.setErrorMessage(message);
          this.pincode.confirmCodeForm.get('digits')?.setErrors({ invalid: true });
        }
      },
      error: (_) => {
        this.openDialog();
      }
    });
  }

  loadImage() {
    this.imgLoad = true;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: this._reintento},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
      this._reintento++;
    });
  }

  reiniciarComponente(){
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    if(this.router.url.substring(1, 19) == 'verification-admin'){
      this.router.navigateByUrl(NAV.verificationAdmin+"/("+NAV.auth+":"+NAV.code+")");
    }else if(this.router.url.substring(1, 21) == 'verification-usuario'){
      this.router.navigateByUrl(NAV.verificationUser+"/("+NAV.auth+":"+NAV.code+")");
    }else{
      this.router.navigateByUrl(NAV.verification+"/("+NAV.auth+":"+NAV.code+")");
    }
  }

}
