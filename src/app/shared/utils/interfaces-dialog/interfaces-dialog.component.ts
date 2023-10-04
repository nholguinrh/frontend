import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfiguracionSLA, DetallePunta, PlantillaSLA, Punta } from '../../model/cliente.model';
import { AdministratorService } from '../../services/administrator.service';
import { WorkspaceService } from '../../services/workspace.service';
import { Paginator } from 'array-paginator';

@Component({
  selector: 'app-interfaces-dialog',
  templateUrl: './interfaces-dialog.component.html',
  styleUrls: ['./interfaces-dialog.component.css']
})
export class InterfacesDialogComponent implements OnInit {

  public form: FormGroup;
  public puntauno: boolean = true; 
  public puntados: boolean = false;
  public tablePuntas: any;
  public pager:any;
  idConfiguracionSLA: number;
  estatusPunta: string = 'activa';
  idUsuario: number;
  sla: ConfiguracionSLA;
  cliente: number;


  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<InterfacesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public detallePunta: DetallePunta,
    private administratorService: AdministratorService,
    public spinner: NgxSpinnerService,
    private workspaceService: WorkspaceService,
  ) {}

  ngOnInit(): void {
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.dialogRef.disableClose = true;
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.idConfiguracionSLA = Number(localStorage.getItem('idConfiguracionSLA'));
    this.cliente = Number(localStorage.getItem('cliente'))
    this.detallePlantilla(this.idConfiguracionSLA);
    this.paginador(this.detallePunta.interfaces);
  }

  closeDialog() {
    this.registrarBitacora(2);
    this.dialogRef.close(false);
  }

  confirmDialog() {
    this.dialogRef.close(true);
  }

  inputClick(event?: any){
    if(event){
      event.stopPropagation();
    }
  }

  asignarConfiguracionPunta(estatus: boolean){
    if(estatus == false){
      this.detallePunta.punta.tbConfiguracionSLA = null;
        this.pager.data.forEach(element => {
          element.tbConfiguracionSLA = null
        });
    }else{
      this.detallePunta.punta.tbConfiguracionSLA = this.sla;
    }
  }

  detallePlantilla(id: number){
    this.administratorService.detalleSLA(id).subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.sla = data.configuracionSLA;
        }
      },
      error: (_) => {
        
      }
    });

  }

  modificarDetallePunta() {
    this.detallePunta.activacion = false;
    this.workspaceService.modificarDetallePunta(
      this.idUsuario,
      this.detallePunta
    ).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.registrarBitacora(1)
          this.dialogRef.close(true);
          this.spinner.hide();
        } else {
          console.error(message);
          this.spinner.hide();
        }
      }, 
      error: (e) => {
        console.error(e);
        this.spinner.hide();
      }
    });
  }

  onPaged(page: number) {
    this.tablePuntas = this.pager.page(page);
  }

  paginador(value: any){
    value.forEach(val => {
      if(val.tbCatEstatus.idCatEstatus == 27){
        this.pager = new Paginator(value,3,1);
        this.pager.data.forEach(element => {
          if(element.tbConfiguracionSLA?.idConfiguracionSLA == null){
            element.tbConfiguracionSLA = null
          }
        });
      }
    });
    this.tablePuntas = this.pager?.page(1);    
  }

  onKeyDownEvent(event: any){
    let filtro = event.target.value;
    let busquedaDeDatos = this.detallePunta.interfaces;
    busquedaDeDatos = busquedaDeDatos.filter( item => 
      item.interfaz.toLowerCase().includes(filtro.toLowerCase())  
      || item.alias.toLowerCase().includes(filtro.toLowerCase())
    );
    this.paginador(busquedaDeDatos);
  }

  puntasActivas(tablePuntas: any){
    let vistaPuntas = [];
    tablePuntas.forEach(element => {
      if(element.tbCatEstatus.idCatEstatus == 27){
        vistaPuntas.push(element);
      }
    });
    return vistaPuntas
  }

  registrarBitacora(flujo?: number, idDispositivo?: number){
    let cliente: string = ', del cliente: '+ this.cliente
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;

    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo nuevo cambios al dispositivo "+ this.detallePunta.punta.idClientePunta +", con la configuración SLA "+ this.idConfiguracionSLA + cliente
      funcionalidad = 'Guarda cambios del dispositivo a asignar SLA'
      tipoOperacion = 'Cambios'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", cancelo los cambios del dispositivo "+ this.detallePunta.punta.idClientePunta + ", con la configuración SLA "+ this.idConfiguracionSLA + cliente
      funcionalidad = 'Cancelar cambios del dispositivo a asignar SLA'
      tipoOperacion = 'Cancelar'
    }else{
      return
    }
    let body = {
      "funcionalidad": funcionalidad,
      "tipoOperacion": tipoOperacion,
      "datos": comentario,
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios()
      }
    }

    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

}
