import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subscription } from 'rxjs';
import { Metrica, Tiempo } from 'src/app/shared/model/cliente.model';
import { DateValue } from 'src/app/shared/model/date-value';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ChangeGraphService } from 'src/app/shared/services/change-graph.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { ThemeService } from 'src/app/shared/services/theme.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'smc-monitoreo-enlaces',
  templateUrl: './monitoreo-enlaces.component.html',
  styleUrls: ['./monitoreo-enlaces.component.css']
})
export class MonitoreoEnlacesComponent implements OnInit {

  selected = '24 horas';
  public created: Date;
  isDarkTheme: Observable<boolean>;
  viewGraph:number = 1;
  typeGraph:number = 1;
  objectGraph:any;
  metricas: Metrica[];
  tiempos: Tiempo[] = [
    {
      value: '24 horas',
      time: 23 
    }
  ];
  public form: FormGroup;
  datesValue: Array<DateValue> = [
    { date: new Date('2022-10-01 06:12:58.911982'), value: 30 },
    { date: new Date('2022-10-02 06:12:58.911982'), value: 38 },
    { date: new Date('2022-10-03 06:12:58.911982'), value: 67 },
    { date: new Date('2022-10-04 06:12:58.911982'), value: 48 },
    { date: new Date('2022-10-05 06:12:58.911982'), value: 37 },
    { date: new Date('2022-10-06 06:12:58.911982'), value: 27 },
  ];
  
  requireUpdate: Subscription;
  typeService:string = 'Enlaces';
  idUsuario: number;
  CuadrantesList: any[]=[];
  metricaSeleccionada : string = 'Alcanzabilidad';

  tiempoSeleccionada: number = 23;
  requireUpdateRange: Subscription;
  requireUpdateTotal: Subscription;
  escalaTiempo:string = 'Ultima hora';
  totalSitios: number;
  constructor(private themeService: ThemeService,
    private changeGraphService: ChangeGraphService,
    private workspaceService: WorkspaceService,
    public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private administratorService: AdministratorService,
    public dashboardService: DashboardService,
    private reloadDataService: ReloadDataService) {
      this.requireUpdate = this.reloadDataService.requireUpdate.subscribe({
        next: (response) => {
          if (response) {
            let service = localStorage.getItem('type-service');
            this.typeService = Number(service) == 1 ? 'Enlaces' : Number(service) == 2 ? 'Servicios' : 'Sitios';


            //Agregar a la recarga de cada X tiempo
            //Metricas
            this.consultaMetricaCliente();

            //this.consultaCuadrantesGraficas();
          }
        },
      }); 
    }

  ngOnInit(): void {
    // this.spinner.show();
    this.requireUpdateRange = this.changeGraphService.enviarflagObservableRange.subscribe((response) => {
      if (response) {
        console.log("Vista general entra al flag - Response {",response,"}")
        switch (String(response)) {
          case '1':
              this.escalaTiempo = 'Última hora';
            break;
          case '12':
            this.escalaTiempo = 'Últimas 12 hrs';
            break;
          case '24':
            this.escalaTiempo = 'Últimas 24 hrs';
            break;
          case '7':
            this.escalaTiempo = 'Última semana';
            break;
          }
      }
    });
    this.requireUpdateTotal = this.changeGraphService.enviarflagObservableTotal.subscribe((response) => {
      if (response > 0) {
        console.log("Vista general entra al flag - Response {",response,"}")
        this.totalSitios = response
      }
    });

    localStorage.setItem('type-service', '3');
    this.idUsuario = this.administratorService.getIdUsuarios();
    let service = localStorage.getItem('type-service');
    this.typeService = Number(service) == 1 ? 'Enlaces' : Number(service) == 2 ? 'Servicios' : 'Sitios';
    this.created = new Date();
    this.form = this.formBuilder.group({
      metrica: [null],
      tiempo: [null],
    });
    //this.consultaMetrica();
    this.consultaMetricaCliente();
    this.isDarkTheme = this.themeService.isDarkTheme;
    this.changeGraphService.enviarflagObservable.subscribe((response) => {
      this.consultaCuadrantesGraficas();
    });
    this.consultaCuadrantesGraficas();
    this.form.get('tiempo').setValue('24 horas');
    this.spinner.hide();
  }

  public get width() {
    return window.innerWidth;
  }

  consultaMetrica(){
    // this.spinner.show();
    this.administratorService.catalogoMetricas().subscribe({
      next: ({ data, httpStatus }) => { 
        this.spinner.hide();
        if (httpStatus === 200) {
          this.metricas = data;
          let aux : Metrica[] = [];
          this.metricas.forEach( m => {
            if(m.metrica != 'Latencia'){
              aux.push(m);
            }
          })
          this.metricas = aux;
          this.form.get('metrica').setValue(this.metricas[0].idMetrica);
        }
      },
      error: (error) => { 
        this.spinner.hide();
      }
    });
  }

  consultaMetricaCliente(){    
    
    this.dashboardService.obtenerMetricasCliente(this.administratorService.getIdCliente()).subscribe({
      next: ({ data, httpStatus }) => { 
        console.log('Metricas cliente: ', data)
        this.spinner.hide();
        if (httpStatus === 200) {
          this.metricas = data;
          let aux : Metrica[] = [];
          this.metricas.forEach( m => {
            if(m.metrica != 'Latencia'){
              aux.push(m);
            }
          })
          this.metricas = aux;
          this.form.get('metrica').setValue(this.metricas[0].idMetrica);
        }
      },
      error: (error) => { 
        this.spinner.hide();
      }
    });
  }

  consultaCuadrantesGraficas(){
    this.dashboardService.recuperarCuadranteDashboard(this.idUsuario,5).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.objectGraph = data.filter((cuadrante) => cuadrante.activarEdicion === 1);
          this.objectGraph.forEach( cua => {
            if(cua.cuadranteActivo == null){
              cua.cuadranteActivo = {
                idCuadranteGrafica : cua.cuadranteGrafica[0].idCuadranteGrafica
              }
            }
          });

          let mode = localStorage.getItem('darkTheme');
          if(mode != null){
            setTimeout(() => {
              this.themeService.setDarkTheme(mode === '1' ? true: false);
            }, 20);
          }
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  alert(metrica){
    this.metricaSeleccionada = metrica;
  }

  alertTiempo(tiempo){
    this.tiempoSeleccionada = tiempo;
    //dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(7, 'days').format();
  }

  ngOnDestroy(): void {
    this.requireUpdate.unsubscribe();
    this.requireUpdateRange.unsubscribe();
    this.requireUpdateTotal.unsubscribe();
  }

}
