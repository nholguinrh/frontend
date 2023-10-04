import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Constantes } from 'src/app/shared/const/date-graph';
import { Metrica } from 'src/app/shared/model/cliente.model';
import { DateValue } from 'src/app/shared/model/date-value';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { ConfirmDialogService } from 'src/app/shared/utils/confirm-dialog/confirm-dialog.service';
import { CheckboxMetricaDialogComponent } from './checkbox-metrica-dialog/checkbox-metrica-dialog.component';

@Component({
  selector: 'app-historico-servicio',
  templateUrl: './historico-servicio.component.html',
  styleUrls: ['./historico-servicio.component.css'],
})
export class HistoricoServicioComponent implements OnInit {
  
  
  listadoMetricas: Metrica[] = [];
  datesValue: Array<DateValue> = [];

  rutaDashboard: boolean = false;
  cambiarModo: boolean = false;
  listadoGrafica: GraficaHistorico[] = [];
  dispositivo: string = '';
  nombreMetrica: string = '';
  selected: string = '';
  rangeDate: FormGroup = new FormGroup({
    start: new FormControl(moment().startOf('month').toDate()),
    end: new FormControl(moment().toDate()),
  });
  datesValueSend: Array<DateValue> = []
  metricasSelecionadas: any[] = [];
  dispositivoHistorico: any[] = []; 
  mostrarHistorico: any[] = []; 
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format();



  public get width() {
    return window.innerWidth;
  }



constructor(
    private router: Router,
    private dialog: MatDialog,
    private confirmService: ConfirmDialogService,
    private administratorService: AdministratorService,
    private alertService: AlertService,
    public spinner: NgxSpinnerService,
    private dashboardService: DashboardService,
    private reloadDataService: ReloadDataService,
  ) {}

  ngOnInit(): void {
    let mode = localStorage.getItem('afectacionesRecientes');
    if (mode != null) {
      this.rutaDashboard = mode === '1' ? true : false;
    }
    this.rangeDate.get('end').valueChanges.subscribe((rangoEnd) => {
      const rangoStart = this.rangeDate.value.start;

      if (
        rangoStart != null &&
        rangoEnd != null &&
        moment(rangoEnd).diff(moment(rangoStart)) > 0
      ) {
        this.getData();
      }
    });
    this.getCatalogoMetricas();

    
    this.nombreMetrica = localStorage.getItem('nombreMetrica');
    this.dispositivo = localStorage.getItem('tipo-dispositivo');
    if(this.dispositivo == null){
      this.dispositivo = 'Sitio'
    }
    if(this.dispositivo == 'P'){
      this.dispositivo = 'Sitio'
    }

    let modeDark = localStorage.getItem('darkThemeMode');
    if (modeDark != null) {
      this.cambiarModo = modeDark === '1' ? true : false;
    }
    
    this.rutaDashboard
      ? localStorage.setItem('navigation', NAV.afectacionHistorico)
      : localStorage.setItem('navigation', NAV.historicoServicio);

    
    this.rutaDashboard ? localStorage.setItem('navigation', NAV.afectacionHistorico) : localStorage.setItem('navigation', NAV.historicoServicio); 
  }

