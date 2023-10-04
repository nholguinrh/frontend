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
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../alertas';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';
@Component({
  selector: 'smc-carousel-voz',
  templateUrl: './carousel-voz.component.html',
  styleUrls: ['./carousel-voz.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms', style({ opacity: 1 }))])
    ])
  ]
})
export class CarouselVozComponent implements OnInit {

  public form: FormGroup;
  emailstring= "mailto:helpdesk@totalplay.com?Subject=Soporte SMC&body=Buen día, estoy buscando ayuda…(déjanos saber en que podemos ayudarte)";
  errorCarga: number = 0;
  @Input() cardData: any[];
  cardDataSelect: any;
  carruselCardData: number[] = [];
  dataAccess: number = 1;
  button: number = 1;
  indexCardSelect: number = 0;
  isDark: boolean = false;
  isDarkTheme: Observable<boolean>;
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(30, 'days').format();
  requireUpdate: Subscription;
  progressChartdata: any;
  spinnerLoading: boolean = true;
  isFirst: boolean = true;
  constructor(private themeService: ThemeService, public dialog: MatDialog,
    private auth: AdministratorService,
    public spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private reloadDataService: ReloadDataService,
    private changeGraphService:ChangeGraphService,
    private confirmService: DetalleServicioService,
    private dialogConfirm: ConfirmDialogService,
    private formBuilder: FormBuilder,
    private alertService: AlertService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response && !this.isFirst) {
            console.log("Refrescando Carrusel:::");
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
    /* this.isDarkTheme.subscribe((val: boolean) => this.obtenerAfectaciones(val)); */
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.obtenerAfectaciones(false);
    //this.calcTotalAfectaciones(false);
    //this.isDarkTheme.subscribe((val: boolean) => this.calcTotalAfectaciones(val));
  }

  ngOnDestroy() {
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
    this.isDark = dark
    this.spinnerLoading = true
    let request = {
      "fechaInicio": Constantes.FECHA_LLAMADAS_VOZ_24,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay()
    };
    this.dashboardService.obtenerDispositivosVoz(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        console.log('DATA CARRUSEL:',data)
        if(data.dispositivos.length > 0){
          this.cardData = data.dispositivos;
          if(localStorage.getItem('idDispositivo')){
            console.log("Dentro del if",localStorage.getItem('idDispositivo'));
            let indice = this.cardData.findIndex(element => element.ip === localStorage.getItem('idDispositivo'));
            console.log("Valor Index:",indice);
            this.selectCardData(indice);
          }else{
            this.calcTotalAfectaciones();
          }
        }else{
          const dialogRef = this.dialog.open(
            ConfirmDialogComponent, 
            this.dialogConfirm.sinDispositivos()
          );
          dialogRef.afterClosed().subscribe(
            _data => { 
              if(_data == true){
                this.changeMetricas(0);
                this.help();
              }else{
                this.changeMetricas(0);
              }
                
            }
          );
        }
        this.spinnerLoading = false
      },
      error: (_) => {
        this.spinner.hide();
        this.spinnerLoading = false
        this.errorCarga = 1
        this.changeMetricas(1);
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
    
    this.selectCardData(this.indexCardSelect)
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
      "fechaInicio": Constantes.FECHA_LLAMADAS_VOZ_24,
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
      "funcionalidad": "AfectacionesMonitoreoEjecutivo",
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

  selectCardData(idCard){
    console.log(idCard)
    this.indexCardSelect = idCard 
    this.cardDataSelect = this.cardData[this.indexCardSelect];
    console.log("CardSelect:",this.cardDataSelect);
    if(this.isFirst){
      this.isFirst = false;
      this.changeMetricas(this.cardDataSelect.idDispositivo);
    }
    this.changeCarruselCard()
  }

  changeCarruselCard(){
    this.carruselCardData = [] 
    if(this.cardData.length > 3){
      for (let index = 0; index < 3; index++) {
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

  changeMetricas(idDispositivo){
    console.log('Cambio de metricas: ', idDispositivo)
    localStorage.setItem('idDispositivo', idDispositivo);
    this.changeGraphService.changeDispositivo(idDispositivo);
  }

  filterString() {
    let busqueda = this.form.controls['busqueda'].value;
    let resultadoBusqueda = this.cardData.findIndex((element) => element.ip == busqueda)
    if(resultadoBusqueda >= 0){
      console.log("Dispositivo encontrado")
      this.selectCardData(resultadoBusqueda)
      //this.alertService.success('Saludos');
    }else{
      console.log("No se encontro resultado de tu busqueda")
      this.alertService.warn('No se encontro resultado de tu busqueda');
    }
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return( !( k != 46 && (k < 48 || k > 57))  )
    //return (!(k > 31 && (k < 48 || k > 57)));
  }

  public get widths() {
    console.log("width:",window.innerWidth);
    return window.innerWidth;
  }

  help(){
    window.location.href = this.emailstring;
  }

}
