import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { Estadistica, Tiempo } from 'src/app/shared/model/cliente.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
@Component({
  selector: 'app-tableros-cliente',
  templateUrl: './tableros-cliente.component.html',
  styleUrls: ['./tableros-cliente.component.css']
})
export class TablerosClienteComponent implements OnInit {

  isDarkTheme: Observable<boolean>;
  dark: boolean;
  menu: number = 0;
  update: Date;
  diaInicialMes: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  periodoActual: any = {
    fechaInicio: moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format(),
    fechaFin: moment().format() 
  }
  estadisticaList: Estadistica[] = [
    { name: 'Disponibilidad', value: '98%', change: '-02%', estatus: 0 },
    { name: 'Alcanzabilidad', value: '93%', change: '-07%', estatus: 2 },
    { name: 'Pérdida de paquetes', value: '19%', change: '-81%', estatus: 0 },
    { name: 'Consumo', value: '95%', change: '-05%', estatus: 2 },
  ];
  tableros: any[] = [
    { name: 'MONITOREO GLOBAL', image: 'dahsboard-preview-monitoreo-enlace',    icon: 'img-dashboards-monitoreo-enlaces', id: 5},
    { name: 'MONITOREO CON MAPA',  image: 'dahsboard-preview-monitoreo-mapa',      icon: 'img-dashboards-monitoreo-mapa' , id: 6},
    { name: 'MONITOREO EJECUTIVO', image: 'dahsboard-preview-monitoreo-ejecutivo', icon: 'img-dashboards-monitoreo-ejecutivo', id: 4},
    { name: 'MONITOREO VOZ', image: 'dahsboard-preview-monitoreo-voz', icon: 'img-voz-card', id: 7}
  ];
  idUsuario: number;
  dashboardList: any[]=[];
  requireUpdate: Subscription;
  perfilUsuario: any;
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0,'minute': 0, 'second': 0, 'millisecond': 0}).subtract(3, 'days').format();
  tiempos: Tiempo[] = [
    {
      value: '24 horas',
      time: 23 
    }
  ];
  tiempoSeleccionada: number = 1;
  textoSeleccionado: string = "Última hora";
  public form: FormGroup;
  spinnerLoading: boolean = true;
  isFirst: boolean = true;
  constructor(private themeService: ThemeService,
    public spinner: NgxSpinnerService,
    public dashboardService: DashboardService,
    private formBuilder: FormBuilder,
    private reloadDataService: ReloadDataService,
    private changeGraphService:ChangeGraphService,
    public administratorService: AdministratorService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response && !this.isFirst) {
            this.update = new Date();
            this.obtenerEstadisticas();
          }
        },
      });
     }

  ngOnInit(): void {    
    this.form = this.formBuilder.group({
      tiempo: [null],
    });
    this.form.get('tiempo').setValue('Última hora');
    localStorage.setItem('isdashboard', '1');
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.update = new Date();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.isDarkTheme.subscribe((val: boolean) => 
      this.dark = val
    );
    let menu = localStorage.getItem('dashboard');
    if(menu != null){
      this.changeMenu(Number(menu));
    }else{
      this.obtenerDashboard();
    }
    let mode = localStorage.getItem('darkTheme');
    if(mode != null){
      // this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
        this.themeService.setDarkTheme(mode === '1' ? true: false);
      }, 100);
    }
    this.perfilUsuario = this.administratorService.getPerfi();
    this.recuperarDashboardPaquete();
    this.obtenerEstadisticas();
  }

  setDarkTheme(checked: boolean) {
    localStorage.setItem('darkTheme', checked ? '1' : '0');
    this.themeService.setDarkTheme(checked);
    this.personalizarDashboard(this.menu);
  }

  changeMenu(menu: number){
    this.update = new Date();
    this.menu = menu;
    // this.spinner.show();
    setTimeout(() => {
      let mode = localStorage.getItem('darkTheme');
      this.setDarkTheme(mode === '1' ? true: false);
      this.spinner.hide();
    }, 100);
    localStorage.setItem('dashboard', menu.toString());
    console.log(menu)
    this.personalizarDashboard(menu);
  }

  obtenerDashboard(){
    this.dashboardService.obtenerDashboard(this.idUsuario).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          localStorage.setItem('dashboard', data?.tbDashboard?.idDashboard.toString());
          this.changeMenu(data?.tbDashboard?.idDashboard);
          if(data.aspecto == "claro"){
            this.setDarkTheme(false);
          }else{
            this.setDarkTheme(true);
          }
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  recuperarDashboardPaquete(){
    this.dashboardService.recuperarDashboardPaquete(this.idUsuario).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          let mode = localStorage.getItem('darkTheme');
          let contador = 0;
          let dashboardShow = false
          let dashboardFirst
          this.dashboardList = []
          if(data.length == 1){
            this.dashboardList.push(data[0].tbDashboard);
            if(data[0].tbDashboard.idDashboard == Number(localStorage.getItem('dashboard'))){
              dashboardShow = true
            }
          }else{
            console.log(this.perfilUsuario.descripcion)
            data.forEach(element => {
              if(this.perfilUsuario.descripcion == "Operador"){
                if(element.tbDashboard.descripcion != "Monitoreo Ejecutivo"){
                  this.dashboardList.push(element.tbDashboard);
                }
                if(element.tbDashboard.idDashboard == Number(localStorage.getItem('dashboard'))){
                  dashboardShow = true
                }
              }else{
                this.dashboardList.push(element.tbDashboard);
                if(element.tbDashboard.idDashboard == Number(localStorage.getItem('dashboard'))){
                  dashboardShow = true
                }
              }
            });
          }
          this.dashboardList.forEach(element => {
            this.tableros.forEach(ele =>{
              if(element.idDashboard == ele.id){
                  if(Number(mode) == 0){
                    element.image = ele.image;
                  }else{
                    element.image = ele.image+'-dark';
                  }
                }
            });
          });
          dashboardFirst =  this.dashboardList[0].idDashboard
          if(!dashboardShow){
            this.changeMenu(dashboardFirst)
          }
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  personalizarDashboard(idDashboard){
    let mode = localStorage.getItem('darkTheme');
    let aspecto;
    if(Number(mode) == 0){
      aspecto = "claro";
      this.dashboardList.forEach(element => {
        this.tableros.forEach(ele =>{
          if(element.idDashboard == ele.id){
              element.image = ele.image;
            }
        });
      });
    }
    if(Number(mode) == 1){
      aspecto = "oscuro";
      this.dashboardList.forEach(element => {
        this.tableros.forEach(ele =>{
          if(element.idDashboard == ele.id){
            element.image = ele.image+'-dark';
          }
        });
      });
    }
    this.dashboardService.personalizarDashboard(this.idUsuario,idDashboard,aspecto).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
  }

  obtenerEstadisticas(){
    this.spinnerLoading = true;
    let body = {
      "fechaInicio": Constantes.FECHA_INICIO_GLOBAL_ENCABEZADO,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay() ? this.administratorService.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": 'p',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "EncabezadoGeneralMonitoreoGlobal",
      "full": true
    }

    this.dashboardService.obtenerEstadisticas(body).subscribe({
      next: ( data ) => { 
          this.estadisticaList = data.estadisticasMetricas;
          this.periodoActual = {
            fechaInicio: Constantes.FECHA_INICIO_GLOBAL_ENCABEZADO,
            fechaFin: moment().format() 
          }
          this.spinnerLoading = false;
          this.isFirst = false;
      },
      error: (error) => { 
        console.log('Error ', error);
        this.spinnerLoading = false;
        this.isFirst = false;
      }
    });
  }

  desactivarIncatividad(){
    localStorage.setItem('inactividad', '1');
  }

  activarIncatividad(){
    localStorage.setItem('inactividad', '2');
  }
  alertTiempo(tiempo,texto){
    this.tiempoSeleccionada = tiempo;
    this.textoSeleccionado = texto;
    this.changeGraphService.changeRange(this.tiempoSeleccionada);
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  }
}
