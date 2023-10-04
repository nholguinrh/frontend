import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Auth } from 'src/app/shared/model/auth';
import { Cliente, Option} from 'src/app/shared/model/cliente.model';
import { Dashboard } from 'src/app/shared/model/onboarding.model';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { OnBoardignService } from 'src/app/shared/services/onboarding.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.css']
})
export class DashboardsComponent implements OnInit {

  public cuadrantes: string = '';
  public optionList: Option[] = [];
  public dashboardList: Dashboard[] = [];
  public dashboards: Dashboard[];
  public dashboardSelect: number = 6;
  _auth: Auth;
  idUsuario: string;
  perfilGlobal: boolean = true;
  perfil: string;

  constructor(public sanitizer: DomSanitizer, 
    private auth: AuthService, 
    public spinner: NgxSpinnerService,
    private clienteService: ClientService,
    private dialogService: ConfirmDialogService,
    private adminService: AdministratorService,
    private router: Router,
    private themeService: ThemeService,
    private dialog: MatDialog,
    public dashboardService: DashboardService,
    public administratorService: AdministratorService) { }

  ngOnInit(): void {
    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      setTimeout(() => {
        this.themeService.setDarkTheme(mode === '1' ? true: false);
      }, 10);
    }

    this.perfil = localStorage.getItem('perfilCliente');
    if(this.perfil != null){
      this.perfil == 'Ejecutivo' ? this.perfilGlobal = true : this.perfilGlobal = false
    }

    // this.spinner.show();
    if(this.auth.usuario){
      this.idUsuario = String(this.auth.usuario.idUsuario);
    }else{
      this.idUsuario = localStorage.getItem('onid');
    }
    
    //this.idUsuario = String(525);
    /* this.clienteService.catalogoDashboard().subscribe({
      next: ({data, httpStatus}) => {
        if (httpStatus === 200) {
          if(perfil){
            this.dashboards = data;
          }else{
            this.dashboards = []
            data.forEach(element => {
              if(element.descripcion != 'Monitoreo Ejecutivo'){
                this.dashboards.push(element);
              }
            });
          }
          this.dashboards.forEach(e => {
            if(e.idDashboard === 6){
              e.recommended = true;
              e.selected = true;
              this.cuadrantes = e.descripcion;
            }
          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.openDialog();
        }
      },
      error: (_) => {
        this.spinner.hide();
        this.openDialog();
      }
    }); */
    this.recuperarDashboardPaquete()
  }

  openDialog() {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: 1},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
    });
  }

  recuperarDashboardPaquete(){
    this.dashboardService.recuperarDashboardPaquete(Number(this.idUsuario)).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          if(data.length == 1){
            this.dashboardList.push(data[0].tbDashboard);
          }else{
            data.forEach(element => {
              if(this.perfil == "operador"){
                if(element.tbDashboard.descripcion != "Monitoreo Ejecutivo"){
                  this.dashboardList.push(element.tbDashboard);
                }
              }else{
                this.dashboardList.push(element.tbDashboard);
              }
            });
          }

          this.dashboardList.forEach(e => {
            if(e.idDashboard === 6){
              e.recommended = true;
              e.selected = true;
              this.cuadrantes = e.descripcion;
            }
          });
        }
        this.spinner.hide();
      },
      error: (error) => { 
        this.spinner.hide();
        console.log('Error ', error);
      }
    });
  }

  seleccionaCuadrante(i: number){
    this.dashboardList.forEach(element => {
      element.selected = false;
    });
    this.dashboardList[i].selected = true;
    this.cuadrantes = this.dashboardList[i].descripcion;
    this.dashboardSelect = this.dashboardList[i].idDashboard;

    console.log(this.dashboardSelect)
  }

  goToPerfil(){
    let tabSeleccionada = localStorage.getItem('usuario-monitoreo');
    if(tabSeleccionada != null){
      this.router.navigateByUrl(NAV.cliente);
    }else{
      this.router.navigateByUrl(NAV.cliente+"/("+NAV.cliente+":"+NAV.perfil+")");
    }
  }

  comenzar(){
    this.personalizarDashboard(this.dashboardSelect);
  }

  login(): void{

      // this.spinner.show();
      this._auth = new Auth();
      this._auth.password = localStorage.getItem('onPassowrd');
      this._auth.email = localStorage.getItem('onEmail');

      this.adminService.login(this._auth).subscribe({
        next: ({data, httpStatus, message}) => {
          if (httpStatus === 200) {
            this.spinner.hide();
            localStorage.setItem('dashboard', String(this.dashboardSelect));
            this.router.navigateByUrl(NAV.inicioCliente);
          }else{
            this.navToLogin();
          }
        },
        error: (e) => {
          this.navToLogin();
        }
      });
  }

  navToLogin(){
    this.spinner.hide();
    let onrol = Number(localStorage.getItem('onrol'));
    if(onrol == 5 || onrol == 4 || onrol == 3){
      this.router.navigateByUrl(NAV.loginAdmin);
    }else{
      this.router.navigateByUrl(NAV.login);
    }
  }


  personalizarDashboard(idDashboard){
    let aspecto= "claro"
    this.dashboardService.personalizarDashboard(Number(this.idUsuario),idDashboard,aspecto).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.login();
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }
}
