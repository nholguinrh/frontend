import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from 'src/app/shared/model/cliente.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { DetalleIncidenteComponent } from './detalle-incidente/detalle-incidente.component';
import { DetalleIncidenteService } from './detalle-incidente/detalle-incidente.service';
import {MatAccordion} from '@angular/material/expansion';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import * as d3 from 'd3';
import { Paginator } from 'array-paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginatorComponent } from 'src/app/shared/utils/paginator';
import * as moment from 'moment';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import { Constantes } from 'src/app/shared/const/date-graph';

@Component({
  selector: 'app-incidentes-cliente',
  templateUrl: './incidentes-cliente.component.html',
  styleUrls: ['./incidentes-cliente.component.css']
})
export class IncidentesClienteComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('changePage') changePage: PaginatorComponent;

  public pager:any;
  public form: FormGroup;
  spinnerLoading = true; 

  panelesActivos:boolean = true;
  ticketActivo: number = 1;
  formatDate =  d3.timeFormat('%d %B de %Y');
  formatTime =  d3.timeFormat('%H : %M');
  ticketEstatus: any[] = [] 
  ticketData: any;
  errorCarga: number = 0;

  estatusTicketShow:string = 'todos';
  estatusTickets:string = 'Todos los tickets';
  tickets:any = [{
    numeroTicket: 5183570,
    descripcion: "ALARMA GENERADA 2022 12:31 - Cannot recived expected optical signal from ONT",
    estatus: 'resuelto'
},
{
    numeroTicket: 5183845,
    descripcion: "ALARMA GENERADA 2022 12:31 - The power supply of the ONT",
    estatus: 'pendiente'
},
{
    numeroTicket: 5184147,
    descripcion: "ALARMA GENERADA 2022 12:31 - Cannot recived expected optical signal from ONT",
    estatus: 'en curso'
  }];
  pageResponse: Page<Cliente> = new Page<Cliente>();
  fetchRequest: PageRequest<Cliente> = new PageRequest<Cliente>();
  ticketsStatusList:any[] = [];
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().startOf('month').set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  
  constructor(private workspaceService: WorkspaceService,
    private dialog: MatDialog,
    private alertService: AlertService,
    private dashboardService: DashboardService,
    private auth: AdministratorService,
    public spinner: NgxSpinnerService,
    private reloadDataService: ReloadDataService,
    private formBuilder: FormBuilder,
    private dialogService: DetalleIncidenteService) { }

  ngOnInit(): void {
    //this.obtenerTicketsCliente();
    this.obtenerTickets();
    //this.onPaged(1);
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
  }

  filtroTicket(val:any){
    this.ticketsStatusList = [];
    this.ticketActivo = val;
    switch (val) {
      case 1: this.estatusTickets = "Todos los tickets"; this.estatusTicketShow = 'todos'; break;
      case 2: this.estatusTickets = "Tickets en curso"; this.estatusTicketShow = 'en curso'; break;
      case 3: this.estatusTickets = "Tickets pendientes"; this.estatusTicketShow = 'pendiente'; break;
      case 4: this.estatusTickets = "Tickets resueltos"; this.estatusTicketShow = 'resuelto'; break;
      default:
        break;
      }
      this.ticketData = this.ticketEstatus.find(element => element.id == val);
      localStorage.setItem('estatus-ticket', this.ticketData.estatus);
      this.ticketsStatusList =  this.ticketData.data; 
      
    this.form.reset()
    this.paginador(this.ticketsStatusList)

  }

  onPagedA(page: number) {

		this.fetchRequest.page = page;
		this.fetchRequest.model = new Cliente();		    
    this.workspaceService.getJSON(this.fetchRequest).then(result => {
      this.pageResponse.init(result);
    }).catch(()=>{
    });
  }

  onPaged(page: number) {
    this.ticketsStatusList = this.pager.page(page);
  }

  onKeyDownEvent(event: any){
    let busquedaDeDatos;
    this.ticketData = this.ticketEstatus.find(element => element.id == this.ticketActivo);
    busquedaDeDatos =  this.ticketData.data; 

    let filtro = event.target.value;
    busquedaDeDatos = busquedaDeDatos.filter( item => 
    item?.numeroTicket?.toLowerCase().includes(filtro.toLowerCase())
    )
    this.paginador(busquedaDeDatos);
  }

  paginador(value: any){
    this.pager = new Paginator(value,3,1)
    if(value.length > 0){
      this.ticketsStatusList = this.pager.page(1);  
    }else{
      this.ticketsStatusList = []
    }

  }


  detalleIncidente(numeroTicket: any, event?: any){
    if(event){
      event.stopPropagation();
    }

    const dialogRef = this.dialog.open(
      DetalleIncidenteComponent, 
      this.dialogService.detalleTicket(numeroTicket, 'Sitio')
    );
    dialogRef.afterClosed().subscribe(
      data => {
        this.obtenerTickets();
        //this.crearTicket();
      }
    );
  }

  obtenerTicketsCliente(){
    //this.spinner.show();
    let request = {
      fechaFin: 'string',
      fechaInicio: 'string',
      idEmpresa: 'string',
      limite: 'string',
      tipoDispositivo: 'string',
      numeroTicket: 'string',
      idDispositivo: 'string',
      precision: {
        unidad: 'string',
        valor: 0,
      },
      full: true,
    };
    this.dashboardService.workspaceTicketsCliente(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        
      },
      error: (_) => {
        this.spinner.hide();
        
      }
    });
  }

  crearTicket(){
    this.spinner.show();
    let request = {
      categoria: "",
      descripcion: [
        ""
      ],
      diagnosticoInicial: "",
      estatus: "",
      grupo: "",
      idItsm: "",
      organizacion: "",
      proactivoReactivo: "",
      puntaId: "",
      regCiuId: "",
      resumen: "",
      solicitadoPor: "",
      tenant: "",
      ticketExterno: "",
      tipo: "",
      tipoRed: "",
      url: "",
      numeroTicket: "",
      fechaApertura: "",
      fechaCierre: "",
      diagnosticoFinal: "",
      descripcionEstatus: "",
      cantidad: "",
      fecha: "",
      tipoDispositivo: "",
      idDispositivo: "",
      ipNs: "",
      sitio: ""
    };
    this.dashboardService.workspaceCrearTicket(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        this.alertService.success('<b>Ticket creado correctamante</b>');
      },
      error: (_) => {
        this.spinner.hide();
        this.alertService.error('<b>Error al crear ticket</b>');
      }
    });
  }

  obtenerTickets(){
    this.spinnerLoading = true;
    let request = {
      "fechaInicio": Constantes.FECHA_INICIO_EJECUTIVO_TICKET,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay() ? this.auth.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": "",
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "IncidentesEspacioTrabajo",
      "full": true
    };
    this.tickets = [];
    this.dashboardService.obtenerTicketEspacioTrabajo(request).subscribe({
      next: (data) => {
        
        if(data.ticketEstatus){
          this.errorCarga = 0;
          this.spinner.hide();
          this.ticketEstatus = data.ticketEstatus.reverse();
          this.ticketEstatus.forEach(element => {
            element.data.forEach(ele => {
              ele.fechaDeApertura = this.formatDate(new Date(ele.fechaDeApertura))
              //ele.tiempoTranscurrido = this.formatTime(new Date(ele.tiempoTranscurrido))
            });
          });
          this.ticketEstatus?.forEach(element => {
            if(element.name != 'totales'){
              element.data.forEach(element => {
                this.tickets.push(element);
              });
            }
          });
          let idTicket = 1
          
          let estatusTicket = localStorage.getItem('estatus-ticket')

          if(estatusTicket != null){
            let mode =  this.ticketEstatus.find(element => element.estatus == estatusTicket);
            if(mode != undefined){
              idTicket = mode.id
            }
          } 
          console.log('ticket:', estatusTicket)
          console.log(idTicket)
          
          this.filtroTicket(idTicket)
          /** 
          this.ticketData = this.ticketEstatus.find(element => element.id == idTicket) 
          this.ticketsStatusList =  this.ticketData.data; ;
          this.paginador(this.ticketsStatusList);
           */
        }else{
          this.ticketEstatus = [{ 
            id: 1,
            estatus: 'Todos',
            cantidad: 0,
            clase: 'estatus-todos',
            color: '#285CED'
          },{ 
            id: 2,
            estatus: 'En curso',
            cantidad: 0,
            clase: 'estatus-curso',
            color: '#DDBC00'
          },{ 
            id: 3,
            estatus: 'Pendientes',
            cantidad: 0,
            clase: 'estatus-pendientes',
            color: '#F95A36'
          },{ 
            id: 4,
            estatus: 'Resueltos',
            cantidad: 0,
            clase: 'estatus-resueltos',
            color: '#1A7F1C'
          }];

          let idTicket = 1
          let estatusTicket = localStorage.getItem('estatus-ticket')
          if(estatusTicket != null){
            let mode =  this.ticketEstatus.find(element => element.estatus == estatusTicket);
            if(mode != undefined){
              idTicket = mode.id
            }
          } 
          this.ticketActivo = idTicket
          this.errorCarga = 0;
        }
        this.spinnerLoading = false;
      },
      error: (_) => {
        this.spinnerLoading = false;
        this.errorCarga = 1;
        this.spinner.hide();
        this.alertService.error('<b>Error al obtener los tickets</b>');
      }
    });
  }

  returnFilter(){
    /**
    
    let busquedaDeDatos;
    switch (this.ticketActivo) {
      case 1:  busquedaDeDatos = this.ticketEstatus[3].data; break;
      case 2:  busquedaDeDatos = this.ticketEstatus[0].data; break;
      case 3:  busquedaDeDatos = this.ticketEstatus[1].data; break;
      case 4:  busquedaDeDatos = this.ticketEstatus[2].data; break;
      default:
        break;
    }
    this.form.reset()
    this.paginador(busquedaDeDatos);
     */

    this.filtroTicket(1)
  }
  


}
