import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/utils/alertas';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { Notifications } from 'src/app/shared/model/notifications.model';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'app-bandeja-entrada',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaComponent implements OnInit {

  selected = new FormControl(1);
  notifications: Notifications[] = [];
  notificationSelected: Notifications;
  estatus : string = 'leidas';
  idUsuario: number;
  idNotificacionActiva: number;
  public form: FormGroup;
  mostrarData: boolean = true;

  constructor(public router: Router,
    private alertService: AlertService,
    public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public notificationService : NotificationService,
    private administratorService: AdministratorService,
    private workspaceService: WorkspaceService) { 
      this.form = this.formBuilder.group({      
        busqueda: ['']
      });
    }

  ngOnInit(): void {
    this.idUsuario = this.administratorService.getIdUsuarios();
    if(Number(localStorage.getItem('id-notificacion'))){
      this.idNotificacionActiva = Number(localStorage.getItem('id-notificacion'))     
      this.updatestatus(this.idNotificacionActiva);
      this.estatus ="leidas"
    }else{
      this.tabChange(1)
    }
    setTimeout(() => {
      localStorage.setItem('navigation', NAV.inbox);
    }, 3000);
  }

  goToWorkspace(){
    localStorage.removeItem('navigation');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  selectTab(index: number){
    this.selected.setValue(index);
  }

  tabChange(index: any){
    this.spinner.show();
    this.selectTab(index)
    this.form.reset();
    this.mostrarData = true
    if(index == 0){
      this.estatus ="noleidas"
      this.notificationSelected = null;
      this.fillnotifications();
    }else{
      this.estatus ="leidas"
      this.notificationSelected = null;
      this.fillnotifications();
    }
  }

  selectNotification(notification){
    this.form.reset();
    this.mostrarData = true
    this.notificationSelected = notification;
    this.idNotificacionActiva = notification.idNotificacion;
    this.updatestatus(notification.idNotificacion);
  }

  deleteNotificacion(notificacion){
    this.spinner.show();
    this.notificationService.borrarNotificacion(this.idUsuario,notificacion.idNotificacion).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.registrarBitacora(2)
        this.notificationSelected = null;
        this.fillnotifications();
      },
      error: () => {
        console.log('error')
        this.spinner.hide();
      }
    });
  }

  fillnotifications(){
    this.notifications = [];
    this.notificationService.consultarNotificaciones(this.idUsuario,this.estatus ).subscribe({
      next: (result) => {
        this.notifications = result.data;
        this.spinner.hide();
        if(Number(localStorage.getItem('id-notificacion'))){
          this.notificationSelected = this.notifications?.find(element => element.idNotificacion == this.idNotificacionActiva) 
          localStorage.removeItem('id-notificacion')
        }
      },
      error: () => {
        console.log('error')
        this.spinner.hide();
      }
    });
  }

  updatestatus(idNotificacion){
    this.spinner.show();
    this.notificationService.actualizasEstatusNotificacion(this.idUsuario,idNotificacion).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.registrarBitacora(1)
        this.fillnotifications();
      },
      error: () => {
        console.log('error')
        this.spinner.hide();
      }
    });
  }

  alerta(notificacion){
    const _nav = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteInformacion+")";
    this.router.navigateByUrl(_nav);
    let arrayDeParametros = notificacion.tbParametroUrl.parametros.split(',');
    localStorage.setItem('id-nuevo-cliente',arrayDeParametros[0]);
    localStorage.setItem('cliente',arrayDeParametros[0]);
    this.registrarBitacora(3)
    if(arrayDeParametros[1] == 1){
      let _nav = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteInformacion+")";
      this.router.navigateByUrl(_nav);
    }else if(arrayDeParametros[1] == 2){
      let _nav = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteActivacion+")";
      this.router.navigateByUrl(_nav);
    }else{
      let _nav = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteConfiguracion+")";
      this.router.navigateByUrl(_nav);
    }
  }

  buscarNotificaciones(ele){
    this.spinner.show();
    let tipo = this.estatus == 'noleidas' ? 0 : 1 ;
    let busqueda: string = ele.target.value;
    this.notifications = [];
    if(busqueda != null && busqueda != ''){
      this.notificationService.buscarNotificaciones(this.idUsuario,busqueda,tipo).subscribe({
        next: (result) => {
          console.log(result.data)
          this.notificationSelected = null;
          if(result.data.length > 0){
            this.mostrarData = true
            this.notifications = result.data;
          }else{
            this.mostrarData = false
          }
          this.spinner.hide();
        },
        error: () => {
          console.log('error')
          this.spinner.hide();
        }
      });
    }else{
      this.fillnotifications();
    }

  }

  returnFilter(){
    this.form.reset();
    this.fillnotifications();
  }

  registrarBitacora(flujo?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " entro a ver la notificación " + + ''
      funcionalidad = 'Visualizar notificación'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " elimino la notificación " + + '' 
      funcionalidad = 'Eliminar notificación'
      tipoOperacion = 'Baja'
    }else if(flujo == 3){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + "  entro a terminar la configuración del cliente " + + ''
      funcionalidad = 'Continuar con configuración de cliente'
      tipoOperacion = 'Cambios'
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