  goToBack() {
    localStorage.removeItem('idDispositivo')
    localStorage.removeItem('ipNs')
    localStorage.removeItem('tipoDispositivo')
    localStorage.removeItem('title')

    localStorage.removeItem('afectacionesRecientes');
    if(this.rutaDashboard){
      localStorage.setItem('full-type', 'ENLACES_AFECTACIONES')
      this.router.navigateByUrl(NAV.inicioCliente+"/("+'tablero'+":"+NAV.fullSize+")") 
    }else{
      let _isDashboard: string=localStorage.getItem('isdashboard');
      console.log(_isDashboard);
      if(_isDashboard=='1'){
        this.router.navigateByUrl(NAV.inicioCliente);
      }else{        
        this.router.navigateByUrl( NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.busquedaPersonalizada + ')');      
      }
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(
      CheckboxMetricaDialogComponent,
      this.confirmService.metricaHistorico(this.listadoMetricas)
    );
    
    dialogRef.afterClosed().subscribe(
      data => { 
        if(data){
          this.listadoMetricas = data;
          this.metricasSelecionadas = []
          
          this.listadoGrafica = []
          data.forEach(element => {
            if(element.selected == true){
              this.metricasSelecionadas.push(element)
            }
          });

          

          //this.graficaMetricas()
          this.graficaHistorico()
          this.definirGraficaMetricas();
        }
      }
    );
  }

  getCatalogoMetricas() {
    this.administratorService.catalogoMetricas().subscribe({
      next: ({ data, httpStatus }) => {
        if (httpStatus === 200) {
          this.listadoMetricas = data;
          this.listadoMetricas[0].selected = true;
          this.listadoGrafica = [];
          this.listadoMetricas?.forEach((element) => {
            if (element.selected == true) {
              let metrica = {
                titulo: element.metrica,
                promedio: 91,
                data: '',
              }
              this.listadoGrafica.push(metrica)
              this.metricasSelecionadas.push(element)
            }
          });
          this.selected = this.listadoGrafica[0].titulo;
          this.getData();
        }
      },
      error: (e) => {
        this.alertService.error(
          'Error al obtener la información del catalogo metricas'
        );
      },
    });

    if(this.rutaDashboard){
      let idDispositivo = localStorage.getItem('idDispositivo');
      let ipNs = localStorage.getItem('ipNs');
      //this.dispositivo = localStorage.getItem('tipoDispositivo') == 'P' ? 'Sitio' : 'Servicio';
      //this.nombreMetrica = localStorage.getItem('title');
      this.historicoDispositivo(idDispositivo, ipNs);
    }
  }

  definirGraficaMetricas() {
    //TODO: Definir correctamente la manera de seleccionar los elementos para la lista de métricas
    this.listadoGrafica = [];
    this.listadoMetricas?.forEach((element) => {
      if (element.selected == true) {
        let metrica = {
          titulo: element.metrica,
          promedio: 91,
          data: '',
        };
        this.listadoGrafica.push(metrica);
      }
    });
    this.selected = this.listadoGrafica[0]?.titulo;
    this.getData();
  }

  fullSize(grafica: GraficaHistorico) {
    localStorage.setItem('full-type', 'DISPOSITIVO_DETALLE_HISTORICO');
    localStorage.setItem('full-type-metrica', grafica.titulo);
    localStorage.setItem('group-type', '1');

    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.detalleFullSize + ')'
    );
  }

  fullSizeDashboard(grafica: any) {
    localStorage.setItem('full-type', 'DISPOSITIVO_DETALLE_HISTORICO');
    localStorage.setItem('full-type-metrica', grafica.titulo);
    localStorage.setItem('group-type', String(1));
    localStorage.setItem('data-historico', JSON.stringify(grafica));

    this.router.navigateByUrl(
      NAV.inicioCliente + '/(' + 'tablero' + ':' + NAV.detalleFullSize + ')'
    );
  }

  sendAlert(){
        this.spinner.show();
        setTimeout(() => {
          this.spinner.hide()
          this.alertService.info('<b>!Descarga realizada correctamente! </b>');
        }, 400);
  }


  private getData() {
    //TODO: Es necesario implementar correctamente la manera de obtener la información del servicio
    const start = this.rangeDate.get('start');
    const end = this.rangeDate.get('end');
    if (
      start.value == null ||
      end.value == null ||
      this.listadoMetricas.length == 0
    ) {
      return;
    }
    const dateEnd = moment(end.value);
    let dateStart = moment(start.value);
    let days = dateEnd.diff(dateStart, 'd');

    let tempVals = [];
    //TODO: Este proceso de llenado de datos es temporal
    for (let index = 0; index <= days; index++) {
      tempVals.push({
        date: dateStart.clone().add(index, 'days').toDate(),
        value: 50,
      });
    }

    this.datesValue = tempVals;
  }

  download(){
    console.log('prueba')
  }
  

  historicoDispositivo(id?: string, ip?: string){
    
    let request = {
      "fechaInicio": this.dayAgo.substring(0, 19),
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.administratorService.getidClienteTotalplay(),
      "idServicio": "",
      "idDispositivo": id,
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "H",
      "ipNs": ip,
      "funcionalidad": "HistoricoMetricasMonitoreoGlobal",
      "full": true
    };
    this.dashboardService.obtenerHistorico(request).subscribe({
      next: (data) => {
        this.dispositivoHistorico = data.metricas
        this.dispositivoHistorico.forEach(elemento => {
          elemento.barras.forEach( ele =>{
            ele.date = new Date(ele.date);
          });
        });
        this.graficaHistorico()
      },
      error: (_) => {
        this.spinner.hide();
      },
    });
  }

  graficaHistorico(){
    this.mostrarHistorico = [];
    this.dispositivoHistorico.forEach(element => {
      this.metricasSelecionadas.forEach(e => {
        if(element.idMetrica == e.idMetrica || element.metrica.toLowerCase() == e.metrica.toLowerCase()){
          this.mostrarHistorico.push(element)
        }
      });
    });     
  }
}


interface GraficaHistorico {
  titulo: string;
  promedio: number;
  data: any;
}