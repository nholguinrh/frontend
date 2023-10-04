import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { CanDeactivateGuard } from 'src/app/shared/helper/canDeactivateGuard.helper';
import { Resumen } from 'src/app/shared/model/onboarding.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit, CanDeactivateGuard {

  @ViewChild('videoModal') videoModal : any;
  public resumen: Resumen;
  public canExit: boolean = false;
  mostrarEspecificacione: boolean = true;
  constructor(private router: Router,
    private auth: AuthService,
    public spinner: NgxSpinnerService,
    private alertService: AlertService,
    private clienteService: ClientService) { }

  ngOnInit(): void {
    let contrato = localStorage.getItem('onContrato');
    this.spinner.show();
    this.clienteService.getNewResumen(contrato).then(elem =>{
      this.spinner.hide();
      if(elem.httpStatus == 200){
        this.resumen = elem.data;
        this.resumen.beneficios = ["Visualizar en tiempo real el rendimiento de tus servicios contratados", "Reportar de manera inmediata las fallas de cada sucursal", "Podrás revisar el histórico de tus niveles de servicio contratados"]
      }else{
        this.resumen = null;
        this.alertService.error(elem.message);
      }
    }).catch((error)=>{
      console.log(error);
      this.alertService.error(error.message);
      this.spinner.hide();
    });
    let tabSeleccionada = localStorage.getItem('usuario-monitoreo');
    if(tabSeleccionada != null){
      this.mostrarEspecificacione = false;
    }
  }

  goToPerfil(){
    this.canExit = true;
    this.router.navigateByUrl(NAV.cliente+"/("+NAV.cliente+":"+NAV.perfil+")");
  }

  goToDashboards(){
    this.canExit = true;
    this.router.navigateByUrl(NAV.cliente+"/("+NAV.cliente+":"+NAV.dashboards+")");
  }

  public openVideoModal() {
    this.videoModal.nativeElement.className = 'modal show-modal';
  }
  
  public closeAlertaModal() {
    this.videoModal.nativeElement.className = 'modal hide-modal';    
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.canExit){
      return true;
    }else{
      this.canExit = true;
      this.router.navigateByUrl(NAV.register);
      return true;
    }
  }

}
