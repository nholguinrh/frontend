import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationModel } from '../../model/confirm-dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AdministratorService } from '../../services/administrator.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from '../../configuration/navegacion';
import { AlertService } from '../alertas';
import { Cliente } from '../../model/cliente.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClientService } from '../../services/client.service';
import { NotificationService } from '../../services/notification.service';
import { ClienteNotify } from '../../model/cliente-notify-model';
import { ClienteFavNotify } from '../../model/cliente-fav-notify-model';
import { WorkspaceService } from '../../services/workspace.service';



@Component({
  selector: 'app-massive-notification-dialog',
  templateUrl: './massive-notification-dialog.component.html',
  styleUrls: ['./massive-notification-dialog.component.css']
})
export class MassiveNotificationDialogComponent implements OnInit {

  public form: FormGroup;
  public clientList: ClienteNotify[] = [];
  public clientListFav: ClienteFavNotify[] = [];
  public selectedClients: ClienteNotify[] = [];
  public idClients: any[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredClients: Observable<any[]>;
  clientCtrl = new FormControl('');
  
  @ViewChild('clientsInput') clientsInput: ElementRef<HTMLInputElement>;
  @ViewChild('todos') todosEle: ElementRef<HTMLInputElement>;
  @ViewChild('favoritos') favoritosEle: ElementRef<HTMLInputElement>;
  idUsuario: number;
  todos: boolean = false;
  favoritos: boolean = false;
  favoritosName : any = [];
  todosName : any = [];
  isGeneral: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService, 
    private alertService: AlertService, 
    private router: Router,
    private administratorService: AdministratorService,
    public dialogRef: MatDialogRef<MassiveNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NotificationModel,
    public notificationService : NotificationService,
    public clientesService:ClientService,
    private workspaceService: WorkspaceService
  ) {

    this.form = this.formBuilder.group({
      clientes: [null], 
      titulo: [null, [Validators.required]],
      mensaje: [null, [Validators.required]]
    });

    this.filteredClients = this.form.controls['clientes'].valueChanges.pipe(
      startWith(null),
      map((cliente: string | null) => (cliente ? this._filter(cliente) : this.clientList.slice())),
    );
  }

  ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.clientesService.obtenerClientes().subscribe({
      next: (result) => {
        this.clientList = result.data;
        this.spinner.hide();
      },
      error: () => {
        this.alertService.error('<b>Error al obtener datos del cliente</b>');
        this.spinner.hide();
      }
    });
    this.clientesService.obtenerClientesFavoritas(this.idUsuario).subscribe({
      next: (result) => {
        this.clientListFav = result.data;
        this.spinner.hide();
      },
      error: () => {
        this.alertService.error('<b>Error al obtener datos del cliente</b>');
        this.spinner.hide();
      }
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  confirmDialog() {
    this.selectedClients.forEach(element => {
      this.idClients.push({
        idCliente : element.idCliente
      });
    });
    let body = {
      notificacion: {
        titulo: this.form.get('titulo').value,
        descripcion: this.form.get('mensaje').value,
        tipoNotificacion: 'I'
      },
      destinatarios:this.idClients
    }

    this.notificationService.crearNotificacionMasiva(this.administratorService.getIdUsuarios(),'USUARIO_CLIENTE',body).subscribe({
      next: (result) => {
        this.spinner.hide();
        if(result.httpStatus == 200){
          this.registrarBitacora()
          this.alertService.success(result.message);
        }else{
          this.alertService.error("No se pudo crear la notificacion");
        }
        this.isGeneral = false;
      },
      error: () => {
        console.log('error')
        this.alertService.error("No se pudo crear la notificacion");
        this.spinner.hide();
      }
    });
    this.dialogRef.close(true);
  }

  add(event: MatChipInputEvent): void {

    const value = (event.value || '').trim();
    if (value) {
      
    }
    event.chipInput!.clear();
    this.form.controls['clientes'].setValue(null);
  }

  selected(cliente: ClienteNotify): void {
    this.selectedClients.push(cliente);
    this.clientsInput.nativeElement.value = '';
    this.form.controls['clientes'].setValue(null);
  }

  remove(cliente: ClienteNotify): void {
    const index = this.selectedClients.indexOf(cliente);
    if (index >= 0) {
      this.selectedClients.splice(index, 1);
    }
    if(this.selectedClients.length == 0){
      this.form.controls['clientes'].setValue(null);
    }
  }

  private _filter(value: any): ClienteNotify[] {
    if(value?.razonSocial){
      const filterValue = value.razonSocial.toLowerCase();
      let valor = this.clientList.filter(cliente =>
        cliente.razonSocial.toLowerCase().includes(filterValue)
      );
      console.log("Filter::",valor)
      return valor;
    }else{
      const filterValue = value.toLowerCase();
      console.log("FilterValue::",filterValue)
      return this.clientList.filter(cliente => 
        cliente.razonSocial.toLowerCase().startsWith(filterValue));
    }
  }

  agregaTodos(){
    this.selectedClients = [];
    this.clientList.forEach(element => {
      this.selectedClients.push(element);
      
    });
    this.todos = true;
    this.todosName.push({nombre : 'Todos'});
  }

  agregaFavoritos(){
    this.selectedClients = [];
    this.clientListFav.forEach(element => {
         element.tbCliente.indicadorFavorito = 1;
        this.selectedClients.push(element.tbCliente);
    });
    this.favoritos = true;
    this.favoritosName.push({nombre : 'Favoritos'});
  }

  removeAll(): void {
    this.selectedClients = [];
    this.todos = false;
    this.favoritos = false;
    if(this.selectedClients.length == 0){
      this.form.controls['clientes'].setValue(null);
    }
  }

  disabledOption(cliente){
    let disabled = false;
    this.selectedClients.forEach(ele => {
      if(cliente.idCliente == ele.idCliente){
        disabled = true
      }
    });
    return disabled;
  }

  registrarBitacora(){
    let body = {
      "funcionalidad": "Envió de notificación masiva",
      "tipoOperacion": "Envió",
      "datos": "El usuario " + this.administratorService.getIdUsuarios() +" realizo un envió masivo de notificación",
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

  notificacionGeneral(){
    this.todos = true;
    this.todosName.push({nombre : 'Todos'});
    this.form.get('titulo').setValue("Actualización disponible");
    this.form.get('mensaje').setValue("¡Una nueva version del SMC esta lista para ti!\n\n"
    + "Haz click aqui para actualizar");
    this.isGeneral = true;
  }

  enviarNotificacion(){
    if(this.isGeneral){
      this.enviarRefresh();
    }else{
      if(this.form.valid){
        console.log("Dentro del confirm");
        this.confirmDialog();
      }else{
        console.log("Dentro del else");
        this.form.get('titulo').markAsTouched();
        this.form.get('mensaje').markAsTouched();
      }
    }
  }

  enviarRefresh(){
    const body = {
      notificacion: {
        titulo: "Actualización disponible",
        descripcion: "¡Una nueva version del SMC esta lista para ti!"
      },
      parametros: {
        descripcion: 'Haz click aqui para actualizar',
        accion: "string",
        servidorIp: "string",
        path: "string",
        parametros: "string",
        tipoServicio: "General"
      }
    }
    this.notificationService.crearNotificacionGeneral(this.administratorService.getIdUsuarios(),body).subscribe({
      next: (result) => {
        this.spinner.hide();
        if(result.httpStatus == 200){
          this.alertService.notify('¡Se envio notificacion de la nueva version!');
        }
        this.dialogRef.close(true);
      },
      error: () => {
        this.spinner.hide();
        console.log("No se pudo crear la notificacion");
        this.dialogRef.close(true);
      }
    });
}
}
