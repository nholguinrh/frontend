import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AlertService } from 'src/app/shared/utils/alertas';
import { Notification, Usuario } from 'src/app/shared/model/cliente.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Notifications } from 'src/app/shared/model/notifications.model';

@Component({
  selector: 'app-bandeja-entrada-cliente',
  templateUrl: './bandeja-entrada.component.html',
  styleUrls: ['./bandeja-entrada.component.css']
})
export class BandejaEntradaClienteComponent implements OnInit {

  selected = new FormControl(1);
  notifications: Notifications[] = [];
  notificationSelected: Notifications;
  estatus : string = 'noleidas';
  idUsuario: number;
  idNotificacionActiva: number;
  public form: FormGroup;
  mostrarData: boolean = true;

  constructor(public router: Router,
    private alertService: AlertService,
    public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public notificationService : NotificationService,
    private themeService: ThemeService,
    private administratorService: AdministratorService) { 
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
      this.tabChange(0)
    }
    setTimeout(() => {
      localStorage.setItem('navigation', NAV.inbox);
    }, 3000);
  }

  goToWorkspace(){
    localStorage.removeItem('navigation');
    this.router.navigateByUrl(NAV.inicioCliente);
    let dark = localStorage.getItem('darkType');
    if(dark == '1'){
      localStorage.setItem('darkTheme', '1');
      this.themeService.setDarkTheme(true);
    }else{
      localStorage.setItem('darkType', '0');
      this.themeService.setDarkTheme(false);
    }
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
    if(this.estatus == "noleidas"){
      this.estatus ="leidas"
      this.selectTab(1)
    }
    this.updatestatus(notification.idNotificacion);
  }

  deleteNotificacion(notificacion){
    this.spinner.show();
    this.notificationService.borrarNotificacion(this.idUsuario,notificacion.idNotificacion).subscribe({
      next: (result) => {
        this.spinner.hide();
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
        this.fillnotifications();
      },
      error: () => {
        console.log('error')
        this.spinner.hide();
      }
    });
  }

  buscarNotificaciones(ele){
    this.spinner.show();
    let tipo = this.estatus == 'noleidas' ? 0 : 1 ;
    let busqueda: string = ele.target.value;
    this.notifications = [];
    if(busqueda != null && busqueda != ''){
      this.notificationService.buscarNotificaciones(this.idUsuario,busqueda,tipo).subscribe({
        next: (result) => {
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
  
}
