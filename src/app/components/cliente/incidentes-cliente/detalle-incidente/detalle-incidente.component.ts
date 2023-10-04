import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicioDialogModel } from 'src/app/shared/model/confirm-dialog';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { DashboardService } from 'src/app/shared/services/dashboards.service';
import { DetalleServicioComponent } from '../../servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.component';
import { DetalleServicioService } from '../../servicios-cliente/busqueda-personalizada/detalle-servicio/detalle-servicio.service';
import * as d3 from 'd3';
import { ReloadDataService } from 'src/app/shared/services/reload-data.service';
import * as moment from 'moment';
import { Constantes } from 'src/app/shared/const/date-graph';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-detalle-incidente',
  templateUrl: './detalle-incidente.component.html',
  styleUrls: ['./detalle-incidente.component.css']
})
export class DetalleIncidenteComponent {

  formatDate =  d3.timeFormat('%d %B de %Y');
  incidenteDetalle: any = {
    solicitante: 'José Ramirez',
    categotia: 'Monitoreo SMC Proactivo',
    descripcion: '*Cliente (SÉCRETARIA DE SALUD) \n\r Generado automático (Disponibilidad) 1 ',
    numeroIncidente: '0129481',
    resumen: 'CLIENTE - COVID // Generado automático (Disponibilidad) 1 ...',
    estatus: 'Pendiente por cliente',
    fechaSolucion: '',
    
    ticketExterno: '124135246151324',
    sitio: 'SUC-1241-TFE-D-11305TH-BAN',
    diagnosticoFinal: '',
  }
  today: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).format();
  dayAgo: string = moment().set({'hour': 0, 'minute': 0, 'second': 0, 'millisecond': 0}).subtract(1, 'days').format();
  public form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DetalleIncidenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private confirmService: DetalleServicioService,
    private dashboardService: DashboardService,
    private auth: AdministratorService,
    public spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private reloadDataService: ReloadDataService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({      
      ticketExterno: ['']
    });
    this.dialogRef.disableClose = true;

    this.consultaDetalle(this.data?.ticket);
  }

  consultaDetalle(ticket: any){
    let request = {
      "fechaInicio": Constantes.FECHA_INICIO_GLOBAL_TICKET,
      "fechaFin": moment().format().substring(0, 19),
      "idEmpresa": this.auth.getidClienteTotalplay() ? this.auth.getidClienteTotalplay() : 0,
      "idServicio": "",
      "idDispositivo": "",
      "tipoDispositivo": Number(localStorage.getItem('type-service')) == 3 ? 'p' : 'i',
      "folioTicket": ticket,
      "folioTicketExterno": "",
      "metrica": "",
      "tiempo": "D",
      "ipNs": "",
      "funcionalidad": "DetalleTicketEspacioTrabajo",
      "full": true
    };
    this.dashboardService.obtenerTicketIncidente(request).subscribe({
      next: (data) => {
        this.spinner.hide();
        console.log(data)
        if(data != null){
          this.incidenteDetalle = data
          this.form.get('ticketExterno').setValue(this.incidenteDetalle.ticketAlias);
          this.incidenteDetalle.fechaSolucion = this.formatDate(new Date(this.incidenteDetalle.fechaSolucion))
        }
      },
      error: (_) => {
        this.spinner.hide();
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
    let nombreDispositivo = localStorage.getItem('nombreMetrica');
    if(nombreDispositivo != null){
      this.data.nombreSitio = nombreDispositivo;
    }
  }

  openDialogDispositivo(dispositivo: any){
    let selecionDialogo;
    localStorage.setItem('tipo-dispositivo', dispositivo.dispositivo);
    localStorage.setItem('nombre-sitio', dispositivo.alias)
    

    let dispositivoSelecionado = {
      tipo: dispositivo.dispositivo,
      sitio: dispositivo.alias,
      metricaSelecionada: {
        idMetrica: 1,
        metrica: 'Disponibilidad',
        porcentajeActual: '80%',
        porcentajeAyer: '6%',
        porcentajeSla: '99%',
        color: '#FF0D0D',
      },
      ticketEstatus: false,
      ticketNumero: '',
    }

    selecionDialogo = this.confirmService.detalleDispositivo(false, dispositivoSelecionado)
    const dialogRef = this.dialog.open(
      DetalleServicioComponent, 
      selecionDialogo
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data){
            console.log(data);
        }
      }
    );
  }

  actualizarTicket(){
    let texto = this.form.get('ticketExterno').value;
    let ali = texto.trim();
    if(ali.length > 0){
      let request = {
        "folioTicket": this.incidenteDetalle.numeroIncidente,
        "ticketExterno": this.form.get('ticketExterno').value.trim(),
        "idClienteTotalPlay": this.auth.getidClienteTotalplay()
      };
      console.log("Request:",request)
      this.dashboardService.personalizaTicket(request).subscribe({
        next: (data) => {
          console.log("Ticket actualizado");
          this.closeDialog();
        },
        error: (_) => {
          console.log("Error al actualiar Ticket");
        },
      });
    }else{
      this.alertService.error('<b>!No se pudo actualizar el ticketExterno! </b>');
    }
  }

  

}
