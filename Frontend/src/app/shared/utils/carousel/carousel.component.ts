import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { SucursalesAfectadas } from 'src/app/shared/model/sucurales-afectadas';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DetalleServicioService } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.service';
import { DetalleServicioComponent } from 'src/app/components/cliente/servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { AdministratorService } from '../../services/administrator.service';
import { DashboardService } from '../../services/dashboards.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { Constantes } from '../../const/date-graph';
import { ChangeGraphService } from '../../services/change-graph.service';
@Component({
  selector: 'smc-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))])
    ])
  ]
})
export class CarouselComponent implements OnInit {
  errorCarga: number = 0;
  @Input() cardData: any[];
  cardDataSelect: any;
  carruselCardData: number[] = [];
  dataAccess: number = 1;
  button: number = 1;
  idCardSelect: number = 0;
  isDark: boolean = false;
  isDarkTheme: Observable<boolean>;
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(30, 'days').format();
  requireUpdate: Subscription;
  progressChartdata: any;
  spinnerLoading: boolean = true;
  message: boolean = false;
  isFirst:boolean = true;
  constructor(private themeService: ThemeService, public dialog: MatDialog,
    private auth: AdministratorService,
    public spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private reloadDataService: ReloadDataService,
    private changeGraphService: ChangeGraphService,
    private confirmService: DetalleServicioService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response) {
            this.obtenerAfectaciones(false)
          }
        },
      });
    }

  public get width() {
    return window.innerWidth;
  }

  ngOnInit() {
    this.isDarkTheme = this.themeService.isDarkTheme;
    //this.isDarkTheme.subscribe((val: boolean) => this.obtenerAfectaciones(val));

    //this.calcTotalAfectaciones(false);
    //this.isDarkTheme.subscribe((val: boolean) => this.calcTotalAfectaciones(val));
  }

  changeSlide(slidePosition: number): void {
    setTimeout(() => {
      this.dataAccess = slidePosition;
    }, 200);
    this.button = slidePosition;
  }

  setDesktopMode(mode: boolean, total: number, value:number): {} {
    if (mode) {
      return {
        id: 'ejecutivo-dark',
        icono: 'assets/img/vista-arrow-down.svg',
        porcentaje: value,
        total: total,
        color: {
          colorPorcentaje: '#FF2F5E',
          colorFondo: '#3b4559',
          colorCirculo: '#697181',
        }
      };
    } else {
      return {
        id: 'ejecutivo-light',
        icono: 'assets/img/vista-arrow-down.svg',
        porcentaje: value,
        total: total,
        color: {
          colorPorcentaje: '#FF2F5E',
          colorFondo: '#EFF6FD',
          colorCirculo: '#FFFFFF',
        }
      };
    }
  }

  resetDataOnChangeMode(): void {
    this.dataAccess = 1;
    this.button = 1;
    this.changeSlide(2);
    this.changeSlide(1);
  }

  obtenerAfectaciones(dark?: boolean) {
    this.spinnerLoading = true;
    this.isDark = dark
    let request = {
      "fechaInicio": (moment().set({'minute': 0, 'second': 0, 'millisecond': 0}).subtract(23, 'hours').format()).substring(0,19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "funcionalidad": "ServiciosInalcanzablesMonitoreoMapa",
    };
    this.dashboardService.obtenerServiciosInalcanzables(request).subscribe({
    /* this.dashboardService.monitoreoEjecutivoAfectaciones(request).subscribe({ */
      next: (data) => {
        var start = window.performance.now(); 
        this.spinner.hide();
        console.log('Data:',data)
        if(data){
          this.changeGraphService.changetotal(data.dispositivos.length);
          this.cardData = data.dispositivos;
          if(this.cardData.length == 0){
            this.message = true;
          }else{
            this.message = false;
          }
          this.calcTotalAfectaciones();
        }else{
          this.message = true;
        }
        this.isFirst = false;
        this.spinnerLoading = false;
        var end = window.performance.now();
        console.log(`Tiempo execusion Sitios Inactivos Ejecutivo: ${((end - start)/1000).toFixed(5)} segundos`);
      },
      error: (_) => {
        this.errorCarga = 1
        this.spinnerLoading = false;
        console.log(_);       
      },
    });
  }

  calcTotalAfectaciones(isDark?: boolean): void {
    /* this.cardData.forEach((card) => {
      let total = card.total;
      let value = card.tiempoCaida;
      card.totalAfectaciones = total ? total : 0;
      card.classCard = this.isDark ? 'custom-card-dark' : 'custom-card-claro';
      card.classIcon = this.isDark ? 'ic-color-light' : 'ic-color-dark';
      card.progressChartdata = this.setDesktopMode(this.isDark, total, value);
    }); */
    
    this.selectCardData(this.idCardSelect)
    this.resetDataOnChangeMode();
  }

/*
  abrirDetalleDispositivo(dispositivo: string){

    let selecionDialogo;

    localStorage.setItem('tipo-dispositivo', 'Sitio');
    
    selecionDialogo = this.confirmService.metricaSitio()
    //selecionDialogo = this.confirmService.detalleDispositivo(this.isDark, data.listaResultado[0]);

    localStorage.setItem('nombre-sitio', dispositivo)
    const dialogRef = this.dialog.open(
      DetalleServicioComponent, 
      selecionDialogo
    );
    localStorage.removeItem('afectacionesRecientes');
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
            console.log(data);
        }
      }
    );
  }
  */

  obtenerDetalleAfectaciones(ipns , dispositivo) {    
    let selecionDialogo;
    // this.spinner.show();
    let request = {
      "fechaInicio": Constantes.FECHA_INICIO_EJECUTIVO_AFECTACIONES_24,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": dispositivo,
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": ipns,
      "full": true,
      "funcionalidad": "AfectacionesMonitoreoGlobal",
    };

    this.dashboardService.obtenerDetalleAfectacionesRecientes(request).subscribe({
      next: (data) => {                
        if(!data){
          console.log('Data Esta vacio');
          this.spinner.hide();
        }else if(!data.listaResultado){
          console.log('data.listaResultado Esta vacio');
          this.spinner.hide();
        }else{
          selecionDialogo = this.confirmService.detalleDispositivo(this.isDark, data.listaResultado[0]);
          const dialogRef = this.dialog.open(
            DetalleServicioComponent,
            selecionDialogo
          );
          localStorage.removeItem('afectacionesRecientes');
          dialogRef.afterClosed().subscribe(
            data => {
              if(data){
                  console.log(data);
              }
            }
          );
          this.spinner.hide();
        }
        
      },
      error: (_) => {
        this.spinner.hide();
      },
    });
    
  } 

  abrirModalDetalle(ipns, dispositivo) {
    let selecionDialogo;
    selecionDialogo = this.confirmService.detalleDispositivoModal(this.isDark, ipns, dispositivo);
    const dialogRef = this.dialog.open(
      DetalleServicioComponent,
      selecionDialogo
    );
    localStorage.removeItem('afectacionesRecientes');
    dialogRef.afterClosed().subscribe(
      data => {
      }
    );    
  } 

  selectCardData(idCard){
    this.idCardSelect = idCard 
    this.cardDataSelect = this.cardData[this.idCardSelect];
    console.log("CardSelect:",this.cardDataSelect)
    this.changeCarruselCard()
  }

  changeCarruselCard(){
    this.carruselCardData = [] 
    if(this.cardData.length > 2){
      for (let index = 0; index < 3; index++) {
        //let i = this.cardData.findIndex((element) => element.idCard == this.cardDataSelect.idCard)
        let i = this.cardData.findIndex((element) => element.idDispositivo == this.cardDataSelect.idDispositivo)
        if(index == 0){
          if(i == 0){
            this.carruselCardData.push(this.cardData.length - 1)
          }else{
            this.carruselCardData.push(i - 1)
          }
        }else if(index == 1){
          this.carruselCardData.push(i)
        }else{
          if(i + 1  == this.cardData.length){
            this.carruselCardData.push(0)
          }else{
            this.carruselCardData.push(i + 1)
          }

        }
      }
    }else{
      this.cardData.forEach((element, index) => {
        this.carruselCardData.push(index)
      });
    }

    console.log(this.carruselCardData)
    

    
  } 
}
