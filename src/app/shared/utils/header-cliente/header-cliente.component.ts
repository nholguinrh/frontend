import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from '../../configuration/navegacion';
import { AdministratorLoginModel } from '../../model/auth';
import { AdministratorService } from '../../services/administrator.service';
import { ThemeService } from '../../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ReloadDataService } from '../../services/reload-data.service';
import { NotificationService } from '../../services/notification.service';
import { ChangeGraphService } from '../../services/change-graph.service';
import { WorkspaceService } from '../../services/workspace.service';

@Component({
  selector: 'smc-header-cliente',
  templateUrl: './header-cliente.component.html',
  styleUrls: ['./header-cliente.component.css']
})
export class HeaderClienteComponent implements OnInit {

  @Input() color: string = '#3B4559';
  @Input() logo: string = 'image-toolbar';
  public isHomeActive: boolean = true;
  public isWorkspaceActive: boolean;
  public username: string = '';
  public role: string = '';
  public dark: boolean;
  isDarkTheme: Observable<boolean>;
  selected = new FormControl(1);
  idUsuario: number;
  requireUpdate: Subscription;
  numNotificaciones: string;
  version:string;
  constructor(public router: Router,
    public spinner: NgxSpinnerService,
    private administratorService: AdministratorService,
    private themeService: ThemeService,
    private reloadDataService: ReloadDataService,
    public wokspaceService : WorkspaceService,
    public notificationService : NotificationService,
    private changeGraphService:ChangeGraphService) {
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
    this.versionSistema();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => {
      this.dark = val;
    });
    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      setTimeout(() => {
        this.themeService.setDarkTheme(mode === '1' ? true: false);
      }, 100);
    }
    this.role = this.administratorService.getPerfi() ? this.administratorService.getPerfi().descripcion : 'Sin información';
    this.username = this.administratorService.getNombreUsuario() ? this.administratorService.getNombreUsuario() : 'Sin información';

    
  }

  logout(){
    setTimeout(() => {
      this.themeService.setDarkTheme(false);
    }, 100);
    this.registrarBitacora();
    localStorage.clear();
    this.router.navigateByUrl(NAV.login);
  }

  changeMenu(menu:number){
    if(localStorage.getItem('navigation') == 'inbox'){
      localStorage.removeItem('navigation');
    }
    switch (menu) {
      case 1:
          localStorage.setItem('menu', '1');
          this.router.navigateByUrl(NAV.inicioCliente);
        break;
      case 2:
          localStorage.setItem('menu', '2');
          this.themeService.setDarkTheme(false);
          this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.clienteWorspace+")");
        break;
      default:
        break;
    }
  }

  tabChange(index: any){
    console.log(index)
  }

  openMenu(){
    this.selected.setValue(0);
    this.changeGraphService.changeTab(1);
  }

  selectTab(index: number){
    this.selected.setValue(index);
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
    localStorage.setItem('menu', '3');
    this.themeService.setDarkTheme(false);
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.moduloAyudaAdmin+")");
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

  configuracion(){
    localStorage.setItem('menu', '3');
    this.themeService.setDarkTheme(false);
    this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.configuracionInactividad+")");
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
