import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from '../../configuration/navegacion';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AdministratorLoginModel } from '../../model/auth';
import { AdministratorService } from '../../services/administrator.service';
import { MatTabGroup } from '@angular/material/tabs';
import { ChangeGraphService } from '../../services/change-graph.service';
import { Subscription } from 'rxjs';
import { ReloadDataService } from '../../services/reload-data.service';
import { NotificationService } from '../../services/notification.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'smc-header-home',
  templateUrl: './header-home.component.html',
  styleUrls: ['./header-home.component.css']
})
export class HeaderHomeComponent implements OnInit {

  @Input() color: string = '#3B4559';
  @Input() logo: string = 'image-toolbar';
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  public isHomeActive: boolean = true;
  public isWorkspaceActive: boolean;
  public username: string = '';
  public role: string = '';
  selected = new FormControl(1);
  tabLoadTimes: Date[] = [];
  idUsuario: number;
  requireUpdate: Subscription;
  numNotificaciones: string;
  version:string;
  constructor(public router: Router,
    public spinner: NgxSpinnerService,
    private administratorService: AdministratorService,
    private changeGraphService:ChangeGraphService,
    public wokspaceService : WorkspaceService,
    private reloadDataService: ReloadDataService,
    public notificationService : NotificationService) {
      this.idUsuario = this.administratorService.getIdUsuarios();
    this.requireUpdate = this.reloadDataService.requireUpdate2.subscribe({
      next: (response) => {
        if (response) {
          this.countNotifications();
        }
      },
    });
    }

  ngOnInit(): void {
    this.administratorService.enviarCambioObservable.subscribe((resp) => {
      this.changeMenu(resp);
    })
    this.role = this.administratorService.getPerfi() ? this.administratorService.getPerfi().descripcion : 'Sin información';
    this.username = this.administratorService.getNombreUsuario() ? this.administratorService.getNombreUsuario() : 'Sin información';

    let navigation = localStorage.getItem('navigation');
    if(navigation == null){
      let menu = Number(localStorage.getItem('menu'));
      this.changeMenu(menu);
    }else{
      this.navigateToChild(navigation);
    }
  }

  changeMenu(menu:number){
    if(localStorage.getItem('navigation') == 'inbox'){
      localStorage.removeItem('navigation');
    }
    switch (menu) {
      case 1:
          localStorage.setItem('menu', '1');
          localStorage.removeItem('workspace');
          localStorage.removeItem('navigation');
          localStorage.removeItem('detalle-cliente');
          this.router.navigateByUrl(NAV.administrator);
        break;
      case 2:
          localStorage.setItem('menu', '2');
          this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
        break;
      default:
        break;
    }
  }

  navigateToChild(navigation: string){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+ navigation +")");
  }

  logout(){
    this.registrarBitacora();
    localStorage.clear();
    this.router.navigateByUrl(NAV.loginAdmin);
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }
    return this.tabLoadTimes[index];
  }

  selectTab(index: number){
    this.selected.setValue(index);
  }

  openMenu(){
    this.selected.reset();
    this.changeGraphService.changeTab(1);
  }

  tabChange(index: any){
    console.log(index)
  }

  countNotifications(){
    this.notificationService.contarNotificaciones(this.idUsuario).subscribe({
      next: (result) => {
        this.numNotificaciones = result.data;
      },
      error: () => {
        console.log('error')
      }
    });
  }

  openModuloAyuda(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.moduloAyudaAdmin+")");
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  registrarBitacora(){
    let body = {
      "funcionalidad": "Logout",
      "tipoOperacion": "Logout",
      "datos": "Logout de usuario " + this.administratorService.getIdUsuarios() +" : "+this.administratorService.getNombreUsuario(),
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios()
      }
    }

    this.wokspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

  versionSistema(){
    this.wokspaceService.obtenerVersion().subscribe({
      next: (response) => {
        console.log('La version es',response.data);
        this.version = response.data;
      },
      error: (_) => {
        console.log('No se pudo obtener la version');
      }
    });
  }

}
