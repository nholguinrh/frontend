import { formatDate } from '@angular/common';
import { Component, OnInit, Input, EventEmitter, Output, } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NAV } from '../../configuration/navegacion';
import { Notification } from '../../model/cliente.model';
import { AdministratorService } from '../../services/administrator.service';
import { ChangeGraphService } from '../../services/change-graph.service';
import { NotificationService } from '../../services/notification.service';
import { ReloadDataService } from '../../services/reload-data.service';
import { ThemeService } from '../../services/theme.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input() leidas: boolean;
  @Output() close = new EventEmitter<boolean>();
  notifications : any[] = [];
  estatus : string = 'noleidas';
  idUsuario: number;
  @Input() typeUser:number;
  @Input() darkMode:boolean = false;
  sinResultados: boolean = false;
  requireUpdate: Subscription;

  ordenNotificacion: ListaNotificaciones[] = [];

  fechaActual: any = new Date(formatDate(Date.now(), 'YYYY-MM-dd', 'en'))
  constructor(public router: Router,
  public notificationService : NotificationService,
  private administratorService: AdministratorService,
  private reloadDataService: ReloadDataService,
  private themeService: ThemeService,
  private changeGraphService:ChangeGraphService,
  private workspaceService: WorkspaceService) { 
    this.idUsuario = this.administratorService.getIdUsuarios();
    /* this.requireUpdate = this.reloadDataService.requireUpdate2.subscribe({
      next: (response) => {
        if (response) {
          this.fillnotifications();
        }
      },
    }); */
   }

   async ngOnInit() {
    this.requireUpdate = this.changeGraphService.enviarflagObservableNumber.subscribe((response) => {
      if (response == 1) {
        this.estatus = "noleidas";
        this.fillnotifications();
      }
    });
     this.idUsuario = this.administratorService.getIdUsuarios();
    if(!this.leidas){
      this.estatus = "leidas";
      await this.fillnotifications();
    }else{
      this.estatus = "noleidas";
      await this.fillnotifications();
    }
  }

  public ocultarMenu(notification: Notification): void {
    notification.status = 0;
  }

  public deleteNotification(index: number, event: any,item:any): void {
    event.stopPropagation()
    this.notificationService.borrarNotificacion(this.idUsuario,item.idNotificacion).subscribe({
      next: (result) => {
        if(this.typeUser == 0){
          this.registrarBitacora(2, item.idNotificacion)
        }
        if(!this.leidas){
          this.notifications = [];
          this.estatus = "leidas";
          this.fillnotifications();
        }else{
          this.estatus = "noleidas";
          this.fillnotifications();
        }
      },
      error: () => {
        console.log('error')
      }
    });
  }

  public showDelete(notification: Notification, event: any): void {
    event.stopPropagation()
    notification.status = 1;
  }

  public goToInbox(idNotificacion?: number){
    localStorage.setItem('menu', '3');
    this.themeService.setDarkTheme(false);
    localStorage.setItem('id-notificacion',String(idNotificacion));
    this.close.emit(true);
    if(this.typeUser == 0){
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.inbox+")");
      if(localStorage.getItem('navigation') == 'inbox'){
        window.location.reload();
      }
    }else{
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.inbox+")");
      //this.setDarkTheme();
      if(localStorage.getItem('navigation') == 'inbox'){
        window.location.reload();
      }
    }
  }

   fillnotifications(){
    let dateNotification: any;
    let diff: any;
    let diferenciaDias
    let tituloDia = 'HOY'
    this.sinResultados = false;
    this.notifications = [];
    this.notificationService.consultarNotificaciones(this.idUsuario,this.estatus ).subscribe({
      next: (result) => {
        if(result.data.length > 0){
          this.sinResultados = false;
        this.notifications = result.data;
        this.ordenNotificacion = []
        result.data.forEach(element => {
          dateNotification = new Date(formatDate(new Date(element.fechaCreacion), 'YYYY-MM-dd', 'en'))
          diff = this.fechaActual - dateNotification;
          diferenciaDias = Math.floor(diff / (1000 * 60 * 60 * 24));
          let agregarTitulo = true
          let indexNotificacion = 0;
          this.ordenNotificacion.forEach((elem, index) => {
            if(elem.titulo == tituloDia){
              agregarTitulo = false
              indexNotificacion = index;
            }
          });
          if(diferenciaDias == 0){
            tituloDia = 'HOY'
          }else if(diferenciaDias == 1){
            tituloDia = 'AYER'
          }else{
            tituloDia = 'HACE MAS DE 3 DÍAS'   
          }
          if(agregarTitulo){
            this.ordenNotificacion.push({ titulo: tituloDia, listaNotificacion: [element]})
          }else{
            this.ordenNotificacion[indexNotificacion].listaNotificacion.push(element)
          }
      });
        }else{
          this.sinResultados = true;
        }
            
      },
      error: () => {
        console.log('error')
        this.sinResultados = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  setDarkTheme() {
    if(Number(localStorage.getItem('darkTheme')) == 1){
      localStorage.setItem('darkTheme', '0');
      localStorage.setItem('darkType', '1');
    }
    this.themeService.setDarkTheme(false);
  }

  alerta(event: any,notificacion){
    event.stopPropagation()
    this.close.emit(true);
    let arrayDeParametros = notificacion.tbParametroUrl.parametros.split(',');
    localStorage.setItem('id-nuevo-cliente',arrayDeParametros[0]);
    localStorage.setItem('cliente',arrayDeParametros[0]);
    this.registrarBitacora(3, arrayDeParametros[0])
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

  registrarBitacora(flujo?: number, data?: any){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " entro a ver la notificación " + + ''
      funcionalidad = 'Visualizar notificación'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + " elimino la notificación " + data 
      funcionalidad = 'Eliminar notificación'
      tipoOperacion = 'Baja'
    }else if(flujo == 3){
      comentario = "El usuario "+ this.administratorService.getIdUsuarios() + "  entro a terminar la configuración del cliente " + data
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

  refreshPage(event?){  
    event.stopPropagation();
    window.location.reload();
  }

}

export class ListaNotificaciones {
  titulo?: string;
  listaNotificacion?: any[];
}
